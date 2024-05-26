import { Injectable } from "@nestjs/common";
import { MessagesRepository } from "./messages.repository";

@Injectable()   // Mark this service to be registered in DI container
export class MessagesServices {
    // messagesRepo: MessagesRepository;

    // constructor(messagesRepo: MessagesRepository) {
    //     this.messagesRepo = messagesRepo;

    //     // // get repository to be used
    //     // // Service is creating its own dependencies (not done in production NestJS App)
    //     // this.messagesRepo = new MessagesRepository();
    // }

    // same as above
    constructor(public messagesRepo: MessagesRepository) {

    }

    findOne(id: string) {
        return this.messagesRepo.findOne(id);
    }

    findAll() {
        return this.messagesRepo.findAll();
    }

    createMessage(content: string) {
        return this.messagesRepo.createMessage(content);
    }
}