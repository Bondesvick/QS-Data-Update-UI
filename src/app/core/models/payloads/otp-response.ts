export class IBOTPResponse {
    otpRefence: string;
    otp: any;
    accountNumber: any;
}
export class IBOnboardingResponse {
    data: IBOTPResponse;
    responseCode: string;
    responseDescription: string;
}