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
    @Inject(MAT_DIALOG_DATA) public data: Book,
    private fb: FormBuilder) { }

  public ngOnInit(): void {
    this.bookForm = this.fb.group({
      Title: [this.data.Title, Validators.required],
      Description: [this.data.Description, Validators.required],
      PageCount: [this.data.PageCount, Validators.required],
      PublishDate: [this.data.PublishDate, Validators.required]
    });
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public updateDate(dateJSON: string): void {
    this.bookForm.patchValue({ PublishDate: dateJSON });
  }
}
