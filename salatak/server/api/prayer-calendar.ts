import ical, { ICalAlarmType, ICalEventBusyStatus, ICalEventTransparency } from 'ical-generator';
import { PrayerTimingsService } from '~/services/PrayerTimeingsService';

function parsePrayerTime(timeStr: string): string {
    return timeStr.replace(/\s*\([^)]*\)/g, '').trim(); // Remove timezone annotations like (BST)
}

function formatDateString(dateStr: string): string {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
}

function createValidDate(dateStr: string, timeStr: string): Date {
    try {
        const formattedDate = formatDateString(dateStr);

        const cleanTime = parsePrayerTime(timeStr);
        const [hours, minutes] = cleanTime.split(':').map(Number);

        const date = new Date(formattedDate);
        date.setHours(hours, minutes, 0, 0);

        return date;
    } catch (error) {
        console.error(`Error creating date from ${dateStr} ${timeStr}:`, error);
        throw error;
    }
}



export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const {
            startDate,
            endDate,
            lat,
            long,
            calcMethod = '2',
            asrMethod = '1',
            alarm = '0',
            duration = '25',
            timezone = 'timezone',
            fajrDuration = duration,
            dhuhrDuration = duration,
            asrDuration = duration,
            maghribDuration = duration,
            ishaDuration = duration,
            jummahDuration = '60',
            fajrOffset = '0',
            dhuhrOffset = '0',
            asrOffset = '0',
            maghribOffset = '0',
            ishaOffset = '0',
            jummahOffset = '0',
            selectedPrayers
        } = query;

        if (!startDate || !endDate || !lat || !long) {
            throw createError({
                statusCode: 400,
                message: 'Missing required parameters: startDate, endDate, lat, and long are required'
            });
        }
        const prayerService = new PrayerTimingsService({
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string),
            location: {
                lat: Number(lat),
                long: Number(long),
                address: ""
            },
            calcMethod: Number(calcMethod),
            asrMethod: Number(asrMethod),
        });
        await prayerService.getPrayersTimings();
        const calendar = ical({
            name: 'Prayer Times',
            timezone: String(timezone),
        });

        let allowedEvents = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        const prayerDurations = {
            'Fajr': Number(fajrDuration),
            'Dhuhr': Number(dhuhrDuration),
            'Asr': Number(asrDuration),
            'Maghrib': Number(maghribDuration),
            'Isha': Number(ishaDuration)
        };

        const prayerOffsets = {
            'Fajr': Number(fajrOffset),
            'Dhuhr': Number(dhuhrOffset),
            'Asr': Number(asrOffset),
            'Maghrib': Number(maghribOffset),
            'Isha': Number(ishaOffset)
        };

        if (selectedPrayers && typeof selectedPrayers === 'string') {
            const prayerNames = selectedPrayers.split(',');
            if (prayerNames.length > 0) {
                allowedEvents = prayerNames;
            }
        }

        for (const dayData of prayerService.timings) {
            for (const day of dayData) {
                const dateStr = day.date.gregorian.date;
                const dayName = day.date.gregorian.weekday.en;

                for (const [name, timeStr] of Object.entries(day.timings)) {
                    if (!allowedEvents.includes(name)) {
                        continue;
                    }
                    try {
                        // Determine the duration and offset based on prayer name and day
                        let prayerDuration;
                        let prayerOffset;
                        if (name === 'Dhuhr' && dayName === 'Friday') {
                            prayerDuration = Number(jummahDuration);
                            prayerOffset = Number(jummahOffset);
                        } else {
                            //@ts-ignore
                            prayerDuration = prayerDurations[name];
                            //@ts-ignore
                            prayerOffset = prayerOffsets[name];
                        }

                        const startDate = createValidDate(dateStr, String(timeStr));
                        if (isNaN(startDate.getTime())) {
                            console.error(`Invalid date created for ${name} on ${dateStr} at ${timeStr}`);
                            continue;
                        }

                        // Apply offset
                        startDate.setMinutes(startDate.getMinutes() + prayerOffset);

                        const endDate = new Date(startDate);
                        endDate.setMinutes(endDate.getMinutes() + prayerDuration);

                        // Determine prayer name (change Dhuhr to Jummah on Friday)
                        const displayName = (name === 'Dhuhr' && dayName === 'Friday') ? 'Jummuah' : name;

                        const event = calendar.createEvent({
                            start: startDate,
                            end: endDate,
                            summary: `🕋 ${displayName}`,
                            description: `Prayer time for ${displayName}`,
                            busystatus: ICalEventBusyStatus.BUSY,
                            transparency: ICalEventTransparency.OPAQUE,
                        });
                        if (Number(alarm) > 0) {
                            event.createAlarm({
                                type: ICalAlarmType.audio,
                                triggerBefore: Number(alarm) * 60,
                            });
                        }
                    } catch (err) {
                        console.error(`Error creating event for ${name} on ${dateStr}:`, err);
                        continue;
                    }
                }
            }
        }

        // Set headers for calendar download
        setHeaders(event, {
            'Content-Type': 'text/calendar',
            'Content-Disposition': 'attachment; filename="prayer-times.ics"',
            'charset': 'utf-8'
        });

        // Return the calendar content
        return calendar.toString();

    } catch (error: any) {
        console.error('Prayer calendar error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error instanceof Error ? error.message : 'Internal server error'
        });
    }
})