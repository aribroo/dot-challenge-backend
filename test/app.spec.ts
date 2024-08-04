import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/common/database/database.service';
import { DatabaseModule } from '../src/common/database/database.module';

describe('e2e Testing', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    databaseService = app.get(DatabaseService);
  });

  describe('Test token for API', () => {
    let token = '';

    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        username: 'testing',
        password: '12345',
        name: 'Rifki Ari',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testing',
          password: '12345',
        });

      token = response.body.access_token;
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', 'invalidToken')
        .send({
          title: 'Tutorial Coding',
          content: 'Bagaimana cara jadi jago coding?',
        });

      expect(response.statusCode).toBe(401);
    });

    it('should return 401 if token is not provided', async () => {
      const response = await request(app.getHttpServer()).post('/posts').send({
        title: 'Tutorial Coding',
        content: 'Bagaimana cara jadi jago coding?',
      });

      expect(response.statusCode).toBe(401);
    });

    it('should success post if token is valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Tutorial Coding',
          content: 'Bagaimana cara jadi jago coding?',
        });

      expect(response.statusCode).toBe(201);
    });

    afterEach(async () => {
      await databaseService.user.deleteMany();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
