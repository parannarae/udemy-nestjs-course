import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

// class to interact with file data
@Injectable()   // Mark this service to be registered in DI container
export class MessagesRepository {
    async findOne(id: string) {
        const contents = await readFile('messages.json', 'utf-8');
        const messages = JSON.parse(contents);

        return messages[id];
    }

    async findAll() {
        const contents = await readFile('messages.json', 'utf-8');
        const messages = JSON.parse(contents);

        return messages;
    }

    async createMessage(content: string) {
        const contents = await readFile('messages.json', 'utf-8');
        const messages = JSON.parse(contents);

        // create random id
        const id = Math.floor(Math.random() * 999);
        messages[id] = { id, content };

        // write back to file
        await writeFile('messages.json', JSON.stringify(messages));
    }
}
