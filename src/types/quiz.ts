export interface GameResponse {
  statut: number;
  message: string;
  jeu: Game;
}

export interface Game {
  _id: string;
  titre: string;
  image: string;
  createdBy: string;
  planification: any[];
  questions: any[];
  date: string;
}

export interface QuestionType {
  _id: string;
  libelle: string;
  description: string;
  reference: string;
  date: string;
}

export interface PointType {
  _id: string;
  nature: string;
  valeur: number;
  description: string;
  date: string;
}

export interface QuestionTypeResponse {
  success: boolean;
  message: string;
  data: QuestionType[];
}

export interface PointTypeResponse {
  success: boolean;
  message: string;
  data: PointType[];
}