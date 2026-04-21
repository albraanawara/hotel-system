import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink,RouterLinkActive],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {

  rooms: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.http.get("http://localhost:5000/api/rooms")
      .subscribe((res: any) => {
        this.rooms = res.slice(0, 6); // 🔥 Featured فقط
      });
  }

  bookRoom(id: string) {
    alert("Go to login or rooms page");
  }
}
