import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusBadgeClass' })
export class StatusBadgeClassPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'disponible': return 'bg-success';
      case 'ocupada': return 'bg-danger';
      case 'mantenimiento': return 'bg-warning text-dark';
      case 'pendiente': return 'bg-warning text-dark';
      case 'confirmada': return 'bg-success';
      case 'cancelada': return 'bg-danger';
      case 'finalizada': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }
}
