import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfigService } from "./appconfig.service";
import { Observable } from "rxjs";
import { GenericApiResponse } from "../models/payloads/generic-response";

@Injectable({
  providedIn: "root",
})
export class UtilityService {
  apiBaseUrl: string;
  headers: HttpHeaders;

  constructor(settings: AppConfigService, private httpClient: HttpClient) {
    this.apiBaseUrl = settings.InterswitchURL;
    //  this.headers = new HttpHeaders({ 'X-Stack-Eb': 'djjddd8991B2c3D4e5F6g7H8' });
  }
  validateCustomerDetails(payload): Observable<GenericApiResponse> {
    return this.httpClient.post<GenericApiResponse>(
      `${this.apiBaseUrl}/request-manager/validate-customer`,
      payload
    );
  }
  // formatAmount(amount): string {
  //   return (amount as string).replace(
  //     /(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g,
  //     "$1,"
  //   );
  // }
}
