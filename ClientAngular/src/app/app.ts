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
    // Suscribirse a los cambios de usuario para que el nav siempre muestre el usuario logueado
    this.auth.user$.subscribe(user => {
      this.user.set(user);
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
