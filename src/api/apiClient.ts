import axios, { AxiosInstance } from 'axios';

export type APIClientOptions = {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  token?: string;
};

class APIClient {
  private client: AxiosInstance;

  constructor(options?: APIClientOptions) {
    this.client = axios.create({
      baseURL: options?.baseURL || 'https://ovkyc-gateway-server-uat.mobifi.vn',
      timeout: options?.timeout || 30000,
      headers: options?.headers || { 'Content-Type': 'application/json' },
    });

    if (options?.token) {
      this.client.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${options?.token}`;
        return config;
      });
    }
  }

  getClient() {
    return this.client;
  }
}

// Factory function to create an instance
export function createAPIClient(options?: APIClientOptions) {
  return new APIClient(options).getClient();
}
