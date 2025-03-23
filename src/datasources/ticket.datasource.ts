import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'Ticket',
  connector: 'mysql',
  url: '',
  host: 'sql12.freesqldatabase.com',
  port: 3306,
  user: 'sql12768962',
  password: 'u7nYcSL9ZP',
  database: 'sql12768962'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class TicketDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'Ticket';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Ticket', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
