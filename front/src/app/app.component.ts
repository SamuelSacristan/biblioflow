import { Component } from '@angular/core';
import { BookListComponent } from './components/book-list/book-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookListComponent],
  template: `<app-book-list></app-book-list>`
})
export class AppComponent {
  title = 'BiblioFlow - Gestion de Livres';
}