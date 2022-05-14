import { Injectable } from '@angular/core';

@Injectable()
export class AppConfigService {

    static config: any;

    constructor() {
        if (typeof AppConfigService.config == "undefined") {
            AppConfigService.config = this.GetSettings();
        }
    }

    GetSettings() {

        const appSettings = this.loadSettings();

        if (!appSettings) {
            throw new Error("AppConfig unable to load");
        }

        return appSettings;
    }

    public get SmeOnboardingUrl(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd == true) {
            return AppConfigService.config.SmeOnboardingUrl.prod;
        }

        return AppConfigService.config.SmeOnboardingUrl.dev;
    }

    public get MerchantOnboardingUrl(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd == true) {
            return AppConfigService.config.MerchantOnboardingUrl.prod;
        }

        return AppConfigService.config.MerchantOnboardingUrl.dev;
    }

    public get TransferLimitRequestUrl(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd == true) {
            return AppConfigService.config.TransferLimitRequestUrl.prod;
        }

        return AppConfigService.config.TransferLimitRequestUrl.dev;
    }

    public get CorporateAccountUrl(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd == true) {
            return AppConfigService.config.CorporateAccountUrl.prod;
        }

        return AppConfigService.config.CorporateAccountUrl.dev;
    }

    public get InternetBankingOnboardingUrl(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd == true) {
            return AppConfigService.config.InternetBankingOnboardingUrl.prod;
        }

        return AppConfigService.config.InternetBankingOnboardingUrl.dev;
    }

    public get AdditionalAccountUrl(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd == true) {
            return AppConfigService.config.AdditionalAccountUrl.prod;
        }

        return AppConfigService.config.AdditionalAccountUrl.dev;
    }

    public get DataUpdateUrl(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd == true) {
            return AppConfigService.config.DataUpdateUrl.prod;
        }

        return AppConfigService.config.DataUpdateUrl.dev;
    }

    public get AccountUpgradeUrl(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd == true) {
            return AppConfigService.config.AccountUpgradeUrl.prod;
        }

        return AppConfigService.config.AccountUpgradeUrl.dev;
    }

    public get InterswitchURL(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd === true) {
            return AppConfigService.config.InterswitchURL.prod;
        }

        return AppConfigService.config.InterswitchURL.dev;
    }

    public get BusBankingAmendmentURL(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd === true) {
            return AppConfigService.config.BusBankingAmendmentURL.prod;
        }

        return AppConfigService.config.BusBankingAmendmentURL.dev;
    }

    public get FailedTransactionsURL(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd === true) {
            return AppConfigService.config.FailedTransactionsURL.prod;
        }

        return AppConfigService.config.FailedTransactionsURL.dev;
    }


    public get AccountReactivationUrl(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd === true) {
            return AppConfigService.config.AccountReactivationUrl.prod;
        }

        return AppConfigService.config.AccountReactivationUrl.dev;
    }

    public get LoanInitiationURL(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd === true) {
            return AppConfigService.config.LoanInitiationURL.prod;
        }

        return AppConfigService.config.LoanInitiationURL.dev;
    }

    public get LoanRepaymentURL(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd === true) {
            return AppConfigService.config.LoanRepaymentURL.prod;
        }

        return AppConfigService.config.LoanRepaymentURL.dev;
    }

    public get PasswordResetURL(): string {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.environment.IsProd === true) {
            return AppConfigService.config.PasswordResetURL.prod;
        }

        return AppConfigService.config.PasswordResetURL.dev;
    }
    public get UseMockData(): boolean {
        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }

        if (AppConfigService.config.useMock) {
            return true;
        }

        return false;
    }


    public static get IsProdEnv(): boolean {

        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }
        return AppConfigService.config.environment.IsProd;
    }


    public static get DevModeLoaderInterval(): number {

        if (!AppConfigService.config) {
            throw new Error("AppConfig not loaded.");
        }
        return AppConfigService.config.devModeLoaderInterval;
    }

    loadSettings() {
        return {

            "CorporateAccountUrl": {
                "dev": "https://quickservice-corporateaccountopening-api.stanbicibtc-devase.p.azurewebsites.net/api",
                "prod": "https://10.234.175.80:8443/api"
            },
            "SmeOnboardingUrl": {
                "dev": "https://quickservice-sme-onbaording-api.stanbicibtc-devase.p.azurewebsites.net/api",
                "prod": "https://10.234.175.80:8443/api"
            },
            "MerchantOnboardingUrl": {
                "dev": "https://quickservice-api.stanbicibtc-devase.p.azurewebsites.net/MerchantOnboarding/api",
                "prod": "https://10.234.175.80:8443/api"
            },
            "InternetBankingOnboardingUrl": {
                "dev": "https://quickservice-ib-onboarding-api.stanbicibtc-devase.p.azurewebsites.net/api",
                "prod": "https://10.234.175.80:8443/api"
            },
            "AdditionalAccountUrl": {
                "dev": "https://sibtc-azure-external-api.stanbicibtc-devase.p.azurewebsites.net/qs-additional-acct/api",
                // "dev": "https://localhost:44376/api",
                "prod": "https://10.234.175.80:8443/api"
            },
            "DataUpdateUrl": {
                "dev": "https://sibtc-azure-external-api.stanbicibtc-devase.p.azurewebsites.net/qs-data-update/api",
                // "dev": "https://localhost:44376/api",
                "prod": "https://ienroll.stanbicibtc.com:3443/DataUpdate"
            },
            "AccountUpgradeUrl": {
                "dev": "https://quickservice-api.stanbicibtc-devase.p.azurewebsites.net/AccountUpgrade",
                "prod": "https://10.234.175.80:8443/api"
            },
            "InterswitchURL": {
                "dev": "https://quickservice-api.stanbicibtc-devase.p.azurewebsites.net/Utility/api",
                "prod": "https://ienroll.stanbicibtc.com:3443/UtilityService/api"
            },
            "BusBankingAmendmentURL": {
                "dev": "https://quickservice-api.stanbicibtc-devase.p.azurewebsites.net/BusinessBankingAmendment",
                "prod": "https://10.234.175.80:8443/api"
            },
            "FailedTransactionsURL": {
                "dev": "https://quickservice-api.stanbicibtc-devase.p.azurewebsites.net/FailedTransaction/api",
                "prod": "https://10.234.175.80:8443/api"
            },
            "AccountReactivationUrl": {
                "dev": "https://quickservice-api.stanbicibtc-devase.p.azurewebsites.net/AccountReactivation",
                "prod": "https://10.234.175.80:8443/api"
            },
            "LoanInitiationURL": {
                "dev": "https://quickservice-api.stanbicibtc-devase.p.azurewebsites.net/LoanRequest",
                "prod": "https://10.234.175.80:8443/api"
            },
            "TransferLimitRequestUrl": {
                "dev": "https://quickservice-api.stanbicibtc-devase.p.azurewebsites.net/TransferLimit/api",
                "prod": "https://10.234.175.80:8443/api"
            },
            "PasswordResetURL": {
                "dev": "https://quickservice-api.stanbicibtc-devase.p.azurewebsites.net/passwordreset/api",
                "prod": "https://10.234.175.80:8443/api"
            },
            "LoanRepaymentURL": {
                "dev": "https://quickservice-api.stanbicibtc-devase.p.azurewebsites.net/LoanRepayment/api",
                "prod": "https://10.234.175.80:8443/api"
            },
            "environment": {
                "IsProd":  true
            },
            useMock: false,
            devModeLoaderInterval: 500,
        };
    }
}
