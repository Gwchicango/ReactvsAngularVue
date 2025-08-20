
import { Component, signal, effect, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsController } from '../../../posts/controllers/posts.controller';
import { PostModel } from '../../../posts/models/post.model';
import { AuthService } from '../../../../core/services/auth';

interface FormState { title: string; body: string; userId: number; id?: number }

@Component({
  selector: 'app-posts-list',
  imports: [CommonModule],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.scss'
})
export class PostsList implements OnInit, OnDestroy {
  postsBackend = signal<PostModel[]>([]);
  postsApi = signal<PostModel[]>([]);
  // State signals (mirroring React state)
  loading = signal(true);
  error = signal<string | null>(null);
  form = signal<FormState>({ title:'', body:'', userId:1 });
  editingId = signal<number | null>(null);
  editForm = signal<FormState>({ title:'', body:'', userId:1 });
  filterUser = signal<string>('');
  searchTerm = signal('');
  debouncedSearch = signal('');
  busyIds = signal<Set<number>>(new Set());
  showOverlay = signal(false);
  quickEditId = signal<number | null>(null);
  quickTitle = signal('');
  showCreateModal = signal(false);
  creating = signal(false);
  showDelete = signal<number | null>(null);

  private debounceHandle: any;

  private auth = inject(AuthService);
  constructor(private postsCtrl: PostsController) {
    // Effect to debounce searchTerm
    effect(() => {
      const term = this.searchTerm();
      clearTimeout(this.debounceHandle);
      this.debounceHandle = setTimeout(() => {
        this.debouncedSearch.set(term.trim());
      }, 420);
    });

    // Effect to reload when filters change
    effect(() => {
      this.filterUser();
      this.debouncedSearch();
      this.load();
    });
  }

  ngOnInit() { this.load(); }
  ngOnDestroy() { clearTimeout(this.debounceHandle); }

  async load() {
    this.loading.set(true); this.error.set(null); this.showOverlay.set(true);
    try {
      let apiData: PostModel[] = [];
      let backendData: PostModel[] = [];
      const search = this.debouncedSearch();
      const filter = this.filterUser();
      const user = this.auth.user;
      if (search) {
        apiData = await this.postsCtrl.searchTitleApi(search);
        backendData = await this.postsCtrl.searchTitleBackend(search);
        if (filter) {
          apiData = apiData.filter(p => String(p.userId) === String(filter));
          backendData = backendData.filter(p => String(p.userId) === String(filter));
        } else if (user?.id) {
          backendData = backendData.filter(p => String(p.userId) === String(user.id));
        }
      } else if (filter) {
        apiData = await this.postsCtrl.byUserApi(Number(filter));
        backendData = await this.postsCtrl.byUserBackend(Number(filter));
      } else {
        apiData = await this.postsCtrl.listApi();
        backendData = await this.postsCtrl.listBackend();
        if (user?.id) {
          backendData = backendData.filter(p => String(p.userId) === String(user.id));
        }
      }
      this.postsApi.set(apiData);
      this.postsBackend.set(backendData);
    } catch (e: any) {
      this.error.set(e.message || 'Error desconocido');
    } finally {
      this.loading.set(false);
      setTimeout(()=> this.showOverlay.set(false), 300);
    }
  }

  openCreate() {
    const user = this.auth.user;
    this.form.set({ title: '', body: '', userId: user?.id ? Number(user.id) : 1 });
    this.showCreateModal.set(true);
    this.creating.set(false);
  }
  closeCreate() { this.showCreateModal.set(false); }

  // Crear solo en backend
  async handleCreate(ev: SubmitEvent) {
    ev.preventDefault();
    try {
      this.creating.set(true);
      const newPost = await this.postsCtrl.createBackend(this.form());
  this.postsBackend.update((list: PostModel[]) => [newPost, ...list]);
      const currentUserId = this.form().userId;
      this.form.set({ title:'', body:'', userId: currentUserId });
      this.showCreateModal.set(false);
    } catch (e: any) { this.error.set(e.message || 'Error al crear'); }
    finally { this.creating.set(false); }
  }

  // Solo permitir editar posts del backend
  startEdit(p: PostModel) {
    if (!this.isBackendPost(p)) return;
    this.editingId.set(p.id!);
    this.editForm.set({ id: p.id, title: p.title, body: p.body, userId: p.userId });
  }
  cancelEdit() { this.editingId.set(null); }

  async submitEdit() {
    const id = this.editingId();
    if (!id) return;
    this.busyIds.update(s => new Set([...s, id]));
    try {
      const payload = { ...this.editForm() };
      const updated = await this.postsCtrl.updateBackend(payload);
  this.postsBackend.update((list: PostModel[]) => list.map((p: PostModel) => p.id === updated.id ? updated : p));
      this.editingId.set(null);
    } catch (e:any) {
      this.error.set(e.message || 'Error al actualizar');
    } finally {
      this.busyIds.update(s => { s.delete(id); return new Set(s); });
    }
  }

  // Solo permitir patch en backend
  patchTitle(p: PostModel) {
    if (!this.isBackendPost(p)) return;
    this.quickEditId.set(p.id!);
    this.quickTitle.set(p.title);
  }

  async submitQuickTitle(p: PostModel) {
    if (!this.isBackendPost(p)) return;
    const title = this.quickTitle().trim();
    if (!title) { this.quickEditId.set(null); return; }
    const id = p.id!;
    try {
      this.addBusy(id);
      const updated = await this.postsCtrl.patchBackend(id, { title });
  this.postsBackend.update((list: PostModel[]) => list.map((x: PostModel) => x.id === id ? updated : x));
    } catch (e: any) { this.error.set(e.message || 'Error en actualización parcial'); }
    finally { this.removeBusy(id); this.quickEditId.set(null); }
  }

  // Solo permitir borrar en backend
  confirmDelete(id: number) { this.showDelete.set(id); }
  cancelDelete() { this.showDelete.set(null); }

  async del(id: number) {
    try {
      this.addBusy(id);
      await this.postsCtrl.deleteBackend(id);
  this.postsBackend.update((list: PostModel[]) => list.filter((p: PostModel) => p.id !== id));
    } catch (e: any) { this.error.set(e.message || 'Error al eliminar'); }
    finally { this.removeBusy(id); this.showDelete.set(null); }
  }

  // Utilidad para saber si un post es del backend
  isBackendPost(p: PostModel) {
    // Puedes ajustar la lógica según tu modelo real
    // Por ejemplo, si los IDs del backend son mayores a 10000, o si tienen algún flag
    // Aquí asumimos que si el post está en postsBackend, es del backend
  return this.postsBackend().some((b: PostModel) => b.id === p.id);
  }

  dismissError() { this.error.set(null); }

  private addBusy(id:number) { this.busyIds.update(set => new Set([...set, id])); }
  private removeBusy(id:number) { this.busyIds.update(set => { set.delete(id); return new Set(set); }); }

  // Input handlers (avoid inline arrow functions in template)
  onFilterUserInput(e: Event) { const v = (e.target as HTMLInputElement).value; this.filterUser.set(v); }
  onSearchTitleInput(e: Event) { const v = (e.target as HTMLInputElement).value; this.searchTerm.set(v); }
  onQuickTitleInput(e: Event) { const v = (e.target as HTMLInputElement).value; this.quickTitle.set(v); }
  onEditTitleInput(e: Event) { const v = (e.target as HTMLInputElement).value; this.editForm.update(f => ({...f, title: v})); }
  onEditBodyInput(e: Event) { const v = (e.target as HTMLTextAreaElement).value; this.editForm.update(f => ({...f, body: v})); }
  onCreateTitleInput(e: Event) { const v = (e.target as HTMLInputElement).value; this.form.update(f => ({...f, title: v})); }
  onCreateBodyInput(e: Event) { const v = (e.target as HTMLTextAreaElement).value; this.form.update(f => ({...f, body: v})); }
  onCreateUserIdInput(e: Event) { const v = Number((e.target as HTMLInputElement).value); this.form.update(f => ({...f, userId: v})); }
}

