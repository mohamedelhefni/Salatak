/**
 * Prayer color system for consistent visual representation across the app
 * Used in prayers table, calendar events, and other UI components
 */

export const PRAYER_COLORS = {
  Fajr: '#3B82F6',    // Blue
  Dhuhr: '#10B981',   // Green
  Asr: '#F59E0B',     // Orange/Amber
  Maghrib: '#EC4899', // Pink
  Isha: '#8B5CF6',    // Purple
  Jummah: '#10B981'   // Green (same as Dhuhr)
} as const;

export type PrayerName = keyof typeof PRAYER_COLORS;

/**
 * Composable for accessing prayer colors
 */
export const usePrayerColors = () => {
  /**
   * Get the color for a specific prayer
   */
  const getColor = (prayerName: PrayerName): string => {
    return PRAYER_COLORS[prayerName] || '#6B7280'; // Default gray if not found
  };

  /**
   * Get all prayer colors as an object
   */
  const getAllColors = () => {
    return { ...PRAYER_COLORS };
  };

  /**
   * Get color with opacity (for backgrounds, borders, etc.)
   */
  const getColorWithOpacity = (prayerName: PrayerName, opacity: number = 0.1): string => {
    const color = getColor(prayerName);
    // Convert hex to RGB and add opacity
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return {
    PRAYER_COLORS,
    getColor,
    getAllColors,
    getColorWithOpacity
  };
};
