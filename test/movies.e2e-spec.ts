import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSeederService } from '../src/data-seeder/data-seeder.service';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Ensure data is seeded
    const dataSeederService = app.get(DataSeederService);
    await dataSeederService.onModuleInit();
  });

  it('/movies/producer-stats (GET)', () => {
    return request(app.getHttpServer())
      .get('/movies/producer-stats')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('min');
        expect(res.body).toHaveProperty('max');
        expect(Array.isArray(res.body.min)).toBeTruthy();
        expect(Array.isArray(res.body.max)).toBeTruthy();

        if (res.body.min.length > 0) {
          expect(res.body.min[0]).toHaveProperty('producer');
          expect(res.body.min[0]).toHaveProperty('interval');
          expect(res.body.min[0]).toHaveProperty('previousWin');
          expect(res.body.min[0]).toHaveProperty('followingWin');
        }

        if (res.body.max.length > 0) {
          expect(res.body.max[0]).toHaveProperty('producer');
          expect(res.body.max[0]).toHaveProperty('interval');
          expect(res.body.max[0]).toHaveProperty('previousWin');
          expect(res.body.max[0]).toHaveProperty('followingWin');
        }
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
