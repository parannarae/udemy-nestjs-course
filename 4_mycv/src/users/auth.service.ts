import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

// Make a function with a callback (old way) as a Promise based function (new way)
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // Hash user's password
    // Generate a salt
    //  8 random bytes -> 16 alphanumeric in hex
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    //  Returning 32 characters in hash value
    // Note that Typescript has no idea on the return value of promisify function,
    //  thus we need to give a hint using `as` keyword
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.usersService.create(email, result);

    // Return the user
    return user;
  }

  async signin(email: string, password: string) {
    // find returns arrays of user thus destructing it to a user variable
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Retrieve salt and hash value
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Compare hash values
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    return user;
  }
}
