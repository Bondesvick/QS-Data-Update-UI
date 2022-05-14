import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { BVNValidationRequest } from 'src/app/core/models/acct-upgrade-request';
import { AccountValidation } from 'src/app/core/models/payloads/account-validation';
import { AdditionalAcctPayload, ContinueSession, DataUpdatePayload, IdVerificationRequest, TinVerificationRequest, UploadedDocument } from 'src/app/core/models/payloads/additional-acct-payload';
import { CustomerDetails } from 'src/app/core/models/payloads/customer-details';
import { DataUpdateService } from 'src/app/core/services/data-update.service';
import { InterswitchService } from 'src/app/core/services/interswitch.service';
import { TermsOfUseComponent } from '../terms-of-use/terms-of-use.component';
import * as $ from "jquery";
import { OTPPayload } from 'src/app/core/models/payloads/otp-payload';
import { country_code } from 'src/app/core/models/country_code';

@Component({
  selector: 'app-data-update',
  templateUrl: './data-update.component.html',
  styleUrls: ['./data-update.component.css', '../../app.component.css']
})

export class DataUpdateComponent implements OnInit {

  
  dialogBoxSettings = {
    margin: '0 auto',
    disableClose: true,
    hasBackdrop: true,
    data: {}
  };

  // Forms
  continueSessionForm: FormGroup;
  accountFormGroup: FormGroup;
  dataToUpdateForm: FormGroup;
  bvnUpdateFormGroup: FormGroup;
  updateFormGroup: FormGroup;
  cardFormGroup: FormGroup;
  uploadSignatureForm: FormGroup;
  otpForm: FormGroup;

  class = '';
  // accountTypes = ['Personal Account', 'Business Account'];
  accountTypes = ['Personal Account', 'Business Account'];
  // dataToUpdate = ['Address Update', 'Phone Number Update', 'Email Update','ID Update', 'Tin Update'];
  dataToUpdate = ['Address Update', 'Contact Details Update (Phone Number and Email)','ID Update', 'Tin Update'];

  dataTinToUpdate = ['Tin Update'];

  showSpinner: boolean;
  isAwaitingResponse: boolean;
  color = 'primary';
  mode = 'query';
  value = 50;
  bufferValue = 75;
  ticketID: any;

  // Vertical steppers
  isAccountStepperActive: boolean = true;
  isAccountStepperDone: boolean = false;
  isContinueSessionStepperActive: boolean = false;
  isContinueSessionStepperDone: boolean = false;
  isAccountTypeStepperActive: boolean = false;
  isAccountTypeStepperDone: boolean = false;
  isUpdateFormStepperActive: boolean = false;
  isUpdateFormStepperDone: boolean = false;
  isUploadCorporateFormDocActive: boolean = false;
  isUploadCorporateFormDone: boolean = false;
  isAuthenticationFormActive: boolean = false;
  isAuthenticationFormDone: boolean = false;

  // Account Validation Variables
  isBusinessAccount: boolean = false;
  showDataToUpdate: boolean = false;
  bvnIsValid: boolean = true;
  bvnIsSet: boolean = true;
  showBVNSpinner: boolean;
  acctDetails: CustomerDetails;

  // Session Vars
  caseId: string = '';
  otpReference: any;


  // ID variables
  idTypes = ['Nigerian National Identity Card (NIMC)', 'Nigeria Permanent Voter\'s Card (PVC)', 'Nigeria Driver\s License', 'Nigerian International Passport', 'Other IDs (Foreign International Passport, Driver\'s License, etc)'];
  idIsValid = false;
  isTinValid = false;
  showOtherIdHint = false;
  showNinInfo: boolean;
  showIdSpinner: boolean;

  // Auth variables
  cardOptions: string[] = ['Yes', 'No'];
  iAgree: boolean;
  authWithSignature: boolean = true;
  showContactUpdateHint: boolean;
  showTinDataToUpdate: boolean;
  get acctNo() { return this.accountFormGroup.controls.accountNoCtrl.value; }
  get debitCardValue() { return this.cardFormGroup.controls.debitCardOption.value }
  debitCardAuthModalSub: Subscription;
  public iframeModalRef: MatDialogRef<any>;
  @ViewChild('iFrameModalTemplate', { static: true }) iFrameModalTemplate: TemplateRef<any>;
  @ViewChild('stepper', { static: false }) stepperIndex: MatStepper;


  // Signature variables
  _fileError: string;
  selectedSignaturefile = '';
  _selectedSignatureFile: File;
  signatureToBase64: string;

  // Data form variables
  showAddressUpdate: boolean = false;
  showTinUpdate: boolean = false;
  showContactUpdate: boolean = false;
  showIdUpdate: boolean = false;
  stateList: string[] = ['ABIA',
    'ABUJA (F C T)',
    'ADAMAWA',
    'AKWA IBOM',
    'ANAMBRA',
    'BAUCHI',
    'BAYELSA',
    'BENUE',
    'BORNO',
    'CROSS RIVER',
    'DELTA',
    'EBONYI',
    'EDO',
    'EKITI',
    'ENUGU',
    'GOMBE',
    'IMO',
    'JIGAWA',
    'KADUNA',
    'KANO',
    'KATSINA',
    'KEBBI',
    'KOGI',
    'KWARA',
    'LAGOS',
    'NASSARAWA',
    'NIGER',
    'OGUN',
    'ONDO',
    'OSUN',
    'OYO',
    'PLATEAU',
    'RIVERS',
    'SOKOTO',
    'TARABA',
    'YOBE',
    'ZAMFARA']
  cityStates: any[] = [];
  stateLis: any[] = [];
  lgas: any[] = [];
  isDebitCardAuth: boolean = false;
  countryCodes = country_code;

  // Doc Variables
  fileResult: string;
  referenceFormError: string;
  IntroLetterFileName = ''
  introLetterError: string;
  _selectedFileToUpload: File;
  DocumentsFormGroup: FormGroup;
  public supportingDocModel = {
    UtilityBill: '',
    IntroLetter: '',
    meansOfIdentification: []
  };
  documents: UploadedDocument[] = [];
  meansOfIdentification: any;
  meansOfIdentificationFileNames: string[] = [];
  meansOfIdentificationError: string;
  signatureFileError: string;

  constructor(private dialog: MatDialog, private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private dataUpdateService: DataUpdateService,
    private interswitchService: InterswitchService) { }

  ngOnInit(): void {
    this.openTermsOfUse();

    this.getCityState();

    this.accountFormGroup = this.formBuilder.group({
      phoneNoCtrl: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      accountNoCtrl: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]]
    });

    this.continueSessionForm = this.formBuilder.group({
      caseId: ['']
    });

    this.dataToUpdateForm = this.formBuilder.group({
      accountType: ['', [Validators.required]],
      selectOptions: [[''], [Validators.required]]
    })

    this.bvnUpdateFormGroup = this.formBuilder.group({
      bvnId: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]]
    })

    this.updateFormGroup = this.formBuilder.group({
      fileInputCtrl: [''],
      identificationCard: [''],
      houseNumber: [''],
      streetName: [''],
      cityTown: [''],
      state: [''],
      lga: [''],
      busStop: [''],
      alias: [''],
      houseDesc: [''],
      phoneNoCtrl: ['', [Validators.pattern(/^[0-9]\d*$/)]],
      email: ['', [Validators.email]],
      idTypeCtrl: [''],
      idNumber: [''],
      countryCode:[''],
      tinCtrl: ['']
    })

    this.cardFormGroup = this.formBuilder.group({
      debitCardOption: ['', Validators.required]
    });

    this.DocumentsFormGroup = this.formBuilder.group({
      IntroLetter: [''],
      TermsAndConditions: [false, [Validators.required]],
    });

    this.otpForm = this.formBuilder.group({
      otpControl: ['', Validators.required]
    });

  }
    get emailCheck() { 
      return this.updateFormGroup.controls.email.value; 
    }

    checkValidity(){
      const invalid = []
      const controls = this.updateFormGroup.controls
      for (const name in controls){
        if (controls[name].invalid){
          invalid.push({name:name, value: controls[name].value})
        }
      }
      console.log(JSON.stringify(invalid));
      console.log( 
        // this.updateFormGroup.invalid || 
        !this.idIsValid || !this.isTinValid||
        (this.showContactUpdate && !this.updateFormGroup.controls.email.value  && !this.updateFormGroup.controls.phoneNoCtrl.value) || (this.showAddressUpdate && !this.fileResult) || (this.showIdUpdate && this.meansOfIdentificationFileNames.length < 1))

    }
  getCityState() {
    this.dataUpdateService.getCityState().subscribe(res => {
      this.cityStates = res;

      this.stateLis = [...new Set(res.map(x=> x.region))]

      this.onSelectState(this.stateLis[0]);
    });
  }

  onSelectState(state: string) {
    this.lgas = [];
    this.cityStates.forEach(element => {
      if(element.region === state) {
        this.lgas.push(element.city)
      }
    });
  }

  //#region OPEN TERMS OF USE
  openTermsOfUse(): void {
    const dialogRef = this.dialog.open(
      TermsOfUseComponent,
      this.dialogBoxSettings
    );
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //#endregion OPEN TERMS OF USE


  //#region AUTHENTICATE ACCOUNT AND PHONE
  proceedFromAccountForm(stepper: MatStepper) {
    const payload = this.buildAcctValidation();

    this.showSpinner = true;
    this.isAwaitingResponse = true;

    this.dataUpdateService.validateAccountNoAndPhoneNo(payload).subscribe(
      (response) => {

        // Invalid Phone number match - RETURN
        if (response.responseCode === '01') {
          this.showSpinner = false;
          this.isAwaitingResponse = false;
          this._snackBar.open('Phone number does not match the account provided', 'Error',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
          return;
        }

        // Successful API call
        if (response.responseCode === '00') {
          this.showSpinner = false;
          this.isAwaitingResponse = false;
          this.acctDetails = response.data;
          console.log('acc val data', response.data);

          // Success
          this._snackBar.open(`Account has been validated for ${this.acctDetails.firstName} ${this.acctDetails.lastName}`, 'Ok',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });

          // Handle next corporate - SET ACCOUNT TYPE
          
          // Handle null/empty BVN
          if (!response.data.bvn) {
            this.bvnIsValid = false;
            this.bvnIsSet = false;
            this._snackBar.open('Your account does not have BVN. Kindly fill in your BVN details to continue', 'Error',
              { verticalPosition: 'top', horizontalPosition: 'center', duration: 10000 });
            return;
          }
          else {
            this.bvnUpdateFormGroup.controls.bvnId.setValue(response.data.bvn);
          }

          // Move to next stepper
          this.isAccountStepperActive = false;
          this.isAccountStepperDone = true;
          this.isContinueSessionStepperActive = true;
          stepper.next();
        }
        else {
          //Failed
          this.showSpinner = false;
          this.isAwaitingResponse = false;
          this._snackBar.open(response.responseDescription, 'Error',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
        }
      },
      error => {
        this.showSpinner = false;
        this.isAwaitingResponse = false;
        this._snackBar.open('Error occured', 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      }
    );
  }

  // Validate BVN
  onBVNChange() {
    this.showBVNSpinner = true;
    this.isAwaitingResponse = true;

    const payload: BVNValidationRequest = {
      firstName: this.acctDetails.firstName,
      lastName: this.acctDetails.lastName,
      accountNumber: this.accountFormGroup.controls.accountNoCtrl.value,
      bvnId: this.bvnUpdateFormGroup.controls.bvnId.value
    }

    this.dataUpdateService.validateBvn(payload).subscribe(res => {
      console.log(res);
      this.showBVNSpinner = false;
      this.isAwaitingResponse = false;

      if (res.responseCode == '00') {
        this.bvnIsSet = true;
        console.log(this.bvnIsSet)
        this._snackBar.open('BVN has been successfully validated', 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      }
      else {
        this._snackBar.open(res.responseDescription, 'Error',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 10000 });
      }

    }, error => {
      this.showBVNSpinner = false;
      this.isAwaitingResponse = false;
      this._snackBar.open('An error ocurred while trying to validate BVN', 'Error',
        { verticalPosition: 'top', horizontalPosition: 'center', duration: 10000 });
    });

  }

  // Proceed from BVN Validation
  proceedBVNForm(stepper: MatStepper) {

    this.isAccountStepperActive = false;
    this.isAccountStepperDone = true;
    this.isContinueSessionStepperActive = true;

    stepper.next();

    // Ask for continue session
  }

  // Account verificaiton payload
  buildAcctValidation(): AccountValidation {
    return {
      accountNumber: this.accountFormGroup.controls.accountNoCtrl.value,
      phoneNumber: this.accountFormGroup.controls.phoneNoCtrl.value
    }
  }

  //#endregion


  //#region SESSION
  proceedWithoutSession(stepper: MatStepper) {
    this.isContinueSessionStepperActive = false;
    this.isContinueSessionStepperDone = true;
    this.isAccountTypeStepperActive = true;
    stepper.next();
  }

  onYesClick(stepper: MatStepper) {
    this.showSpinner = true;

    this.caseId = this.continueSessionForm.controls.caseId.value;

    const payload: ContinueSession = {
      caseId: this.caseId,
      accountNumber: this.accountFormGroup.controls.accountNoCtrl.value
    }

    this.dataUpdateService.continueSession(payload).subscribe(res => {
      this.showSpinner = false;

      if (res.responseCode === '00') {
        this.continueSession(res.data.detail, stepper);
        this.isContinueSessionStepperActive = false;
        this.isContinueSessionStepperDone = true;
      }
      else {
        this.caseId = undefined;
        this._snackBar.open(`${res.responseDescription} Click on 'GET STARTED' to continue`, 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 20000 });
        return
      }
    });

  }

  setFormFields(data: any) {
    this.caseId = data.caseId;

    // Account validation
    this.accountFormGroup.controls.phoneNoCtrl.setValue(data.phoneNumber);
    this.accountFormGroup.controls.accountNoCtrl.setValue(data.customerReq.accountNumber);

    // BVN
    this.bvnUpdateFormGroup.controls.bvnId.setValue(data.bvnId);

    // Account types
    this.dataToUpdateForm.controls.accountType.setValue(data.existingAccType);
    this.onSelectAccountType(data.existingAccType);
    this.dataToUpdateForm.controls.selectOptions.setValue(data.dataToUpdate.split(','));
    this.toggleDataToUpdate();

    // Data form
    this.updateFormGroup.controls.houseNumber.setValue(data.houseNumber);
    this.updateFormGroup.controls.streetName.setValue(data.streetName);
    this.updateFormGroup.controls.cityTown.setValue(data.cityTown);
    this.updateFormGroup.controls.state.setValue(data.state);
    this.updateFormGroup.controls.lga.setValue(data.lga);
    this.updateFormGroup.controls.busStop.setValue(data.busStop);
    this.updateFormGroup.controls.alias.setValue(data.alias);
    this.updateFormGroup.controls.phoneNoCtrl.setValue(data.newPhoneNumber);
    this.updateFormGroup.controls.email.setValue(data.newEmail);
    this.updateFormGroup.controls.idTypeCtrl.setValue(data.idType);
    this.onSelectIdType(data.idType);
    this.updateFormGroup.controls.idNumber.setValue(data.idNumber);

    // Handle Documents
    this.setDocumentsOnContinue(data.documents);
  }

  setDocumentsOnContinue(documents: any) {
    console.log('doc from session', documents)

    documents.forEach(element => {

      if (element.title === 'Utility Bill') {
        this.supportingDocModel.UtilityBill = element.contentOrPath
        this.fileResult = element.fileName
      }
    });

  }

  saveAndContinue(stepper: MatStepper, currentStep: string) {
    const payload = this.buildDataUpdatePayload(this.caseId, currentStep);
    console.log(payload);
    const initialCaseId = this.caseId;
    return new Promise<boolean>((resolve, reject) => {
      this.dataUpdateService.saveAndContinue(payload).subscribe(res => {
        console.log(res);
        this.showSpinner = false;
        this.isAwaitingResponse = false;
        if (res.responseCode == '00') {

          if (!initialCaseId) {
            this._snackBar.open(`Data Update progress saved successfully. \nYour Case ID for this current session is ${res.data.detail}. Kindly copy it out to keep track of your progress`, 'Ok',
              { verticalPosition: 'top', horizontalPosition: 'center', duration: 20000 });
          }
          else {
            this._snackBar.open('Data Update progress saved successfully', 'Ok',
              { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
          }
          this.caseId = res.data.detail;
          resolve(true);
          stepper.next();
        }
        else {
          this._snackBar.open(res.responseDescription, 'Ok',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
          reject(false);
        }
      },
        error => {
          this.showSpinner = false;
          this.isAwaitingResponse = false;
          this._snackBar.open('Error occured', 'Ok',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
          reject(false);
        });

    });
  }

  buildDataUpdatePayload(caseId: string, currentStep: string, submitted: boolean = false): DataUpdatePayload {
    console.log('dataToUpdate', this.dataToUpdateForm.controls.selectOptions.value.toString())
    return {
      accountName: `${this.acctDetails.firstName} ${this.acctDetails.lastName}`,
      authType: this.authWithSignature ? 'signature' : 'debit-card',
      existingAccount: this.accountFormGroup.controls.accountNoCtrl.value,
      existingAccountType: this.dataToUpdateForm.controls.accountType.value,
      documents: this.documents,
      otp: this.otpForm.controls.otpControl.value,
      otpReasonCode: '20',
      otpIdentifier: this.accountFormGroup.controls.accountNoCtrl.value,
      otpSourceReference: this.otpReference,
      bvnId: this.bvnUpdateFormGroup.controls.bvnId.value,
      phoneNumber: this.accountFormGroup.controls.phoneNoCtrl.value,
      iAcceptTermsAndCondition: this.DocumentsFormGroup.controls.TermsAndConditions.value,
      dataToUpdate: this.dataToUpdateForm.controls.selectOptions.value.toString(),
      houseNumber: this.updateFormGroup.controls.houseNumber.value,
      streetName: this.updateFormGroup.controls.streetName.value,
      cityTown: this.updateFormGroup.controls.cityTown.value,
      state: this.updateFormGroup.controls.state.value,
      lga: this.updateFormGroup.controls.lga.value,
      busStop: this.updateFormGroup.controls.busStop.value,
      alias: this.updateFormGroup.controls.phoneNoCtrl.value,
      houseDescription: this.updateFormGroup.controls.houseDesc.value,
      newPhoneNumber: this.updateFormGroup.controls.phoneNoCtrl.value,
      newEmail: this.updateFormGroup.controls.email.value,
      idType: this.updateFormGroup.controls.idTypeCtrl.value,
      idNumber: this.updateFormGroup.controls.idNumber.value,
      caseId: caseId,
      currentStep: currentStep,
      submitted: submitted,
    };
  }

  continueSession(data: DataUpdatePayload, stepper: MatStepper) {
    this.isAccountTypeStepperActive = false;
    console.log('session data', data)
    this.setFormFields(data);

    switch (data.currentStep) {
      case 'ACCOUNT-TYPE':
        if (data.existingAccountType === 'Business Account') {
          this.isBusinessAccount = true;
        }
        stepper.next();
        this.isAccountTypeStepperActive = true;
        break;

      case 'DATA-FORM':
        this.stepperIndex.selectedIndex = 4;
        this.isAccountTypeStepperDone = true;
        this.isUpdateFormStepperActive = true;
        break;

      default:
        break;
    }
  }
  //#endregion


  //#region ACCOUNT TYPE

  // Handle Account Type
  onSelectAccountType(value) {
    if (value === 'Business Account') {
      // if (this.acctDetails.accountSegment === 'PB-PERSONAL BANKING') {
      //   this.dataToUpdateForm.controls.accountType.setValue('Business Account');
      //   this.showDataToUpdate = true;
        
      // }
      if (this.acctDetails.accountSegment === 'PB-PERSONAL BANKING' && this.acctDetails.accountSegment) {
        this._snackBar.open('Sorry, the account number provided is a personal account, please select "Personal Account"',
          'Failed', { verticalPosition: 'top', horizontalPosition: 'center', duration: 20000 });
        return;
        // this.dataToUpdateForm.controls.accountType.setValue('Business Account');
        // this.onSelectAccountType('Business Account');
      }
      this.isBusinessAccount = true;
      this.showDataToUpdate = false;
      this.showTinDataToUpdate = true;
      this.showTinUpdate = true;
      this.dataToUpdateForm.controls.selectOptions.setValue(value);
    }
    else if (value === 'Personal Account') {
      if (this.acctDetails.accountSegment !== 'PB-PERSONAL BANKING' && this.acctDetails.accountSegment) {
        this._snackBar.open('Sorry, the account number provided is a business account, please select "Business Account"',
          'Failed', { verticalPosition: 'top', horizontalPosition: 'center', duration: 20000 });
        return;
        // this.dataToUpdateForm.controls.accountType.setValue('Business Account');
        // this.onSelectAccountType('Business Account');
      }

      this.isBusinessAccount = false;
      this.showTinDataToUpdate = false;
      this.showDataToUpdate = true;
      this.dataToUpdateForm.controls.selectOptions.setValue('');
    }
  }

  proceedAccountTypeStepper(stepper: MatStepper) {
    this.showSpinner = true;
    this.isAwaitingResponse = true;

    this.saveAndContinue(stepper, 'ACCOUNT-TYPE').then(res => {
      if (res) {
        if (this.isBusinessAccount) {
          this.isAccountTypeStepperActive = false;
          this.isAccountTypeStepperDone = true;
          this.isUploadCorporateFormDocActive = true;
        }
        else {
          this.toggleDataToUpdate();
          this.isAccountTypeStepperActive = false;
          this.isAccountTypeStepperDone = true;
          this.isUpdateFormStepperActive = true;
        }
      }
    });
  }
  setAll(checked: boolean){
    if (checked ){
      this.isTinValid = true;
    }
    else{
      this.isTinValid = false;
    }
  }

  onSelectDataToUpdate() {
    const selectedDataToUpdate: string[] = this.dataToUpdateForm.controls.selectOptions.value;

    if (selectedDataToUpdate.includes("Contact Details Update (Phone Number and Email)")) {
      this.showContactUpdateHint = true;
    }
    
    else {
      this.showContactUpdateHint = false;
    }
    if (selectedDataToUpdate.includes("Tin Update")) {
      this.idIsValid = true;
    }
  }
  backtoSelectType(updateFormGroup, stepper: MatStepper){
    this.updateFormGroup = updateFormGroup;
    stepper.previous()
  }

  toggleDataToUpdate() {
    const selectedDataToUpdate: string[] = this.dataToUpdateForm.controls.selectOptions.value;
    console.log( this.updateFormGroup)
    if (selectedDataToUpdate.includes("Address Update")) {
      this.showAddressUpdate = true;
      this.updateFormGroup = this.formBuilder.group({
        fileInputCtrl: [''],
        identificationCard: [''],
        houseNumber: ['',  [Validators.required]],
        streetName: ['',[Validators.required]],
        cityTown: ['',[Validators.required]],
        state: ['',[Validators.required]],
        lga: ['',[Validators.required]],
        busStop: ['',[Validators.required]],
        alias: [''],
        houseDesc: [''],
        phoneNoCtrl: [''],
        email: [''],
        idTypeCtrl: [''],
        idNumber: [''],
        countryCode:[''],
        tinCtrl: ['']
      })
      this.updateFormGroup.patchValue({houseDesc: " ", alias: " ",phoneNoCtrl: " ", email: " ", countryCode: " ", })
     
    }
    
    else {
      this.showAddressUpdate = false;
      // this.updateFormGroup.controls.houseNumber.clearValidators();
      // this.updateFormGroup.controls.streetName.clearValidators();
      // this.updateFormGroup.controls.cityTown.clearValidators();
      // this.updateFormGroup.controls.state.clearValidators();
      // this.updateFormGroup.controls.lga.clearValidators();
      // this.updateFormGroup.controls.busStop.clearValidators();
      // this.updateFormGroup.controls.alias.clearValidators();
      // this.updateFormGroup.controls.phoneNoCtrl.clearValidators();
      // this.updateFormGroup.controls.email.clearValidators();
      // this.updateFormGroup.controls.fileInputCtrl.clearValidators();
      // this.updateFormGroup.controls.houseDesc.clearValidators();
      // this.updateFormGroup.controls.idTypeCtrl.clearValidators();
      this.updateFormGroup = this.formBuilder.group({
        fileInputCtrl: [''],
        identificationCard: [''],
        houseNumber: [''],
        streetName: [''],
        cityTown: [''],
        state: [''],
        lga: [''],
        busStop: [''],
        alias: [''],
        houseDesc: [''],
        phoneNoCtrl: ['', [Validators.pattern(/^[0-9]\d*$/), Validators.maxLength(15)]],
        email: ['', [Validators.email]],
        idTypeCtrl: [''],
        idNumber: [''],
        countryCode:[''],
        tinCtrl: ['']
      })
      // this.updateFormGroup.controls.houseDesc.clearValidators();
      this.updateFormGroup.patchValue({houseDesc: " "})
      

     
    }
    
    if (selectedDataToUpdate.includes("Contact Details Update (Phone Number and Email)")) {
      this.showContactUpdate = true;
      this.authWithSignature = false;
    }
    else {
      this.showContactUpdate = false;
      this.authWithSignature = true;
    }
    if (selectedDataToUpdate.includes("ID Update")) {
      this.showIdUpdate = true;
      this.idIsValid = false;
      this.updateFormGroup.controls.idTypeCtrl.setValidators([Validators.required]);
      
    }
    else {
      this.idIsValid = true;
      this.showIdUpdate = false;
      this.updateFormGroup.controls.idTypeCtrl.clearValidators();
    }
    if (selectedDataToUpdate.includes("Tin Update")){
      this.showTinUpdate =true
      this.isTinValid = false;
      this.updateFormGroup.controls.tinCtrl.setValidators([Validators.required]);
    }
    else{
      this.showTinUpdate =false
      this.updateFormGroup.controls.tinCtrl.clearValidators();
    }

  }
  //#endregion


  //#region DATA FORMS
  proceedDataFormStepper(stepper: MatStepper) {
    this.showSpinner = true;
    this.isAwaitingResponse = true;
    // Set docs if part of form
    if (this.showAddressUpdate) {
      this.populateDocumentWithUtilityBill();
    }
    if (this.showIdUpdate) {
      this.createMultipleIDUpload();
    }

    this.initiateOTP(stepper);
    this.isAuthenticationFormActive = true;
    this.isUpdateFormStepperActive = false;
    this.isUpdateFormStepperDone = true;
  }

  populateDocumentWithUtilityBill() {
    if (this.supportingDocModel.UtilityBill) {
      const reference: UploadedDocument = {
        title: 'Utility Bill',
        name: this.fileResult,
        base64Content: this.supportingDocModel.UtilityBill
      };
      this.documents.push(reference);
    }
    console.log('Docs', this.documents);
  }

  createMultipleIDUpload() {
    for (var i = 0; i < this.supportingDocModel.meansOfIdentification.length; i++) {
      const ID: UploadedDocument = {
        title: 'Means of Identification',
        name: this.meansOfIdentificationFileNames[i],
        base64Content: this.supportingDocModel.meansOfIdentification[i]
      };
      // remove previous one
      this.documents = this.documents.filter(x => x.base64Content !== this.supportingDocModel.meansOfIdentification[i]);
      this.documents.push(ID);
    }
  }
  //#endregion


  //#region VALIDATE ID
  onSelectIdType(value) {
    this.idIsValid = false;
    if (value === 'Nigerian National Identity Card (NIMC)') {
      this.showNinInfo = true;
    }
    else {
      this.showNinInfo = false;
    }
    if (value === 'Other IDs (Foreign International Passport, Driver\'s License, etc)') {
      this.showOtherIdHint = true;
      this.idIsValid = true;
    }
    else {
      this.showOtherIdHint = false;
    }

  }

  onIdNumberKeyUp() {
    this.showIdSpinner = true;
    this.isAwaitingResponse = true;
    this.idIsValid = false;

    const payload: IdVerificationRequest = {
      idType: this.updateFormGroup.controls.idTypeCtrl.value,
      idNumber: this.updateFormGroup.controls.idNumber.value,
      phoneNumber: this.accountFormGroup.controls.phoneNoCtrl.value,
      firstName: this.acctDetails.firstName,
      lastName: this.acctDetails.lastName
    }
    

    this.dataUpdateService.verifyIdCard(payload).subscribe(res => {
      this.showIdSpinner = false;
      this.isAwaitingResponse = false;

      if (res.responseCode == '00') {
        this._snackBar.open('ID successfully verified', 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
        this.idIsValid = true;
      }
      else {
        this._snackBar.open(res.responseDescription, 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      }
    },
      error => {
        this.showIdSpinner = false;
        this.isAwaitingResponse = false;
        this._snackBar.open('Error occured', 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      })
  }
  //#endregion
  ValidateTinNumber() {
    this.showIdSpinner = true;
    this.isAwaitingResponse = true;
    this.isTinValid = false;

    const payload: TinVerificationRequest = {
      tinNumber: this.updateFormGroup.controls.tinCtrl.value,
      accountName: this.acctDetails.lastName + " "+ this.acctDetails.firstName,
    }
    

    this.dataUpdateService.verifyTinNumber(payload).subscribe(res => {
      this.showIdSpinner = false;
      this.isAwaitingResponse = false;

      if (res.responseCode == '00') {
        this.isTinValid = true;
        this.idIsValid = true;
        this.checkValidity()
        this._snackBar.open('Tin successfully verified', 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
        
      }
      else {
        this._snackBar.open(res.responseDescription, 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      }
    },
      error => {
        this.showIdSpinner = false;
        this.isAwaitingResponse = false;
        this._snackBar.open('Error occured', 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      })
  }

  

  //#region AUTH
  onSelectDebitCard(value) {
    if (value === 'Yes') {
      this.authWithSignature = false;
      this.showSpinner = true;
    } else {
      this.authWithSignature = true;
      this.showSpinner = false;
    }
  }

  _window(): any {
    // return the global native browser window object
    return window;
  }

  fetchInterswitchURL(stepper: MatStepper) {
    const payload = {
      accountNumber: this.acctNo
    };
   
    this.isUpdateFormStepperActive = false;
    this.isUpdateFormStepperDone = true;
    this.isUploadCorporateFormDocActive = false;
    this.isUploadCorporateFormDone = true
    let self = this;
    this.debitCardAuthModalSub = this.interswitchService.fetchInterswitchURL(payload).
      subscribe(response => {

        this.iframeModalRef = this.dialog.open(this.iFrameModalTemplate, {
          width: '800px',
          height: '600px',
        });
        // Init Iframe
        $('#quickServiceIFrame').attr('src', 'data:text/html;charset=utf-8,' + escape(response.Data));
        console.log('w', window);

        this._window().frames.quickServiceIFrame.focus();

        $('#quickServiceIFrame').on('load', () => {
          console.log('done loading iframe');
          this.showSpinner = false;
          this.isAwaitingResponse = false;
        });


        // https://gist.github.com/cirocosta/9f730967347faf9efb0b
        // set up the communication between iframe and parent window
        if (this._window().addEventListener) {
          this._window().addEventListener('message', onMessage, false);
        } else if (this._window().attachEvent) {
          this._window().attachEvent('onmessage', onMessage, false);
        }

        // this would be call once the iframe send a message
        function onMessage(event) {
          const data = event.data;
          if (data && data.appsource && data.appsource === 'quickservice') {

            if (data.responseCode && data.responseCode === '00') {
              // alert('Card authenticated successfully');
              self._snackBar.open('Card authenticated successfully', 'OK',
                { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000, panelClass: ['errorSnackbar'] });
              self.dialog.closeAll();

              self.submitRequest(stepper);
              return;
              // send te user to the next process
              //
            } if (data.responseDescription === 'Customer cancelation') {
              self._snackBar.open('Card validation cancelled', 'OK',
                { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000, panelClass: ['errorSnackbar'] });
              this.showSpinner = false;
              this.isAwaitingResponse = false;
              self.dialog.closeAll();
              return;

            } else {
              this.showSpinner = false;
              this.isAwaitingResponse = false;
              self.dialog.closeAll();
              self._snackBar.open('Card Validation failed', 'Failed',
                { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000, panelClass: ['errorSnackbar'] });
            }

            // remove iframe
            $('#quickServiceIFrame').remove();
          }
        }

      },
        (error: any) => {
          this.showSpinner = false;
          this.isAwaitingResponse = false;
          this._snackBar.open('A problem has occured', null, { verticalPosition: 'top', horizontalPosition: 'right', duration: 2500 });
        });
  }

  //#region FILE
  removeSelectedFile(document: string, index = null) {
    if (document === 'Utility Bill') {
      this.fileResult = '';
      this.updateFormGroup.controls.fileInputCtrl.setValue('');
    }

    if (document === 'Identification Card') {
      if (index !== null) {
        this.meansOfIdentificationFileNames.splice(index, 1);
        this.supportingDocModel.meansOfIdentification.splice(index, 1);
      }
      this.updateFormGroup.controls.identificationCard.setValue('');
    }
  }

  onSignatureFileSelected(evt) {

    this._fileError = '';

    if (!evt.target.files || evt.target.files.length < 1) {
      this._fileError = 'No file selected. Please select a valid pdf/jpeg file to upload';
      this._snackBar.open(this._fileError, 'Ok', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      evt.target.value = '';
      this.selectedSignaturefile = '';
      return;
    }
    if (evt.target.files.length > 1) {
      this._fileError = 'Multiple file upload is not supported. please select a single file and retry';
      this._snackBar.open(this._fileError, 'Ok', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      evt.target.value = '';
      this.selectedSignaturefile = '';
      return;
    }

    const _fileToUpload: File = evt.target.files[0];
    if (_fileToUpload.size / (1000 * 1024) > 2) {
      this._fileError = 'Size limit for the file is 2 MB';
      this._snackBar.open(this._fileError, 'Failed', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      evt.target.value = '';
      return;
    }
    this._fileError = ''
    this.selectedSignaturefile = evt.target.files[0].name;
    // this.uploadSignatureForm.value.fileInputCtrl = this.fileResult;
    this._selectedSignatureFile = evt.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this._selectedSignatureFile);
    fileReader.onload = (e: any) => {
      this.ConvertToBase64(this._selectedSignatureFile).then(result => {
        this.signatureToBase64 = this.transformBase64String(result)
      });
    };
    evt.target.value = '';

  }

  validateFileType(File): string {
    const fileExtension = this._selectedFileToUpload.name.toString().toLowerCase().substr(this._selectedFileToUpload.name.lastIndexOf('.'));
    switch (fileExtension) {
      case '.pdf':
      case '.jpeg':
      case '.jpg':
      case '.png':
        return '';
      default: return `${this._selectedFileToUpload.name} is a not a valid type. Valid files must either be pdf or jpeg files`;
    }
  }

  onFormControlClicked(event: any) {
    const element = event.target as HTMLInputElement;
    element.value = '';
  }

  ConvertToBase64(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  transformBase64String(base64String: string) {
    if (base64String && base64String.indexOf('base64') > -1) {
      const hay = base64String.indexOf('base64');
      return base64String.substr(hay + 7);
    }
    console.log(base64String);
    return base64String;
  }

  ConvertUtilityBill() {
    try {
      this.ConvertToBase64(this._selectedFileToUpload).then(result => {
        this.supportingDocModel.UtilityBill = this.transformBase64String(result)
      });
    } catch (error) {
      console.log(error);
      this._snackBar.open('Error occured', 'Error', { duration: 5000 }); return;
    }
    console.log('Utility bill', this.supportingDocModel.UtilityBill);
  }

  ConvertIntroLetter() {
    try {
      this.ConvertToBase64(this._selectedFileToUpload).then(result => {
        this.supportingDocModel.IntroLetter = this.transformBase64String(result)
      });
    } catch (error) {
      console.log(error);
      this._snackBar.open('Error occured', 'Error', { duration: 5000 }); return;
    }
  }

  onFormControlChanged(evt, document: string) {
    this._fileError = '';
    const element = evt.target as HTMLInputElement;
    // Check if there's a file
    if (!evt.target.files || evt.target.files.length < 1) {
      this.fileResult = document === 'Utility Bill' ? '' : this.fileResult;
      this.IntroLetterFileName = document === 'IntroLetter' ? '' : this.IntroLetterFileName;
      this.meansOfIdentification = document === 'Identification Card' ? '' : this.meansOfIdentification;

      this.introLetterError = document === 'IntroLetter' ? 'No file selected. Please select a valid pdf/jpeg file to upload' : '';
      this.referenceFormError = document === 'Reference Form' ? 'No file selected. Please select a valid pdf/jpeg file to upload' : '';
      this.meansOfIdentification = document === 'Identification Card' ? 'No file selected. Please select a valid pdf/jpeg file to upload' : '';

      const error = 'No file selected. Please select a valid pdf/jpeg file to upload';
      this._snackBar.open(error, 'Ok', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      element.value = '';
      return;
    }
    if (evt.target.files.length > 1) { // Check if file is more than one
      this.fileResult = document === 'Utility Bill' ? '' : this.fileResult;
      this.IntroLetterFileName = document === 'IntroLetter' ? '' : this.IntroLetterFileName;
      this.meansOfIdentification = document === 'Identification Card' ? '' : '';

      this.referenceFormError = document === 'Reference Form' ? 'Multiple file upload is not supported. please select a single file and retry' : this.referenceFormError;
      this.meansOfIdentificationError = document === 'Identification Card' ? 'Multiple file upload is not supported. please select a single file and retry' : this.signatureFileError;

      const error = 'Multiple file upload is not supported. please select a single file and retry';
      this._snackBar.open(error, 'Ok', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      element.value = '';
      return;
    }

    // Check file size
    const _fileToUpload: File = evt.target.files[0];
    if (_fileToUpload.size / (1000 * 1024) > 2) {
      const error = 'Size limit for the file is 2 MB';
      this.fileResult = document === 'Utility Bill' ? '' : this.fileResult;
      this.IntroLetterFileName = document === 'IntroLetter' ? '' : this.IntroLetterFileName;
      this.meansOfIdentificationError = document === 'Identification Card' ? error : this.meansOfIdentificationError;

      this.introLetterError = document === 'IntroLetter' ? error : this.introLetterError;
      this.referenceFormError = document === 'Reference Form' ? error : this.referenceFormError;
      this._snackBar.open(error, 'Failed', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      element.value = '';
      return;
    }

    // Set upload file
    this._selectedFileToUpload = _fileToUpload;
    const fileTypeError = this.validateFileType(this._selectedFileToUpload);

    // Check file type
    if (fileTypeError) {
      this._fileError = fileTypeError;
      this._snackBar.open(fileTypeError, 'Failed', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      element.value = '';
      return;
    }

    if (document === 'Utility Bill') {
      this.referenceFormError = ''
      this.fileResult = evt.target.value.substring(12);
      this.updateFormGroup.controls.fileInputCtrl.setValue(this.fileResult);
      this._snackBar.open('Utility bill has been uploaded successfully', 'OK', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
    }
    if (document === 'IntroLetter') {
      this.introLetterError = ''
      this.IntroLetterFileName = evt.target.value.substring(12);
      this.DocumentsFormGroup.controls.IntroLetter.setValue(this.IntroLetterFileName);
      this._snackBar.open('Instruction Letter has been uploaded successfully', 'OK', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
    }
    // Has multiple upload
    if (document === 'Identification Card') {
      this.meansOfIdentificationError = '';
      this.meansOfIdentification = evt.target.value.substring(12);
      this.meansOfIdentificationFileNames.push(this.meansOfIdentification)
      console.log('Multiple IDs', this.meansOfIdentificationFileNames);
      this.updateFormGroup.controls.identificationCard.setValue(this.meansOfIdentification);
      this._snackBar.open('Means of Identification has been uploaded successfully', 'OK', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
    }

    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this._selectedFileToUpload);
    fileReader.onload = (e: any) => {

      if (document === 'Utility Bill') {
        this.ConvertUtilityBill();
        return;
      }
      if (document === 'IntroLetter') {
        this.ConvertIntroLetter();
        return;
      }
    };
    element.value = '';
  }

  onSubmitDocumentsFormGroup(stepper: MatStepper) {
    this.isAwaitingResponse = true;
    this.isAuthenticationFormActive = true;

    const intstructionLetterDocuments: UploadedDocument = {
      title: 'Instruction Letter',
      name: this.IntroLetterFileName,
      base64Content: this.supportingDocModel.IntroLetter
    };
    this.documents.push(intstructionLetterDocuments);
    this.initiateCorporateAcctOTP(stepper);
    console.log(this.documents, 'documents');
  }

  //#endregion

  onClickAgree(completed: boolean): void {
    this.iAgree = completed;
  }

  buildOTPPayload(): OTPPayload {
    return {
      cifId: this.acctDetails.cifId,
      userId: this.accountFormGroup.controls.accountNoCtrl.value,
      reasonCode: '20',
      reasonDescription: 'INITIATE OTP DATA UPDATE'
    };
  }

  initiateOTP(stepper) {
    this.showSpinner = true;

    if (!this.authWithSignature) {
      this.fetchInterswitchURL(stepper);
      
    }
    else {
      const payload = this.buildOTPPayload();
      this.dataUpdateService.initiateOTP(payload).subscribe(
        (response) => {
          if (response.responseCode === '00') {
            stepper.next();
            this.showSpinner = false;
            this.isAwaitingResponse = false;
            this.otpReference = response.responseDescription;
            if (this.acctDetails.maskedPhoneNumber) {
              this._snackBar.open(`OTP has been sent to ${this.acctDetails.maskedPhoneNumber}`, 'Ok',
                { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
            } else {
              this._snackBar.open(`OTP has been sent to your registered phone number`, 'Ok',
                { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
            }
          } else {
            this.showSpinner = false;
            this.isAwaitingResponse = false;
            this._snackBar.open('Error Occured', 'Error',
              { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
          }
        },
        error => {
          this.showSpinner = false;
          this.isAwaitingResponse = false;
          this._snackBar.open('Error occured', 'Ok',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
        });
    }
  }

  initiateCorporateAcctOTP(stepper) {
    this.showSpinner = true;
    const payload = this.buildOTPPayload();
    this.dataUpdateService.initiateOTP(payload).subscribe(
      (response) => {
        console.log(response);
        if (response.responseCode === '00') {
          this.showSpinner = false;
          this.isAwaitingResponse = false;
          this.otpReference = response.responseDescription;
          if (this.acctDetails.maskedPhoneNumber) {
            this._snackBar.open(`OTP has been sent to ${this.acctDetails.maskedPhoneNumber}`, 'Ok',
              { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
          } else {
            this._snackBar.open(`OTP has been sent to your registered phone number`, 'Ok',
              { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
          }
          stepper.next();
        } else {
          this.showSpinner = false;
          this.isAwaitingResponse = false;
          this._snackBar.open('Error Occured', 'Error',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
        }
      },
      error => {
        this.showSpinner = false;
        this.isAwaitingResponse = false;
        this._snackBar.open('Error occured', 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      });
  }

  resendOTP() {
    this.showSpinner = true;
    const payload = this.buildOTPPayload();
    this.dataUpdateService.initiateOTP(payload).subscribe(
      (response) => {
        if (response.responseCode === '00') {
          this.showSpinner = false;
          this.otpReference = response.responseDescription;
          this._snackBar.open(`OTP has been sent to your registered phone number`, 'Ok',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
        } else {
          this.showSpinner = false;
          this._snackBar.open('Error Occured', 'Error',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
        }
      },
      error => {
        this.showSpinner = false;
        this._snackBar.open('Error occured', 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      });
  }

  submitRequest(stepper: MatStepper) {
    const payload = this.buildDataUpdatePayload(this.caseId, 'COMPLETED');
    this.showSpinner = true;
    this.isAwaitingResponse = true;
    this.dataUpdateService.submitRequest(payload).subscribe(
      (response) => {
        this.showSpinner = false;
        this.isAwaitingResponse = false;
        console.log(response);
        if (response.responseCode === '00') {
          if (this.isBusinessAccount) {
            this.isUploadCorporateFormDocActive = false;
            this.isUploadCorporateFormDone = true;
            this.isAuthenticationFormActive = false;
            this.isAuthenticationFormDone = true;
          } else {
            this.isUpdateFormStepperActive = false;
            this.isUpdateFormStepperDone = true;
          }
          this.ticketID = response.data.detail;
          this._snackBar.open('Data Update request has been created successfully', 'Ok',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
          stepper.next();
        } else {
          this._snackBar.open(response.responseDescription, 'Ok',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 15000 });
        }
      },
      (err) => {
        this.showSpinner = false
        this.isAwaitingResponse = false;
        console.log(err);
        this._snackBar.open('Error occured', 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      });
  }

}
