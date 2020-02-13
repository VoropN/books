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
    const shouldUpdateBook = Object.prototype.hasOwnProperty.call(this.book, 'ID');
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
    this.bookForm.patchValue({ PublishDate: dateJSON });
  }

  private updateBook(book: Book): void {
    this.bookForm = this.fb.group({
      ID: [book.ID],
      Title: [book.Title, Validators.required],
      Description: [book.Description, Validators.required],
      PageCount: [book.PageCount, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      PublishDate: [book.PublishDate, Validators.required]
    });
  }

  private createBook(): void {
    this.bookForm = this.fb.group({
      Title: [null, Validators.required],
      Description: [null, Validators.required],
      PageCount: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      PublishDate: [null, Validators.required]
    });
  }
}
