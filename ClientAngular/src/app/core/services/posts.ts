import { Injectable } from '@angular/core';

export interface PostEntity { id?: number; userId: number; title: string; body: string }

@Injectable({ providedIn: 'root' })
export class PostsService {
  private base = 'https://jsonplaceholder.typicode.com/posts';

  list(): Promise<PostEntity[]> { return fetch(this.base).then(r=>r.json()); }
  byUser(userId:number): Promise<PostEntity[]> { return fetch(`${this.base}?userId=${userId}`).then(r=>r.json()); }
  create(p: PostEntity): Promise<PostEntity> { return fetch(this.base,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(p)}).then(r=>r.json()); }
  update(p: PostEntity): Promise<PostEntity> { return fetch(`${this.base}/${p.id}`,{method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(p)}).then(r=>r.json()); }
  patch(id:number, partial: Partial<PostEntity>): Promise<PostEntity> { return fetch(`${this.base}/${id}`,{method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(partial)}).then(r=>r.json()); }
  delete(id:number): Promise<void> { return fetch(`${this.base}/${id}`,{method:'DELETE'}).then(()=>undefined); }
  searchTitle(q:string): Promise<PostEntity[]> { return this.list().then(list => list.filter(p=>p.title.toLowerCase().includes(q.toLowerCase()))); }
}
