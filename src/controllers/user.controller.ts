// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {api, get, post, requestBody, response} from '@loopback/rest';
import {CREATE_USER_BODY, CREATE_USER_RESPONSE, USER_LOGIN_BODY, USER_LOGIN_RESPONSE} from '../specs';
import {CreateUser, UserCredential} from '../types';
import _ from 'lodash';
import {validateUser} from '../buiseness/validator';
import {inject, service} from '@loopback/core';
import {ErrorService} from '../services';
import {BcryptHasher} from '../services/hash.password.bcrypt';
import {MyUserService} from '../services/user.service';
import {JWTService} from '../services/jwt.service';
import {PasswordHasherBindings, TokenServiceBindings, UserServiceBindings} from '../keys';
import { securityId } from '@loopback/security';

// import {inject} from '@loopback/core';

@api({
  basePath: '/user'
})
export class UserController {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @service(ErrorService) private errorService: ErrorService,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) private bcryptHasher: BcryptHasher,
    @inject(UserServiceBindings.USER_SERVICE) private userService: MyUserService,
    @inject(TokenServiceBindings.TOKEN_SERVICE) private jwtService: JWTService
  ) {}

  @post('/signup')
  @response(200, CREATE_USER_RESPONSE)
  async signup(
    @requestBody(CREATE_USER_BODY) body: CreateUser
  ) {
    //encrypt password
    body.password = await this.bcryptHasher.hashPassword(body.password);
    const { name, email, password } = body;
    try {
      await validateUser(_.pick(body, ['email', 'password']));
      const user = await this.userRepository.create({
        name,
        email,
        password
      })
      return _.omit(user,'password');
    } catch(err) {
      throw this.errorService.badRequest(err.message)
    }
  }

  @get('/login')
  @response(200, USER_LOGIN_RESPONSE)
  async login(
    @requestBody(USER_LOGIN_BODY) credentials: UserCredential
  ){
    const user = await this.userService.verifyCredentials(credentials);
    const token = await this.jwtService.generateToken({[securityId]: user.id!.toString(), email: user.email, id: user.id });
    return { token }
  }
}
