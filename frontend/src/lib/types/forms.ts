import type { DateTime } from "luxon";

export type RawSimpleForm = {
    titel: string;
    anonym: "Ja" | "Nej";
    ejer: string;
    id: string;
    svarfrist: string;
}

export type SimpleForm = {
    title: string;
    deadline: DateTime;
    anonymous: boolean;
    owner: string;
    id: string;
}

export type RawForm = {
    titel: string;
    afstender: {
        navn: string;
        id: string;
    };
    anonym: boolean;
    indhold: {
        svar: {
            type: null | "radio" | "checkbox" | "tekstfelt";
            id: null | string;
            muligheder: {
                id: string;
                tekst: string;
            }[];
        };
        titel: string;
        tekst: string;
    }[];
}

export type Form = {
    title: string;
    owner: {
        name: string;
        id: string;
    };
    anonymous: boolean;
    questions: {
        type: null | "radio" | "checkbox" | "tekstfelt";
        title: string;
        description: string;
        id: null | string;
        options: {
            id: string;
            value: string;
        }[];
    }[];
}