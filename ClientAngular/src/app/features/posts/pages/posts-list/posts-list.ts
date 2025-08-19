import { Component, signal, effect, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsController } from '../../../posts/controllers/posts.controller';
import { PostModel } from '../../../posts/models/post.model';

interface FormState { title: string; body: string; userId: number; id?: number }

@Component({
  selector: 'app-posts-list',
  imports: [CommonModule],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.scss'
})
export class PostsList implements OnInit, OnDestroy {
  // State signals (mirroring React state)
  posts = signal<PostModel[]>([]);
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
      // Track dependencies
      this.filterUser();
      this.debouncedSearch();
      // Trigger load
      this.load();
    });
  }

  ngOnInit() { this.load(); }
  ngOnDestroy() { clearTimeout(this.debounceHandle); }

  async load() {
    this.loading.set(true); this.error.set(null); this.showOverlay.set(true);
    try {
      let data: PostModel[];
      const search = this.debouncedSearch();
      const filter = this.filterUser();
      if (search) {
        data = await this.postsCtrl.searchTitle(search);
        if (filter) data = data.filter(p => String(p.userId) === String(filter));
      } else if (filter) {
        data = await this.postsCtrl.listByUser(Number(filter));
      } else {
        data = await this.postsCtrl.listAll();
      }
      this.posts.set(data);
    } catch (e: any) {
      this.error.set(e.message || 'Error desconocido');
    } finally {
      this.loading.set(false);
      setTimeout(()=> this.showOverlay.set(false), 300);
    }
  }

  openCreate() { this.showCreateModal.set(true); this.creating.set(false); }
  closeCreate() { this.showCreateModal.set(false); }

  async handleCreate(ev: SubmitEvent) {
    ev.preventDefault();
    try {
      this.creating.set(true);
      const newPost = await this.postsCtrl.create(this.form());
      this.posts.update(list => [newPost, ...list]);
      const currentUserId = this.form().userId;
      this.form.set({ title:'', body:'', userId: currentUserId });
      this.showCreateModal.set(false);
    } catch (e: any) { this.error.set(e.message || 'Error al crear'); }
    finally { this.creating.set(false); }
  }

  startEdit(p: PostModel) {
    this.editingId.set(p.id!);
    this.editForm.set({ id: p.id, title: p.title, body: p.body, userId: p.userId });
  }
  cancelEdit() { this.editingId.set(null); }

  async submitEdit() {
    const id = this.editingId();
    if (!id) return;
    // Igual al patrón React: agregar busy inline, PUT y reemplazar
    this.busyIds.update(s => new Set([...s, id]));
    try {
      const payload = { ...this.editForm() }; // asegurar copia completa
      const updated = await this.postsCtrl.update(payload);
      this.posts.update(list => list.map(p => p.id === updated.id ? updated : p));
      this.editingId.set(null);
    } catch (e:any) {
      this.error.set(e.message || 'Error al actualizar');
    } finally {
      this.busyIds.update(s => { s.delete(id); return new Set(s); });
    }
  }

  patchTitle(p: PostModel) {
    this.quickEditId.set(p.id!);
    this.quickTitle.set(p.title);
  }

  async submitQuickTitle(p: PostModel) {
    const title = this.quickTitle().trim();
    if (!title) { this.quickEditId.set(null); return; }
    const id = p.id!;
    try {
      this.addBusy(id);
      const updated = await this.postsCtrl.patch(id, { title });
      this.posts.update(list => list.map(x => x.id === id ? updated : x));
    } catch (e: any) { this.error.set(e.message || 'Error en actualización parcial'); }
    finally { this.removeBusy(id); this.quickEditId.set(null); }
  }

  confirmDelete(id: number) { this.showDelete.set(id); }
  cancelDelete() { this.showDelete.set(null); }

  async del(id: number) {
    try {
      this.addBusy(id);
      await this.postsCtrl.delete(id);
      this.posts.update(list => list.filter(p => p.id !== id));
    } catch (e: any) { this.error.set(e.message || 'Error al eliminar'); }
    finally { this.removeBusy(id); this.showDelete.set(null); }
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

