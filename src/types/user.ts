export interface CreateUser extends UserCredential {
  name: string;
}

export interface UserCredential {
  email: string;
  password: string;
}

export interface UserPayload {
  name: string;
  email: string;
}
