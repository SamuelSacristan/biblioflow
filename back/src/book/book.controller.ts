import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    HttpStatus,
  } from '@nestjs/common';
  import { BookService } from './book.service';
  import { CreateBookDto } from './dto/create-book.dto';
  import { UpdateBookDto } from './dto/update-book.dto';
  
  @Controller('books')
  export class BookController {
    constructor(private readonly bookService: BookService) {}
  
    @Get()
    findAll(@Query('search') search?: string) {
      if (search) {
        return {
          data: this.bookService.search(search),
          total: this.bookService.search(search).length,
          query: search,
        };
      }
      const books = this.bookService.findAll();
      return {
        data: books,
        total: books.length,
      };
    }
  
    @Get('health')
    getHealth() {
      return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Book service is running',
        totalBooks: this.bookService.findAll().length,
      };
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.bookService.findOne(id);
    }
  
    @Post()
    create(@Body() createBookDto: CreateBookDto) {
      return this.bookService.create(createBookDto);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateBookDto: UpdateBookDto,
    ) {
      return this.bookService.update(id, updateBookDto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      this.bookService.remove(id);
      return {
        message: `Book with ID ${id} has been successfully deleted`,
        statusCode: HttpStatus.OK,
      };
    }
  }