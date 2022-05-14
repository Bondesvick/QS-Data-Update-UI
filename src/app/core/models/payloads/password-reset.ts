export class PasswordResetRequest {
    accountNumber: string;
    authType: string;
    otp: string;
    otpReference: string;
    signature: string;
    signatureExt: string;
}