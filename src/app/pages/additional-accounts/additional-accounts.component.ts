import { Component, OnInit, ViewChild, TemplateRef, NgZone, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, Form, FormGroupDirective } from '@angular/forms';
// import { MatStepper, MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdditionalAccountService } from 'src/app/core/services/additional-account.service';
import { AccountValidation } from 'src/app/core/models/payloads/account-validation';
import { OTPPayload } from 'src/app/core/models/payloads/otp-payload';
import { CustomerDetails } from 'src/app/core/models/payloads/customer-details';
import { AccountEnquiryRequest, AdditionalAcctPayload, CardRadioOption, IdVerificationRequest, UploadedDocument } from 'src/app/core/models/payloads/additional-acct-payload';
import { InterswitchService } from 'src/app/core/services/interswitch.service';
import { Subscription } from 'rxjs';
import * as $ from "jquery";
import { TermsOfUseComponent } from '../terms-of-use/terms-of-use.component';
import { ContinueSessionComponent } from '../continue-session/continue-session.component';

@Component({
  selector: 'app-additional-accounts',
  templateUrl: './additional-accounts.component.html',
  styleUrls: ['./additional-accounts.component.css', '../../app.component.css']
})

export class AdditionalAccountsComponent implements OnInit {
  accountFormGroup: FormGroup;
  bvnUpdateFormGroup: FormGroup;
  accountOptionFormGroup: FormGroup;
  uploadSignatureForm: FormGroup;
  cardFormGroup: FormGroup;
  uploadReferenceForm: FormGroup;
  otpForm: FormGroup;
  DocumentsFormGroup: FormGroup;
  idTypeForm: FormGroup;
  uploadSignatureFormWithExistingSavings: FormGroup;
  accountTypes = ['Personal Account', 'Business Account'];
  optionTypes = ['Savings Account', 'Current Account'];
  refereeTypes = ['Stanbic IBTC Bank', 'Other Banks'];
  idTypes = ['Nigerian National Identity Card (NIMC)', 'Nigeria Permanent Voter\'s Card (PVC)', 'Nigeria Driver\s License', 'Nigerian International Passport', 'Other IDs (Foreign International Passport, Driver\'s License, etc)'];
  currencyOptionTypes = ['NGN', 'USD', 'GBP', 'EUR', 'ZAR', 'CNY'];
  employmentStatus = ['CONTRACTOR', 'EMPLOYED FULL TIME', 'EMPLOYED PART TIME', 'RETIRED/PENSIONER', 'SELF-EMPLOYED', 'STUDENT', 'UNEMPLOYED'];
  occupation = ['ACTUARIES/STATISTICIANS'
    , 'ARCHITECT'
    , 'ARTISAN'
    , 'ARTS (ARTISTS, ACTORS, WRITERS, DANCERS ETC.)'
    , 'AUDITOR/ACCOUNTING/TAX PRACTITIONERS'
    , 'BANKING'
    , 'BARTENDERS'
    , 'CAFETERIA/RESTAURANT ATTENDANTS'
    , 'CAR DEALER'
    , 'CATERING (CHEFS/COOKS ETC.)'
    , 'CIVIL SERVANTS'
    , 'CLEANING AND MAINTENANCE (PESTS, PRUNERS ETC.)'
    , 'CLERICAL/ADMIN (RECEPTIONIST, SECRETARY ETC.)'
    , 'COMMUNICATIONS/TELECOMMUNICATIONS'
    , 'CONSTRUCTION (BUILDERS, CARPENTERS ETC.)'
    , 'CONSULTANTS'
    , 'CORPORATE CLEANING'
    , 'COSMETOLOGISTS'
    , 'DATA SCIENTIST'
    , 'DESIGN(INTERIOR DESIGNERS,GRAPHIC DESIGNERS ETC.)'
    , 'EDUCATION AND TRAINING'
    , 'ENGINEERING'
    , 'FARMING/FISHING'
    , 'FASHION DESIGNERS/TAILORS'
    , 'FINANCIAL AND INSURANCE SERVICES'
    , 'HEALTH CARE PROVIDERS(DOCTORS,NURSES,DENTISTS ETC.)'
    , 'HEALTH SUPPORT (E.G.MEDICAL EQUIPMENT PROVIDER)'
    , 'HOSTS/HOSTESSES'
    , 'HOTEL MANAGERS'
    , 'HUMAN RESOURCES/PERSONNEL SERVICES'
    , 'IMPORTING AND EXPORTING'
    , 'INFORMATION TECHNOLOGY'
    , 'INSTALLATIONS AND REPAIRS (AUTO REPAIRERS)'
    , 'JEWELERS'
    , 'LABORER'
    , 'LAWYERS/JUDGES/LEGAL SUPPORTS'
    , 'MAIDS/HOUSE KEEPING CLEANERS'
    , 'MAKEUP ARTISTS'
    , 'MANUFACTURING/PRODUCTION'
    , 'MARKETING AND SALES'
    , 'MECHANIZED FARMING(EQUIPMENT/LARGE SCALE FARMING)'
    , 'MEDIA (PRODUCERS, RADIO/TV PRESENTER ETC.)'
    , 'MESSENGER'
    , 'MILITARY PERSONNEL'
    , 'MINERS'
    , 'MUSICIANS/SINGERS/MUSIC DIRECTORS ETC.'
    , 'NANNIES'
    , 'OTHERS'
    , 'PERSONAL CARE SERVICES (HAIRSTYLIST,BARBERS)'
    , 'PHOTOGRAPHERS'
    , 'PILOTS'
    , 'PRIVATE BUSINESS OWNER'
    , 'PROPERTY DEVELOPMENT'
    , 'PSYCHOLOGISTS'
    , 'REAL ESTATE AGENTS/DEALERS'
    , 'RELIGIOUS WORKERS (PASTORS, OVERSEERS ETC.)'
    , 'SCIENCE (E.G. GEOSCIENTISTS, BIOLOGISTS)'
    , 'SECURITY'
    , 'SOCIAL SERVICES (COUNSELLORS,THERAPISTS ETC.)'
    , 'SOCIOLOGISTS'
    , 'SPORTS AND ENTERTAINMENT'
    , 'SURVEYORS'
    , 'TRANSPORTATION AND LOGISTICS'
    , 'WAITERS/WAITRESS'];
  industry = ['Agriculture, forestry and fishing'
    , 'Mining and quarrying'
    , 'Manufacturing'
    , 'Electricity, gas, steam and air conditioning supply'
    , 'Water supply; sewerage, waste management and remediation activities'
    , 'Construction'
    , 'Wholesale and retail trade'
    , 'Repair of motor vehicles and motorcycles'
    , 'Transportation and storage'
    , 'Accommodation and Food service activities'
    , 'Information and communication'
    , 'Financial and insurance activities'
    , 'Real estate activities'
    , 'Professional, scientific and technical activities'
    , 'Administrative and support service activities'
    , 'Public administration and defence; compulsory social security'
    , 'Education'
    , 'Human health and social work activities'
    , 'Arts, entertainment and recreation'
    , 'Repair of computers and personal and household goods and other service activities'
    , 'Activities of households as employers; undifferentiated goods- and servicesproducing activities of households for own use'
    , 'Activities of extraterritorial organizations and bodies'
    , 'Others'
  ];
  incomeRange = ['0 – 70,000', '70,001 – 150,000', '150,001 – 750,000', '750,001 – 3 million', 'Above 3 million'];
  branches = ['Walter Carrington', 'Idejo'];
  cardOptions: string[] = ['Yes', 'No'];
  cardRadioOptions: CardRadioOption[] = [
    { name: 'Yes', value: true },
    { name: 'No', value: false }
  ];
  selectedCurrecyOption = '';
  employmentFormGroup: FormGroup;
  refereeFormGroup: FormGroup;
  debitCardInformationFormGroup: FormGroup;
  color = 'primary';
  mode = 'query';
  value = 50;
  bufferValue = 75;
  showCurrencyOption: boolean;
  showFixedCurrencyOption = false;
  fixedCurrency = 'NGN';
  showAccountOptType: boolean;
  fileResult: string;
  showUploadSignatureForm: boolean;
  interswitchUrl = 'https://ienroll.stanbicibtc.com:8444//Identification/Index';
  selectedSignaturefile = '';
  showRadioButton: boolean;
  isRequiredDocStepperActive = true;
  isRequiredDocStepperDone = false;
  isAccountTypeStepperActive = false;
  isAccountTypeStepperDone = false;
  isAccountStepperDone = false;
  isAccountStepperActive = false;
  isIdTypeStepperActive = false;
  isIdTypeStepperDone = false;
  isEmploymentStatusStepperActive = false;
  isEmploymentStatusStepperDone = false;
  isRefereeInformationStepperActive = false;
  isRefereeInformationStepperDone = false;
  isDebitCardInformationStepperActive = false;
  isDebitCardInformationStepperDone = false;
  isUploadSignatureFormActive = false;
  isUploadSignatureFormDone = false;
  isAuthenticationFormActive = false;
  isAuthenticationFormDone = false;
  isAccessTypeFormActive = false;
  isAccessTypeFormDone = false;
  IntroLetterFileName = ''
  _selectedFileToUpload: File;
  _fileError: string;
  directorsIDFileName: any;
  signatoriesIDFileNames: string[] = [];
  bvnDirectorsFileName: any;
  isAwaitingResponse: boolean;
  class = '';
  public supportingDocModel = {
    IntroLetter: '',
    DirectorsID: '',
    SignatoriesID: [''],
    referenceForm: '',
    meansOfIdentification: ''
  };
  showUploadRequiredDocFormForBusinessAccount: boolean;
  showUploadRequiredDocFormForBusinessAccountForPersonalAccount: boolean;
  showNinInfo: boolean;
  acctDetails: CustomerDetails;
  showSpinner: boolean;
  showRefSpinner: boolean;
  showIdSpinner: boolean;
  showBVNSpinner: boolean;
  selectedCurrency: string;
  documents: UploadedDocument[] = [];
  _selectedSignatureFile: File;
  signatureToBase64: string;
  showCorporateAcctTab = false;
  otpReference: any;
  ticketID: any;
  introLetterError: string;
  referenceFormError: string;
  signatureFileError: string;
  isUploadCorporateFormDocActive: boolean;
  isUploadCorporateFormDone: boolean;
  debitCardAuthModalSub: Subscription;
  public iframeModalRef: MatDialogRef<any>;
  @ViewChild('iFrameModalTemplate', { static: true }) iFrameModalTemplate: TemplateRef<any>;
  @ViewChild('stepper', { static: false }) stepperIndex: MatStepper;
  meansOfIdentification: any;
  meansOfIdentificationError: string;
  isCurrentAcct = false;
  wantsDebitCard = false;

  dialogBoxSettings = {
    margin: '0 auto',
    disableClose: true,
    hasBackdrop: true,
    data: {}
  };

  showOccupationAndBusiness = true;
  showNatureOfBusiness = true;
  showEmployerField = true;
  showOtherIdHint = false;
  showStudentField = false;
  showOtherOccupation = false;
  idIsValid = false;
  caseId: string;
  firstRefIsStanbic: boolean = false;
  secondRefIsStanbic: boolean = false;
  refIsOtherBank: boolean = false;
  showCurrencyConditions: boolean = false;
  bvnIsValid: boolean = true;
  bvnIsSet: boolean = true;
  iAgree: boolean;

  constructor(private formBuilder: FormBuilder, private additionalAcctService: AdditionalAccountService, private ngZone: NgZone,
    private _snackBar: MatSnackBar, private dialog: MatDialog, private interswitchService: InterswitchService) { }

  ngOnInit() {
    this.accountFormGroup = this.formBuilder.group({
      phoneNoCtrl: ['08091442734', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      accountNoCtrl: ['0009722009', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]]
    });
    this.accountOptionFormGroup = this.formBuilder.group({
      accountTypeCtrl: ['', Validators.required],
      optTypeCtrl: ['', Validators.required],
      currencyOptionCtrl: ['NGN', Validators.required]
    });
    this.uploadSignatureForm = this.formBuilder.group({
      fileInputCtrl: [],
      identificationCard: ['', Validators.required]
    });
    this.uploadSignatureFormWithExistingSavings = this.formBuilder.group({
      fileInputCtrl: ['', Validators.required],
      identificationCard: ['', Validators.required]
    });

    this.uploadReferenceForm = this.formBuilder.group({
      refFileCtrl: ['', Validators.required]
    });
    this.cardFormGroup = this.formBuilder.group({
      debitCardOption: ['', Validators.required]
    });
    this.otpForm = this.formBuilder.group({
      otpControl: ['', Validators.required]
    });
    this.DocumentsFormGroup = this.formBuilder.group({
      IntroLetter: ['', [Validators.required]],
      DirectorsID: ['', [Validators.required]],
      SignatoriesID: [[''], [Validators.required]],
      TermsAndConditions: [false, [Validators.required]]
    });

    this.idTypeForm = this.formBuilder.group({
      idTypeCtrl: ['', [Validators.required]],
      idNumber: ['']
    });
    this.employmentFormGroup = this.formBuilder.group({
      idTypeCtrl: ['', [Validators.required]],
      idNumber: [''],
      employmentStatus: ['', Validators.required],
      occupation: [''],
      industry: [''],
      natureOfBusiness: [''],
      incomeRange: ['', Validators.required],
      nameOfEmployer: [''],
      levelOfEducation: [''],
      nameOfInstitution: ['']
    });
    this.refereeFormGroup = this.formBuilder.group({
      requestedDebitCard: [false, Validators.required],
      preferredNameOnCard: [''],
      pickupBranch: [''],
      firstRefereeBank: [''],
      firstRefereeAccountNumber: [''],
      firstRefereeName: [''],
      secondRefereeBank: [''],
      secondRefereeName: [''],
      secondRefereeAccountNumber: ['']
    });
    this.debitCardInformationFormGroup = this.formBuilder.group({
      preferredNameOnCard: [''],
      pickupBranch: ['']
    });

    this.bvnUpdateFormGroup = this.formBuilder.group({
      bvnId: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    })

    this.openTermsOfUse();
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


  //#region  SESSION DIALOG
  openSessionDialog(): void {
    this.dialogBoxSettings.data = this.accountFormGroup.controls.phoneNoCtrl.value;
    const dialogRef = this.dialog.open(
      ContinueSessionComponent,
      this.dialogBoxSettings
    );

    dialogRef.afterClosed().subscribe(result => {

      if (result.status) {
        this._snackBar.open(`Previous Session successfully retrieved for ${this.acctDetails.firstName} ${this.acctDetails.lastName}`, 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });

        // TODO: Handle step and form fields
        this.continueSession(result.data);
        this.stepperIndex.linear = true;
      }
      else if (!result) {
      }
      else {
        this._snackBar.open(result.data, 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      }

    });
  }
  //#endregion


  //#region CONTINUE SESSION LOGIC
  continueSession(data: AdditionalAcctPayload) {
    console.log('from handler', data.currentStep)

    this.stepperIndex.linear = false;

    switch (data.currentStep) {
      case 'ACCOUNT-TYPE':
        this.stepperIndex.selectedIndex = 3;
        break;

      case 'EMPLOYMENT-STATUS':
        this.stepperIndex.selectedIndex = 4;
        break;

      case 'REFEREE-INFORMATION':
        this.stepperIndex.selectedIndex = 5;
        break;

      default:
        break;
    }


    //   setTimeout(() => {
    //     this.stepperIndex.linear = true;
    //  }, 500);
  }
  //#endregion


  get acctNo() { return this.accountFormGroup.controls.accountNoCtrl.value; }
  get debitCardValue() { return this.cardFormGroup.controls.debitCardOption.value }

  goBack() {
  }

  //#region FIRST STEPPER - INITIAL DOCS
  proceedRequiredDocs(stepper: MatStepper) {
    this.isRequiredDocStepperDone = true;
    this.isRequiredDocStepperActive = false;
    stepper.next();
    this.isAccountTypeStepperActive = true;
  }
  //#endregion

  //#region AUTHENTICATE ACCOUNT AND PHONE
  proceedFromAccountForm(stepper: MatStepper) {
    const payload = this.buildAcctValidation();
    this.showSpinner = true;
    this.isAwaitingResponse = true;

    this.additionalAcctService.validateAccountNoAndPhoneNo(payload).subscribe(
      (response) => {

        // Handle Phone number match
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

          // Handle successfull scheme codes
          if (this.acctDetails.accountSchemeCode === 'OD002' || this.acctDetails.accountSchemeCode === 'OD003' ||
            this.acctDetails.accountSchemeCode === 'OD004') {
            this.isCurrentAcct = true;
          }
          if (this.acctDetails.accountSchemeCode === 'KYCL2' || this.acctDetails.accountSchemeCode === 'KYCL1') {
            this.showSpinner = false;
            this.isAwaitingResponse = false;
            this._snackBar.open('This service is only available to account holders with at least a full savings account. \n'
              + ' Upgrade your account to create an additional account. ',
              'Failed', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
            return;
          }

          this._snackBar.open(`Account has been validated for ${this.acctDetails.firstName} ${this.acctDetails.lastName}`, 'Ok',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });

          // Handle next corporate or not
          if (this.acctDetails.accountSegment !== 'PB-PERSONAL BANKING' && this.acctDetails.accountSegment) {
            this.showCorporateAcctTab = true;
            this.isUploadCorporateFormDocActive = true;
          }
          else {
            this.showCorporateAcctTab = false;
            this.isEmploymentStatusStepperActive = true;
          }

          if (this.accountOptionFormGroup.controls.accountTypeCtrl.value === 'Business Account') {
            this.isUploadCorporateFormDocActive = true;
          }

          // Handle null/empty BVN
          if (!response.data.bvn) {
            this.bvnIsValid = false;
            this.bvnIsSet = false;
            this._snackBar.open('Your account does not have BVN. Kindly fill in your BVN details to continue', 'Error',
              { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
            return;
          }

          // Ask for continue session
          this.openSessionDialog();

          // Move to next stepper
          this.isAccountStepperActive = false;
          this.isAccountStepperDone = true;
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
  //#endregion

  // Proceed from BVN Validation
  proceedBVNForm(stepper: MatStepper) {

    if (this.accountOptionFormGroup.controls.accountTypeCtrl.value === 'Business Account') {
      this.isAccountStepperActive = false;
      this.isAccountStepperDone = true;
      this.isUploadCorporateFormDocActive = true;
    }
    else {
      this.isAccountStepperActive = false;
      this.isAccountStepperDone = true;
      this.isEmploymentStatusStepperActive = true;
    }

    stepper.next();

    // Ask for continue session
    this.openSessionDialog();
  }

  // Validate BVN
  onBVNChange() {
    this.showBVNSpinner = true;
    this.isAwaitingResponse = true;

    // TODO Make BVN validation API call
    this.bvnIsSet = true;

    this.bvnUpdateFormGroup.controls.phoneNumber.setValue(this.accountFormGroup.controls.phoneNoCtrl.value);

    this.showBVNSpinner = false;
    this.isAwaitingResponse = false;
    this._snackBar.open('BVN has been successfully validated', 'Ok',
      { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
  }


  buildAcctValidation(): AccountValidation {
    return {
      accountNumber: this.accountFormGroup.controls.accountNoCtrl.value,
      phoneNumber: this.accountFormGroup.controls.phoneNoCtrl.value
    }
  }

  // Handle Account Type
  onSelectAccountType(value) {
    this.showUploadRequiredDocFormForBusinessAccountForPersonalAccount = false;
    this.showUploadRequiredDocFormForBusinessAccount = false;
    if (value === 'Business Account') {
      this.showCorporateAcctTab = true;
      this.showUploadRequiredDocFormForBusinessAccount = true;
      this.showCurrencyOption = true;
      this.showFixedCurrencyOption = false;
    }
    else if (value === 'Personal Account') {
      this.showCorporateAcctTab = false;
      this.showUploadRequiredDocFormForBusinessAccountForPersonalAccount = true;
    }
  }

  //  Handle Account Option
  onSelectAccountOption(value) {
    this.selectedCurrecyOption = value;
    if (value === 'Current Account') {
      this.showCurrencyOption = true;
      this.showFixedCurrencyOption = false;
      console.log(this.showCurrencyOption)
    } else if (value === 'Savings Account') {
      this.showCurrencyOption = false;
      this.showFixedCurrencyOption = true;
    }
  }

  // Handle ID type
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

  // Handle referee bank type
  onRefereeBankType(value: string, ref: string) {
    this.refIsOtherBank = false;

    switch (ref) {
      case 'first':
        if (value === 'Stanbic IBTC Bank') {
          this.firstRefIsStanbic = true;
        }
        else {
          this.refIsOtherBank = true;
          this.firstRefIsStanbic = false;
        }

        break;

      case 'second':
        if (value === 'Stanbic IBTC Bank') {
          this.secondRefIsStanbic = true;
        }
        else {
          this.refIsOtherBank = true;
          this.secondRefIsStanbic = false;
        }

        break;
      default:
        break;
    }
  }

  // Handle employment status
  onSelectEmploymentStatus(value) {
    this.showOccupationAndBusiness = true;
    this.showNatureOfBusiness = true;
    this.showEmployerField = true;
    this.showStudentField = false;

    if (value === 'UNEMPLOYED' || value === 'RETIRED/PENSIONER') {
      this.showOccupationAndBusiness = false;
    }
    else if (value === 'EMPLOYED FULL TIME' || value === 'EMPLOYED PART TIME') {
      this.showNatureOfBusiness = false;
    }
    else if (value === 'SELF-EMPLOYED') {
      this.showEmployerField = false;
    }
    else if (value === 'STUDENT') {
      this.showOccupationAndBusiness = false;
      this.showStudentField = true;
    }
  }

  // Handle occupation type
  onSelectOccupationType(value) {
    this.showOtherOccupation = false;
    if (value === 'OTHERS') {
      this.showOtherOccupation = true;
    }
  }

  // Handle currency type
  onSelectCurrency(value: string) {
    this.selectedCurrency = value;
    console.log(this.accountOptionFormGroup, 'form');
    if (value !== 'NGN') {
      this.showCurrencyConditions = true;
    }
    else {
      this.showCurrencyConditions = false;
    }
  }


  proceedAccountTypeForm(stepper: MatStepper) {
    // this.showSpinner = true;
    // this.isAwaitingResponse = true;

    // Save and Continue
    // this.saveAndContinue(stepper, 'ACCOUNT-TYPE').then(res => {
    //   if (res) {
    //     this.isAccountTypeStepperActive = false;
    //     this.isAccountTypeStepperDone = true;
    //     this.isEmploymentStatusStepperActive = true;
    //   }
    // });

    this.isAccountTypeStepperActive = false;
    this.isAccountTypeStepperDone = true;
    this.isAccountStepperActive = true;

    // if (this.accountOptionFormGroup.controls.accountTypeCtrl.value === 'Business Account') {
    //   this.isAccountTypeStepperActive = false;
    //   this.isAccountTypeStepperDone = true;
    //   this.isUploadCorporateFormDocActive = true;
    // }
    // else {
    //   this.isAccountTypeStepperActive = false;
    //   this.isAccountTypeStepperDone = true;
    //   this.isAccountStepperActive = true;
    // }
    stepper.next();
  }

  proceedEmploymentStatusForm(stepper: MatStepper) {
    this.showSpinner = true;
    this.isAwaitingResponse = true;

    // Save and Continue
    this.saveAndContinue(stepper, 'EMPLOYMENT-STATUS').then(res => {
      if (res) {
        this.isEmploymentStatusStepperActive = false;
        this.isEmploymentStatusStepperDone = true;
        this.isRefereeInformationStepperActive = true;
      }
    });
  }

  proceedRefereeInformationForm(stepper: MatStepper) {
    this.showSpinner = true;
    this.isAwaitingResponse = true;

    // Save and Continue
    this.saveAndContinue(stepper, 'REFEREE-INFORMATION').then(res => {
      if (res) {
        this.isRefereeInformationStepperActive = false;
        this.isRefereeInformationStepperDone = true;
        this.isUploadSignatureFormActive = true;
      }
    });

  }

  onSelectDebitCardOption(value) {
    if (value === 'Yes') {
      this.wantsDebitCard = true;
    }
    else {
      this.wantsDebitCard = false;
    }
  }

  //#region  Do Save and Continue
  saveAndContinue(stepper: MatStepper, currentStep: string) {
    const payload = this.buildAdditionalAcctPayload(this.caseId, currentStep);
    console.log(payload);
    const initialCaseId = this.caseId;
    return new Promise<boolean>((resolve, reject) => {
      this.additionalAcctService.saveAndContinue(payload).subscribe(res => {
        console.log(res);
        this.showSpinner = false;
        this.isAwaitingResponse = false;
        if (res.responseCode == '00') {

          if (initialCaseId === undefined) {
            this._snackBar.open(`Additional account opening progress saved successfully. \nYour Case ID for this current session is ${res.data.detail}. Kindly copy it out to keep track of your progress`, 'Ok',
              { verticalPosition: 'top', horizontalPosition: 'center', duration: 15000, panelClass: ['success-snackbar'] });
          }
          else {
            this._snackBar.open('Additional account opening progress saved successfully', 'Ok',
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
  //#endregion

  onSelectDebitCard(value) {
    if (value === 'Yes') {
      this.showUploadSignatureForm = false;
      this.showSpinner = true;
      this.fetchInterswitchURL();
    } else {
      this.showUploadSignatureForm = true;
    }
  }

  removeSelectedFile(document: string) {
    if (document === 'DirectorsID') {
      this.bvnDirectorsFileName = '';
      return;
    }
    if (document === 'SignatoriesID') {
      this.directorsIDFileName = '';
      return;
    }
    if (document === 'IntroLetter') {
      this.IntroLetterFileName = '';
      return;
    }
    if (document === 'Signature') {
      this.selectedSignaturefile = '';
      this.uploadSignatureForm.value.fileInputCtrl = '';
      this.signatureToBase64 = '';
    }
    if (document === 'Reference Form') {
      this.fileResult = '';
      this.uploadSignatureFormWithExistingSavings.controls.fileInputCtrl.setValue('');

    }
    if (document === 'Identification Card') {
      this.meansOfIdentification = '';
      this.supportingDocModel.meansOfIdentification = '';
      this.uploadSignatureFormWithExistingSavings.controls.identificationCard.setValue('');
    }
  }

  onFileSelected(event) {
    this.fileResult = event.target.files[0].name;
    if (this.fileResult) {
      this.showRadioButton = true;
    }
  }

  proceedFromRadioGroupForm() {
    this.isAuthenticationFormDone = true;
    this.isAuthenticationFormActive = false;
    this.isUploadSignatureFormActive = true;
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
    this.uploadSignatureForm.value.fileInputCtrl = this.fileResult;
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

  onFormControlClicked(event: any) {
    const element = event.target as HTMLInputElement;
    element.value = '';
  }

  onFormControlChanged(evt, document: string) {
    this._fileError = '';
    const element = evt.target as HTMLInputElement;
    if (!evt.target.files || evt.target.files.length < 1) {
      this.bvnDirectorsFileName = document === 'DirectorsID' ? '' : this.bvnDirectorsFileName;
      this.IntroLetterFileName = document === 'IntroLetter' ? '' : this.IntroLetterFileName;
      this.fileResult = document === 'Reference Form' ? '' : this.fileResult;
      this.directorsIDFileName = document === 'SignatoriesID' ? '' : this.directorsIDFileName;
      this.meansOfIdentification = document === 'Identification Card' ? '' : this.meansOfIdentification;

      this._fileError = document === 'DirectorsID' ? 'No file selected. Please select a valid pdf/jpeg file to upload' : '';
      this.introLetterError = document === 'IntroLetter' ? 'No file selected. Please select a valid pdf/jpeg file to upload' : '';
      this.referenceFormError = document === 'Reference Form' ? 'No file selected. Please select a valid pdf/jpeg file to upload' : '';
      this.signatureFileError = document === 'SignatoriesID' ? 'No file selected. Please select a valid pdf/jpeg file to upload' : '';
      this.meansOfIdentification = document === 'Identification Card' ? 'No file selected. Please select a valid pdf/jpeg file to upload' : '';

      const error = 'No file selected. Please select a valid pdf/jpeg file to upload';
      this._snackBar.open(error, 'Ok', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      element.value = '';
      return;
    }
    if (evt.target.files.length > 1) {
      this.bvnDirectorsFileName = document === 'DirectorsID' ? '' : this.bvnDirectorsFileName;
      this.IntroLetterFileName = document === 'IntroLetter' ? '' : this.IntroLetterFileName;
      this.fileResult = document === 'Reference Form' ? '' : this.fileResult;
      this.directorsIDFileName = document === 'SignatoriesID' ? '' : this.directorsIDFileName;
      this.meansOfIdentification = document === 'Identification Card' ? '' : '';

      this._fileError = document === 'DirectorsID' ? 'Multiple file upload is not supported. please select a single file and retry' : this._fileError;
      this.introLetterError = document === 'IntroLetter' ? 'Multiple file upload is not supported. please select a single file and retry' : this.introLetterError;
      this.referenceFormError = document === 'Reference Form' ? 'Multiple file upload is not supported. please select a single file and retry' : this.referenceFormError;
      this.signatureFileError = document === 'SignatoriesID' ? 'Multiple file upload is not supported. please select a single file and retry' : this.signatureFileError;
      this.meansOfIdentificationError = document === 'Identification Card' ? 'Multiple file upload is not supported. please select a single file and retry' : this.signatureFileError;

      const error = 'Multiple file upload is not supported. please select a single file and retry';
      this._snackBar.open(error, 'Ok', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      element.value = '';
      return;
    }

    const _fileToUpload: File = evt.target.files[0];
    if (_fileToUpload.size / (1000 * 1024) > 2) {
      const error = 'Size limit for the file is 2 MB';

      this.bvnDirectorsFileName = document === 'DirectorsID' ? '' : this.bvnDirectorsFileName;
      this.IntroLetterFileName = document === 'IntroLetter' ? '' : this.IntroLetterFileName;
      this.fileResult = document === 'Reference Form' ? '' : this.fileResult;
      this.directorsIDFileName = document === 'SignatoriesID' ? '' : this.directorsIDFileName;

      this._fileError = document === 'DirectorsID' ? error : this._fileError;
      this.introLetterError = document === 'IntroLetter' ? error : this.introLetterError;
      this.referenceFormError = document === 'Reference Form' ? error : this.referenceFormError;
      this.signatureFileError = document === 'SignatoriesID' ? error : this.signatureFileError;
      this.meansOfIdentificationError = document === 'Identification Card' ? error : this.meansOfIdentificationError;

      this._snackBar.open(error, 'Failed', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      element.value = '';
      return;
    }
    this._selectedFileToUpload = _fileToUpload;
    const fileTypeError = this.validateFileType(this._selectedFileToUpload);
    if (fileTypeError) {
      this._fileError = fileTypeError;
      this._snackBar.open(fileTypeError, 'Failed', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      element.value = '';
      return;
    }

    if (document === 'Identification Card') {
      this.meansOfIdentificationError = '';
      console.log(this.uploadSignatureFormWithExistingSavings);
      this.meansOfIdentification = evt.target.value.substring(12);
      this.uploadSignatureFormWithExistingSavings.controls.identificationCard.setValue(this.meansOfIdentification);

      this._snackBar.open('Means of Identification has been uploaded successfully', 'OK', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });

    }
    if (document === 'DirectorsID') {
      this._fileError = '';
      this.bvnDirectorsFileName = evt.target.value.substring(12);
      this.DocumentsFormGroup.controls.DirectorsID.setValue(this.bvnDirectorsFileName);
      this._snackBar.open('Directors BVN has been uploaded successfully', 'OK', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });

    }

    if (document === 'IntroLetter') {
      this.introLetterError = ''
      this.IntroLetterFileName = evt.target.value.substring(12);
      this.DocumentsFormGroup.controls.IntroLetter.setValue(this.IntroLetterFileName);
      this._snackBar.open('Instruction Letter has been uploaded successfully', 'OK', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });

    }
    if (document === 'SignatoriesID') {
      this.signatureFileError = '';
      this.directorsIDFileName = evt.target.value.substring(12);
      this.signatoriesIDFileNames.push(this.directorsIDFileName);
      this.DocumentsFormGroup.controls.SignatoriesID.setValue(this.directorsIDFileName);
      this._snackBar.open('Signatories ID has been uploaded successfully', 'OK', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
    }

    if (document === 'Reference Form') {
      this.referenceFormError = ''
      this.fileResult = evt.target.value.substring(12);
      this.uploadSignatureFormWithExistingSavings.controls.fileInputCtrl.setValue(this.fileResult);

      this._snackBar.open('Reference Form has been uploaded successfully', 'OK', { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });

      // this.DocumentsFormGroup.controls.DirectorsID.setValue(this.bvnDirectorsFileName);
    }
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this._selectedFileToUpload);
    fileReader.onload = (e: any) => {
      if (document === 'DirectorsID') {
        this.ConvertDirectorsID();
        return;
      }
      if (document === 'SignatoriesID') {
        this.ConvertSignatoriesID();
        return;
      }
      if (document === 'IntroLetter') {
        this.ConvertIntroLetter();
        return;
      }

      if (document === 'Reference Form') {
        this.ConvertReferenceForm();
        return;
      }

      if (document === 'Identification Card') {
        this.ConvertIdentificationCard();
        return;
      }
    };
    element.value = '';
  }

  //#region VALIDATE ID
  onIdNumberKeyUp() {
    this.showIdSpinner = true;
    this.isAwaitingResponse = true;
    this.idIsValid = false;

    const payload: IdVerificationRequest = {
      idType: this.employmentFormGroup.controls.idTypeCtrl.value,
      idNumber: this.employmentFormGroup.controls.idNumber.value,
      phoneNumber: this.accountFormGroup.controls.phoneNoCtrl.value,
      firstName: '',
      lastName: ''
    }

    this.additionalAcctService.verifyIdCard(payload).subscribe(res => {
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

  //#region GET REFEREE ACCOUNT DETAILS
  onRefereeAccountNumberKeyUp(ref: string) {
    this.showRefSpinner = true;
    this.isAwaitingResponse = true;

    const payload = new AccountEnquiryRequest();

    switch (ref) {
      case 'first':
        payload.accountNumber = this.refereeFormGroup.controls.firstRefereeAccountNumber.value;
        break;

      case 'second':
        payload.accountNumber = this.refereeFormGroup.controls.secondRefereeAccountNumber.value;
        break;

      default:
        break;
    }

    this.additionalAcctService.accountEnquiry(payload).subscribe(res => {
      this.showRefSpinner = false;
      this.isAwaitingResponse = false;

      if (res.responseCode == '00') {
        this._snackBar.open('Referee successfully verified', 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });

        switch (ref) {
          case 'first':
            this.refereeFormGroup.controls.firstRefereeName.setValue(`${res.data.lastName} ${res.data.firstName}`);
            break;

          case 'second':
            this.refereeFormGroup.controls.secondRefereeName.setValue(`${res.data.lastName} ${res.data.firstName}`);
            break;

          default:
            break;
        }
      }
      else {
        this._snackBar.open(res.responseDescription, 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      }
    },
      error => {
        this.showRefSpinner = false;
        this.isAwaitingResponse = false;
        this._snackBar.open('Error occured while verifying referee', 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      })
  }
  //#endregion

  ConvertDirectorsID() {
    try {
      this.ConvertToBase64(this._selectedFileToUpload).then(result => {
        this.supportingDocModel.DirectorsID = this.transformBase64String(result)
      });
    } catch (error) {
      console.log(error)
      this._snackBar.open('Error occured', 'Error', { duration: 5000 }); return;
    }
  }

  ConvertSignatoriesID() {
    try {
      this.ConvertToBase64(this._selectedFileToUpload).then(result => {
        this.supportingDocModel.SignatoriesID.push(this.transformBase64String(result))
      });
    } catch (error) {
      console.log(error);
      this._snackBar.open('Error occured', 'Error', { duration: 5000 }); return;
    }
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

  ConvertReferenceForm() {
    try {
      this.ConvertToBase64(this._selectedFileToUpload).then(result => {
        this.supportingDocModel.referenceForm = this.transformBase64String(result)
      });
    } catch (error) {
      console.log(error);
      this._snackBar.open('Error occured', 'Error', { duration: 5000 }); return;
    }
  }

  ConvertIdentificationCard() {
    try {
      this.ConvertToBase64(this._selectedFileToUpload).then(result => {
        this.supportingDocModel.meansOfIdentification = this.transformBase64String(result);
      });
    } catch (error) {
      console.log(error);
      this._snackBar.open('Error occured', 'Error', { duration: 5000 }); return;
    }
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

  onSubmitDocumentsFormGroup(stepper: MatStepper) {
    this.isAwaitingResponse = true;
    this.isAuthenticationFormActive = true;
    const documents: UploadedDocument = {
      title: 'BVN Directors File',
      name: this.bvnDirectorsFileName,
      base64Content: this.supportingDocModel.DirectorsID
    };
    this.documents.push(documents);


    // ========== MULTIPLE SIGNATORIES ===========

    for (var i = 0; i < this.supportingDocModel.SignatoriesID.length; i++) {
      const signatoryDocuments: UploadedDocument = {
        title: 'ID\'s of Directors File',
        name: this.signatoriesIDFileNames[i],
        base64Content: this.supportingDocModel.SignatoriesID[i]
      };
      this.documents.push(signatoryDocuments);
    }
    // this.supportingDocModel.SignatoriesID.forEach(element => {
    //   const signatoryDocuments: UploadedDocument = {
    //     title: 'ID\'s of Directors File',
    //     name: this.directorsIDFileName,
    //     base64Content: element
    //   };
    //   this.documents.push(signatoryDocuments);
    // });

    // const signatoryDocuments: UploadedDocument = {
    //   title: 'ID\'s of Directors File',
    //   name: this.directorsIDFileName,
    //   base64Content: this.supportingDocModel.SignatoriesID[0]
    // };

    // this.documents.push(signatoryDocuments);

    const intstructionLetterDocuments: UploadedDocument = {
      title: 'Instruction Letter',
      name: this.IntroLetterFileName,
      base64Content: this.supportingDocModel.IntroLetter
    };
    this.documents.push(intstructionLetterDocuments);
    this.initiateCorporateAcctOTP(stepper);
    console.log(this.documents, 'documents');
  }

  initiateCorporateAcctOTP(stepper) {
    this.showSpinner = true;
    const payload = this.buildOTPPayload();
    this.additionalAcctService.initiateOTP(payload).subscribe(
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

  populateDocumentWithSignature() {
    const signatureFile: UploadedDocument = {
      title: 'Signature',
      name: this.selectedSignaturefile,
      base64Content: this.signatureToBase64
    };
    this.documents.push(signatureFile);
    console.log(this.documents, 'documents');
  }

  onClickAgree(completed: boolean): void {
    this.iAgree = completed;
  }

  initiateOTP(stepper) {
    this.populateDocumentWithSignature()
    this.showSpinner = true;
    const payload = this.buildOTPPayload();
    this.additionalAcctService.initiateOTP(payload).subscribe(
      (response) => {
        if (response.responseCode === '00') {
          stepper.next();
          this.showSpinner = false;
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

  resendOTP() {
    this.populateDocumentWithSignature()
    this.showSpinner = true;
    const payload = this.buildOTPPayload();
    this.additionalAcctService.initiateOTP(payload).subscribe(
      (response) => {
        if (response.responseCode === '00') {
          this.showSpinner = false;
          this.otpReference = response.responseDescription;
          this._snackBar.open(`OTP has been sent to ${this.acctDetails.maskedPhoneNumber}`, 'Ok',
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

  buildOTPPayload(): OTPPayload {
    return {
      cifId: this.acctDetails.cifId,
      userId: this.accountFormGroup.controls.accountNoCtrl.value,
      reasonCode: '20',
      reasonDescription: 'INITIATE OTP ADDITIONAL ACCOUNT'
    };
  }

  buildAdditionalAcctPayload(caseId: string, currentStep: string, submitted: boolean = false): AdditionalAcctPayload {
    return {
      accountName: this.showCorporateAcctTab ? this.acctDetails.lastName : `${this.acctDetails.firstName} ${this.acctDetails.lastName}`,
      authType: this.showCorporateAcctTab ? 'signature' : this.cardFormGroup.controls.debitCardOption.value === 'No'
        && this.showCorporateAcctTab === false ? 'signature' : this.cardFormGroup.controls.debitCardOption.value === 'Yes'
          ? 'debit-card' : '',
      currency: this.selectedCurrency,
      existingAccount: this.accountFormGroup.controls.accountNoCtrl.value,
      existingAccountType: this.acctDetails.accountSegment,
      documents: this.documents,
      extraAccountClass: this.acctDetails.accountSegment === 'PB-PERSONAL BANKING' ? 'Personal' : 'Business',
      newAccountType: this.accountOptionFormGroup.controls.optTypeCtrl.value === 'Current Account'
        || this.showCorporateAcctTab ? 'Current' : 'Savings',
      otp: this.otpForm.controls.otpControl.value,
      otpReasonCode: '20',
      otpIdentifier: this.accountFormGroup.controls.accountNoCtrl.value,
      otpSourceReference: this.otpReference,
      phoneNumber: this.accountFormGroup.controls.phoneNoCtrl.value,
      requestedDebitCard: this.refereeFormGroup.controls.requestedDebitCard.value ? this.refereeFormGroup.controls.requestedDebitCard.value : false,
      preferredNameOnDebitCard: this.refereeFormGroup.controls.preferredNameOnCard.value,
      pickUpBranchForDebitCard: this.refereeFormGroup.controls.pickupBranch.value,
      firstRefereeName: this.refereeFormGroup.controls.firstRefereeName.value,
      firstRefereeBank: this.refereeFormGroup.controls.firstRefereeBank.value,
      firstRefereeAccountNumber: this.refereeFormGroup.controls.firstRefereeAccountNumber.value,
      secondRefereeName: this.refereeFormGroup.controls.secondRefereeName.value,
      secondRefereeBank: this.refereeFormGroup.controls.secondRefereeBank.value,
      secondRefereeAccountNumber: this.refereeFormGroup.controls.secondRefereeAccountNumber.value,
      employmentStatus: this.employmentFormGroup.controls.employmentStatus.value ? this.employmentFormGroup.controls.employmentStatus.value : null,
      occupation: this.employmentFormGroup.controls.occupation.value ? this.employmentFormGroup.controls.occupation.value : null,
      natureOfBusiness: this.employmentFormGroup.controls.natureOfBusiness.value ? this.employmentFormGroup.controls.natureOfBusiness.value : null,
      incomeRange: this.employmentFormGroup.controls.incomeRange.value ? this.employmentFormGroup.controls.incomeRange.value : null,
      nameOfEmployer: this.employmentFormGroup.controls.nameOfEmployer.value ? this.employmentFormGroup.controls.nameOfEmployer.value : null,
      levelOfEducation: this.employmentFormGroup.controls.levelOfEducation.value ? this.employmentFormGroup.controls.levelOfEducation.value : null,
      nameOfInstitution: this.employmentFormGroup.controls.nameOfInstitution.value ? this.employmentFormGroup.controls.nameOfInstitution.value : null,
      idType: this.employmentFormGroup.controls.idTypeCtrl.value ? this.employmentFormGroup.controls.idTypeCtrl.value : null,
      idNumber: this.employmentFormGroup.controls.idNumber.value ? this.employmentFormGroup.controls.idNumber.value : null,
      caseId: caseId,
      currentStep: currentStep,
      submitted: submitted
    };
  }


  submitRequest(stepper: MatStepper) {
    const payload = this.buildAdditionalAcctPayload('', '', true);
    this.showSpinner = true;
    this.isAwaitingResponse = true;
    this.additionalAcctService.submitRequest(payload).subscribe(
      (response) => {
        this.showSpinner = false;
        this.isAwaitingResponse = false;
        console.log(response);
        if (response.responseCode === '00') {
          if (this.showCorporateAcctTab) {
            this.isUploadCorporateFormDocActive = false;
            this.isUploadCorporateFormDone = true;
          } else {
            this.isUploadSignatureFormActive = false;
            this.isUploadSignatureFormDone = true;
          }
          this.ticketID = response.data.detail;
          this._snackBar.open('Additional Account has been created successfully', 'Ok',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
          stepper.next();
        } else {
          this._snackBar.open(response.responseDescription, 'Ok',
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
        }
      },
      (err) => {
        this.showSpinner = false
        console.log(err);
        this._snackBar.open('Error occured', 'Ok',
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000 });
      });

  }

  populateDocumentWithReference() {
    if (!this.isCurrentAcct) {
      const reference: UploadedDocument = {
        title: 'Reference Form',
        name: this.fileResult,
        base64Content: this.supportingDocModel.referenceForm
      };
      this.documents.push(reference);

      const ID: UploadedDocument = {
        title: 'Means of Identification',
        name: this.meansOfIdentification,
        base64Content: this.supportingDocModel.meansOfIdentification
      };
      this.documents.push(ID);
    } else {
      const ID: UploadedDocument = {
        title: 'Means of Identification',
        name: this.meansOfIdentification,
        base64Content: this.supportingDocModel.meansOfIdentification
      };
      this.documents.push(ID);
    }
    console.log(this.documents, 'documents');
  }

  populateDocWithSignatureSavings(stepper: MatStepper) {
    const ID: UploadedDocument = {
      title: 'Means of Identification',
      name: this.meansOfIdentification,
      base64Content: this.supportingDocModel.meansOfIdentification
    };
    this.documents.push(ID);
    this.ngZone.run(() => {
      this.stepperIndex.selected.completed = true;
      this.stepperIndex.selected.editable = true;
      // this.isCompleted = true;
      // this.stepperIndex.next();
    });
    stepper.next();
  }

  proceedFromUploadReferenceForm(stepper: MatStepper) {
    this.populateDocumentWithReference();
    this.saveAndContinue(stepper, 'UPLOAD-DOCUMENTS')
  }

  _window(): any {
    // return the global native browser window object
    return window;
  }

  fetchInterswitchURL() {
    const payload = {
      accountNumber: this.acctNo
    };
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

              self.submitRequest(self.stepperIndex);
              return;
              // send te user to the next process
              //
            } if (data.responseDescription === 'Customer cancelation') {
              self._snackBar.open('Card validation cancelled', 'OK',
                { verticalPosition: 'top', horizontalPosition: 'center', duration: 5000, panelClass: ['errorSnackbar'] });
              self.dialog.closeAll();
              return;

            } else {
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
          this._snackBar.open('A problem has occured', null, { verticalPosition: 'top', horizontalPosition: 'right', duration: 2500 });
        });
  }
}