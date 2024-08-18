import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // set to global such that this module is created only once for the system lifespan
      envFilePath: `.env.${process.env.NODE_ENV}`,  // set the .env file according to the current environment
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // Allow DI to inject ConfigService while setting up TypeORM module
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'), // Get DB_NAME from .env file
          synchronize: true,
          entities: [User, Report],
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   // Set up configuration for SQLite
    //   type: 'sqlite',
    //   database: 'db.sqlite', // name of database == file name to store all data
    //   entities: [User, Report], // list out all the entities to be used (e.g. UserEntity, ReportEntity)
    //   synchronize: true,
    // }),
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
