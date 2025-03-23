// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {api, post, requestBody, response} from '@loopback/rest';
import {CREATE_USER_BODY, CREATE_USER_RESPONSE} from '../specs';
import {CreateUser} from '../types';

// import {inject} from '@loopback/core';

@api({
  basePath: '/user'
})
export class UserController {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository
  ) {}

  @post('')
  @response(200, CREATE_USER_RESPONSE)
  async createUser(
    @requestBody(CREATE_USER_BODY) body: CreateUser
  ) {
    const { name, email, password } = body;
    const user = await this.userRepository.create({
      name,
      email,
      password
    })
    return user;
  }
}
