export interface PayloadTransactionType {
    email: string;
    name: string;
    gender: string;
    no_whatsapp: string;
    id_detail_event: number;
    type_ticket: string;
    quantity: number;
    price: number;
}

export interface responseType {
    success: boolean;
    message: string;
    results: any;
}

export interface EventList {
    id?: number;
    title: string;
    DetailEvents: DetailEventType[];
    image: any;
}

export interface DetailEventType {
    price: number | string;
    type_ticket: string;
    quantity_ticket: number | string;
    start_date: string;
    end_date: string;
}

export interface responseEventListType {
    success: boolean;
    message: string;
    results: {
        data: EventList[];
        count: number;
        pageCount: number;
    };
}

export interface responseEventListAllType {
    success: boolean;
    message: string;
    results: EventList[];
}

export interface responseDetailEventType {
    success: boolean;
    message: string;
    results: EventList;
}

export interface HomeList {
    price: number | string;
    type_ticket: string;
    quantity_ticket: number | string;
    start_date: string;
    end_date: string;
    id: number;
    id_event: number;
    title: string;
    image: string;
}

export interface HomeType {
    event: HomeList[]
}

export interface responseDetailActiveEventType {
    success: boolean;
    message: string;
    results: HomeList;
}

export interface PaymentDetail {
    id: number;
    id_customer: number;
    email: string;
    name: string;
    gender: string;
    no_whatsapp: string;
    total: number;
    type_ticket: string;
    title: string;
    quantity: number;
}

export interface responseDetailPaymentEventType {
    success: boolean;
    message: string;
    results: PaymentDetail;
}

export interface CustomerType {
    email: string;
    gender: string;
    name: string;
    no_whatsapp: string;
}

export interface ListTransactionType {
    id: number;
    code: string | null;
    status: 'PENDING' | 'WAITING' | 'SUCCESS';
    upload_proof_transaction: string | null;
    Customer: CustomerType;
    quantity: number;
    DetailEvent: {
        Event: {
            title: string;
        }
        type_ticket: string;
        price: number;
    }
}

export interface responseListTransactionType {
    success: boolean;
    message: string;
    results: {
        data: ListTransactionType[];
        count: number;
        pageCount: number;
    };
}

export interface StatusType {
    status: 'PENDING' | 'WAITING' | 'SUCCESS';
    count: string;
}

export interface responseDashboardType {
    success: boolean;
    message: string;
    results: StatusType[];
}