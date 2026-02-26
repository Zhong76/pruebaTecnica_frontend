export interface listUserResponse {
    ok: boolean,
    message: string,
    rowsAffected: 1,
    data: listUserDataResponse []
}

export interface listUserDataResponse {
    id: number,
    username: string,
    email: string,
    _status: boolean,
    createdAt: Date,
    updatedAt: Date
}

export interface createUserResponse {
    ok: boolean,
    message: string,
    rowsAffected: 1,
    id: number
}

export interface updateUserResponse {
    ok: boolean,
    message: string,
    rowsAffected: 1
}

export interface deleteUserResponse {
    ok: boolean,
    message: string,
    rowsAffected: 1
}