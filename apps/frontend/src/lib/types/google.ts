import type { DateTime } from 'luxon';

export type GoogleSyncSettings = {
	enabled: boolean;
	CalenderEnabled: boolean;
	TaskEnabled: boolean;
	googleToken: string;
	lectioToken: string;
	tokenValid: boolean;

	calendar: {
		autoSync: boolean;
		calendars: GCalendar[];
		syncInterval: 'every day' | 'every week' | 'manual';
		amountOfWeeks: number;
		preferredCalendar: GCalendar | null;
		notifications: boolean;
		lastSync: DateTime | null;
		nextSync: DateTime | null;
	} | null;
	tasks: {
		autoSync: boolean;
		syncInterval: 'every day' | 'every week' | 'manual';
		amountOfWeeks: 1 | 2 | 3 | 4;
		preferredList: string;
		lastSync: DateTime | null;
		nextSync: DateTime | null;
	} | null;
};

export type GoogleSyncObject = {
	settings: GoogleSyncSettings;
	startWeek: number;
	syncToCalendar: boolean;
	syncToTasks: boolean;
};

export type GoogleSyncCheckTokenObject = {
	token: string;
};

export type GCalendar = {
	value: string;
	label: string;
};
