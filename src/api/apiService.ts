import { AxiosInstance } from 'axios';
import { createAPIClient } from './apiClient';
import { ActionHistory, environment } from '../utils/helpers';
import { APIClientOptions, ApiResponse, CheckSelfKycDto, ConfigDto, CreateMeetingDto, SubmitDto } from '../types';

/**
 * APIService provides methods to interact with the backend API.
 * It encapsulates HTTP GET and POST requests and provides higher-level methods
 * for specific API endpoints such as fetching configuration, creating meetings,
 * verifying OTPs, and more.
 */
class APIService {
  private client: AxiosInstance;

  /**
   * Creates an instance of APIService.
   * @param client - An Axios instance for making HTTP requests.
   */
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Sends a GET request to the specified endpoint with optional query parameters.
   * @param endpoint - The API endpoint to send the GET request to.
   * @param params - (Optional) Query parameters for the request.
   * @returns A promise resolving to the response data.
   * @throws An error if the request fails.
   */
  private async get(endpoint: string, params?: Record<string, any>) {
    try {
      const res = await this.client.get(endpoint, { params });
      return res as unknown;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Sends a GET request to an endpoint with dynamic path parameters.
   * @param endpoint - The API endpoint with placeholders for dynamic parameters.
   * @param ids - An object containing the dynamic parameters to replace in the endpoint.
   * @param params - (Optional) Query parameters for the request.
   * @returns A promise resolving to the response data.
   * @throws An error if the request fails.
   */
  private async getNested(endpoint: string, ids: Record<string, any>, params?: Record<string, any>) {
    const keys = Object.keys(ids);
    for (const key of keys) {
      if (endpoint.toString().includes(':' + key)) {
        endpoint = endpoint.toString().replace(':' + key, ids[key]);
      }
    }
    return this.get(endpoint, params);
  }

  /**
   * Sends a POST request to the specified endpoint with optional payload data.
   * @param endpoint - The API endpoint to send the POST request to.
   * @param data - (Optional) The payload data for the request.
   * @returns A promise resolving to the response data.
   * @throws An error if the request fails.
   */
  private async post(endpoint: string, data?: Record<string, any>) {
    try {
      const res = await this.client.post(endpoint, data);
      return res as unknown;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Sends a POST request to an endpoint with dynamic path parameters.
   * @param endpoint - The API endpoint with placeholders for dynamic parameters.
   * @param ids - An object containing the dynamic parameters to replace in the endpoint.
   * @param data - (Optional) The payload data for the request.
   * @returns A promise resolving to the response data.
   * @throws An error if the request fails.
   */
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

  /**
   * Fetches configuration information for a given appointment.
   * @param appointmentId - The ID of the appointment.
   * @returns A promise resolving to the configuration information.
   * @throws An error if the request fails.
   */
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

  /**
   * Creates a meeting for a given appointment.
   * @param appointmentId - The ID of the appointment.
   * @param agentId - (Optional) The ID of the agent.
   * @returns A promise resolving to the meeting creation response.
   * @throws An error if the request fails.
   */
  async createMeeting(appointmentId: string, agentId = null) {
    try {
      const ids = { id: appointmentId };
      const payload: any = {};
      agentId && (payload['agent_id'] = agentId);
      const res = await this.postChildren(environment.CREATE_MEETING, ids, payload);
      return res as ApiResponse<CreateMeetingDto>;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  }

  /**
   * Saves a log entry with action history and optional details.
   * @param actionHistory - The action history object.
   * @param detail - (Optional) Additional details for the log.
   * @param sessionKey - (Optional) The session key.
   * @returns A promise resolving to the log save response.
   * @throws An error if the request fails.
   */
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

  /**
   * Submits data for a given appointment.
   * @param appointmentId - The ID of the appointment.
   * @param agentId - (Optional) The ID of the agent.
   * @returns A promise resolving to the submission response.
   * @throws An error if the request fails.
   */
  async submit(appointmentId: string, agentId = null) {
    try {
      const payload: any = { id: appointmentId };
      agentId && (payload['agent_id'] = agentId);
      const res = await this.post(environment.SUBMIT, payload);
      return res as ApiResponse<SubmitDto>;
    } catch (error) {
      console.error('Error submitting:', error);
      throw error;
    }
  }

  /**
   * Verifies an OTP for a given appointment.
   * @param appointmentId - The ID of the appointment.
   * @param otp - The OTP to verify.
   * @returns A promise resolving to the OTP verification response.
   * @throws An error if the request fails.
   */
  // async verifyOTP(appointmentId: string, otp: string) {
  //   try {
  //     const payload = { uuid: appointmentId, appointmentId, otp };
  //     const res = await this.post(environment.VERIFY_OTP, payload);
  //     return res as ApiResponse<VerifyOTPDto>;
  //   } catch (error) {
  //     console.error('Error verifying OTP:', error);
  //     throw error;
  //   }
  // }

  /**
   * Resends an OTP for a given appointment.
   * @param appointmentId - The ID of the appointment.
   * @returns A promise resolving to the OTP resend response.
   * @throws An error if the request fails.
   */
  // async resendOTP(appointmentId: string) {
  //   try {
  //     const payload = { uuid: appointmentId };
  //     const res = await this.post(environment.RESEND_OTP, payload);
  //     return res as ApiResponse<ResendOTPDto>;
  //   } catch (error) {
  //     console.error('Error resending OTP:', error);
  //     throw error;
  //   }
  // }

  /**
   * Checks the self-KYC status for a given session key.
   * @param sessionKey - The session key.
   * @returns A promise resolving to the self-KYC status.
   * @throws An error if the request fails.
   */
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

  /**
   * Hooks a session with the given session ID, session key, and optional agent ID.
   * @param sessionId - The session ID.
   * @param sessionKey - The session key.
   * @param agentId - (Optional) The ID of the agent.
   * @returns A promise resolving to the hook response.
   * @throws An error if the request fails.
   */
  async hook(sessionId: string, sessionKey: string, agentId = null) {
    try {
      const payload: any = { sessionId, sessionKey };
      agentId && (payload['agent_id'] = agentId);
      const res = await this.post(environment.HOOK, payload);
      return res as ApiResponse<any>;
    } catch (error) {
      console.error('Error hooking:', error);
      throw error;
    }
  }

  /**
   * Closes a video session for a given session key.
   * @param sessionKey - The session key.
   * @returns A promise resolving to the video close response.
   * @throws An error if the request fails.
   */
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

  /**
   * Rates a call and provides feedback for both the call and the agent.
   * @param callRating - The rating for the video call.
   * @param callFeedback - The feedback for the video call.
   * @param agentRating - The rating for the agent.
   * @param agentFeedback - The feedback for the agent.
   * @returns A promise resolving to the rating response.
   * @throws An error if the request fails.
   */
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

/**
 * Factory function to create an instance of APIService.
 * @param options - (Optional) Configuration options for the Axios client.
 * @returns A new instance of APIService.
 */
export function createAPIService(options?: APIClientOptions) {
  const client = createAPIClient(options);
  return new APIService(client);
}
