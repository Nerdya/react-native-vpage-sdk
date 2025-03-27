import { AxiosInstance } from 'axios';
import { APIClientOptions, createAPIClient } from './apiClient';

class APIService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async getConfigInfo(appointmentId: string) {
    try {
      const response = await this.client.get(`/get-config-info`, { params: { appointment_id: appointmentId } });
      return response.data;
    } catch (error) {
      console.error('Error fetching info:', error);
      throw error;
    }
  }

  async createEkycMeeting(appointmentId: string, agentId: string) {
    try {
      const response = await this.client.post(`/create-ekyc-meeting/${appointmentId}`, { agent_id: agentId });
      return response.data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  }
}

// Export a function to create an API service instance
export function createAPIService(baseURL: string, options?: APIClientOptions) {
  const client = createAPIClient(baseURL, options);
  return new APIService(client);
}
