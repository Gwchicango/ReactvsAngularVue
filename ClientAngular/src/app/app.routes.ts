import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Dashboard } from './features/home/pages/dashboard/dashboard';
import { PostsList } from './features/posts/pages/posts-list/posts-list';
import { authGuard } from './core/guards/auth-guard';
import { RoomsComponent } from './features/rooms/rooms.component';

export const routes: Routes = [
	{ path: '', component: Login },
	{ path: 'login', component: Login },
	{ path: 'dashboard', component: Dashboard, canActivate:[authGuard] },
	{ path: 'posts', component: PostsList, canActivate:[authGuard] },
	{ path: 'rooms', component: RoomsComponent, canActivate:[authGuard] },
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: '**', redirectTo: 'login' }
];
