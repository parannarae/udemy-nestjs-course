import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // Set up configuration for SQLite
      type: 'sqlite',
      database: 'db.sqlite', // name of database == file name to store all data
      entities: [User, Report], // list out all the entities to be used (e.g. UserEntity, ReportEntity)
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // When creating AppModule, below allows to apply new ValidationPipe to all incoming request
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  // Called automatically whenever incoming request is made
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asdfasfd'], // string to be used to encrypt cookie value
        }),
      )
      .forRoutes('*'); // apply middleware for all (*) routes
  }
}
