import { GenericApiResponse } from './generic-response'

export interface ValidateAcctandPhoneRequestPayload {
    accountNumber: string;
    phoneNumber: string;
}

export interface ValidateAcctandPhoneResponse{
    responseCode: string;
    responseDescription: string;
    data: Data;
}

export interface Data{
    bvn: string;
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string;
    phoneNumber: string;
    address: string;
    cifId: string;
    gender: string;
    enrollmentBank: string;
    enrollmentBranch: string;
    accountOpened: boolean;
    pinSet: string;
    pinActive: string;
    maskedPhoneNumber: string;
    accountSegment: string
}


export interface UploadDocumentRequestPayload {
 instruction:string;
 instructionExt:string;
 accountNumber: string;
 phoneNumber:string;
}

export interface UploadDocumentResponsePayload {
    responseCode: string;
    responseDescription: string;
    data: string;
   }