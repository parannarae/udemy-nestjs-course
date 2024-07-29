import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    // send POST /auth/signup with a body {email, password}
    //  Check if 201 is returned with an user body
    const email = 'asdlkjq4321@akl.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, password: 'alskdfjl' })
      .expect(201)  // check the returning status code
      // check the response body
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });
});
