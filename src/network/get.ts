import axios from 'axios';

export const get = async (url: string): Promise<any> => {
  console.log('GET request to:', url);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('GET request failed:', error);
    throw error;
  }
};
