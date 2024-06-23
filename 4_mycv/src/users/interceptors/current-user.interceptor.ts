import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  // context: wrapper of an incoming request
  // next: reference to the route handler
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      // Assign the found user to a request data in order for decorator (in a route handler)
      //  to get the data
      request.currentUser = user;
    }

    // Make a route handler to execute its logic
    return next.handle();
  }
}
