import { Injectable } from '@angular/core';
import { PostsService, PostEntity } from '../../../core/services/posts';
import { PostModel } from '../models/post.model';

// Controller / Facade bridging UI and service (mirrors React controller layer)
@Injectable({ providedIn:'root' })
export class PostsController {
  constructor(private posts: PostsService) {}

  // API externa
  listApi(): Promise<PostEntity[]> { return this.posts.listApi(); }
  byUserApi(userId: number): Promise<PostEntity[]> { return this.posts.byUserApi(userId); }
  createApi(data: PostModel) { return this.posts.createApi(data); }
  updateApi(data: PostModel) { return this.posts.updateApi(data as PostEntity); }
  patchApi(id: number, partial: Partial<PostModel>) { return this.posts.patchApi(id, partial); }
  deleteApi(id: number) { return this.posts.deleteApi(id); }
  searchTitleApi(q: string) { return this.posts.searchTitleApi(q); }

  // Backend propio
  listBackend(): Promise<PostEntity[]> { return this.posts.listBackend(); }
  byUserBackend(userId: number): Promise<PostEntity[]> { return this.posts.byUserBackend(userId); }
  createBackend(data: PostModel) { return this.posts.createBackend(data); }
  updateBackend(data: PostModel) { return this.posts.updateBackend(data as PostEntity); }
  patchBackend(id: number, partial: Partial<PostModel>) { return this.posts.patchBackend(id, partial); }
  deleteBackend(id: number) { return this.posts.deleteBackend(id); }
  searchTitleBackend(q: string) { return this.posts.searchTitleBackend(q); }
}
