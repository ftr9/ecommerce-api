import { VersioningType } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as csurf from 'csurf';
import { guestSessionConfig } from 'session.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //@api versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });

  //@security-related HTTP header
  app.use(helmet());

  //@adds cookie to request object - req.cookies
  app.use(cookieParser());

  //@express session
  app.use(session(guestSessionConfig));

  //@Cross-site request forgery
  app.use(csurf());

  //@global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(process.env.PORT || 3050);
  console.log('server started on port 3050');
}
bootstrap();
