import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  baseUrl = "http://localhost:5000/api/bookings";

  constructor(private http: HttpClient) {}

  getMyBookings() {
  const token = localStorage.getItem("token");

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get(`${this.baseUrl}/my`, { headers });
}

  cancelBooking(id: string) {
    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }
}
