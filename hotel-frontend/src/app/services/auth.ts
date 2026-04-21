import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post("http://localhost:5000/api/auth/login", data);
  }

  saveToken(token: string): void {
    localStorage.setItem("token", token);
  }
}

