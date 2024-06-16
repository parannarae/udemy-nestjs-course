import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToClass } from 'class-transformer';

// make interface to distinguish a class
interface ClassConstructor {
  new (...args: any[]): {};
}

// decorator is just a function
// export function Serialize(dto: any) {
// only allows the class as an argument type
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  // allow to use dynamic dto class
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        // Note: following function is replaced with `plainToInstance`
        return plainToClass(this.dto, data, {
          // ignore any property having no decorator of Expose or Exclude
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
