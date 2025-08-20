import { Injectable } from '@angular/core';
import { AuthService, DemoUser } from '../../../core/services/auth';
import { UserModel } from '../models/user.model';

@Injectable({ providedIn:'root' })
export class AuthController {
  constructor(private auth: AuthService) {}
  get user(): DemoUser | null { return this.auth.user; }
  login(user: UserModel) { this.auth.login(user as DemoUser); }
  logout() { this.auth.logout(); }
}
