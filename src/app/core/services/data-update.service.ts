import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/payloads/generic-response';
import { AppConfigService } from './appconfig.service';

@Injectable({
  providedIn: 'root'
})

export class DataUpdateService {

  apiBaseUrl: string;
  headers: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    //this.apiBaseUrl = 'https://sibtc-azure-external-api.stanbicibtc-devase.p.azurewebsites.net/qs-additional-acct/api';

    //this.apiBaseUrl = 'https://ibrcollectuatv.ng.sbicdirectory.com:5442/quickservices/debit-card/API/api';
    //this.apiBaseUrl = "https://ienroll.stanbicibtc.com:3443/DataUpdate";
    this.apiBaseUrl = environment.dataUpdateBaseUrl; //'https://sibtc-azure-external-api.stanbicibtc-devase.p.azurewebsites.net/qs-data-update/api';
    this.headers = new HttpHeaders({ 'X-Stack-Eb': 'djjddd8991B2c3D4e5F6g7H8' });
  }

  validateAccountNoAndPhoneNo(payload): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(`${this.apiBaseUrl}/CustomerAccount/accountDetails`, payload, { headers: this.headers });
  }

  initiateOTP(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerRequest/dataUpdate/inititiateOtp`, payload, { headers: this.headers });
  }

  submitRequest(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerRequest/dataUpdate/submitRequest`, payload, { headers: this.headers });
  }

  saveAndContinue(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerRequest/dataUpdate/saveAndContinue`, payload, { headers: this.headers });
  }

  continueSession(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerRequest/dataUpdate/verifyCaseId`, payload, { headers: this.headers });
  }

  verifyIdCard(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerAccount/validateIdCard`, payload, { headers: this.headers });
  }

  verifyTinNumber(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerAccount/tinDetails`, payload, { headers: this.headers });
  }
  accountEnquiry(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerAccount/accountEnquiry`, payload, { headers: this.headers });
  }

  validateBvn(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiBaseUrl}/CustomerAccount/validateBVN`, payload, { headers: this.headers });
  }

  getCityState(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/CustomerAccount/getCityState`, { headers: this.headers });
  }
}
