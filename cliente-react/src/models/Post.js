// Modelo Post: define la estructura lógica de un Post
export class Post {
  constructor(obj) {
    this.id = obj.id
    this.title = obj.title
    this.body = obj.body
    this.userId = obj.userId
    // Guardar cualquier campo extra (como raw)
    Object.keys(obj).forEach(k => {
      if (!(k in this)) this[k] = obj[k]
    })
  }
}
