export interface AuthResponse {
    ok: boolean,
    message: string,
    rowsAffected: 1,
    data: AuthDataResponse
}
export interface AuthDataResponse {
    id: number,
    username: string,
    email: string,
    _status: boolean,
    token: string
}

export interface changePasswordResponse {
    ok: boolean,
    message: string,
    rowsAffected: 1
}