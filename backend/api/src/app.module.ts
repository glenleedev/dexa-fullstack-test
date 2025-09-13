import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    //registers the .env file outside of backend folder
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
