import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface PostEntity { id?: number; userId: number; title: string; body: string }

@Injectable({ providedIn: 'root' })
export class PostsService {
  private apiBase = environment.API_URL_POST + '/posts';
  private backendBase = environment.BACKEND_URL + '/posts';

  // Métodos para API externa
  listApi(): Promise<PostEntity[]> { return fetch(this.apiBase).then(r=>r.json()); }
  byUserApi(userId:number): Promise<PostEntity[]> { return fetch(`${this.apiBase}?userId=${userId}`).then(r=>r.json()); }
  createApi(p: PostEntity): Promise<PostEntity> { return fetch(this.apiBase,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(p)}).then(r=>r.json()); }
  updateApi(p: PostEntity): Promise<PostEntity> { return fetch(`${this.apiBase}/${p.id}`,{method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(p)}).then(r=>r.json()); }
  patchApi(id:number, partial: Partial<PostEntity>): Promise<PostEntity> { return fetch(`${this.apiBase}/${id}`,{method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(partial)}).then(r=>r.json()); }
  deleteApi(id:number): Promise<void> { return fetch(`${this.apiBase}/${id}`,{method:'DELETE'}).then(()=>undefined); }
  searchTitleApi(q:string): Promise<PostEntity[]> { return this.listApi().then(list => list.filter(p=>p.title.toLowerCase().includes(q.toLowerCase()))); }

  // Métodos para Backend propio
  listBackend(): Promise<PostEntity[]> { return fetch(this.backendBase).then(r=>r.json()); }
  byUserBackend(userId:number): Promise<PostEntity[]> { return fetch(`${this.backendBase}?userId=${userId}`).then(r=>r.json()); }
  createBackend(p: PostEntity): Promise<PostEntity> { return fetch(this.backendBase,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(p)}).then(r=>r.json()); }
  updateBackend(p: PostEntity): Promise<PostEntity> { return fetch(`${this.backendBase}/${p.id}`,{method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(p)}).then(r=>r.json()); }
  patchBackend(id:number, partial: Partial<PostEntity>): Promise<PostEntity> { return fetch(`${this.backendBase}/${id}`,{method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(partial)}).then(r=>r.json()); }
  deleteBackend(id:number): Promise<void> { return fetch(`${this.backendBase}/${id}`,{method:'DELETE'}).then(()=>undefined); }
  searchTitleBackend(q:string): Promise<PostEntity[]> { return this.listBackend().then(list => list.filter(p=>p.title.toLowerCase().includes(q.toLowerCase()))); }
}
