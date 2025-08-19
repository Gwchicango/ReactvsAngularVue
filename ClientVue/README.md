# ClientVue

Esqueleto conceptual para replicar la funcionalidad del cliente React en Vue 3 + Pinia + Vue Router.

## Funcionalidad Objetivo
- Auth demo randomuser (generar candidato y usarlo como sesión)
- Persistencia localStorage
- Rutas protegidas (`/dashboard`, `/posts`)
- Dashboard con stats, credenciales y acciones rápidas
- CRUD posts jsonplaceholder (create, update PUT, quick patch title, delete)
- Modales (crear / confirmar eliminar) + modal oscuro creación
- Skeletons + overlay loading
- Búsqueda con debounce por título + filtro userId combinados
- Banner error descartable
- Quick edit título (PATCH)
- Design tokens CSS variables

## Estructura propuesta
```
ClientVue/
  src/
    main.ts
    App.vue
    router/index.ts
    stores/auth.ts
    services/posts.ts
    services/auth.ts
    components/
      modal/Modal.vue
      SkeletonCard.vue
    views/
      LoginView.vue
      DashboardView.vue
      PostsView.vue
  styles/
    tokens.css
    global.css
  vite.config.ts
  index.html
  tsconfig.json
  package.json
```

## Instalación base (ejecutar fuera de este boceto)
```bash
npm create vue@latest ClientVue
# Seleccionar: TypeScript, Pinia, Vue Router
cd ClientVue
npm install
```

## Store Auth (`stores/auth.ts`)
```ts
import { defineStore } from 'pinia'

export interface DemoUser { id:string; name:string; username:string; email:string; password:string; raw:any }

const STORAGE_KEY = 'demo_user'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: load() as DemoUser | null, candidate: null as DemoUser | null, loading:false }),
  actions: {
    async generateCandidate() {
      this.loading = true
      try {
        const res = await fetch('https://randomuser.me/api/?nat=us,es')
        const data = await res.json()
        const r = data.results[0]
        this.candidate = {
          id: r.login.uuid,
          name: `${r.name.first} ${r.name.last}`,
          username: r.login.username,
          email: r.email,
            password: r.login.password,
          raw: r
        }
      } finally { this.loading = false }
    },
    acceptCandidate() {
      if (!this.candidate) return
      this.user = this.candidate
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user))
      this.candidate = null
    },
    logout() { this.user = null; localStorage.removeItem(STORAGE_KEY) }
  }
})

function load() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw? JSON.parse(raw): null
}
```

## Servicio Posts (`services/posts.ts`)
```ts
import type { Post } from '../types'

const BASE = 'https://jsonplaceholder.typicode.com/posts'

export interface Post { id?:number; userId:number; title:string; body:string }

export async function list(): Promise<Post[]> { return fetch(BASE).then(r=>r.json()) }
export async function byUser(userId:number): Promise<Post[]> { return fetch(`${BASE}?userId=${userId}`).then(r=>r.json()) }
export async function create(p:Post): Promise<Post> { return fetch(BASE,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(p)}).then(r=>r.json()) }
export async function update(p:Post): Promise<Post> { return fetch(`${BASE}/${p.id}`,{method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(p)}).then(r=>r.json()) }
export async function patch(id:number, partial:Partial<Post>): Promise<Post> { return fetch(`${BASE}/${id}`,{method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(partial)}).then(r=>r.json()) }
export async function removePost(id:number): Promise<void> { await fetch(`${BASE}/${id}`,{method:'DELETE'}) }
export async function searchTitle(q:string): Promise<Post[]> { const all = await list(); return all.filter(p=>p.title.toLowerCase().includes(q.toLowerCase())) }
```

## Router (`router/index.ts`)
```ts
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import PostsView from '../views/PostsView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/dashboard', component: DashboardView, meta:{ requiresAuth:true } },
    { path: '/posts', component: PostsView, meta:{ requiresAuth:true } },
    { path: '/', redirect: '/dashboard' }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.user) {
    return '/login'
  }
})

export default router
```

## Modal (`components/modal/Modal.vue`)
```vue
<template>
  <div class="modal-backdrop" @click="onBackdrop" v-if="open">
    <div class="modal" :class="theme" @click.stop>
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="btn mini" @click="$emit('close')">✕</button>
      </header>
      <div class="modal-body"><slot /></div>
      <footer class="modal-footer"><slot name="footer" /></footer>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ open:boolean; title:string; theme?:string; closeOnBackdrop?:boolean }>()
const emit = defineEmits(['close'])
function onBackdrop() { if (props.closeOnBackdrop !== false) emit('close') }
</script>
<style scoped>
.modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; justify-content:center; align-items:flex-start; padding:5vh 1rem; backdrop-filter:blur(2px); z-index:100; }
.modal { background:var(--color-surface); border:1px solid var(--color-border); border-radius:14px; width:100%; max-width:520px; padding:1.4rem 1.5rem 1.7rem; display:flex; flex-direction:column; gap:1rem; position:relative; animation:scaleIn .25s ease; }
.modal::before { content:''; position:absolute; left:0; top:0; height:4px; width:100%; background:linear-gradient(90deg,var(--color-primary),var(--color-primary-hover)); border-top-left-radius:inherit; border-top-right-radius:inherit; }
.modal.dark { background:linear-gradient(135deg,#1e293b,#0f172a); border-color:#334155; color:#fff; }
.modal.dark::before { background:linear-gradient(90deg,#3b82f6,#2563eb); }
.modal-header { display:flex; justify-content:space-between; align-items:center; }
.modal-footer { display:flex; justify-content:flex-end; gap:.6rem; }
@keyframes scaleIn { from { transform:scale(.92); opacity:0 } to { transform:scale(1); opacity:1 } }
</style>
```

## PostsView (resumen de lógica principal)
- `ref` para posts, loading, error, filterUser, searchTerm, debouncedTerm, showCreate, showDelete, quickEditId, quickTitle.
- `watch` con `setTimeout` (o usar `useDebounceFn` de VueUse si lo añades) para debounce.
- Métodos: `load()`, `create()`, `update()`, `patchTitle()`, `remove()`. Igual que en React.

## Debounce simple
```ts
watch(searchTerm, (v) => {
  clearTimeout(timer.value)
  timer.value = setTimeout(()=>{ debounced.value = v.trim(); load(); }, 420) as any
})
```

## Tokens (`styles/tokens.css`)
Igual que en Angular/React.

## Siguientes pasos
1. Ejecutar `npm create vue@latest` fuera de este esqueleto.
2. Copiar/crear archivos arriba listados.
3. Implementar `LoginView.vue` (generar candidato y aceptar) y `DashboardView.vue` similar a React.
4. Implementar `PostsView.vue` con lista, skeletons y modales usando `<Modal />`.

Solicita más si quieres que genere stubs concretos de `PostsView.vue` u otros.
