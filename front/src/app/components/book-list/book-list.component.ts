import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>📚 Gestion des Livres</h2>
      
      <!-- Recherche -->
      <div class="search-section">
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (input)="onSearch()"
          placeholder="Rechercher par titre, auteur ou description..."
          class="search-input">
        <button (click)="clearSearch()" *ngIf="searchQuery" class="clear-btn">✕</button>
      </div>

      <!-- Bouton Ajouter -->
      <button (click)="showAddForm = !showAddForm" class="add-btn">
        {{ showAddForm ? 'Annuler' : '+ Ajouter un livre' }}
      </button>

      <!-- Formulaire d'ajout -->
      <div *ngIf="showAddForm" class="form-section">
        <h3>Ajouter un nouveau livre</h3>
        <form (ngSubmit)="onSubmit()" #bookForm="ngForm">
          <input name="title" [(ngModel)]="newBook.title" placeholder="Titre *" required class="form-input">
          <input name="author" [(ngModel)]="newBook.author" placeholder="Auteur *" required class="form-input">
          <input name="isbn" [(ngModel)]="newBook.isbn" placeholder="ISBN" class="form-input">
          <input name="publishedYear" [(ngModel)]="newBook.publishedYear" type="number" placeholder="Année de publication" class="form-input">
          <textarea name="description" [(ngModel)]="newBook.description" placeholder="Description" class="form-textarea"></textarea>
          <div class="form-actions">
            <button type="submit" [disabled]="!bookForm.form.valid" class="submit-btn">Ajouter</button>
            <button type="button" (click)="resetForm()" class="reset-btn">Réinitialiser</button>
          </div>
        </form>
      </div>

      <!-- Liste des livres -->
      <div class="books-section">
        <div *ngIf="loading" class="loading">Chargement...</div>
        
        <div *ngIf="!loading && books.length === 0" class="no-books">
          {{ searchQuery ? 'Aucun livre trouvé pour cette recherche.' : 'Aucun livre disponible.' }}
        </div>

        <div *ngIf="!loading && books.length > 0" class="books-grid">
          <div class="books-header">
            <span>{{ total }} livre(s) {{ searchQuery ? 'trouvé(s)' : 'au total' }}</span>
          </div>
          
          <div *ngFor="let book of books" class="book-card">
            <div *ngIf="editingBook?.id !== book.id" class="book-content">
              <h4>{{ book.title }}</h4>
              <p><strong>Auteur:</strong> {{ book.author }}</p>
              <p *ngIf="book.isbn"><strong>ISBN:</strong> {{ book.isbn }}</p>
              <p *ngIf="book.publishedYear"><strong>Année:</strong> {{ book.publishedYear }}</p>
              <p *ngIf="book.description" class="description">{{ book.description }}</p>
              <div class="book-actions">
                <button (click)="startEdit(book)" class="edit-btn">✏️ Modifier</button>
                <button (click)="deleteBook(book.id)" class="delete-btn">🗑️ Supprimer</button>
              </div>
            </div>

            <!-- Formulaire d'édition -->
            <div *ngIf="editingBook?.id === book.id && editingBook" class="edit-form">
              <h4>Modifier le livre</h4>
              <input [(ngModel)]="editingBook.title" placeholder="Titre" class="form-input">
              <input [(ngModel)]="editingBook.author" placeholder="Auteur" class="form-input">
              <input [(ngModel)]="editingBook.isbn" placeholder="ISBN" class="form-input">
              <input [(ngModel)]="editingBook.publishedYear" type="number" placeholder="Année" class="form-input">
              <textarea [(ngModel)]="editingBook.description" placeholder="Description" class="form-textarea"></textarea>
              <div class="form-actions">
                <button (click)="saveEdit()" class="submit-btn">Sauvegarder</button>
                <button (click)="cancelEdit()" class="reset-btn">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
    
    h2 { color: #333; text-align: center; margin-bottom: 30px; }
    
    .search-section { position: relative; margin-bottom: 20px; }
    .search-input { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; }
    .clear-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; }
    
    .add-btn { background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }
    .add-btn:hover { background: #0056b3; }
    
    .form-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .form-input, .form-textarea { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .form-textarea { min-height: 80px; resize: vertical; }
    .form-actions { display: flex; gap: 10px; margin-top: 15px; }
    
    .submit-btn { background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
    .submit-btn:hover { background: #218838; }
    .submit-btn:disabled { background: #6c757d; cursor: not-allowed; }
    .reset-btn { background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
    .reset-btn:hover { background: #545b62; }
    
    .loading, .no-books { text-align: center; padding: 40px; color: #666; }
    
    .books-header { background: #e9ecef; padding: 10px; border-radius: 4px; margin-bottom: 20px; font-weight: bold; }
    
    .books-grid { display: grid; gap: 20px; }
    .book-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; }
    .book-card h4 { margin: 0 0 10px 0; color: #333; }
    .book-card p { margin: 5px 0; }
    .description { color: #666; font-style: italic; }
    
    .book-actions { margin-top: 15px; display: flex; gap: 10px; }
    .edit-btn { background: #ffc107; color: #212529; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
    .edit-btn:hover { background: #e0a800; }
    .delete-btn { background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
    .delete-btn:hover { background: #c82333; }
    
    .edit-form { background: #f8f9fa; padding: 15px; border-radius: 4px; }
    .edit-form h4 { margin-top: 0; }
  `]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  total = 0;
  loading = false;
  searchQuery = '';
  showAddForm = false;
  editingBook: Book | null = null;
  
  newBook = {
    title: '',
    author: '',
    isbn: '',
    publishedYear: undefined as number | undefined,
    description: ''
  };

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.loading = true;
    this.bookService.getBooks(this.searchQuery).subscribe({
      next: (response) => {
        this.books = response.data;
        this.total = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des livres:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.loadBooks();
  }

  clearSearch() {
    this.searchQuery = '';
    this.loadBooks();
  }

  onSubmit() {
    this.bookService.createBook(this.newBook).subscribe({
      next: () => {
        this.loadBooks();
        this.resetForm();
        this.showAddForm = false;
      },
      error: (error) => console.error('Erreur lors de la création:', error)
    });
  }

  resetForm() {
    this.newBook = {
      title: '',
      author: '',
      isbn: '',
      publishedYear: undefined,
      description: ''
    };
  }

  startEdit(book: Book) {
    this.editingBook = { ...book };
  }

  saveEdit() {
    if (!this.editingBook) return;
    
    const updateData = {
      title: this.editingBook.title,
      author: this.editingBook.author,
      isbn: this.editingBook.isbn,
      publishedYear: this.editingBook.publishedYear,
      description: this.editingBook.description
    };

    this.bookService.updateBook(this.editingBook.id, updateData).subscribe({
      next: () => {
        this.loadBooks();
        this.editingBook = null;
      },
      error: (error) => console.error('Erreur lors de la mise à jour:', error)
    });
  }

  cancelEdit() {
    this.editingBook = null;
  }

  deleteBook(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.loadBooks();
        },
        error: (error) => console.error('Erreur lors de la suppression:', error)
      });
    }
  }
}