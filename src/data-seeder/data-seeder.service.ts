import { Injectable, OnModuleInit } from '@nestjs/common';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class DataSeederService implements OnModuleInit {
  constructor(private readonly moviesService: MoviesService) {}

  async onModuleInit() {
    await this.moviesService.loadCsvData();
    console.log('CSV data loaded into the database');
  }
}
