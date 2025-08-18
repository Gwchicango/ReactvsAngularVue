// Modelo User basado en la respuesta de randomuser.me
export class User {
  constructor(raw) {
    this.id = raw.login?.uuid
    this.name = `${raw.name?.first || ''} ${raw.name?.last || ''}`.trim()
    this.email = raw.email
    this.username = raw.login?.username
  this.password = raw.login?.password // solo con fines didácticos
    this.picture = raw.picture?.medium
    this.raw = raw // conservar datos completos si se necesitan
  }
}
