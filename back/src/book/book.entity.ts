export interface Book {
    id: number;
    title: string;
    author: string;
    isbn?: string;
    publishedYear?: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }