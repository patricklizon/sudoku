import type { TimeSecond, TimeMillisecond, TimeHour, TimeMinute } from "./types";

export const TIME_SECOND_IN_MILLISECONDS = 1000 as TimeMillisecond;

export const TIME_MINUTE_IN_SECONDS = 60 as TimeSecond;
export const TIME_MINUTE_IN_MILLISECONDS = (TIME_MINUTE_IN_SECONDS *
	TIME_SECOND_IN_MILLISECONDS) as TimeSecond;

export const TIME_HOUR_IN_MINUTES = 60 as TimeMinute;
export const TIME_HOUR_IN_SECONDS = (TIME_MINUTE_IN_SECONDS * 60) as TimeSecond;
export const TIME_HOUR_IN_MILLISECONDS = (TIME_HOUR_IN_SECONDS *
	TIME_SECOND_IN_MILLISECONDS) as TimeMillisecond;

export const TIME_DAY_IN_HOURS = 24 as TimeHour;
export const TIME_DAY_IN_MINUTES = (TIME_DAY_IN_HOURS * TIME_HOUR_IN_MINUTES) as TimeMinute;
export const TIME_DAY_IN_SECONDS = (TIME_DAY_IN_HOURS * TIME_HOUR_IN_SECONDS) as TimeSecond;
export const TIME_DAY_IN_MILLISECONDS = (TIME_DAY_IN_HOURS *
	TIME_HOUR_IN_MILLISECONDS) as TimeMillisecond;
