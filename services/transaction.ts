import { PayloadTransactionType } from "@/types/global.type";
import http from "@/utils/http";

export const getTransaction = async (params: Object) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await http.get(`transaction`, { params });
            if (response.data) resolve(response.data);
        } catch (err: any) {
            reject();
        }
    });

export const getTransactionDashboard = async () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await http.get(`transaction/dashboard`);
            if (response.data) resolve(response.data);
        } catch (err: any) {
            reject();
        }
    });

export const setTransaction = async (data: PayloadTransactionType) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await http.post(`transaction`, data);
            if (response.data) resolve(response.data);
        } catch (err: any) {
            reject();
        }
    });

export const editTransaction = async (data: FormData, id: number) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await http.put(`transaction/${id}`, data);
            if (response.data) resolve(response.data);
        } catch (err: any) {
            reject();
        }
    });

export const getDetailTransaction = async (id: number) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await http.get(`transaction/${id}`);
            if (response.data) resolve(response.data);
        } catch (err: any) {
            reject();
        }
    });

export const getDetailPaymentTransaction = async (id: number) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await http.get(`transaction/payment/${id}`);
            if (response.data) resolve(response.data);
        } catch (err: any) {
            reject();
        }
    });