import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiURLConstants } from '../../helper/apiURLConstants';
import { AppConfigService } from './appconfig.service';
import { GenericApiResponse } from '../models/payloads/generic-response';
import { UploadDocumentsRequestPayload, ValidateBVNRequestPayload } from '../models/payloads/account-creation';


@Injectable()
export class AccountCreationService {
    private _apiBaseUrl: string;
    private _apiBaseUrl2:string;
    private headers: HttpHeaders;
    headersCaptcha: HttpHeaders;

    constructor(_settings: AppConfigService, private _httpClient: HttpClient) {
        this._apiBaseUrl = _settings.CorporateAccountUrl;
        this._apiBaseUrl2=_settings.SmeOnboardingUrl;
        this.headers = new HttpHeaders({ 'X-Stack-Eb': 'djjddd8991B2c3D4e5F6g7H8' });
        this.headersCaptcha = new HttpHeaders({ 'X-Stack-Eb': 'xvbTHDUUJILMxsqwoppdjjxZSxQpvk' });

    }

    validateBVN(payload: ValidateBVNRequestPayload): Observable<GenericApiResponse> {
        return this._httpClient.post<GenericApiResponse>(
            `${this._apiBaseUrl}/${ApiURLConstants.ValidateBVN}`, payload,{ headers: this.headers });
    }

    uploadDocuments(payload: UploadDocumentsRequestPayload): Promise<GenericApiResponse> {
        return this._httpClient.post<GenericApiResponse>(
            `${this._apiBaseUrl}/${ApiURLConstants.UploadDocuments}`, payload,{ headers: this.headers })
            .toPromise();
    }
    validateCache(payload): any {
        return this._httpClient.post(`${this._apiBaseUrl2}/utilities/validate-capcha`, payload);
    }
}