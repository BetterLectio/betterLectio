import type { DateTime } from "luxon";

export type RawSimpleDocument = {
    afsender: string;
    dato: string;
    id: string;
    navn: string;
}

export type SimpleDocument = {
    author: string;
    date: DateTime;
    id: number;
    title: string;
}

export type RawDocumentItem = {
    type: "dokument";
    navn: string;
    id: string;
    ændret_af: string;
    dato: string;
} | {
    type: "folder";
    navn: string;
    id: string;
}

export type DocumentItem = {
    type: "file";
    name: string;
    id: string;
    author: string;
    date: string;
    fileType: string;
    link: string
} | {
    type: "folder";
    name: string;
    id: string;
}