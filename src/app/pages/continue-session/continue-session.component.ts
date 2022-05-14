import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdditionalAcctPayload, ContinueSession } from 'src/app/core/models/payloads/additional-acct-payload';
import { AdditionalAccountService } from 'src/app/core/services/additional-account.service';

@Component({
  selector: 'app-continue-session',
  templateUrl: './continue-session.component.html',
  styleUrls: ['./continue-session.component.css']
})
export class ContinueSessionComponent implements OnInit {

  caseId: string = '';
  accOpeningProgress: AdditionalAcctPayload;
  continueSessionForm: FormGroup;

  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<ContinueSessionComponent>,
    private additionalAcctService: AdditionalAccountService, @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
    this.continueSessionForm = this.formBuilder.group({
      caseId: ['', [Validators.required]]
    })
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick() {

    this.caseId = this.continueSessionForm.controls.caseId.value;

    const payload: ContinueSession = {
      caseId: this.caseId,
      accountNumber: ''
    }

    this.additionalAcctService.continueSession(payload).subscribe(res => {

      if (res.responseCode === '00') {
        this.accOpeningProgress = res.data.detail;

        this.dialogRef.close({
          status: true,
          data: this.accOpeningProgress
        });
      }
      else {
        this.dialogRef.close({
          status: false,
          data: res.responseDescription
        });
      }
    });

  }
}
