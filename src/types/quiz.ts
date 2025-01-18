export interface GameResponse {
  statut: number;
  message: string;
  jeu: {
    _id: string;
    titre: string;
    image: string;
    createdBy: string;
    planification: any[];
    questions: Question[];
    date: string;
    __v: number;
  };
}

export interface QuestionTypeResponse {
  success: boolean;
  message: string;
  data: Array<{
    _id: string;
    libelle: string;
    description: string;
    reference: string;
    date: string;
    __v: number;
  }>;
}

export interface PointTypeResponse {
  success: boolean;
  message: string;
  data: Array<{
    _id: string;
    nature: string;
    valeur: number;
    description: string;
    date: string;
    __v: number;
  }>;
}

export interface Question {
  id: string;
  libelle: string;
  type_fichier: string;
  temps: number;
  limite_response: boolean;
  typeQuestion: string;
  point: string;
  answers: Answer[];
}

export interface Answer {
  id: number;
  text: string;
  isOptional: boolean;
  isCorrect: boolean;
}