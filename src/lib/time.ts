const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const MONTHS_PER_YEAR = 12;

const SECOND = MILLISECONDS_PER_SECOND;
const MINUTE = SECOND * SECONDS_PER_MINUTE;
const HOUR = MINUTE * MINUTES_PER_HOUR;
const DAY = HOUR * HOURS_PER_DAY;
const WEEK = DAY * DAYS_PER_WEEK;
const YEAR = DAY * 365.24;
const NORMAL_YEAR = DAY * 365;
const LEAP_YEAR = DAY * 366;
const DECADE = 10 * YEAR;
const HALF_YEAR = YEAR / 2;
const AVERAGE_MONTH = YEAR / 12;

export default {
    SECOND,
    MINUTE,
    HOUR,
    DAY,
    WEEK,
    YEAR,
    NORMAL_YEAR,
    LEAP_YEAR,
    DECADE,
    HALF_YEAR,
    AVERAGE_MONTH,
    MILLISECONDS_PER_SECOND,
    SECONDS_PER_MINUTE,
    MINUTES_PER_HOUR,
    HOURS_PER_DAY,
    DAYS_PER_WEEK,
    MONTHS_PER_YEAR,

    // ±100,000,000 days, the min and max dates allowed in ECMA Script.
    // See: http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
    MIN_DATE: new Date(-8.64e15),
    MAX_DATE: new Date(8.64e15),
};
