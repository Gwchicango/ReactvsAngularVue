import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardController } from '../../../home/controllers/dashboard.controller';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  constructor(private ctrl: DashboardController) {}

  get user() { return this.ctrl.user; }
  copied = signal<string | null>(null);
  bars = Array.from({ length: 5 });

  passStrength = computed(() => {
    const u = this.user;
    if (!u?.password) return 0;
    const pwd = u.password;
    let s = 0;
    if (pwd.length >= 4) s++;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return Math.min(s, 5);
  });

  copy(label: string, value: string) {
    try { navigator.clipboard.writeText(value); } catch {}
    this.copied.set(label);
    setTimeout(() => this.copied.set(null), 1400);
  }
}
