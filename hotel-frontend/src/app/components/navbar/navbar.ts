import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem("token");
  }

  isAdmin() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === "admin";
  }
}
