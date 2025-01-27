
export interface AddressLocaiton {
  address: string
  lat?: number
  long?: number
}

interface PrayerTimingParams {
  startDate: Date;
  endDate: Date;
  location: AddressLocaiton;
  calcMethod: number;
  asrMethod: number;
}

export class PrayerTimingsService {
  private startDate: Date;
  private endDate: Date;
  private location: AddressLocaiton;
  private calcMethod: number;
  private asrMethod: number;
  public timings: any[] = [];

  constructor(params: PrayerTimingParams) {
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.location = params.location;
    this.calcMethod = params.calcMethod;
    this.asrMethod = params.asrMethod;
  }

  private getBaseUrl(year: number, month?: number): string {
    const dateURI = month ? `${year}/${month}` : `${year}`;
    return `https://api.aladhan.com/v1/calendar/${dateURI}?latitude=${this.location.lat}&longitude=${this.location.long}&method=${this.calcMethod}&school=${this.asrMethod}`;
  }

  private async fetchPrayerData(year: number, month?: number): Promise<any> {
    const url = this.getBaseUrl(year, month);
    const response = await fetch(url);
    return response.json();
  }

  private getMonthRange(startDate: Date, endDate: Date, year: number): [number, number] {
    const start = year === startDate.getFullYear() ? startDate.getMonth() + 1 : 1;
    const end = year === endDate.getFullYear() ? endDate.getMonth() + 1 : 12;
    return [start, end];
  }

  private async processYearData(year: number, startDate: Date, endDate: Date): Promise<any[]> {
    const [startMonth, endMonth] = this.getMonthRange(startDate, endDate, year);
    const monthDiff = endMonth - startMonth;

    // If difference is more than one month, fetch entire year
    if (monthDiff > 1) {
      const yearData = await this.fetchPrayerData(year);
      return Array.from(
        { length: endMonth - startMonth + 1 },
        (_, i) => yearData.data[String(startMonth + i)]
      );
    }

    // Otherwise fetch individual months
    const monthsData = [];
    for (let month = startMonth; month <= endMonth; month++) {
      const monthData = await this.fetchPrayerData(year, month);
      monthsData.push(monthData.data);
    }
    return monthsData;
  }

  async getPrayersTimings(): Promise<void> {
    const startYear = this.startDate.getFullYear();
    const endYear = this.endDate.getFullYear();
    const years = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );

    // Fetch data for all years concurrently
    const yearPromises = years.map(year => 
      this.processYearData(year, this.startDate, this.endDate)
    );

    // Wait for all requests to complete
    const yearResults = await Promise.all(yearPromises);
    
    // Flatten the results into a single array
    this.timings = yearResults.flat();
  }
}
