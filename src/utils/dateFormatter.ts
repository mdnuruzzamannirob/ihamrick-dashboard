export const dateFormatter = (
  utcDate: string | Date,
  options: {
    locale?: string;
    timeZone?: string;
    showTime?: boolean;
    showSeconds?: boolean;
  } = {},
): string => {
  if (!utcDate) return '-';

  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;

  // Default values
  const {
    locale = navigator.language,
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    showTime = false,
    showSeconds = false,
  } = options;

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone,
  };

  if (showTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
    if (showSeconds) formatOptions.second = '2-digit';
    formatOptions.hour12 = true;
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
};
