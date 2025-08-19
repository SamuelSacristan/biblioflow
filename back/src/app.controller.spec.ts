import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: BooksController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [AppService],
    }).compile();

    appController = app.get<BooksController>(BooksController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
