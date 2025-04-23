import { AxiosInstance } from 'axios';
import { createAPIClient } from './apiClient';
import { ActionHistory, environment } from '../utils/helpers';
import { APIClientOptions, ApiResponse, CheckSelfKycDto, ConfigDto, ContractDto, ContractURLDto, CreateMeetingDto, ResendOTPDto, SubmitDto, VerifyOTPDto } from '../types';
import publicIP from "react-native-public-ip";

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
   */
  private async get(endpoint: string, params?: Record<string, any>) {
    try {
      const res = await this.client.get(endpoint, { params });
      return res.data as unknown;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
    }
  }

  /**
   * Sends a GET request to an endpoint with dynamic path parameters.
   * @param endpoint - The API endpoint with placeholders for dynamic parameters.
   * @param ids - An object containing the dynamic parameters to replace in the endpoint.
   * @param params - (Optional) Query parameters for the request.
   * @returns A promise resolving to the response data.
   */
  private async getChildren(endpoint: string, ids: Record<string, any>, params?: Record<string, any>) {
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
   */
  private async post(endpoint: string, data?: Record<string, any>) {
    try {
      const res = await this.client.post(endpoint, data);
      return res.data as unknown;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
    }
  }

  /**
   * Sends a POST request to an endpoint with dynamic path parameters.
   * @param endpoint - The API endpoint with placeholders for dynamic parameters.
   * @param ids - An object containing the dynamic parameters to replace in the endpoint.
   * @param data - (Optional) The payload data for the request.
   * @returns A promise resolving to the response data.
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

  /**
   * Fetches configuration information for a given appointment.
   * @param appointmentId - The ID of the appointment.
   * @returns A promise resolving to the configuration information.
   */
  async getConfigInfo(appointmentId: string) {
    try {
      const params = { appointment_id: appointmentId };
      const res = await this.get(environment.GET_CONFIG_INFO, params);
      return res as ApiResponse<ConfigDto>;
    } catch (error) {
      console.error('Error fetching info:', error);
    }
  }

  /**
   * Retrieves the public IP address of the device.
   *
   * This method attempts to fetch the public IP address using the `react-native-public-ip` library.
   * It includes a timeout mechanism to ensure the operation does not hang indefinitely.
   *
   * @param {number} [timeoutMs=3000] - The maximum time (in milliseconds) to wait for the IP address before timing out.
   * @returns {Promise<string | undefined>} A promise that resolves to the public IP address as a string, or `undefined` if an error occurs.
   *
   * Example usage:
   * ```typescript
   * const ipAddress = await apiService.getIPAddress();
   * console.log(ipAddress); // Output: "192.168.1.1" or similar
   * ```
   */
  async getIPAddress(timeoutMs = 3000) {
    try {
      const timeout = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeoutMs)
      );
  
      const ip = await Promise.race([publicIP(), timeout]);
      return ip;
    } catch (error) {
      console.error('Error fetching public IP:', error);
    }
  };

  /**
   * Creates a meeting for a given appointment.
   * @param appointmentId - The ID of the appointment.
   * @param customerIp - The customer's public IP address.
   * @param agentId - (Optional) The ID of the agent.
   * @returns A promise resolving to the meeting creation response.
   */
  async createMeeting(appointmentId: string, customerIp: string, agentId = null) {
    try {
      const ids = { id: appointmentId };
      const payload: any = { customerIp, agent_id: agentId };
      const res = await this.postChildren(environment.CREATE_MEETING, ids, payload);
      return res as ApiResponse<CreateMeetingDto>;
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  }

  /**
   * Saves a log entry with action history and optional details.
   * @param actionHistory - The action history object.
   * @param detail - (Optional) Additional details for the log.
   * @param sessionKey - (Optional) The session key.
   * @returns A promise resolving to the log save response.
   */
  async saveLog(actionHistory: ActionHistory, detail = null, sessionKey = null) {
    try {
      const payload = { actionHistory, detail, sessionKey };
      const res = await this.post(environment.SAVE_LOG, payload);
      return res as ApiResponse<any>;
    } catch (error) {
      console.error('Error saving log:', error);
    }
  }

  /**
   * Submits data for a given appointment.
   * @param appointmentId - The ID of the appointment.
   * @param agentId - (Optional) The ID of the agent.
   * @returns A promise resolving to the submission response.
   */
  async submit(appointmentId: string, agentId = null) {
    try {
      const payload: any = { id: appointmentId, agent_id: agentId };
      const res = await this.post(environment.SUBMIT, payload);
      return res as ApiResponse<SubmitDto>;
    } catch (error) {
      console.error('Error submitting:', error);
    }
  }

  /**
   * Verifies an OTP for a given appointment.
   * @param appointmentId - The ID of the appointment.
   * @param otp - The OTP to verify.
   * @returns A promise resolving to the OTP verification response.
   */
  async verifyOTP(appointmentId: string, otp: string) {
    try {
      const payload = { uuid: appointmentId, appointmentId, otp };
      const res = await this.post(environment.VERIFY_OTP, payload);
      return res as ApiResponse<VerifyOTPDto>;
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  }

  /**
   * Resends an OTP for a given appointment.
   * @param appointmentId - The ID of the appointment.
   * @returns A promise resolving to the OTP resend response.
   */
  async resendOTP(appointmentId: string) {
    try {
      const payload = { uuid: appointmentId };
      const res = await this.post(environment.RESEND_OTP, payload);
      return res as ApiResponse<ResendOTPDto>;
    } catch (error) {
      console.error('Error resending OTP:', error);
    }
  }

  /**
   * Checks the self-KYC status for a given session key.
   * @param sessionKey - The session key.
   * @returns A promise resolving to the self-KYC status.
   */
  async checkSelfKYC(sessionKey: string) {
    try {
      const params = { sessionKey };
      const res = await this.get(environment.CHECK_SELF_KYC, params);
      return res as ApiResponse<CheckSelfKycDto>;
    } catch (error) {
      console.error('Error checking self KYC:', error);
    }
  }

  /**
   * Hooks a session with the given session ID, session key, and optional agent ID.
   * @param sessionId - The session ID.
   * @param sessionKey - The session key.
   * @param agentId - (Optional) The ID of the agent.
   * @returns A promise resolving to the hook response.
   */
  async hook(sessionId: string, sessionKey: string, agentId = null) {
    try {
      const payload: any = { sessionId, sessionKey, agentId };
      const res = await this.post(environment.HOOK, payload);
      return res as ApiResponse<any>;
    } catch (error) {
      console.error('Error hooking:', error);
    }
  }

  /**
   * Closes a video session for a given session key.
   * @param sessionKey - The session key.
   * @returns A promise resolving to the video close response.
   */
  async closeVideo(sessionKey: string) {
    try {
      const payload = { sessionKey, type: 'USER' };
      const res = await this.post(environment.CLOSE_VIDEO, payload);
      return res as ApiResponse<any>;
    } catch (error) {
      console.error('Error closing video:', error);
    }
  }

  /**
   * Rates a call and provides feedback for both the call and the agent.
   * @param callRating - The rating for the video call.
   * @param callFeedback - The feedback for the video call.
   * @param agentRating - The rating for the agent.
   * @param agentFeedback - The feedback for the agent.
   * @returns A promise resolving to the rating response.
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
    }
  }

  async getContractList(sessionKey: string) {
    try {
      const params = { meetingId: sessionKey };
      const res = await this.get(environment.GET_CONTRACT_LIST, params);
      return res as ApiResponse<ContractDto[]>;
    } catch (error) {
      console.error('Error getting contract list:', error);
    }
  }

  async getContractURL(sessionKey: string) {
    try {
      const ids = { id: sessionKey };
      const res = await this.getChildren(environment.GET_CONTRACT_LIST, ids);
      return res as ApiResponse<ContractURLDto>;
    } catch (error) {
      console.error('Error getting contract URL:', error);
    }
  }

  async confirmContract(sessionKey: string) {
    try {
      const ids = { id: sessionKey };
      const res = await this.postChildren(environment.CONFIRM_CONTRACT, ids);
      return res as ApiResponse<any>;
    } catch (error) {
      console.error('Error confirming contract:', error);
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
