import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HotelService } from '../../core/services/hotel';
import { TableCrudComponent } from '../../components/table-crud.component';
import { ModalFormComponent } from '../../components/modal-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, TableCrudComponent, ModalFormComponent],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Gestión de Huéspedes</h2>
        <button class="btn btn-primary" (click)="openModal()">
          <i class="bi bi-plus-circle me-2"></i> Nuevo Huésped
        </button>
      </div>
      <div *ngIf="formError && !modalOpen" class="alert alert-danger">{{ formError }}</div>
      <app-table-crud
        [columns]="columns"
        [data]="guests"
        [loading]="loading"
        [emptyText]="'No hay huéspedes registrados.'"
        [onDelete]="handleDelete.bind(this)"
        (onEdit)="openModal($event)">
      </app-table-crud>
      <app-modal-form
        [show]="modalOpen"
        [title]="editGuest ? 'Editar Huésped' : 'Nuevo Huésped'"
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
export class GuestsComponent implements OnInit {
  guests: any[] = [];
  loading = false;
  modalOpen = false;
  editGuest: any = null;
  form: any = { name: '', document: '', email: '', phone: '' };
  formError = '';
  fields = [
    { name: 'name', label: 'Nombre Completo', type: 'text', value: '', required: true, autoFocus: true },
    { name: 'document', label: 'Cédula', type: 'text', value: '', required: true },
    { name: 'email', label: 'Correo', type: 'email', value: '', required: true },
    { name: 'phone', label: 'Teléfono', type: 'tel', value: '', required: true },
  ];
  columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'document', label: 'Cédula' },
    { key: 'email', label: 'Correo' },
    { key: 'phone', label: 'Teléfono' },
  ];

  constructor(private hotelService: HotelService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchGuests();
  }

  async fetchGuests() {
    this.loading = true;
    try {
      const data = await this.hotelService.getGuests();
      this.guests = data;
      if (!Array.isArray(data)) {
        this.formError = 'La respuesta del servidor no es un arreglo.';
      } else if (data.length === 0) {
        this.formError = 'No hay huéspedes registrados en el backend.';
      } else {
        this.formError = '';
      }
      this.cdr.detectChanges();
    } catch (e: any) {
      this.formError = e.message || 'Error al cargar huéspedes.';
      this.cdr.detectChanges();
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  openModal(guest: any = null) {
    this.editGuest = guest;
    this.form = guest ? { ...guest } : { name: '', document: '', email: '', phone: '' };
    this.fields.forEach(f => f.value = this.form[f.name] || '');
    this.formError = '';
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editGuest = null;
    this.form = { name: '', document: '', email: '', phone: '' };
    this.fields.forEach(f => f.value = '');
    this.formError = '';
  }

  handleFieldChange(event: any) {
    if (event && event.target && event.target.name !== undefined) {
      const name = event.target.name;
      const value = event.target.value;
      this.form[name] = value;
      const field = this.fields.find(f => f.name === name);
      if (field) field.value = value;
    } else if (event && event.name !== undefined) {
      this.form[event.name] = event.value;
      const field = this.fields.find(f => f.name === event.name);
      if (field) field.value = event.value;
    }
  }

  async handleSubmit() {
    this.formError = '';
    try {
      if (this.editGuest) {
        await this.hotelService.updateGuest(this.editGuest.id, this.form);
      } else {
        await this.hotelService.createGuest(this.form);
      }
      this.closeModal();
      this.fetchGuests();
    } catch (e: any) {
      this.formError = e?.error || e?.message || 'Error desconocido al guardar.';
      // No cerrar el modal si hay error
    }
  }

  async handleDelete(guest: any) {
    return this.hotelService.deleteGuest(guest.id)
      .then(() => this.fetchGuests())
      .catch((err) => { throw err; });
  }
}
