export interface payloadLogin {
    username: string;
    password: string;
}

export interface responseLoginType {
    success: boolean;
    message: string;
    results: {
        token: string;
    }
}