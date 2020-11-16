import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from 'src/app/shared/models/book.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss'],
})
export class EditBookComponent implements OnInit {
  public bookForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditBookComponent>,
    @Inject(MAT_DIALOG_DATA) public book: Book,
    private fb: FormBuilder) { }

  public ngOnInit(): void {
    const shouldUpdateBook = Object.prototype.hasOwnProperty.call(this.book, 'id');
    if (shouldUpdateBook) {
      this.updateBook(this.book);
    } else {
      this.createBook();
    }
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public updateDate(dateJSON: string): void {
    this.bookForm.patchValue({ publishDate: dateJSON });
  }

  private updateBook(book: Book): void {
    this.bookForm = this.fb.group({
      id: [book.id],
      title: [book.title, Validators.required],
      description: [book.description, Validators.required],
      pageCount: [book.pageCount, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      publishDate: [book.publishDate, Validators.required]
    });
  }

  private createBook(): void {
    this.bookForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      pageCount: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      publishDate: [null, Validators.required]
    });
  }
}
