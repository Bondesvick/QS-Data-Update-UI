export class LoanProducts {
  ProductCategory: string;
  ProductName: string;
  DocumentName: string;
  IsRequired: boolean;
  DocumentCode: string;
  Note: string;
}
export class LoanRequestPayload {
  accountName:string;
  loanAmount: number;
  loanTenure: number;
  accountNumber: string;
  repaymentAccountNumber: string;
  repaymentDay: number;
  plpp: string;
  signature: string;
  signatureExt: string;
  accountSegment: string;
  authType: string;
  sourceRef: string;
  productName: string;
  documentList: LoanDocumentList[];
}

export class LoanDocumentList {
  documentName: string;
  documentCode: string;
  content: string;
  extension: string;
}