import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Request, Response } from 'express';
import { User } from '../user.entity';

declare global {
  // Add one more property to Express.Request interface (to fix)
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

// To use DI (to inject UsersService) make this class Injectable
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: (error?: Error | any) => void) {
    const { userId } = req.session || {}; // make one if not exists

    if (userId) {
      const user = await this.usersService.findOne(userId);
      // Note that req (in express) does not have currentUser in default thus
      // typescript givens a compile error.
      // This can be ignored using `@ts-ignore` keyword or by defining an
      // interface to resolve type issue.
      req.currentUser = user;
    }

    // next refer to the next middleware to be run
    next();
  }
}
