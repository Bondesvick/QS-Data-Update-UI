export interface GenericApiResponse {
    ResponseCode: string;
    ResponseDescription: string;
    Data: any;
}
export class IBOnboardingGenericResponse {
    responseCode: string;
    data: any;
    responseDescription: string;
}
export interface ApiResponse {
    responseCode: string;
    responseDescription: string;
    data: any;
}