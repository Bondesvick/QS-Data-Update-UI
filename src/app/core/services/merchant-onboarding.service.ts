import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiURLConstants } from '../../helper/apiURLConstants';
import { AppConfigService } from './appconfig.service';
import { GenericApiResponse } from '../models/payloads/generic-response';
import {  ValidateAcctandPhoneRequestPayload, ValidateAcctandPhoneResponse, GetMerchantsResponse } from '../models/payloads/merchant-onboarding';


@Injectable()
export class MerchantOnboardingService {
    private _apiBaseUrl: string;
    headers: HttpHeaders;

    constructor(_settings: AppConfigService, private _httpClient: HttpClient) {
        this._apiBaseUrl = _settings.MerchantOnboardingUrl;
        this.headers = new HttpHeaders({ 'X-Stack-Eb': 'djjddd8991B2c3D4e5F6g7H8' });
    }

    validateAccountandPhoneNum(payload: ValidateAcctandPhoneRequestPayload): Observable<ValidateAcctandPhoneResponse> {
        return this._httpClient.post<ValidateAcctandPhoneResponse>(
            `${this._apiBaseUrl}/${ApiURLConstants.ValidateCustomer}`, payload,{ headers: this.headers });
    }

    getMerchants():Observable<GetMerchantsResponse>{
        return this._httpClient.post<GetMerchantsResponse>(
            `${this._apiBaseUrl}/${ApiURLConstants.MerchantTypes}`,"",{ headers: this.headers });
    }
    sendOTPToCustomer(payload): Observable<GenericApiResponse> {
        return this._httpClient.post<GenericApiResponse>(`${this._apiBaseUrl}/${ApiURLConstants.SendOtp}`, payload,{ headers: this.headers });
      }

    onboardMerchant(payload): Observable<GenericApiResponse> {
        return this._httpClient.post<GenericApiResponse>(`${this._apiBaseUrl}/${ApiURLConstants.OnboardMerchant}`, payload,{ headers: this.headers });
      }
 
}