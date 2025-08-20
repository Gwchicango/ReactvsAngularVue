import { Injectable, signal } from '@angular/core';
import { AuthService, DemoUser } from '../../../core/services/auth';

@Injectable({ providedIn:'root' })
export class DashboardController {
  private _user = signal<DemoUser | null>(null);
  constructor(private auth: AuthService) {
    this._user.set(this.auth.user);
    this.auth.user$.subscribe(user => {
      this._user.set(user);
    });
  }
  user = this._user.asReadonly();
}
