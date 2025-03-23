import {AuthenticationStrategy} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {TokenServiceBindings} from '../keys';
import {JWTService} from '../services/jwt.service';
import {ErrorService} from '../services';


export class JWTStrategy implements AuthenticationStrategy {
  name: string = 'jwt';
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE) private jwtService: JWTService,
    @service(ErrorService) private errorService: ErrorService
  ){}
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.getToken(request);
    const userProfile = await this.jwtService.verifyToken(token);
    return userProfile;
  }

  getToken(request: Request): string {
    if(!request.headers.authorization) throw this.errorService.unauthorized("Authorization header is missing");
    const authHeaderValue = request.headers.authorization;
    if(!authHeaderValue.startsWith('Bearer')) throw this.errorService.unauthorized("Authrization header must be of type 'Bearer xxx.yyy.zzz'");
    const parts = authHeaderValue.split(' ');
    if(parts.length !== 2) throw this.errorService.unauthorized("Authrization header has too many parts. Must be of form 'Bearer xxx.yyy.zzz'");
    const token = parts[1];
    return token;
  }
}
