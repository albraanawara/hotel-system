import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-room.html'
})
export class EditRoomComponent implements OnInit {

  roomId: string = "";

  form;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ["", Validators.required],
      price: ["", Validators.required],
      type: ["", Validators.required],
      available: [true]
    });
  }

  ngOnInit() {
    this.roomId = this.route.snapshot.params['id'];
    this.getRoom();
  }

  getRoom() {
    this.http.get(`http://localhost:5000/api/rooms/${this.roomId}`)
      .subscribe((res: any) => {
        this.form.patchValue(res);
      });
  }

  updateRoom() {
    const token = localStorage.getItem("token");

    this.http.put(
      `http://localhost:5000/api/rooms/${this.roomId}`,
      this.form.value,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => {
        alert("Room updated ");
        this.router.navigate(['/admin']);
      },
      error: () => alert("Update failed ")
    });
  }
}
