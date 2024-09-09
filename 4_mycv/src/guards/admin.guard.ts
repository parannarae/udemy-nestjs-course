import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Note that currentUser is defined by an interceptor (current-user.interceptor.ts)
    if (!request.currentUser) {
      return false;
    }

    return request.currentUser.admin;
  }
}
