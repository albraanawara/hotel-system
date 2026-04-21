import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , RouterLink, RouterLinkActive],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  form: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

 login() {
  if (this.form.invalid) return;

  this.http.post("http://localhost:5000/api/auth/login", this.form.value)
    .subscribe({
      next: (res: any) => {
        localStorage.setItem("token", res.token);

        // 🔥 نفك التوكن
        const payload = JSON.parse(atob(res.token.split('.')[1]));

        // 👑 لو admin
        if (payload.role === "admin") {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        alert("Login failed ");
      }
    });
}



}
