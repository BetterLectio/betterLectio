import type { DateTime } from "luxon";

export type RawFullMessage = {
    beskeder: {
        besked: string;
        bruger: { id: string; navn: string };
        dato: string;
        id: string;
        titel: string;
        vedhæftninger?: {
            href: string;
            navn: string
        }[];
        padding_left: number;
    }[];
    modtagere: string;
}

export type FullMessage = {
    messages: {
        attachments: {
            link: string;
            name: string;
        }[];
        body: string;
        date: DateTime;
        edits: string[];
        client?: { name: string, link: string };
        sender: { id: string, name: string };
        title: string;
        id: string;
        indent: number;
    }[];
    receivers: string;
}

export type RawMessage = {
    dato: string;
    emne: string;
    "førsteBesked": string;
    message_id: string;
    modtagere: string[];
    senesteBesked: string;
    "ændret": string;
}

export type Message = {
    date: DateTime;
    id: string;
    receivers: string[];
    sender: string;
    title: string;
}

export type RawSimpleMessage = {
    afsender: string;
    dato: string;
    id: string;
    navn: string;
}

export type SimpleMessage = {
    date: DateTime;
    id: number;
    sender: string;
    title: string;
}