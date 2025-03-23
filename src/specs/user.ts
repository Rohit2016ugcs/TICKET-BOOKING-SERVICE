import { ResponseObject} from '@loopback/rest';

export const CREATE_USER_BODY: ResponseObject = {
  description: 'The user creation request body (URL-encoded)',
  required: true,
  content: {
    'application/x-www-form-urlencoded': {
      schema: {
        type: 'object',
        properties: {
         name: {
            type: 'string',
            description: 'user name',
            example: 'rohit'
          },
          email: {
            type: 'string',
            description: 'user email',
            example: 'rohit@gmail.com'
          },
          password: {
            type: 'string',
            description: 'user password',
            example: 'rohit@123'
          }
        },
        required: ['name', 'email', 'password']
      }
    }
  }
};

export const CREATE_USER_RESPONSE: ResponseObject = {
  description: 'user detail',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
        }
      }
    }
  }
};

export const USER_LOGIN_BODY: ResponseObject = {
  description: 'The user login request body (URL-encoded)',
  required: true,
  content: {
    'application/x-www-form-urlencoded': {
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'user email',
            example: 'rohit@gmail.com'
          },
          password: {
            type: 'string',
            description: 'user password',
            example: 'rohit@123'
          }
        },
        required: ['email', 'password']
      }
    }
  }
};

export const USER_LOGIN_RESPONSE: ResponseObject = {
  description: 'user data',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          token: { type: 'string' }
        }
      }
    }
  }
};
