import {inject, service} from '@loopback/core';
import {ErrorService} from './error.service';
import jwt from 'jsonwebtoken';
import {TokenService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import {TokenServiceBindings} from '../keys';

export class JWTService implements TokenService {
  constructor(
    @service(ErrorService) private errorService: ErrorService,
    @inject(TokenServiceBindings.TOKEN_SECRET) private readonly jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) private readonly jwtExpiresIn: number,
  ){}
  async generateToken(userProfile: UserProfile): Promise<string> {
    if(!userProfile) throw this.errorService.unauthorized("error while generating token : userprofile is null");
    let token = '';
    try {
      token = jwt.sign(userProfile, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn
      })
    } catch(err) {
      throw this.errorService.badRequest(err.message)
    }
    return token;
  }
  async verifyToken(token: string): Promise<UserProfile> {
    if(!token) throw this.errorService.unauthorized("error verifying token : 'token is null'")
    let userProfile: UserProfile;
    try {
      const decryptedToken = jwt.verify(token, this.jwtSecret);
      if(typeof decryptedToken !== 'object') throw this.errorService.unauthorized(decryptedToken);
      userProfile = Object.assign(
        {[securityId]: '', email: '', id: ''},
        {email: decryptedToken.email, id: decryptedToken.id}
      );
    } catch(err) {
      throw this.errorService.unauthorized(`error verifying token : ${err.message}`)
    }
    return userProfile;
  }
  revokeToken?(token: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

}
