import { ExecutionContext, createParamDecorator } from "@nestjs/common";

// Decorator to get a route handler's parameter
export const CurrentUser = createParamDecorator(
    // Note:
    //  - ExecutionContext work not only with REST but also with webSocket, gRPC, HTTP, GraphQL, etc.
    //  - `never` type tells that the data is never going to be used in the function
    //    - this gives error when a decorator has an argument passed in
  (data: never, context: ExecutionContext) => {
    // Inspect incoming request
    const request = context.switchToHttp().getRequest();
    // currentUser is assigned in the interceptor
    //  Note that the interceptor is used to retrieve currentUser since decorator has no access
    //  to DI (and get UsersService)
    return request.currentUser;
  }
)