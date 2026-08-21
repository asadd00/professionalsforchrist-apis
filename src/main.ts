import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  // Force UTC regardless of the host/.env TZ setting so Node's interpretation of
  // Postgres "timestamp without time zone" columns matches how they were written
  // (Postgres itself defaults to UTC) — otherwise timestamps read back get shifted
  // by the local offset (e.g. a notification's createdAt showing hours off in the app).
  process.env.TZ = 'UTC';

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)))
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:49962',
        'http://127.0.0.1:49962',
        'http://localhost:3000',
        'https://admin.professionalsforchrist.com',
        'https://fe-dev.professionalsforchrist.com',
        `http://127.0.0.1:${process.env.PORT}`,
        'https://professionalsforchrist.com',
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Platform',
      'X-Requested-With',
      'X-App-Version'
    ],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
