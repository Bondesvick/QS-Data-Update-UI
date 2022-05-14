export class AdditionalAcctPayload {
    accountName:string;
    existingAccount: string;
    existingAccountType: string;
    phoneNumber: string;
    newAccountType: string;
    extraAccountClass: string;
    currency: string;
    authType: string;
    documents: UploadedDocument[];
    otpIdentifier: string;
    otpSourceReference:string;
    otp: string;
    otpReasonCode: string;
    preferredNameOnDebitCard: string;
    pickUpBranchForDebitCard: string;
    firstRefereeName: string;
    firstRefereeBank: string;
    firstRefereeAccountNumber: string;
    secondRefereeName: string;
    secondRefereeBank: string;
    secondRefereeAccountNumber: string;
    employmentStatus: string;
    occupation: string;
    natureOfBusiness: string;
    incomeRange: string;
    nameOfEmployer: string;
    levelOfEducation: string;
    nameOfInstitution: string;
    requestedDebitCard: boolean;
    idType: string;
    idNumber: string;
    caseId: string;
    currentStep: string;
    submitted: boolean;
}

export class DataUpdatePayload {
    accountName:string;
    existingAccount: string;
    existingAccountType: string;
    phoneNumber: string;
    authType: string;
    documents: UploadedDocument[];
    otpIdentifier: string;
    otpSourceReference:string;
    otp: string;
    otpReasonCode: string;
    iAcceptTermsAndCondition: boolean;
    bvnId: string;
    dataToUpdate: string[];

    houseNumber: string;
    streetName: string;
    cityTown: string;
    state: string;
    lga: string;
    busStop: string;
    alias: string;
    houseDescription: string;
    newPhoneNumber: string;
    newEmail: string;
    idType: string;
    idNumber: string;
    caseId: string;
    currentStep: string;
    submitted: boolean;
}

export class UploadedDocument {
    title: string;
    name: string;
    base64Content: string;
    documentExt?:string;
}

export class ContinueSession {
    caseId: string;
    accountNumber: string;
}

export class CardRadioOption {
    name: string;
    value: boolean;
}

export class IdVerificationRequest {
    idType: string;
    idNumber: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
}
export class TinVerificationRequest {
    tinNumber: string;
    accountName: string;
}

export class AccountEnquiryRequest {
    accountNumber: string;
}
