import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiURLConstants } from '../../helper/apiURLConstants';
import { AppConfigService } from './appconfig.service';
import { GenericApiResponse, ApiResponse } from '../models/payloads/generic-response';
import { ValidateAcctandPhoneRequestPayload, ValidateAcctandPhoneResponse } from '../models/payloads/merchant-onboarding';
 

@Injectable()
export class FailedTransactionService {
    private _apiBaseUrl: string;
    headers: HttpHeaders;

    constructor(_settings: AppConfigService, private _httpClient: HttpClient) {
        this._apiBaseUrl = _settings.FailedTransactionsURL;
        this.headers = new HttpHeaders({ 'X-Stack-Eb': 'djjddd8991B2c3D4e5F6g7H8' });
    }

    validateAccountandPhoneNum(payload: ValidateAcctandPhoneRequestPayload): Observable<ValidateAcctandPhoneResponse> {
        return this._httpClient.post<ValidateAcctandPhoneResponse>(
            `${this._apiBaseUrl}/${ApiURLConstants.ValidateCustomer}`, payload);
    }

    transactionTypes(): Observable<GenericApiResponse> {
        return this._httpClient.post<GenericApiResponse>(
            `${this._apiBaseUrl}/${ApiURLConstants.TransactionTypes}`, "");
    }
    sendOTPToCustomer(payload): Observable<GenericApiResponse> {
        return this._httpClient.post<GenericApiResponse>(`${this._apiBaseUrl}/${ApiURLConstants.SendOtp}`, payload);
    }

    loadBankList(): Observable<GenericApiResponse> {
        return this._httpClient.post<GenericApiResponse>(`${this._apiBaseUrl}/${ApiURLConstants.LoadBankList}`,{});
    }

    logFailedTransactionRequest(payload): Observable<GenericApiResponse> {
        return this._httpClient.post<GenericApiResponse>(`${this._apiBaseUrl}/${ApiURLConstants.LogRequest}`, payload);
    }

}