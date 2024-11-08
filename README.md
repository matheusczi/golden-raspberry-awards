# Golden Raspberry Awards API

This project is a RESTful API that provides information about the Golden Raspberry Awards' Worst Movie category nominees and winners.

## Prerequisites

- Node.js (v14 or later)
- npm

## Installation

1. Clone the repository:

```
git clone https://github.com/matheusczi/golden-raspberry-awards.git
cd golden-raspberry-awards
```

2. Install dependencies:

```
npm install
```

3. Place the `movielist.csv` file in the root directory of the project.

## Running the application

To start the application, run:

```
npm run start
```

The application will be available at `http://localhost:3000`.

## Running tests

To run the integration tests, use the following command:

```
npm run test:e2e
```

## API Endpoints

- GET `/movies/producer-stats`: Returns the producers with the longest and shortest intervals between consecutive wins.

## Project Structure

- `src/movies`: Contains the Movie entity, service, and controller
- `src/data-seeder`: Contains the service for seeding the database with CSV data
- `test`: Contains the integration tests

## Technologies Used

- NestJS
- TypeORM
- SQLite (in-memory database)
- Jest (for testing)
