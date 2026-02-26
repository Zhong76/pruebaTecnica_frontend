export interface listUserRequest {
    id: number | null;
    username: string | null;
}

export interface userRequest {
    username: string | null;
    email: string | null;
    _password: string | null;
    _status: boolean | null;
}