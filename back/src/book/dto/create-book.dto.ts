export class CreateBookDto {
    title: string;
    author: string;
    isbn?: string;
    publishedYear?: number;
    description?: string;
  }