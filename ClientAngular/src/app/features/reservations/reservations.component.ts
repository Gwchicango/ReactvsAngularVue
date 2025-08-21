import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HotelService } from '../../core/services/hotel';
import { TableCrudComponent } from '../../components/table-crud.component';
import { ModalFormComponent } from '../../components/modal-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, TableCrudComponent, ModalFormComponent],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Gestión de Reservas</h2>
        <button class="btn btn-primary" (click)="openModal()">
          <i class="bi bi-plus-circle me-2"></i> Nueva Reserva
        </button>
      </div>
      <div *ngIf="formError && !modalOpen" class="alert alert-danger">{{ formError }}</div>
      <app-table-crud
        [columns]="columns"
        [data]="reservations"
        [loading]="loading"
        [emptyText]="'No hay reservas registradas.'"
        [onDelete]="handleDelete.bind(this)"
        (onEdit)="openModal($event)">
      </app-table-crud>
      <app-modal-form
        [show]="modalOpen"
        [title]="editReservation ? 'Editar Reserva' : 'Nueva Reserva'"
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
export class ReservationsComponent implements OnInit {
  reservations: any[] = [];
  loading = false;
  modalOpen = false;
  editReservation: any = null;
  form: any = { guestId: '', roomId: '', checkIn: '', checkOut: '', personas: 1, total: 50, status: 'pendiente' };
  formError = '';
  fields = [
    { name: 'guestId', label: 'Huésped', type: 'select', value: '', required: true, options: [] },
    { name: 'roomId', label: 'Habitación', type: 'select', value: '', required: true, options: [] },
    { name: 'checkIn', label: 'Fecha Entrada', type: 'date', value: '', required: true },
    { name: 'checkOut', label: 'Fecha Salida', type: 'date', value: '', required: true },
    { name: 'personas', label: 'Personas', type: 'number', value: 1, required: true, min: 1 },
    { name: 'total', label: 'Total', type: 'number', value: 50, readonly: true },
    { name: 'status', label: 'Estado', type: 'select', value: 'pendiente', required: true, options: [
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'confirmada', label: 'Confirmada' },
      { value: 'cancelada', label: 'Cancelada' },
      { value: 'finalizada', label: 'Finalizada' },
    ] },
  ];
  columns = [
    { key: 'roomNumber', label: 'Habitación' },
    { key: 'guestName', label: 'Huésped' },
    { key: 'checkIn', label: 'Entrada' },
    { key: 'checkOut', label: 'Salida' },
    { key: 'personas', label: 'Personas' },
    { key: 'total', label: 'Total' },
    { key: 'status', label: 'Estado' },
  ];
  guests: any[] = [];
  rooms: any[] = [];

  constructor(private hotelService: HotelService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchReservations();
    this.fetchGuestsAndRooms();
  }

  async fetchReservations() {
    this.loading = true;
    try {
      const data = await this.hotelService.getReservations();
      // Mapea los datos para agregar guestName y roomNumber
      this.reservations = data.map((r: any) => ({
        ...r,
        guestName: this.guests.find(g => g.id === r.guestId)?.name || '',
        roomNumber: this.rooms.find(room => room.id === r.roomId)?.number || ''
      }));
      if (!Array.isArray(data)) {
        this.formError = 'La respuesta del servidor no es un arreglo.';
      } else if (data.length === 0) {
        this.formError = 'No hay reservas registradas en el backend.';
      } else {
        this.formError = '';
      }
      this.cdr.detectChanges();
    } catch (e: any) {
      this.formError = e.message || 'Error al cargar reservas.';
      this.cdr.detectChanges();
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async fetchGuestsAndRooms() {
    // Carga las opciones de huéspedes y habitaciones para los selects
    try {
      const [guests, rooms] = await Promise.all([
        this.hotelService.getGuests(),
        this.hotelService.getRooms()
      ]);
      this.guests = guests;
      this.rooms = rooms;
      const guestOptions = guests.map((g: any) => ({ value: g.id, label: g.name }));
      const roomOptions = rooms.map((r: any) => ({ value: r.id, label: r.number }));
      this.fields.find(f => f.name === 'guestId')!.options = guestOptions;
      this.fields.find(f => f.name === 'roomId')!.options = roomOptions;
      this.cdr.detectChanges();
      // Refresca la tabla con los nombres correctos
      this.fetchReservations();
    } catch (e) {
      // No bloquea la UI si falla
    }
  }

  openModal(reservation: any = null) {
    this.editReservation = reservation;
    this.form = reservation ? { ...reservation } : { guestId: '', roomId: '', checkIn: '', checkOut: '', personas: 1, total: 50, status: 'pendiente' };
    this.fields.forEach(f => {
      if (f.name === 'personas') f.value = this.form.personas ?? 1;
      else if (f.name === 'total') f.value = this.form.total ?? 50;
      else f.value = this.form[f.name] ?? '';
    });
    this.formError = '';
    this.modalOpen = true;
    this.fetchGuestsAndRooms();
  }

  closeModal() {
    this.modalOpen = false;
    this.editReservation = null;
    this.form = { guestId: '', roomId: '', checkIn: '', checkOut: '', personas: 1, total: 50, status: 'pendiente' };
    this.fields.forEach(f => {
      if (f.name === 'personas') f.value = 1;
      else if (f.name === 'total') f.value = 50;
      else f.value = '';
    });
    this.formError = '';
  }

  handleFieldChange(event: any) {
    let changed = false;
    if (event && event.target && event.target.name !== undefined) {
      const name = event.target.name;
      const value = event.target.value;
      this.form[name] = value;
      const field = this.fields.find(f => f.name === name);
      if (field) field.value = value;
      if (name === 'personas') changed = true;
    } else if (event && event.name !== undefined) {
      this.form[event.name] = event.value;
      const field = this.fields.find(f => f.name === event.name);
      if (field) field.value = event.value;
      if (event.name === 'personas') changed = true;
    }
    // Recalcula el total si cambia personas
    if (changed) {
      const personas = parseInt(this.form.personas, 10) || 1;
      this.form.total = personas * 50;
      const totalField = this.fields.find(f => f.name === 'total');
      if (totalField) totalField.value = this.form.total;
    }
  }

  async handleSubmit() {
    this.formError = '';
    // Calcula el total antes de guardar
    const personas = parseInt(this.form.personas, 10) || 1;
    this.form.total = personas * 50;
    const totalField = this.fields.find(f => f.name === 'total');
    if (totalField) totalField.value = this.form.total;
    try {
      if (this.editReservation) {
        await this.hotelService.updateReservation(this.editReservation.id, this.form);
      } else {
        await this.hotelService.createReservation(this.form);
      }
      this.closeModal();
      this.fetchReservations();
    } catch (e: any) {
      this.formError = e?.error || e?.message || 'Error desconocido al guardar.';
    }
  }

  async handleDelete(reservation: any) {
    return this.hotelService.deleteReservation(reservation.id)
      .then(() => this.fetchReservations())
      .catch((err) => { throw err; });
  }
}
