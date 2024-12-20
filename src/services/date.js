import {
	endOfMonth,
	endOfToday,
	endOfWeek,
	endOfYesterday,
	format,
	intervalToDuration,
	startOfMonth,
	startOfToday,
	startOfWeek,
	startOfYesterday,
	subMonths,
	subWeeks,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export const getLocalDateTime = (date, userLocationState) =>
	formatInTimeZone(date, userLocationState, "yyyy-MM-dd'T'HH:mm:ss");

export const getNewsDate = (input) => {
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const dateArray = format(input, 'P').split('/');

	if (typeof input === 'object')
		return `${monthNames[input.getMonth()].toUpperCase()} ${dateArray[1]}, ${
			dateArray[2]
		}`;

	return null;
};

export const getToday = () => startOfToday(new Date());
export const getTodayEnd = () => endOfToday(new Date());

export const getYesterday = () => startOfYesterday(new Date());
export const getYesterdayEnd = () => endOfYesterday(new Date());

export const getThisWeek = () => ({
	start: startOfWeek(new Date()),
	end: endOfWeek(new Date()),
});

export const getLastWeek = () => ({
	start: startOfWeek(subWeeks(new Date(), 1)),
	end: endOfWeek(subWeeks(new Date(), 1)),
});

export const getThisMonth = () => ({
	start: startOfMonth(new Date()),
	end: endOfMonth(new Date()),
});

export const getLastMonth = () => ({
	start: startOfMonth(subMonths(new Date(), 1)),
	end: endOfMonth(subMonths(new Date(), 1)),
});

export const getIntervalDate = (date) => {
	const measure = Object.keys(
		intervalToDuration({
			start: new Date(date),
			end: new Date(),
		})
	).find(
		(type) =>
			intervalToDuration({
				start: new Date(date),
				end: new Date(),
			})[type] !== 0
	);
	const number = intervalToDuration({
		start: new Date(date),
		end: new Date(),
	})[measure];

	return `${number} ${measure} ago`;
};
