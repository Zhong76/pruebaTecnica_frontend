import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { AuthRequest, changePasswordRequest } from '../../features/auth/domain/request/auth.request';
import { AuthDataResponse, AuthResponse, changePasswordResponse } from '../../features/auth/domain/response/auth.response';
import { userRequest } from '../../features/users/domain/request/users.request';
import { createUserResponse } from '../../features/users/domain/response/users.response';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'https://localhost:7165/api/auth';
    constructor(private http: HttpClient) { }

    login(request: AuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(res => {
                if (res.ok && res.data) {
                    localStorage.setItem('session', JSON.stringify(res.data));
                }
            })
        );
    }
    register(request: userRequest): Observable<createUserResponse> {
        return this.http.post<createUserResponse>(`${this.apiUrl}/register`, request);
    }
    changePassword(request: changePasswordRequest): Observable<changePasswordResponse> {
        return this.http.post<changePasswordResponse>(`${this.apiUrl}/change-password`, request);
    }
    getSession(): AuthDataResponse | null {
        const raw = localStorage.getItem('session');
        return raw ? JSON.parse(raw) : null;
    }
    getToken(): string | null {
        return this.getSession()?.token ?? null;
    }
    logout() {
        localStorage.removeItem('session');
    }
}