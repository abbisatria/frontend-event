import axios from "axios";
import { Session } from "next-auth";
import { getSession, signOut } from 'next-auth/react';

export type sessionType = Session & {
  user: {
    token: string
  }
}

const http = () => {
  const defaultOptions = {
    baseURL: process.env.NEXT_PUBLIC_API,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    const session = await getSession() as sessionType;
    if (session?.user?.token) {
      request.headers.Authorization = `Bearer ${session?.user?.token}`;
    }
    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error?.response?.status === 401) {
        await signOut();
      }
      return error?.response
    },
  );

  return instance;
};

export default http()
