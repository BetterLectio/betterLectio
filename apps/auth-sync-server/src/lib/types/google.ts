import type { calendar_v3, tasks_v1 } from "googleapis";

export type CalendarEvent = calendar_v3.Schema$Event;
export interface EventSyncOptions {
	calendarId: string;
	blacklist: string;
	eventReminders?: calendar_v3.Schema$EventReminder[];
};

export type GoogleTask = tasks_v1.Schema$Task;
export interface TaskSyncOptions {
    tasklist: string;
    addFinishedTasks: boolean;
	maxAge?: string;
};

export interface GoogleResponse<T = any> {
	data: T;
	status: number;
	statusText: string;
	headers: any;
}