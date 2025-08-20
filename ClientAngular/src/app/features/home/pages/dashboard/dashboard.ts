import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardController } from '../../../home/controllers/dashboard.controller';
import { PostsController } from '../../../posts/controllers/posts.controller';
import { PostModel } from '../../../posts/models/post.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  postsApi = signal<PostModel[]>([]);
  postsBackend = signal<PostModel[]>([]);
  postsLoading = signal(true);
  postsError = signal<string | null>(null);

  constructor(private ctrl: DashboardController, private postsCtrl: PostsController) {}

  get user() { return this.ctrl.user(); }
  copied = signal<string | null>(null);
  bars = Array.from({ length: 5 });

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts() {
    this.postsLoading.set(true); this.postsError.set(null);
    try {
      const [api, backend] = await Promise.all([
        this.postsCtrl.listApi(),
        this.postsCtrl.listBackend()
      ]);
      this.postsApi.set(api);
      this.postsBackend.set(backend);
    } catch (e: any) {
      this.postsError.set(e.message || 'Error cargando posts');
    } finally {
      this.postsLoading.set(false);
    }
  }

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

  trackPost(index: number, post: PostModel) {
    return post && post.id ? post.id : index;
  }
}
