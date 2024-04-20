import type { RawLesson } from "./lesson";

export type RawAbsence = {
    generalt: {
        heleåret_fravær_moduler: string;
        heleåret_fravær_procent: string;
        hold: string;
        opgjort_fravær_moduler: string;
        opgjort_fravær_procent: string;
    }[];
    grafisk_oversigt: string;
    moduler: {
        manglende_fraværsårsager: {
            aktivitet: RawLesson;
            fravær: string;
            fraværstype: string;
            lærer: string;
            registreret: string;
            type: "Lektion" | string;
            uge: string;
        }[];
        oversigt: {
            aktivitet: RawLesson;
            bemærkning: string;
            fravær: string;
            fraværstype: string;
            lærer: string;
            registreret: string;
            type: "Lektion" | string;
            uge: string;
            årsag: "Anden" | "Kom for sent" | "Private forhold" | "Skolerelaterede aktiviteter" | "Sygdom";
            årsagsnote: string;
        }[];
    };
}