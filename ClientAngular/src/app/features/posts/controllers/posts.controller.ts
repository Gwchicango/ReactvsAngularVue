import { Injectable } from '@angular/core';
import { PostsService, PostEntity } from '../../../core/services/posts';
import { PostModel } from '../models/post.model';

// Controller / Facade bridging UI and service (mirrors React controller layer)
@Injectable({ providedIn:'root' })
export class PostsController {
  constructor(private posts: PostsService) {}

  listAll(): Promise<PostEntity[]> { return this.posts.list(); }
  listByUser(userId: number): Promise<PostEntity[]> { return this.posts.byUser(userId); }
  create(data: PostModel) { return this.posts.create(data); }
  update(data: PostModel) { return this.posts.update(data as PostEntity); }
  patch(id: number, partial: Partial<PostModel>) { return this.posts.patch(id, partial); }
  delete(id: number) { return this.posts.delete(id); }
  searchTitle(q: string) { return this.posts.searchTitle(q); }
}
