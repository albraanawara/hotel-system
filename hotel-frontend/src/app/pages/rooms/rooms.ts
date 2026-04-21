import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css'
})
export class RoomsComponent implements OnInit {

  rooms: any[] = [];
  page: number = 1;
  search: string = "";
  fromDate: string = "";
  toDate: string = "";

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.http.get(`http://localhost:5000/api/rooms?page=${this.page}&limit=6&search=${this.search}`)
      .subscribe((res: any) => {
        this.rooms = res;
      });
  }

  nextPage() {
    this.page++;
    this.loadRooms();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadRooms();
    }
  }

  onSearch() {
    this.page = 1;
    this.loadRooms();
  }

  // 🔥 Booking
 bookRoom(id: string) {
  const token = localStorage.getItem("token");

  const body = {
    roomId: id,
    fromDate: this.fromDate,
    toDate: this.toDate
  };

  this.http.post("http://localhost:5000/api/bookings", body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe({
    next: () => {
      alert("Booked successfully");
    },
    error: (err) => {
      console.log(err);
      alert("Booking failed");
    }
  });
}
}
