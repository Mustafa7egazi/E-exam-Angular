import { Injectable } from '@angular/core';
import { ILoginData } from '../models/User/ilogin-data';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private tokenKey = 'token';

  setToken(token: string, days: number = 20): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${this.tokenKey}=${encodeURIComponent(
      token
    )}; expires=${expires}; path=/`;
  }

  getToken(): string | null {
    const name = this.tokenKey + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let c of ca) {
      c = c.trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }
  removeToken() {
    document.cookie = `${this.tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  setUser(response: ILoginData) {
    localStorage.setItem('user', JSON.stringify(response.user));
  }
  getUser(): ILoginData | null {
    const user = localStorage.getItem('user');
    const data: ILoginData = {
      token: '',
      user: user ? JSON.parse(user) : null,
    };
    return data;
  }
  removeUser() {
    localStorage.removeItem('user');
  }
}
