import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';


@Component({
  selector: 'app-table-crud',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  styleUrls: ['./table-crud.component.css'],
  template: `
    <div class="table-crud-wrapper">
      <div style="padding-top: 1.5rem;"></div>
      <div class="table-responsive">
        <table class="table table-crud table-bordered table-hover align-middle">
          <thead>
            <tr>
              <th *ngFor="let col of columns">{{ col.label }}</th>
              <th *ngIf="onEdit || onDelete">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td [attr.colspan]="columns.length + 1" class="text-center">Cargando...</td>
            </tr>
            <tr *ngIf="!loading && (!data || data.length === 0)">
              <td [attr.colspan]="columns.length + 1" class="text-center text-muted">{{ emptyText || 'Sin registros.' }}</td>
            </tr>
            <tr *ngFor="let row of data">
              <td *ngFor="let col of columns">
                <ng-container *ngIf="col.key === 'status'; else normalCell">
                  <span class="badge" [ngClass]="'estado-' + (row[col.key] || '').toLowerCase()">{{ row[col.key] | titlecase }}</span>
                </ng-container>
                <ng-template #normalCell>
                  <ng-container *ngIf="col.key === 'capacity'; else defaultCell">
                    <i class="bi bi-people me-1"></i> {{ row[col.key] }}
                  </ng-container>
                  <ng-template #defaultCell>{{ row[col.key] }}</ng-template>
                </ng-template>
              </td>
              <td *ngIf="onEdit || onDelete">
                <button *ngIf="onEdit" class="btn btn-sm btn-warning me-2" (click)="handleEdit(row)" title="Editar">
                  <i class="bi bi-pencil"></i>
                </button>
                <button *ngIf="onDelete" class="btn btn-sm btn-danger" (click)="openDeleteModal(row)" title="Eliminar">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Modal de confirmación de borrado -->
      <div class="tablecrud-modal-backdrop" *ngIf="showDeleteModal"></div>
      <div class="tablecrud-modal-outer" *ngIf="showDeleteModal">
        <div class="tablecrud-modal-card">
          <div class="tablecrud-modal-header">¿Seguro que deseas eliminar este registro?</div>
          <div>Esta acción no se puede deshacer.</div>
          <div class="tablecrud-modal-footer">
            <button class="btn btn-danger tablecrud-modal-btn" (click)="confirmDelete()">Eliminar</button>
            <button class="btn btn-secondary tablecrud-modal-btn" (click)="closeDeleteModal()">Cancelar</button>
          </div>
  <div *ngIf="deleteError" class="mt-2" style="color: #d32f2f; font-weight: bold;">
    {{ deleteError }}
  </div>

        </div>
      </div>
    </div>
  `
})
export class TableCrudComponent implements OnChanges {
  @Input() columns: { key: string, label: string }[] = [];
  @Input() data: any[] = [];
  @Input() emptyText = '';
  @Input() loading = false;
  @Output() onEdit = new EventEmitter<any>();
  @Input() onDelete: (row: any) => Promise<any> = async () => {};

  showDeleteModal = false;
  rowToDelete: any = null;
  deleteError: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    console.log('TableCrudComponent data:', this.data);
    console.log('TableCrudComponent columns:', this.columns);
  }

  handleEdit(row: any) {
    // Validación personalizada si se provee onValidate
    if ((this as any).onValidate) {
      const error = (this as any).onValidate(row);
      if (error) {
        alert(error);
        return;
      }
    }
    this.onEdit.emit(row);
  }

  openDeleteModal(row: any) {
    this.rowToDelete = row;
    this.deleteError = '';
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.rowToDelete = null;
    setTimeout(() => { this.deleteError = ''; }, 200);
  }

  async confirmDelete() {
    if (this.onDelete && this.rowToDelete) {
      this.deleteError = '';
      try {
        await this.onDelete(this.rowToDelete);
        this.closeDeleteModal();
      } catch (err: any) {
        console.error('Error al eliminar (modal):', err);
        if (err && err.error) {
          this.deleteError = err.error;
        } else if (err && err.message) {
          this.deleteError = err.message;
        } else if (typeof err === 'string') {
          this.deleteError = err;
        } else {
          this.deleteError = 'Error al eliminar';
        }
        this.cdr.markForCheck();
        console.log('deleteError asignado:', this.deleteError);
        return;
      }
    }
  }
}
