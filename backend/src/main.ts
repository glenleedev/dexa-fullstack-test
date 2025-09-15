import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //enable payload validation based on dto
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { clientId: 'audit-consumer', brokers: [process.env.RED_PANDA_HOST + ':' + process.env.RED_PANDA_PORT] },
      consumer: { groupId: 'audit-group' },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
