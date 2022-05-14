export class ApiURLConstants {
    public static get AuthenticateUser(): string { return 'UserProfileManagement/AuthenticateUser'; }
    public static get ValidateBVN(): string { return 'request-manager/validate-bvn'; }
    public static get ValidateOTP(): string { return 'request-manager/validate-otp'; }

    public static get ValidateCustomer(): string { return 'request-manager/validate-customer'; }
    public static get MerchantTypes(): string { return 'request-manager/merchant-types'; }
    public static get SendOtp(): string { return 'request-manager/send-otp'; }
    public static get OnboardMerchant(): string { return 'request-manager/onboard-merchant'; }
    public static get UploadDocuments(): string { return 'request-manager/account-opening'; }
    public static get ValidateAccountandPhoneNum(): string { return 'sme-onboarding/validateAccountandPhoneNum'; }
    public static get UploadInstruction(): string { return 'sme-onboarding/uploadInstruction'; }

    public static get TransactionTypes(): string { return 'request-manager/transaction-types'; }
    public static get LogRequest(): string { return 'request-manager/log-request'; }
    public static get LoadBankList(): string { return 'request-manager/bank-list'; }

}