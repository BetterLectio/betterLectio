export interface Participant {
  eks_dato: string;
  eks_slut: string;
  eks_start: string;
  elev_id: string;
  forb: string;
  klasse: string;
  navn: string;
}

interface ExamInfo {
  censor: string;
  elevtal: string;
  holdnavn: string;
  lokaler: string;
  lærer: string;
  note: string;
  periode: string;
  prøvehold: string;
  prøvetype: string;
  xprs_prøve: string;
}

export interface ExamData {
  info: ExamInfo;
  participants: Participant[];
}