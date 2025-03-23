// Uncomment these imports to begin using these cool features!

import {IsolationLevel, repository} from '@loopback/repository';
import {ProductRepository, TicketRepository, UserRepository} from '../repositories';
import {api, del, get, param, patch, post, requestBody, response } from '@loopback/rest';
import {BOOK_TICKET_BODY, BOOK_TICKET_RESPONSE, CREATE_TICKET_BODY, CREATE_TICKET_RESPONSE, GET_TICKET_RESPONSE, TICKET_DETAIL_RESPONSE} from '../specs';
import {BookTicket, CreateTicket} from '../types';
import {service} from '@loopback/core';
import {ErrorService} from '../services';
import {TicketStatus} from '../enum/ticket';

// import {inject} from '@loopback/core';

@api({
  basePath: '/ticket'
 })
export class BookingController {
  constructor(
    @repository(ProductRepository) private productRepository: ProductRepository,
    @repository(UserRepository) private userRepository: UserRepository,
    @repository(TicketRepository) private ticketRepository: TicketRepository,
    @service(ErrorService) private errorService: ErrorService,
  ) {}

  @post('')
  @response(200, CREATE_TICKET_RESPONSE)
  async createTicket
  (
    @requestBody(CREATE_TICKET_BODY) body: CreateTicket
  ) {
    const { idempotencyKey, productId } = body;
    let transaction;
    let ticket = await this.ticketRepository.findOne({ where: { idempotencyKey } });
    if(ticket) return ticket;
    const product = await this.productRepository.findById(productId);
    if(!product) throw this.errorService.badRequest('product not found');
    try {
      transaction = await this.ticketRepository.dataSource.beginTransaction(
        IsolationLevel.REPEATABLE_READ
      )
      ticket = await this.ticketRepository.create({
        idempotencyKey,
        userId: 1,
        productId,
        amount: product.price,
        status: TicketStatus.PENDING
      }, { transaction })
      await transaction.commit();
      return {
        ticketId: ticket.id
      }
    } catch(err) {
      await transaction?.rollback()
      throw this.errorService.badRequest(err.message);
    }
  }

  @patch('')
  @response(200, BOOK_TICKET_RESPONSE)
  async bookTicket(
    @requestBody(BOOK_TICKET_BODY) body: BookTicket
  ) {
    const { ticketId, amount } = body;
    const ticket = await this.ticketRepository.findById(ticketId);
    if(!ticket) throw this.errorService.notFound("ticket not found");
    if(ticket.amount !== amount) {
      await this.ticketRepository.updateById(ticketId, { status: TicketStatus.FAILURE });
      throw this.errorService.badRequest("payment price mismatch")
    }
    await this.ticketRepository.updateById(ticketId, { status: TicketStatus.SUCCESS })
    return {
      id: ticket.id,
      userId: ticket.userId,
      price: ticket.amount,
      productId: ticket.productId,
      status: TicketStatus.SUCCESS
    }
  }

  @get('')
  @response(200, GET_TICKET_RESPONSE)
  async getUserTicket(
    @param.query.number('pageNo') pageNo: number,
    @param.query.number('pageSize') pageSize: number
  ){
    const tickets = await this.ticketRepository.find({ where: { userId: 1 }, limit: pageSize, offset: (pageNo - 1) * pageSize });
    return tickets
  }

  @get('/{ticketId}')
  @response(200, TICKET_DETAIL_RESPONSE)
  async getTicketDetail(
    @param.path.number('ticketId') ticketId: number
  ) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if(!ticket) throw this.errorService.notFound("ticket not found")
    return ticket;
  }



  @del('/{ticketId}')
  @response(200, TICKET_DETAIL_RESPONSE)
  async cancelTicket(
    @param.path.number('ticketId') ticketId: number
  ) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if(!ticket) throw this.errorService.notFound("ticket not found");
    await this.ticketRepository.deleteById(ticketId);
    return ticket;
  }
}
