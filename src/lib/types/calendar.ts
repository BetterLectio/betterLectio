import type { calendar_v3 } from "googleapis";

export type CalendarEvent = calendar_v3.Schema$Event;

export interface SyncOptions {
	eventReminders?: calendar_v3.Schema$EventReminder[];
};

export interface GoogleResponse<T = any> {
	data: T;
	status: number;
	statusText: string;
	headers: any;
}