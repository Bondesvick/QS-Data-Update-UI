import { Injectable } from '@angular/core';
import { AppConfigService } from './appconfig.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBOnboardingResponse } from '../models/payloads/otp-response';
import { IBOnboardingGenericResponse, GenericApiResponse } from '../models/payloads/generic-response';

@Injectable({
    providedIn: 'root'
})
export class AccountReactivationService {
    apiBaseUrl: string;
    headers: HttpHeaders;

    constructor(settings: AppConfigService, private httpClient: HttpClient) {
        this.apiBaseUrl = settings.AccountReactivationUrl;
        this.headers = new HttpHeaders({ 'X-Stack-Eb': 'xvbTHDUUJILMxsqwoppdjjxZSxQpvk' });

    }
    validateAccountNoAndPhoneNo(payload): any {

        return this.httpClient.post(`${this.apiBaseUrl}/api/request-manager/ValidateAccountNoAndPhone`, payload, 
        );
    }
    sendOTPToCustomer(payload): Observable<GenericApiResponse> {
        return this.httpClient.post<GenericApiResponse>(`${this.apiBaseUrl}/api/request-manager/SendOTP`,
            payload);
    }
    validateOTP(payload): any {
        return this.httpClient.post(`${this.apiBaseUrl}/api/request-manager/ValidateOTP`, payload);
    }
    loadBankPickUpBranches():Observable<GenericApiResponse>{
        return this.httpClient.post<GenericApiResponse>(`${this.apiBaseUrl}/api/request-manager/bank-branches`,{})
    }
    initiateRequest(payload): Observable<GenericApiResponse> {
        return this.httpClient.post<GenericApiResponse>(`${this.apiBaseUrl}/api/request-manager/InitiateRequest`,
            payload);
    }
    
    validateBVN(payload): Observable<GenericApiResponse> {
        return this.httpClient.post<GenericApiResponse>(`${this.apiBaseUrl}/api/request-manager/validate-bvn`,
            payload);
    }
}
