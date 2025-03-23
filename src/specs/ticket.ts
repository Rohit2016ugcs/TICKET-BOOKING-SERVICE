import { ResponseObject} from '@loopback/rest';

export const CREATE_TICKET_BODY: ResponseObject = {
  description: 'ticket creation request body (URL-encoded)',
  required: true,
  content: {
    'application/x-www-form-urlencoded': {
      schema: {
        type: 'object',
        properties: {
          idempotencyKey: {
            type: 'integer',
            description: 'Unique key to prevent duplicate transactions',
            example: 1234567890123
          },
          productId: {
            type: 'integer',
            description: 'The ID of the product being booked',
            example: 1
          }
        },
        required: ['idempotencyKey', 'productId']
      }
    }
  }
};

export const CREATE_TICKET_RESPONSE: ResponseObject = {
  description: 'ticket creation data',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        }
      }
    }
  }
};

export const BOOK_TICKET_BODY: ResponseObject = {
  description: 'ticket booking request body (URL-encoded)',
  required: true,
  content: {
    'application/x-www-form-urlencoded': {
      schema: {
        type: 'object',
        properties: {
          ticketId: {
            type: 'integer',
            description: 'ticket booking id',
            example: 1234567890123
          },
          amount: {
            type: 'number',
            description: 'The price of the product being booked',
            example: 100
          }
        },
        required: ['ticketId', 'amount']
      }
    }
  }
};

export const BOOK_TICKET_RESPONSE: ResponseObject = {
  description: 'ticket booking detail',
  content: {
    'application/json': {
      schema: {
        type: 'object'
      }
    }
  }
};

export const GET_TICKET_RESPONSE: ResponseObject = {
  description: 'user all booked tickets',
  content: {
    'application/json': {
      schema: {
        type: 'array'
      }
    }
  }
};

export const TICKET_DETAIL_RESPONSE: ResponseObject = {
  description: 'user booked ticket detail',
  content: {
    'application/json': {
      schema: {
        type: 'object'
      }
    }
  }
};

