import { AxiosInstance } from 'axios';
import { APIClientOptions, createAPIClient } from './apiClient';
import { environment } from '../utils/helpers';

class APIService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  // Wrapper for GET request
  private async get(endpoint: string, params?: Record<string, any>) {
    try {
      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  private async getNested(endpoint: string, ids: Record<string, any>, params?: Record<string, any>) {
    const keys = Object.keys(ids);
    for (const key of keys) {
      if (endpoint.toString().includes(':' + key)) {
        endpoint = endpoint.toString().replace(':' + key, ids[key]);
      }
    }
    return this.get(endpoint, params);
  }

  // Wrapper for POST request
  private async post(endpoint: string, data?: Record<string, any>) {
    try {
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  private async postChildren(endpoint: string, ids: Record<string, any>, data?: Record<string, any>) {
    const keys = Object.keys(ids);
    for (const key of keys) {
      if (endpoint.toString().includes(':' + key)) {
        endpoint = endpoint.toString().replace(':' + key, ids[key]);
      }
    }
    return this.post(endpoint, data);
  }

  // API methods
  async getConfigInfo(appointmentId: string) {
    try {
      const response = await this.get(environment.GET_CONFIG_INFO, { params: { appointment_id: appointmentId } });
      return response;
    } catch (error) {
      console.error('Error fetching info:', error);
      throw error;
    }
  }

  async createEkycMeeting(appointmentId: string, agentId: string) {
    try {
      const response = await this.postChildren(environment.EKYC_MEETING, { id: appointmentId }, { agent_id: agentId });
      return response;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  }
}

// Export a function to create an API service instance
export function createAPIService(options?: APIClientOptions) {
  const client = createAPIClient(options);
  return new APIService(client);
}
