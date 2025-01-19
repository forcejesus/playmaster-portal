export interface Answer {
  file?: string;
  etat: number;
  question: string;
  reponse_texte: string;
}

export interface AnswerResponse {
  success: boolean;
  message: string;
  data: Answer;
}