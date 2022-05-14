
export interface ValidateAcctandPhoneRequestPayload {
    accountNo: string;
    phoneNo: string;
}

export interface ValidateAcctandPhoneResponse{
    ResponseCode: string;
    ResponseDescription: string;
    Data: Data;
}
export interface GetMerchantsResponse{
    ResponseCode: string;
    ResponseDescription: string;
    Data: string[];
}
export interface Data{
    FirstName: string;
    Lastname: string;
    PhoneNumber1: string;
    PhoneNumber2: string;
    CIF: string;
    SourceRef: string;
}

export interface OnboardMerchantRequestPayload{
accountNumber: string;
cif: string;
sourceRef: string;
otp: string;
otpReference: string;
merchantTypes: string[];
customerName: string;
address: string;
email: string;
telephone: string;
signatoryBVN: string;
eodNotificationTypeList: string[];
customizeReport: string;
nameOfPrimaryContact: string;
designationOfPrimaryContact: string;
emailOfPrimaryContact: string;
mobileNoOfPrimaryContact: string;
officeNoOfPrimaryContact: string;
companyRegistrationNumber: string;
settlementAccountNumber: string;
merchantID: string;
numberOfSalesOutlet: number;
mposNumberOfHardwareDevice: number;
posNumberOfHardwareDevice: number;
enableDeviceForInternaltionaCardAcceptance: string;
enableDeviceForInternaltionaCardAcceptanceReason: string;
posSettlementType: string;
integrateDeviceWithThirdPartyApp: string;
integrateDeviceWithThirdPartyAppDoc: string;
integrateDeviceWithThirdPartyAppDocExt:string;
nameOfSecondaryContact: string;
designationOfSecondaryContact: string;
emailOfSecondaryContact: string;
mobileNoOfSecondaryContact: string;
officNoOfSecondaryContact: string;
nameOfWebDev: string;
designationOfWebDev: string;
emailOfWebDev: string;
mobileOfWebDev: string;
officeNoOfWebDev: string;
typeOfOwnership: string;
merchantName: string;
collectionAccountNo: string;
collectionAccountName: string;
collectionAccountType: string;
enableWebForInternaltionaCardAcceptance: string;
enableWebForInternaltionaCardAcceptanceReason: string;
primeSettlementType: string;
aggreWebInfo: string;
aggreProductDesc: string;
expectedMonthlyTurnover: number;
additionalInfo: string;
posLetterOfInternationalAcquiringService: string;
primeLetterOfInternationalAcquiringService: string;
letterOfSignedConsent: string;
posLetterOfInternationalAcquiringServiceExt: string;
primeLetterOfInternationalAcquiringServiceExt: string;
letterOfSignedConsentExt: string
}

