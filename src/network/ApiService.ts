import axios from 'axios';

class ApiService {
    async get(url: string) {
        console.log('GET request to:', url);
        return axios.get(url);
    }

    async post(url: string, data: any) {
        console.log('POST request to:', url, 'with data:', data);
        return axios.post(url, data);
    }
}

export default new ApiService();
