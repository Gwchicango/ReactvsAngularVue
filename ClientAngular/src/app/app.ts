import { Component, computed, signal, effect } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ClientAngular');
  currentUrl = signal('');
  isLogin = computed(() => this.currentUrl() === '/login');

  user = signal<any>(null);

  constructor(private router: Router, private auth: AuthService) {
    this.currentUrl.set(this.router.url);
    this.router.events.subscribe(() => this.currentUrl.set(this.router.url));
    effect(() => { this.user.set(this.auth.user); });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
