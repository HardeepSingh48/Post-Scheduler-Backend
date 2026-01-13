# Post Scheduler Backend

A production-ready social media post scheduling API built with Node.js, TypeScript, Prisma 5, PostgreSQL, and BullMQ.

## Features

- 🔐 JWT-based authentication with username & timezone support
- 📝 Post management with scheduling capabilities
- 🖼️ Image upload support (local storage, cloud-ready)
- ⏰ Queue-based post publishing with BullMQ
- 🔒 Comprehensive security (Helmet, CORS, rate limiting)
- ✅ 100% type safety (no `any` types)
- 📚 Swagger/OpenAPI documentation
- 🎯 Zod validation for all inputs
- 🚨 Centralized error handling

## Tech Stack

- **Runtime**: Node.js with TypeScript (strict mode)
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma 5 ORM
- **Queue**: BullMQ with Redis
- **Authentication**: JWT with bcrypt (12 salt rounds)
- **Validation**: Zod schemas
- **File Upload**: Multer
- **API Docs**: Swagger UI

## Prerequisites

- Node.js >= 16
- PostgreSQL >= 13
- Redis >= 6

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   - `DATABASE_URL`: PostgreSQL connection string
   - `REDIS_URL`: Redis connection string
   - `JWT_SECRET`: Strong secret key for JWT tokens

3. **Run database migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Documentation

Once the server is running, access the interactive Swagger documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)

### Posts
- `POST /api/posts` - Create post with optional image upload (protected)
- `GET /api/posts` - Get all user posts with pagination (protected)
- `GET /api/posts/:id` - Get specific post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

### Queue
- `GET /api/queue/stats` - Get queue statistics (protected)

## Project Structure

```
src/
├── config/          # Configuration files (env, database, redis, swagger)
├── controllers/     # Request handlers
├── middleware/      # Express middleware (auth, validation, error handling, upload)
├── routes/          # API routes with Swagger documentation
├── services/        # Business logic
│   └── storage/     # Storage service (local/cloud)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (errors, JWT)
├── validations/     # Zod validation schemas
├── workers/         # BullMQ workers
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Environment Variables

See `.env.example` for all available configuration options.

## Type Safety

This project maintains 100% type safety:
- No `any` types in codebase
- Strict TypeScript compiler options enabled
- Comprehensive type definitions for all entities
- Proper Express Request type augmentation

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- bcrypt password hashing (12 salt rounds)
- JWT token authentication
- Input validation with Zod
- File upload validation (type, size)

## Database Schema

### User
- id, email (unique), username (unique), password, name, timezone
- Timestamps: createdAt, updatedAt

### Post
- id, content, imageUrl, imagePath, scheduledAt, timezone
- status: DRAFT | SCHEDULED | PUBLISHING | PUBLISHED | FAILED
- attempts, lastError, publishedAt
- Relation: belongs to User
- Timestamps: createdAt, updatedAt

## Development

### Build
```bash
npm run build
```

### Type Check
```bash
npx tsc --noEmit
```

### Database Commands
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## License

MIT
