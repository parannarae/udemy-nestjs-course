import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesServices } from './messages.service';
import { MessagesRepository } from './messages.repository';

@Module({
  controllers: [MessagesController],
  // Add injectable classes to use in DI
  providers: [MessagesServices, MessagesRepository]
})
export class MessagesModule {}
