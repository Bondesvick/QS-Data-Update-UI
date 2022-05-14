import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiURLConstants } from '../../helper/apiURLConstants';
import { AppConfigService } from './appconfig.service';
import { GenericApiResponse } from '../models/payloads/generic-response';
import { ValidateAcctandPhoneRequestPayload, ValidateAcctandPhoneResponse, GetMerchantsResponse } from '../models/payloads/merchant-onboarding';


@Injectable()
export class TransferLimitRequestService {
    private _apiBaseUrl: string;
    headers: HttpHeaders;

    constructor(_settings: AppConfigService, private _httpClient: HttpClient) {
        this._apiBaseUrl = _settings.TransferLimitRequestUrl;
        this.headers = new HttpHeaders({ 'X-Stack-Eb': 'djjddd8991B2c3D4e5F6g7H8' });
    }

    validateAccountandPhoneNum(payload: ValidateAcctandPhoneRequestPayload): Observable<any> {
        return this._httpClient.post<any>(
            `${this._apiBaseUrl}/request-initiation/validate-customer`, payload);
    }

    sendOTPToCustomer(payload): Observable<GenericApiResponse> {
        return this._httpClient.post<GenericApiResponse>(`${this._apiBaseUrl}/request-initiation/send-otp`, payload);
    }

    validateOTP(payload): Observable<GenericApiResponse> {
        return this._httpClient.post<GenericApiResponse>(`${this._apiBaseUrl}/request-initiation/validate-otp`, payload);
    }

    submitRequest(payload): Observable<GenericApiResponse> {
        return this._httpClient.post<GenericApiResponse>(`${this._apiBaseUrl}/request-initiation/submit-request`, payload);
    }
}