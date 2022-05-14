export class AccountUpgradeRequest{
    accountNumber: string;
    accountName: string;
    phoneNumber: string;
    oldScheme: string;
    newScheme: string;
    newAddress: string;
    idType: string;
    idNumber: string;
    idDoc: string;
    idDocExtension: string;
    picDoc: string;
    picDocExtension: string;
    utilityDoc: string;
    utilityDocExtension: string;
    haveDebitCard: string;
    signatureDoc: string;
    signatureDocExtension: string;
  }

  export class IdVerificationRequest {
    idType: string;
    idNumber: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
}

export class AccountEnquiryRequest {
    accountNumber: string;
}

export class BVNValidationRequest {
    firstName: string;
    lastName: string;
    accountNumber: string;
    bvnId: string;
}