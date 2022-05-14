import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.css']
})
export class TermsOfUseComponent implements OnInit {
  iAgree: boolean = false;

  constructor(public dialogRef: MatDialogRef<TermsOfUseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    window.location.reload();
  }

  onClickAgree(completed: boolean): void {
    this.iAgree = completed;
  }

  onClickProceed() {
    this.dialogRef.close({
      status: true
    });
  }

}
