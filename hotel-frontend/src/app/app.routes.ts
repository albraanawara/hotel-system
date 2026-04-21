import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { RoomsComponent } from './pages/rooms/rooms';
import { BookingsComponent } from './pages/bookings/bookings';
import { RegisterComponent } from './pages/register/register';
import { authGuard } from './guards/auth-guard';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard';
import { adminGuard } from './guards/admin-guard';
import { AddRoomComponent } from './pages/admin/add-room/add-room';
import { EditRoomComponent } from './pages/admin/edit-room/edit-room';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
{ path: "home", component: HomeComponent },// 🔥 الصفحة الرئيسية

  { path: "login", component: Login },
  { path: "register", component: RegisterComponent },

  { path: "rooms", component: RoomsComponent, canActivate: [authGuard] },
  { path: "bookings", component: BookingsComponent, canActivate: [authGuard] },

  { path: "admin", component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: "admin/add-room", component: AddRoomComponent, canActivate: [adminGuard] },
  { path: "admin/edit-room/:id", component: EditRoomComponent, canActivate: [adminGuard] }
];
