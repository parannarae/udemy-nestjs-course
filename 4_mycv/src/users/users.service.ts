import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // Adding private keyword allows to remove class attribute assignment code
  // InjectRepository decorator aids DI to put UserRepository (`Repository<User>`)
  //  since DI cannot understand generic type
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id }); // return an instance or null
  }

  find(email: string) {
    return this.repo.find({ where: { email } }); // return an array -> an empty array if not found
  }

  // Not a good design since
  //  1. How to pass only newPassword to change password
  //  2. Having many arguments would make the method complex
  // update(id: number, newEmail: string, newPassword: string) {}

  // Put a flexible type annotation to pass in only required attributes
  // Partial allows to use only part of Entity attributes
  //  - can be any object having some | none attributes defined in `User`
  async update(id: number, attrs: Partial<User>) {
    // use `save` to work with entity
    //  - require to fetch data from DB first in order to update data
    //  - whereas using `update` requires only one request to DB
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    // Copy all properties of attrs to user
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    // use `remove` to work with entity (due for hooks to be executed)
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }
}
