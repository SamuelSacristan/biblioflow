import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  private books: Book[] = [
    {
      id: 1,
      title: 'Le Petit Prince',
      author: 'Antoine de Saint-Exupéry',
      isbn: '978-2-07-040842-0',
      publishedYear: 1943,
      description: 'Un conte philosophique et poétique',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0-452-28423-4',
      publishedYear: 1949,
      description: 'Roman dystopique sur la surveillance totalitaire',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: 3,
      title: 'Les Misérables',
      author: 'Victor Hugo',
      isbn: '978-2-253-09681-4',
      publishedYear: 1862,
      description: 'Roman historique français',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ];

  private getNextId(): number {
    return Math.max(...this.books.map(book => book.id), 0) + 1;
  }

  findAll(): Book[] {
    return this.books.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  findOne(id: number): Book {
    const book = this.books.find(book => book.id === id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  create(createBookDto: CreateBookDto): Book {
    const now = new Date();
    const newBook: Book = {
      id: this.getNextId(),
      ...createBookDto,
      createdAt: now,
      updatedAt: now,
    };
    this.books.push(newBook);
    return newBook;
  }

  update(id: number, updateBookDto: UpdateBookDto): Book {
    const bookIndex = this.books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const updatedBook: Book = {
      ...this.books[bookIndex],
      ...updateBookDto,
      updatedAt: new Date(),
    };

    this.books[bookIndex] = updatedBook;
    return updatedBook;
  }

  remove(id: number): void {
    const bookIndex = this.books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    this.books.splice(bookIndex, 1);
  }

  search(query: string): Book[] {
    const lowercaseQuery = query.toLowerCase();
    return this.books.filter(book =>
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.description?.toLowerCase().includes(lowercaseQuery)
    );
  }
}