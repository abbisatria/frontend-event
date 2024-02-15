import { payloadLogin } from "types/auth.type";
import http from "utils/http";

export const postLogin = async (payload: payloadLogin) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await http.post("user/login", payload);
      if (response.data) resolve(response.data);
    } catch (err: any) {
      const message = err.response
        ? `${err.response.data.message}`
        : "Oops, something wrong with our server, please try again later.";
      reject(message);
    }
  });
