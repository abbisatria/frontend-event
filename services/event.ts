import http from "@/utils/http";

export const getEvent = async (params: Object) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await http.get(`event`, { params });
            if (response.data) resolve(response.data);
        } catch (err: any) {
            reject();
        }
    });

export const setEvent = async (data: FormData) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await http.post(`event`, data);
            if (response.data) resolve(response.data);
        } catch (err: any) {
            reject();
        }
    });

export const editEvent = async (data: FormData, id: number) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await http.put(`event/${id}`, data);
            if (response.data) resolve(response.data);
        } catch (err: any) {
            reject();
        }
    });

export const getDetailEvent = async (id: number) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await http.get(`event/${id}`);
            if (response.data) resolve(response.data);
        } catch (err: any) {
            reject();
        }
    });

export const getDetailActiveEvent = async (id: number) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await http.get(`event/active/${id}`);
            if (response.data) resolve(response.data);
        } catch (err: any) {
            reject();
        }
    });