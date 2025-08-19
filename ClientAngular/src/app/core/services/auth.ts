import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DemoUser { id:string; name:string; username:string; email:string; password:string; raw:any }
const STORAGE_KEY = 'demo_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<DemoUser | null>(this.load());
  user$ = this.userSubject.asObservable();
  get user() { return this.userSubject.value; }

  private load(): DemoUser | null {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw? JSON.parse(raw): null; } catch { return null; }
  }

  async generateCandidate(): Promise<DemoUser> {
    const res = await fetch('https://randomuser.me/api/?nat=us,es');
    const data = await res.json();
    const r = data.results[0];
    return { id:r.login.uuid, name:`${r.name.first} ${r.name.last}`, username:r.login.username, email:r.email, password:r.login.password, raw:r };
  }

  login(user: DemoUser) { this.userSubject.next(user); localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); }
  logout() { localStorage.removeItem(STORAGE_KEY); this.userSubject.next(null); }
}
