import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserRequest {
    name: string;
    email: string;
  }
  

export default class UserService {
  private api = axios.create({
    baseURL: 'https://api.example.com/',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async getUser(
    id: number,
    url?: string,
    headers?: AxiosRequestConfig['headers']
  ): Promise<AxiosResponse<User>> {
    const options: AxiosRequestConfig = {};

    if (url) {
      options.url = url;
    }

    if (headers) {
      options.headers = headers;
    }

    try {
      const response = await this.api.get(`/users/${id}`, options);
      return response.data;
    } catch (error:any) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  async createUser(
    userData: CreateUserRequest,
    url?: string,
    headers?: AxiosRequestConfig['headers']
  ): Promise<AxiosResponse<User>> {
    const options: AxiosRequestConfig = {};

    if (url) {
      options.url = url;
    }

    if (headers) {
      options.headers = headers;
    }

    try {
      const response = await this.api.post('/users', userData, options);
      return response.data;
    } catch (error:any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}
