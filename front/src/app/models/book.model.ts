export interface Book {
    id: number;
    title: string;
    author: string;
    isbn?: string;
    publishedYear?: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateBookDto {
    title: string;
    author: string;
    isbn?: string;
    publishedYear?: number;
    description?: string;
  }
  
  export interface BookResponse {
    data: Book[];
    total: number;
    query?: string;
  }