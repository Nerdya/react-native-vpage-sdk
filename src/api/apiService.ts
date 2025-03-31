import { AxiosInstance } from 'axios';
import { createAPIClient } from './apiClient';
import { ActionHistory, environment } from '../utils/helpers';
import { APIClientOptions, ApiResponse, CheckSelfKycDto, ConfigDto, EkycSubmitDto, ResendOTPDto, VerifyOTPDto } from '../types';

class APIService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  // Wrapper for GET request
  private async get(endpoint: string, params?: Record<string, any>) {
    try {
      const res = await this.client.get(endpoint, { params });
      return res as unknown;
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
      const res = await this.client.post(endpoint, data);
      return res as unknown;
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
      const params = { appointment_id: appointmentId };
      const res = await this.get(environment.GET_CONFIG_INFO, params);
      return res as ApiResponse<ConfigDto>;
    } catch (error) {
      console.error('Error fetching info:', error);
      throw error;
    }
  }

  async createMeeting(appointmentId: string, agentId = null) {
    try {
      const ids = { id: appointmentId };
      const payload = { agent_id: agentId };
      const res = await this.postChildren(environment.CREATE_MEETING, ids, payload);
      return res as ApiResponse<any>;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  }

  async saveLog(actionHistory: ActionHistory, detail = null, sessionKey = null) {
    try {
      const payload = { actionHistory, detail, sessionKey };
      const res = await this.post(environment.SAVE_LOG, payload);
      return res as ApiResponse<any>;
    } catch (error) {
      console.error('Error saving log:', error);
      throw error;
    }
  }

  // async verifyCaptcha(secret: string, captchaToken: string) {
  //   try {
  //     const payload = { secret, response: captchaToken };
  //     const res = await this.post(environment.VERIFY_CAPTCHA, payload);
  //     return res as ApiResponse<any>;
  //   } catch (error) {
  //     console.error('Error verifying captcha:', error);
  //     throw error;
  //   }
  // }

  async submit(appointmentId: string, agentId = null) {
    try {
      const payload = { id: appointmentId, agent_id: agentId };
      const res = await this.post(environment.SUBMIT, payload);
      return res as ApiResponse<EkycSubmitDto>;
    } catch (error) {
      console.error('Error submitting:', error);
      throw error;
    }
  }

  async verifyOTP(appointmentId: string, otp: string) {
    try {
      const payload = { uuid: appointmentId, appointmentId, otp };
      const res = await this.post(environment.VERIFY_OTP, payload);
      return res as ApiResponse<VerifyOTPDto>;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  async resendOTP(appointmentId: string) {
    try {
      const payload = { uuid: appointmentId };
      const res = await this.post(environment.RESEND_OTP, payload);
      return res as ApiResponse<ResendOTPDto>;
    } catch (error) {
      console.error('Error resending OTP:', error);
      throw error;
    }
  }

  async checkSelfKYC(sessionKey: string) {
    try {
      const params = { sessionKey };
      const res = await this.get(environment.CHECK_SELF_KYC, params);
      return res as ApiResponse<CheckSelfKycDto>;
    } catch (error) {
      console.error('Error checking self KYC:', error);
      throw error;
    }
  }

  async hook(sessionId: string, sessionKey: string, agentId = null) {
    try {
      const payload = { sessionId, sessionKey, agentId };
      const res = await this.post(environment.HOOK, payload);
      return res as ApiResponse<any>;
    } catch (error) {
      console.error('Error hooking:', error);
      throw error;
    }
  }

  async closeVideo(sessionKey: string) {
    try {
      const payload = { sessionKey, type: 'USER' };
      const res = await this.post(environment.CLOSE_VIDEO, payload);
      return res as ApiResponse<any>;
    } catch (error) {
      console.error('Error closing video:', error);
      throw error;
    }
  }

  async rateCall(callRating: number, callFeedback: string, agentRating: number, agentFeedback: string) {
    try {
      const payload = {
        rating_video_call: callRating,
        customer_feedback: callFeedback,
        rating_agent: agentRating,
        customer_feedback_agent: agentFeedback
      };
      const res = await this.post(environment.RATING, payload);
      return res as ApiResponse<any>;
    } catch (error) {
      console.error('Error rating:', error);
      throw error;
    }
  }
}

// Export a function to create an API service instance
export function createAPIService(options?: APIClientOptions) {
  const client = createAPIClient(options);
  return new APIService(client);
}
