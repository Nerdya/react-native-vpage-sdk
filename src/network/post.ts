import axios from 'axios';

export const post = async (url: string, data: any): Promise<any> => {
  console.log('POST request to:', url, 'with data:', data);
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error('POST request failed:', error);
    throw error;
  }
};
