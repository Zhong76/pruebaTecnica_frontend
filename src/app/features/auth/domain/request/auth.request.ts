export interface AuthRequest {
    username: string|null;
    _password: string|null;
}

export interface changePasswordRequest {
    username: string|null;
    oldPassword: string|null;
    newPassword: string|null;
}