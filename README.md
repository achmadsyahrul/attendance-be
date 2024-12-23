# REST API with Node.js, Express.js, Prisma, and Docker Compose

This project is a REST API built using Node.js, Express.js, Prisma as the ORM, and containerized with Docker Compose.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

Install the necessary Node.js packages:

```bash
yarn install
```

### 3. Start the Application with Docker Compose

Build and start the Docker containers:

```bash
docker-compose up -d
```

### 4. Environment Configuration

Copy `.env.example` to `.env` file in the project root and configure the following environment variables:

```env
cp .env.example .env
```

### 5. Database Migration

Run the Prisma migrations to set up your database schema:

```bash
yarn prisma migrate dev
```
