import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from 'src/app/shared/models/book.model';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss'],
})
export class EditBookComponent {

  constructor(
    public dialogRef: MatDialogRef<EditBookComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book) { }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public updateDate(dateJSON: string): void {
    this.data.PublishDate = dateJSON;
  }
}
