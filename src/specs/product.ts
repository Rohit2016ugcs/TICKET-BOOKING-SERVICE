import { ResponseObject} from '@loopback/rest';

export const CREATE_PRODUCT_BODY: ResponseObject = {
  description: 'The product creation request body (URL-encoded)',
  required: true,
  content: {
    'application/x-www-form-urlencoded': {
      schema: {
        type: 'object',
        properties: {
         name: {
            type: 'string',
            description: 'product name',
            example: 'movie'
          },
          price: {
            type: 'number',
            description: 'product price',
            example: 100
          }
        },
        required: ['name', 'price']
      }
    }
  }
};


export const CREATE_PRODUCT_RESPONSE: ResponseObject = {
  description: 'product detail',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number' }
        }
      }
    }
  }
};
