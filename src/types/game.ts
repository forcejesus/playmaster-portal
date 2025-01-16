export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Response {
  _id: string;
  reponse_apprenant: string;
  etat: boolean;
}

export interface Question {
  _id: string;
  libelle: string;
  fichier: string;
  type_fichier: string;
  temps: number;
  limite_response: boolean;
  reponses: string[];
  typeQuestion: string;
  point: string;
  date: string;
}

export interface Participant {
  _id: string;
  score: number;
  reponses: Response[];
  apprenant: null;
  date: string;
}

export interface Planning {
  _id: string;
  pin: string;
  statut: "en cours" | "en attente";
  date_debut: string;
  date_fin: string;
  heure_debut: string;
  heure_fin: string;
  type: string;
  limite_participant: number;
  participants: Participant[];
  date: string;
}

export interface Game {
  _id: string;
  titre: string;
  image: string;
  createdBy: User;
  planification: Planning[];
  questions: Question[];
  date: string;
}