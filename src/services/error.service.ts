import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class ErrorService {
  constructor(/* Add @inject to inject parameters */) {}
  badRequest(msg?: string) {
    return new HttpErrors.BadRequest(msg ?? 'bad request')
  }
  notFound(msg?: string) {
    return new HttpErrors.NotFound(msg ?? 'not found')
  }
  serverError(msg?: string) {
    return new HttpErrors.InternalServerError(msg ?? 'internal server error')
  }
}
