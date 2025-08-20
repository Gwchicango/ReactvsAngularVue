import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, DemoUser } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  // Estado de vista: true = registro, false = login
  showRegister = signal(false);

  // Registro
  username = signal('');
  email = signal('');
  password = signal('');
  regAttempt = false;
  regMsg: string = '';

  // Login
  loginUser: string = '';
  loginPass: string = '';
  loginAttempt = false;
  loginMsg: string = '';

  // Estado general
  loading = signal(false);
  showPw = signal(false);
  showPwLogin = false;


  pwStrength = computed(() => {
    const pw = this.password();
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 4) score++;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 5);
  });
  validUsername = computed(() => /^[a-zA-Z0-9]+$/.test(this.username()));
  strengthLabels = ['Vacía','Básica','Mejor','Fuerte','Muy Fuerte','Excelente'];
  strengthColors = ['#64748b','#f59e0b','#f59e0b','#10b981','#0ea5e9','#6366f1'];

  constructor(private auth: AuthService, private router: Router) {}

  isValidEmail(email: string): boolean {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }

  validEmail = computed(() => this.isValidEmail(this.email()));

  toggleShowPw() { this.showPw.update(v => !v); }
  toggleShowPwLogin() { this.showPwLogin = !this.showPwLogin; }

  showRegisterForm() {
    this.showRegister.set(true);
    this.regMsg = '';
    this.regAttempt = false;
    this.username.set('');
    this.email.set('');
    this.password.set('');
  }
  showLoginForm() {
    this.showRegister.set(false);
    this.loginMsg = '';
    this.loginAttempt = false;
    this.loginUser = '';
    this.loginPass = '';
  }

  async submitRegister(evt: Event) {
    evt.preventDefault();
    this.regAttempt = true;
    this.regMsg = '';
    if (!this.username() || !this.email() || !this.password() || !this.validUsername() || !this.validEmail()) return;
    this.loading.set(true);
    try {
      const user = await this.auth.register(this.username(), this.password(), this.email());
      this.regMsg = 'Usuario registrado. Ahora puedes iniciar sesión.';
      setTimeout(() => {
        this.showLoginForm();
        this.loginMsg = 'Registro exitoso. Inicia sesión.';
      }, 1200);
      this.username.set('');
      this.email.set('');
      this.password.set('');
      this.regAttempt = false;
    } catch (e: any) {
      this.regMsg = e?.message || 'Error registrando usuario';
    } finally { this.loading.set(false); }
  }

  async submitLogin(evt: Event) {
    evt.preventDefault();
    this.loginAttempt = true;
    this.loginMsg = '';
    if (!this.loginUser || !this.loginPass) return;
    this.loading.set(true);
    try {
      const user = await this.auth.authenticate(this.loginUser, this.loginPass);
      this.router.navigateByUrl('/dashboard');
    } catch (e: any) {
      this.loginMsg = e?.message || 'Error de autenticación';
    } finally { this.loading.set(false); }
  }
}
