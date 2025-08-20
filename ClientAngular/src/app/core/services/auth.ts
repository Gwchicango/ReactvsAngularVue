import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DemoUser { id?:string; name:string; username:string; email:string; password:string; raw?:any; dbUser?:any }
const STORAGE_KEY = 'demo_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<DemoUser | null>(this.load());
  user$ = this.userSubject.asObservable();
  get user() { return this.userSubject.value; }

  private lastRaw: any = null; // Guardar el último raw generado

  private load(): DemoUser | null {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw? JSON.parse(raw): null; } catch { return null; }
  }

  // Registro manual de usuario
  async register(username: string, password: string, email: string): Promise<DemoUser> {
    const regRes = await fetch(`${environment.BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });
    if (!regRes.ok) {
      const err = await regRes.json().catch(()=>({error:'Error'}));
      throw new Error(err.error || 'Error registrando usuario en backend');
    }
    const dbUser = await regRes.json();
    return { ...dbUser };
  }

  // Login real contra backend, fusionando datos del API si existen
  async authenticate(username: string, password: string): Promise<DemoUser> {
    const res = await fetch(`${environment.BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({error:'Error'}));
      throw new Error(err.error || 'Credenciales incorrectas');
    }
    const user = await res.json();
    // Fusionar datos del API si existen
    let merged = { ...user };
    if (this.lastRaw) {
      merged = { ...user, raw: this.lastRaw };
      this.lastRaw = null;
    }
    this.login(merged);
    return merged;
  }

  login(user: DemoUser) { this.userSubject.next(user); localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); }
  logout() { localStorage.removeItem(STORAGE_KEY); this.userSubject.next(null); }
}
