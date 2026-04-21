import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {

  rooms: any[] = [];
  bookings: any[] = [];

  ngOnInit() {
  this.getRooms();
  this.getBookings();
}

  constructor(private http: HttpClient) {}

  getRooms() {
    this.http.get("http://localhost:5000/api/rooms")
      .subscribe((res: any) => this.rooms = res);
  }

getBookings() {
  const token = localStorage.getItem("token");

  this.http.get("http://localhost:5000/api/bookings", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe({
    next: (res: any) => {
      this.bookings = res;
    },
    error: (err) => {
      console.log(err);
      alert("Failed to load bookings ❌");
    }
  });
}
editRoom(room: any) {
  const newName = prompt("Room name", room.name);
  const newPrice = prompt("Price", room.price);

  if (!newName || !newPrice) return;

  this.http.put(`http://localhost:5000/api/rooms/${room._id}`, {
    name: newName,
    price: newPrice,
    type: room.type,
    available: room.available
  }).subscribe(() => {
    this.getRooms();
  });
}
 deleteRoom(id: string) {
  const token = localStorage.getItem("token");

  this.http.delete(`http://localhost:5000/api/rooms/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe({
    next: () => {
      console.log("Deleted ✅");

      // 🔥 هنا الحل
      this.getRooms();       // تحديث الغرف
      this.getBookings();    // تحديث الحجوزات
    },
    error: (err) => {
      console.log(err);
    }
  });
}
 cancelBooking(id: string) {
  const token = localStorage.getItem("token");

  this.http.put(
    `http://localhost:5000/api/bookings/${id}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  ).subscribe({
    next: () => {
      console.log("Cancelled ✅");

      // 🔥 refresh
      this.getBookings();
    }
  });
}
deleteBooking(id: string) {
  const token = localStorage.getItem("token");

  this.http.delete(
    `http://localhost:5000/api/bookings/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  ).subscribe({
    next: () => {
      console.log("Deleted booking ✅");

      // 🔥 refresh
      this.getBookings();
    }
  });
}
}
