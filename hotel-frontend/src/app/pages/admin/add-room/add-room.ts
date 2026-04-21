import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-room.html',
  styleUrl: './add-room.css'
})
export class AddRoomComponent {
  form;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      price: ["", [Validators.required]],
      type: ["", [Validators.required]],
      available: [true]
    });
  }
   selectedFiles: File[] = [];

  onFileSelect(event: any) {
    this.selectedFiles = Array.from(event.target.files);
}
uploadImages() {
  const formData = new FormData();

  this.selectedFiles.forEach(file => {
    formData.append("images", file);
  });

  return this.http.post("http://localhost:5000/api/upload", formData);
}

 addRoom() {
  if (this.form.invalid) return;

  const token = localStorage.getItem("token");


  this.uploadImages().subscribe({
    next: (res: any) => {
      const images = res.images;

      // 2️⃣ ابعت room مع الصور
      const roomData = {
        ...this.form.value,
        images: images
      };

      this.http.post(
        "http://localhost:5000/api/rooms",
        roomData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).subscribe({
        next: (res) => {
          console.log("Room added:", res);
          alert("Room added with images ✅");
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.log(err);
          alert("Failed to add room ❌");
        }
      });
    },

    error: (err) => {
      console.log(err);
      alert("Image upload failed ❌");
    }
  });
  }
}

