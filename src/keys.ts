import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {UserCredential} from './types';
import {User} from './models';
import {PasswordHasher} from './services/hash.password.bcrypt';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = '$r32f23r#$$';
  export const TOKEN_EXPIRES_IN_VALUE = 7*24*60*60;
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret'
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<number>(
    'authentication.jwt.expiresIn'
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'service.jwt.service'
  );
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<UserCredential, User>>(
    'service.user.service'
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
   'service.hasher'
  );
  export const ROUNDS = BindingKey.create<number>(
    'rounds'
  );
}
