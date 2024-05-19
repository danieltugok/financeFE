import type { AxiosInstance, AxiosResponse } from 'axios';
import http from 'src/plugins/http';
import {
  // objectToQueryString,
  type QueryParameters,
} from 'src/utils/helpers';

export const getUsersService = async (
  query: QueryParameters
): Promise<AxiosResponse> => {
  return await http.get<AxiosInstance>('users');
};

export const getUserImageProfileService = async (
  imageName: string
): Promise<AxiosResponse> => {
  return await http.get<AxiosInstance>(`users/profile-image/${imageName}`);
};

export const updateUserService = async (
  userID: string,
  userUpated: any
): Promise<AxiosResponse> => {
  return await http.patch<AxiosInstance>(`users/${userID}`, userUpated);
};

export const updateUserProfileImageService = async (
  userProfileImage: any
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('file', userProfileImage);
  return await http.post<AxiosInstance>('users/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getLoginService = async (
  username: string,
  password: string
): Promise<AxiosResponse> => {
  return await http.post<AxiosInstance>('auth/login', { username, password });
};

//NEED TO BE DONE IN NESTJS
export const getRefreshTokenService = async (): Promise<AxiosResponse> => {
  return await http.patch<AxiosInstance>('auth/refresh-token');
};

export const getProfileService = async (): Promise<AxiosResponse> => {
  return await http.get<AxiosInstance>('auth/profile/');
};

export const forgotPassService = async (
  email: string
): Promise<AxiosResponse> => {
  return await http.post<AxiosInstance>('users/forgot-pass/', { email });
};

export const resetPassService = async (
  password: string
): Promise<AxiosResponse> => {
  return await http.post<AxiosInstance>('users/reset-pass/', { password });
};

export const getUserMenuService = async (): Promise<AxiosResponse> => {
  return await http.get<AxiosInstance>('users/get-menu/');
};
