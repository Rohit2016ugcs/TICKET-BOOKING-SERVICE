export interface CreateTicket {
  idempotencyKey: number;
  productId: number;
}

export interface BookTicket {
  ticketId: number;
  amount: number;
}
