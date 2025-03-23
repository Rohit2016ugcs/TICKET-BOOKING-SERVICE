import * as yup from 'yup';
import {UserCredential} from '../types';

export const validateUser = async (userCredential: UserCredential) => {
  const userSchema = yup.object({
    email: yup.string().required().email('invalid email'),
    password: yup.string().required().min(8)
  })
  await userSchema.validate({ email: userCredential.email, password: userCredential.password })
}
