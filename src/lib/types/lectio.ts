export interface Modul {
    absid: string;
    hold: string | null;
    tidspunkt: string | null;
    status: "normal" | "ændret" | "aflyst" | "eksamen" | null;
    lokale: string | null;
}