import { Injectable } from '@angular/core';
import { AppConfigService } from './appconfig.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBOnboardingResponse } from '../models/payloads/otp-response';
import { IBOnboardingGenericResponse } from '../models/payloads/generic-response';

@Injectable({
  providedIn: 'root'
})
export class InternetOnboardingService {
  apiBaseUrl: string;
  headers: HttpHeaders;

  constructor(settings: AppConfigService, private httpClient: HttpClient) {
    this.apiBaseUrl = settings.InternetBankingOnboardingUrl;
    this.headers = new HttpHeaders({ 'X-Stack-Eb': 'xxsdfHHTRRTE3765lcvxgghQWX' });

  }
  validateAccountNoAndPhoneNo(payload): any {
    return this.httpClient.post(`${this.apiBaseUrl}/RequestInitiation/ValidateAccountNoAndPhone`, payload, { headers: this.headers });
  }
  sendOTPToCustomer(payload): Observable<IBOnboardingResponse> {
    return this.httpClient.post<IBOnboardingResponse>(`${this.apiBaseUrl}/RequestInitiation/SendOTPToCustomer`,
      payload, { headers: this.headers });
  }
  validateOTP(payload): any {
    return this.httpClient.post(`${this.apiBaseUrl}/RequestInitiation/ValidateOTP`, payload, { headers: this.headers });
  }
  initiateRequest(payload): Observable<IBOnboardingGenericResponse> {
    return this.httpClient.post<IBOnboardingGenericResponse>(`${this.apiBaseUrl}/RequestInitiation/InitiateRequest`, payload
      , { headers: this.headers });
  }
}
