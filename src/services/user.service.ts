import { UserService } from '@loopback/authentication';
import {UserCredential} from '../types';
import {User} from '../models';
import {securityId, UserProfile} from '@loopback/security';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {inject, service} from '@loopback/core';
import {ErrorService} from './error.service';
import {BcryptHasher} from './hash.password.bcrypt';
import {PasswordHasherBindings} from '../keys';

export class MyUserService implements UserService<User, UserCredential> {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @service(ErrorService) private errorService: ErrorService,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) private bcryptHasher: BcryptHasher
  ){}
  async verifyCredentials(credentials: UserCredential): Promise<User> {
    const user = await this.userRepository.findOne({
     where: {
      email: credentials.email
     }
    })
    if(!user) throw this.errorService.notFound("user not found");
    const passwordMatched = await this.bcryptHasher.comparePassword(credentials.password, user.password);
    if(!passwordMatched) throw this.errorService.unauthorized('invalid password');
    return user;
  }
  convertToUserProfile(user: User): UserProfile {
    const userName = user.name;
    return { [securityId]: '', id: `${user.id}`, name: userName };
  }

}
