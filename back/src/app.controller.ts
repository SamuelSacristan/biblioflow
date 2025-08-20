import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';

interface Book {
  id: number;
  title: string;
  author: string;
}

@Controller('books')
export class BooksController {
  private books: Book[] = [
    { id: 1, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry' },
    { id: 2, title: '1984', author: 'George Orwell' },
  ];

  @Get()
  getAllBooks(): Book[] {
    return this.books;
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'HOT RELOAD WORKS!',
      timestamp: new Date().toISOString(),
      message: 'Backend mise à jour automatique !',
    };
  }

  @Get('hello')
  getHello(): string {
    return 'hot reload works!';
  }

  @Post()
  createBook(@Body() book: Omit<Book, 'id'>): Book {
    const newBook = {
      id: this.books.length + 1,
      ...book,
    };
    this.books.push(newBook);
    return newBook;
  }

  @Delete(':id')
  deleteBook(@Param('id') id: string): { message: string } {
    const bookId = parseInt(id);
    this.books = this.books.filter((book) => book.id !== bookId);
    return { message: `Book with id ${bookId} deleted` };
  }
}