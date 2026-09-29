export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    expires: number; 

    user: {
        id: string;
        username: string;
        fullname: string;
        joindate: string;
    }
}