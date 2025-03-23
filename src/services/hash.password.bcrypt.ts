import {inject} from '@loopback/core';
import { genSalt, hash, compare } from 'bcryptjs'
import {PasswordHasherBindings} from '../keys';

export interface PasswordHasher<T=string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(providedPass: T, storedPass: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {
  constructor(
    @inject(PasswordHasherBindings.ROUNDS) public readonly rounds: number
  ){}
  async comparePassword(providedPass: string, storedPass: string): Promise<boolean> {
    const passwordMatched = await compare(providedPass, storedPass);
    return passwordMatched;
  }
  async hashPassword(password: string) {
    const salt = await genSalt(this.rounds);
    const hashedPassword =  await hash(password, salt);
    return hashedPassword;
  }
}
