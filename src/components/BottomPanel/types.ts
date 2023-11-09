export interface IApiCall {
  timestamp: string;
  method: string;
  endpoint: string;
  parameters: string;
  requestBody: string;
  statusCode: string;
  response: string;
}

export interface ITemporary {
  temp: number;
}
