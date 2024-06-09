import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    // no inject decorator as DI will figure out the type `UsersService`
    constructor(private usersService: UsersService) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        this.usersService.create(body.email, body.password);
    }

    // @UseInterceptors(ClassSerializerInterceptor)    // Apply serializer interceptor
    // @UseInterceptors(SerializeInterceptor)
    // @UseInterceptors(new SerializeInterceptor(UserDto))
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        // Note that the part of url is string -> Param is needed to be parsed

        // Return 404 if id is not exists
        //  By design, `findOne` will return null if not exists
        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('user not found');
        }

        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    // Patch body form can be very different (some combination of attributes)

    @Delete('/:id')
    remoteUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }
}
