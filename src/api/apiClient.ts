import axios, { AxiosInstance } from 'axios';

export type APIClientOptions = {
  timeout?: number;
  headers?: Record<string, string>;
  token?: string;
};

class APIClient {
  private client: AxiosInstance;

  constructor(baseURL: string, options?: APIClientOptions) {
    this.client = axios.create({
      baseURL,
      timeout: options?.timeout || 10000,
      headers: options?.headers || { 'Content-Type': 'application/json' },
    });

    // Attach token if provided
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
export function createAPIClient(baseURL: string, options?: APIClientOptions) {
  return new APIClient(baseURL, options).getClient();
}
