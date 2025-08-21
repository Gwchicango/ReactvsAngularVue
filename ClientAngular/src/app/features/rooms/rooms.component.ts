import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HotelService } from '../../core/services/hotel';
import { TableCrudComponent } from '../../components/table-crud.component';
import { ModalFormComponent } from '../../components/modal-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, TableCrudComponent, ModalFormComponent],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Gestión de Habitaciones</h2>
        <button class="btn btn-primary" (click)="openModal()">
          <i class="bi bi-plus-circle me-2"></i> Nueva Habitación
        </button>
      </div>
      <div *ngIf="formError && !modalOpen" class="alert alert-danger">{{ formError }}</div>
      <app-table-crud
        [columns]="columns"
        [data]="rooms"
        [loading]="loading"
        [emptyText]="'No hay habitaciones registradas.'"
        [onDelete]="handleDelete.bind(this)"
        (onEdit)="openModal($event)">
      </app-table-crud>
      <app-modal-form
        [show]="modalOpen"
        [title]="editRoom ? 'Editar Habitación' : 'Nueva Habitación'"
        [fields]="fields"
        [form]="form"
        [error]="formError"
        submitLabel="Guardar"
        (onChange)="handleFieldChange($event)"
        (onSubmit)="handleSubmit()"
        (onClose)="closeModal()">
      </app-modal-form>
    </div>
  `
})
export class RoomsComponent implements OnInit {
  rooms: any[] = [];
  loading = false;
  modalOpen = false;
  editRoom: any = null;
  form: any = { number: '', type: '', capacity: '', status: '' };
  formError = '';
  fields = [
    { name: 'number', label: 'Número Habitación', type: 'text', value: '', required: true, autoFocus: true },
    { name: 'type', label: 'Tipo', type: 'select', value: '', required: true, options: [
      { value: 'individual', label: 'Individual' },
      { value: 'doble', label: 'Doble' },
      { value: 'suite', label: 'Suite' },
      { value: 'familiar', label: 'Familiar' },
    ] },
    { name: 'capacity', label: 'Capacidad', type: 'number', value: '', required: true },
    { name: 'status', label: 'Estado', type: 'select', value: '', required: true, options: [
      { value: 'disponible', label: 'Disponible' },
      { value: 'ocupada', label: 'Ocupada' },
      { value: 'mantenimiento', label: 'Mantenimiento' },
    ] },
  ];
  columns = [
    { key: 'number', label: 'Número' },
    { key: 'type', label: 'Tipo' },
    { key: 'capacity', label: 'Capacidad' },
    { key: 'status', label: 'Estado' },
  ];

  constructor(private hotelService: HotelService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchRooms();
  }

  async fetchRooms() {
    this.loading = true;
    try {
      const data = await this.hotelService.getRooms();
      console.log('Habitaciones recibidas:', data);
      this.rooms = data;
      if (!Array.isArray(data)) {
        this.formError = 'La respuesta del servidor no es un arreglo.';
      } else if (data.length === 0) {
        this.formError = 'No hay habitaciones registradas en el backend.';
      } else {
        this.formError = '';
      }
      this.cdr.detectChanges();
    } catch (e: any) {
      this.formError = e.message || 'Error al cargar habitaciones.';
      console.error('Error al cargar habitaciones:', e);
      this.cdr.detectChanges();
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  openModal(room: any = null) {
    this.editRoom = room;
    this.form = room ? { ...room } : { number: '', type: '', capacity: '', status: '' };
    this.fields.forEach(f => f.value = this.form[f.name] || '');
    this.formError = '';
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editRoom = null;
    this.form = { number: '', type: '', capacity: '', status: '' };
    this.fields.forEach(f => f.value = '');
    this.formError = '';
  }

  handleFieldChange(event: any) {
    // Si viene de input/select Angular, extraer name y value
    if (event && event.target && event.target.name !== undefined) {
      const name = event.target.name;
      const value = event.target.value;
      this.form[name] = value;
      const field = this.fields.find(f => f.name === name);
      if (field) field.value = value;
    } else if (event && event.name !== undefined) {
      // Si viene como { name, value }
      this.form[event.name] = event.value;
      const field = this.fields.find(f => f.name === event.name);
      if (field) field.value = event.value;
    }
  }

  async handleSubmit() {
    this.formError = '';
    try {
      if (this.editRoom) {
        await this.hotelService.updateRoom(this.editRoom.id, this.form);
      } else {
        await this.hotelService.createRoom(this.form);
      }
      this.closeModal();
      this.fetchRooms();
    } catch (e: any) {
      this.formError = e.message;
    }
  }

  async handleDelete(room: any) {
    // Propaga el error como promesa rechazada para que el hijo lo capture
    return this.hotelService.deleteRoom(room.id)
      .then(() => this.fetchRooms())
      .catch((err) => { throw err; });
  }
}
