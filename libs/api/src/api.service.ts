import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  private async interceptResponse(response: any): Promise<any> {
    return response.data;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.httpService
      .get(url, { ...config })
      .pipe(map((response) => this.interceptResponse(response)))
      .toPromise();
  }

  async post<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.httpService
      .post(url, body, { ...config })
      .pipe(map((response) => this.interceptResponse(response)))
      .toPromise();
  }
}
