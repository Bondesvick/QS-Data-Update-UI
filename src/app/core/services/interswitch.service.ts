import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppConfigService } from './appconfig.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterswitchService {
  apiBaseUrl: string;
  headers: HttpHeaders;

  // constructor(settings: AppConfigService, private httpClient: HttpClient) {
    constructor(private httpClient: HttpClient) {
      this.apiBaseUrl = 'https://quickservice-api.stanbicibtc-devase.p.azurewebsites.net/Utility/api'//settings.InterswitchURL;
    this.headers = new HttpHeaders({ 'X-Stack-Eb': 'djjddd8991B2c3D4e5F6g7H8' });

  }
  fetchInterswitchURL(payload): Observable<any> {
    return this.httpClient.post(`${this.apiBaseUrl}/request-manager/init-card-auth`, payload, { headers: this.headers});

  }
}
