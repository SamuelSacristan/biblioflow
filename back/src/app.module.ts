import { Module } from '@nestjs/common';
import { BooksController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [BooksController],
  providers: [AppService],
})
export class AppModule {}