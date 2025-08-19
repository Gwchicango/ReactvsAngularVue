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
  loading = signal(false);
  candidate = signal<DemoUser | null>(null);

  // Form state
  username = signal('');
  password = signal('');
  showPw = signal(false);
  error = signal<string | null>(null);

  // Password strength evaluation (0-5)
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

  strengthLabels = ['Vacía','Básica','Mejor','Fuerte','Muy Fuerte','Excelente'];
  strengthColors = ['#64748b','#f59e0b','#f59e0b','#10b981','#0ea5e9','#6366f1'];

  // Basic validation rules
  validUsername = computed(() => {
    const c = this.candidate();
    if (!c) return false;
    return this.username().trim() === c.username; // exact match (case-sensitive as generated)
  });
  validPassword = computed(() => {
    const c = this.candidate();
    if (!c) return false;
    return this.password() === c.password; // must match generated password
  });
  canSubmit = computed(() => !!this.candidate() && this.validUsername() && this.validPassword() && !this.loading());
  attempt = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  async generate() {
    this.loading.set(true);
    try {
  const user = await this.auth.generateCandidate();
  this.candidate.set(user);
  // No prefill; usuario debe escribir o usar botón Auto completar
  this.username.set('');
  this.password.set('');
    } finally { this.loading.set(false); }
  }

  toggleShowPw() { this.showPw.update(v => !v); }

  autofill() {
    const c = this.candidate();
    if (!c) return;
    this.username.set(c.username);
    this.password.set(c.password);
  }

  async submit(evt: Event) {
    evt.preventDefault();
  this.attempt.set(true);
    this.error.set(null);
    const c = this.candidate();
    if (!c) { this.error.set('Genera un usuario primero'); return; }
  if (!this.validUsername()) { this.error.set('Username no coincide'); return; }
  if (!this.validPassword()) { this.error.set('Password no coincide'); return; }
    // Simulate async login phase (could validate password strength etc)
    this.loading.set(true);
    try {
      const user: DemoUser = { ...c, username: this.username(), password: this.password() };
      this.auth.login(user);
      this.router.navigateByUrl('/dashboard');
    } catch (e: any) {
      this.error.set(e?.message || 'Error');
    } finally { this.loading.set(false); }
  }
}
