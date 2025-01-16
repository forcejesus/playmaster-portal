export interface School {
  _id: string;
  libelle: string;
  adresse: string;
  ville: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  ecole: School;
  iat: number;
  exp: number;
}

export interface LoginResponse {
  statut: number;
  message: string;
  token: string;
}