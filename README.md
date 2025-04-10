<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## 🧠 User Management System

This project is a **Role-Based Access Control (RBAC)** system built using the [NestJS](https://nestjs.com) framework. It provides a scalable and efficient way to manage user permissions across multiple microservices.

## 📚 Documentation

- **Function Documentation**: Detailed documentation about the system's RBAC structure, permission strings, and use cases can be found [here](./user_management_documentation.md).
- **REST API Documentation**: The REST API documentation is available at [http://localhost:3000/docs](http://localhost:3000/docs).

## 🛠️ Initial Setup

1. Clone the repository:

   ```bash
   $ git clone <repository-url>
   $ cd user-management
   ```

2. Install dependencies:

   ```bash
   $ npm install
   ```

3. Set up the database:

   - The database services are defined in a `docker-compose.yml` file. Start the database containers:
     ```bash
     $ docker-compose up -d
     ```

4. Run database migrations:

   ```bash
   $ npm run migration:run
   ```

5. Create initial users:
   ```bash
   $ npm run ts-node src/scripts/create-initial-users.ts
   ```

## 🚀 Compile and Run the Project

```bash
# development
$ npm run start

# watch mode
$ npm run start:rest:dev

# production mode
$ npm run start:prod
```

## 🧪 Run Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 🗂️ Project Structure

This project is a monorepo managed by NestJS CLI. The main REST application is located in the `rest` directory.

- **Scripts**: Utility scripts for managing migrations and initial data are located in the [`src/scripts`](./src/scripts) folder:
  - `create-migration.ts`: Create a new migration.
  - `generate-migration.ts`: Generate a migration based on schema changes.
  - `run-migration.ts`: Run all pending migrations.
  - `create-initial-users.ts`: Populate the database with initial users.

## 🛠️ Deployment

When you're ready to deploy the application, follow these steps:

1. Build the project:

   ```bash
   $ npm run build
   ```

2. Deploy the built application to your preferred environment.

For more details, refer to the [NestJS deployment documentation](https://docs.nestjs.com/deployment).

## 🛠️ Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Discord Channel](https://discord.gg/G7Qnnhy)
- [NestJS Devtools](https://devtools.nestjs.com)

## 📝 License

This project is [MIT licensed](https://opensource.org/licenses/MIT).
