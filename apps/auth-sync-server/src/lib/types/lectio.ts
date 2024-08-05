export interface Modul {
    absid: string;
    navn: string | null;
    hold: string | null;
    tidspunkt: string | null;
    status: "normal" | "ændret" | "aflyst" | "eksamen" | null;
    lokale: string | null;
}

export interface Opgave {
    exerciseid: string;
    frist: string;
    hold: string;
    opgavetitel: string;
    opgavenote: string;
    "elev-tid": string;
    status: "Venter" | "Afleveret" | "Mangler" | "Afsluttet";
}