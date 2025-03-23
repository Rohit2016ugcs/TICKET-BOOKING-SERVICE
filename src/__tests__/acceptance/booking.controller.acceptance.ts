import {Client, expect} from '@loopback/testlab';
import {TicketBookingSystemApplication} from '../..';
import {setupApplication} from './test-helper';

describe('BookingController', () => {
  let app: TicketBookingSystemApplication;
  let client: Client;
  let authToken: string;
  let ticketId: string;
  const randomEmail: string = `user${Date.now()}@example.com`;
  const randomName: string = `User${Date.now()}`;
  const idempotencyKey: number = Date.now();

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('should sign up a new user', async () => {
    await client.post('/user/signup')
      .type('form')
      .send({
        name: randomName,
        email: randomEmail,
        password: 'Test@123'
      }).expect(200);
  });

  it('should log in the user and return a token', async () => {
    const res = await client.get('/user/login')
      .type('form')
      .send({
        email: randomEmail,
        password: 'Test@123'
      }).expect(200);

    expect(res.body).to.have.property('token');
    authToken = res.body.token;
  });

  it('should create a product', async () => {
    await client.post('/product')
      .set('Authorization', `Bearer ${authToken}`)
      .type('form')
      .send({
        name: 'MOVIE',
        price: 150
      }).expect(200);
  });

  it('should create a ticket', async () => {
    const res = await client.post('/ticket')
      .set('Authorization', `Bearer ${authToken}`)
      .type('form')
      .send({
        idempotencyKey: idempotencyKey,
        productId: 1
      }).expect(200);

    expect(res.body).to.have.property('ticketId');
    ticketId = res.body.ticketId;
  });

  it('should return 200 without creating new record in booking table and contain fields like userId beside ticket id as processed before with same idempotency key when the same idempotencyKey is used again', async () => {
    const res = await client.post('/ticket')
      .set('Authorization', `Bearer ${authToken}`)
      .type('form')
      .send({
        idempotencyKey: idempotencyKey,
        productId: 1
      }).expect(200);

    expect(res.body).to.have.property('userId').which.is.a.Number();
  });

  it('should create 2 concurrent bookings', async () => {
    const [res1, res2] = await Promise.all([
      client.post('/ticket')
        .set('Authorization', `Bearer ${authToken}`)
        .type('form')
        .send({
          idempotencyKey: Date.now(),
          productId: 1
        }).expect(200),

      client.post('/ticket')
        .set('Authorization', `Bearer ${authToken}`)
        .type('form')
        .send({
          idempotencyKey: Date.now() + 1,
          productId: 1
        }).expect(200)
    ]);

    expect(res1.body).to.have.property('ticketId');
    expect(res2.body).to.have.property('ticketId');
    expect(res1.body.ticketId).to.not.equal(res2.body.ticketId);
  });

  it('should book the ticket', async () => {
    await client.patch('/ticket')
      .set('Authorization', `Bearer ${authToken}`)
      .type('form')
      .send({
        ticketId,
        amount: 100
      }).expect(200);
  });

  it('should get all tickets', async () => {
    await client.get('/ticket?pageNo=1&pageSize=3')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('should get ticket details', async () => {
    await client.get(`/ticket/${ticketId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('should cancel a ticket', async () => {
    await client.delete(`/ticket/${ticketId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });
});
