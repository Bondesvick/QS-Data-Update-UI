import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiURLConstants } from '../../helper/apiURLConstants';
import { AppConfigService } from './appconfig.service';
import { GenericApiResponse } from '../models/payloads/generic-response';
import {  ValidateAcctandPhoneRequestPayload, UploadDocumentRequestPayload, ValidateAcctandPhoneResponse, UploadDocumentResponsePayload } from '../models/payloads/sme-onboarding';


@Injectable()
export class SMEOnboardingService {
    private _apiBaseUrl: string;
    headers: HttpHeaders;

    constructor(_settings: AppConfigService, private _httpClient: HttpClient) {
        this._apiBaseUrl = _settings.SmeOnboardingUrl; 
        this.headers = new HttpHeaders({ 'X-Stack-Eb': 'djjddd8991B2c3D4e5F6g7H8' });
    }

    validateAccountandPhoneNum(payload: ValidateAcctandPhoneRequestPayload): Observable<ValidateAcctandPhoneResponse> {
        return this._httpClient.post<ValidateAcctandPhoneResponse>(
            `${this._apiBaseUrl}/${ApiURLConstants.ValidateAccountandPhoneNum}`, payload,{ headers: this.headers });
    }
    uploadInstruction(payload: UploadDocumentRequestPayload): Promise<UploadDocumentResponsePayload> {
        return this._httpClient.post<UploadDocumentResponsePayload>(
            `${this._apiBaseUrl}/${ApiURLConstants.UploadInstruction}`, payload,{ headers: this.headers })
            .toPromise();
    }
}