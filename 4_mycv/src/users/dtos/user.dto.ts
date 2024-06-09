import { Expose } from "class-transformer";

export class UserDto {
    @Expose()   //  Make this property visible in the response JSON
    id: number;

    @Expose()
    email: string;
}
