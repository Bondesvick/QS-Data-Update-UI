import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from './appconfig.service';
import { GenericApiResponse, ApiResponse } from '../models/payloads/generic-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdditionalAccountService {
  apiBaseUrl: string;
  headers: HttpHeaders;

  // constructor(private httpClient: HttpClient, settings: AppConfigService, ) {
  constructor(private httpClient: HttpClient) {
    // this.apiBaseUrl = settings.AdditionalAccountUrl;
    this.apiBaseUrl = 'settings.AdditionalAccountUrl';
    this.headers = new HttpHeaders({ 'X-Stack-Eb': 'djjddd8991B2c3D4e5F6g7H8' });
  }

  validateAccountNoAndPhoneNo(payload): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(`${this.apiBaseUrl}/CustomerAccount/accountDetails`, payload, { headers: this.headers });
  }

  initiateOTP(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerRequest/accountOpening/inititiateOtp`, payload, { headers: this.headers });
  }

  submitRequest(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerRequest/accountOpening/submitRequest`, payload, { headers: this.headers });
  }

  saveAndContinue(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerRequest/accountOpening/saveAndContinue`, payload, { headers: this.headers });
  }

  continueSession(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerRequest/accountOpening/verifyCaseId`, payload, { headers: this.headers });
  }

  verifyIdCard(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerAccount/validateIdCard`, payload, { headers: this.headers });
  }

  accountEnquiry(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerAccount/accountEnquiry`, payload, { headers: this.headers });
  }
}
