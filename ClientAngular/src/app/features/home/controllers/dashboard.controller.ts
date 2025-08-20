import { Injectable, signal, Signal } from '@angular/core';
import { AuthService, DemoUser } from '../../../core/services/auth';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn:'root' })
export class DashboardController {
  private _user = signal<DemoUser | null>(null);
  constructor(private auth: AuthService) {
    // Suscribirse a los cambios de usuario
    this._user.set(this.auth.user);
    this.auth.user$.subscribe(user => {
      this._user.set(user);
      if (user && !user.raw) {
        this.fetchApiUser(user);
      }
    });
    // Si el usuario existe pero no tiene datos raw, intenta obtenerlos del API
    if (this._user() && !this._user()?.raw) {
      this.fetchApiUser(this._user()!);
    }
  }

  user = this._user.asReadonly();

  private async fetchApiUser(user: DemoUser) {
    try {
      console.log('[DashboardController] Consultando API randomuser.me para username:', user.username);
      const res = await fetch(`${environment.API_URL}/api/?username=${user.username}`);
      console.log('[DashboardController] Respuesta API status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('[DashboardController] Data recibida del API:', data);
        if (data.results && data.results.length > 0) {
          user.raw = data.results[0];
          this._user.set({ ...user });
          console.log('[DashboardController] Usuario actualizado con raw:', this._user());
        } else {
          console.warn('[DashboardController] No se encontraron resultados en el API para el usuario');
        }
      } else {
        console.error('[DashboardController] Error al consultar el API:', res.statusText);
      }
    } catch (e) {
      console.error('[DashboardController] Error en fetchApiUser:', e);
    }
  }
}
