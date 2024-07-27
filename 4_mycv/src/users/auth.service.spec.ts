import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService; // To make the service (created in beforeEach) be visible to all `it`
  let fakeUsersService: Partial<UsersService>;  // allow to be accessible by each `it` to change its form

  beforeEach(async () => {
    // Create a fake copy of the users service
    // Type annotate the fake copy as an UsersService like type (partial)
    fakeUsersService = {
      // define only methods used by AuthService
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    // More intelligent mock
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // Create a DI container for this test
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          // Provide a list to register in DI (to inject appropriate dependency)
          //  e.g. when `provide` class is asked, use `useValue` value
          provide: UsersService,
          useValue: fakeUsersService, // Note that Typescript cannot check the provided object's type
        },
      ],
    }).compile();

    // DI will create AuthService with all the dependencies
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // redefined (overwrite) find to test this scenario
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    // await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
    //   BadRequestException,
    // );

    // refactor: Use intelligent mock - simply call sign up twice
    await service.signup('asdf@asdf.com', 'asdf');

    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    // // redefined (overwrite) find to test this scenario
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ email: 'asdf@asdf.com', password: 'asdf' } as User]);
    // // note that passing in email does not really matter as UsersService.find will return mock value anyway
    // await expect(
    //   service.signin('asdklfj@djkas.com', 'password'),
    // ).rejects.toThrow(BadRequestException);

    // refactor: Use intelligent mock
    await service.signup('lkasjdf@djkas.com', 'password');
    await expect(
      service.signin('lkasjdf@djkas.com', 'adlkasjdf'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    // note that mocked User's password should be `hash.salt` value in order to test if password is matching

    // ##### Option 1 (working around)
    // Use actual signup logic to get the actual hashed password
    // const user = await service.signup('asdf@asdf.com', 'mypassword');
    // console.log(user);

    // Then use this value as a mock
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       email: 'asdf@asdf.com',
    //       password:
    //         '88c95740a25cd9b0.c4bd28791b7acc6a919b486dd220dc4d210253db09228195a194e572fe6fd018',
    //     } as User,
    //   ]);

    // const user = await service.signin('asdf@asdf.com', 'mypassword');
    // expect(user).toBeDefined();

    // ##### Option 2 (Intelligent Mock)
    // Change fakeUserService to store `create` return value to a list such that it can be used in `find`
    await service.signup('asdf@asdf.com', 'mypassword');
    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
