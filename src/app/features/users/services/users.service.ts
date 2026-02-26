import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { createUserResponse, listUserResponse, updateUserResponse } from "../domain/response/users.response";
import { listUserRequest, userRequest } from "../domain/request/users.request";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UsersService {
    private apiUrl = 'https://localhost:7165/api/usuario';
    constructor(private http: HttpClient) { }

    listUser(request: listUserRequest): Observable<listUserResponse> {
        return this.http.get<listUserResponse>(
            `${this.apiUrl}`,
            {
                params: {
                    id: request.id ?? '',
                    username: request.username ?? ''
                }
            }
        );
    }
    listUserById(id: number): Observable<listUserResponse> {
        return this.http.get<listUserResponse>(`${this.apiUrl}/${id}`);
    }

    createUser(request: userRequest): Observable<createUserResponse> {
        return this.http.post<createUserResponse>(`${this.apiUrl}`, request);
    }

    updateUser(id: number, request: userRequest): Observable<updateUserResponse> {
        return this.http.put<updateUserResponse>(`${this.apiUrl}/${id}`, request);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}