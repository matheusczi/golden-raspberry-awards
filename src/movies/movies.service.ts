import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  // Method to load CSV data into the database
  async loadCsvData(): Promise<void> {
    const csvFilePath = path.resolve(__dirname, '../../movielist.csv');
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

    const records = await new Promise<any[]>((resolve, reject) => {
      parse(
        fileContent,
        {
          columns: true,
          delimiter: ';', // Use semicolon as delimiter
          skip_empty_lines: true,
          trim: true, // Trim whitespace from fields
          cast: (value, context) => {
            if (context.column === 'year') {
              return parseInt(value);
            }
            if (context.column === 'winner') {
              return value.toLowerCase() === 'yes';
            }
            return value;
          },
        },
        (err, records) => {
          if (err) reject(err);
          else resolve(records);
        },
      );
    });

    for (const record of records) {
      const movie = new Movie();
      movie.year = record.year;
      movie.title = record.title;
      movie.studios = record.studios;
      movie.producers = record.producers;
      movie.winner = record.winner;
      await this.moviesRepository.save(movie);
    }
  }

  // Method to get producer statistics
  async getProducerStats(): Promise<any> {
    const winners = await this.moviesRepository.find({
      where: { winner: true },
      order: { year: 'ASC' },
    });

    const producerWins = new Map<string, number[]>();

    winners.forEach((movie) => {
      const producers = movie.producers.split(',').map((p) => p.trim());
      producers.forEach((producer) => {
        if (!producerWins.has(producer)) {
          producerWins.set(producer, []);
        }
        producerWins.get(producer).push(movie.year);
      });
    });

    let minInterval = Infinity;
    let maxInterval = 0;
    const minProducers = [];
    const maxProducers = [];

    producerWins.forEach((wins, producer) => {
      if (wins.length > 1) {
        for (let i = 1; i < wins.length; i++) {
          const interval = wins[i] - wins[i - 1];
          if (interval < minInterval) {
            minInterval = interval;
            minProducers.length = 0;
          }
          if (interval === minInterval) {
            minProducers.push({
              producer,
              interval,
              previousWin: wins[i - 1],
              followingWin: wins[i],
            });
          }
          if (interval > maxInterval) {
            maxInterval = interval;
            maxProducers.length = 0;
          }
          if (interval === maxInterval) {
            maxProducers.push({
              producer,
              interval,
              previousWin: wins[i - 1],
              followingWin: wins[i],
            });
          }
        }
      }
    });

    return {
      min: minProducers,
      max: maxProducers,
    };
  }
}
