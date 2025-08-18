// Modelo Post: define la estructura lógica de un Post
export class Post {
  constructor({ id, title, body, userId }) {
    this.id = id
    this.title = title
    this.body = body
    this.userId = userId
  }
}
