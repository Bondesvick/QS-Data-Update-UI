import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiURLConstants } from '../../helper/apiURLConstants';
import { AppConfigService } from './appconfig.service';
import { GenericApiResponse } from '../models/payloads/generic-response';



@Injectable()
export class PasswordResetService {
    private _apiBaseUrl: string;
    headers: HttpHeaders;

    constructor(_settings: AppConfigService, private _httpClient: HttpClient) {
        this._apiBaseUrl = _settings.PasswordResetURL;
        this.headers = new HttpHeaders({ 'X-Stack-Eb': 'djjddd8991B2c3D4e5F6g7H8' });
    }

    sendOTP(payload): Observable<GenericApiResponse> {
        return this._httpClient.post<GenericApiResponse>(`${this._apiBaseUrl}/${ApiURLConstants.SendOtp}`, payload,{ headers: this.headers });
      }

    logRequest(payload): Observable<GenericApiResponse> {
        return this._httpClient.post<GenericApiResponse>(`${this._apiBaseUrl}/${ApiURLConstants.LogRequest}`, payload,{ headers: this.headers });
      }
 
}