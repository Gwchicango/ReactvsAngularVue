import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth';

@Injectable({ providedIn:'root' })
export class DashboardController {
  constructor(private auth: AuthService) {}
  get user() { return this.auth.user; }
}
