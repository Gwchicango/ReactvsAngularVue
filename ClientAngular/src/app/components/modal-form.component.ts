import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./modal-form.component.css'],
  template: `
    <div *ngIf="show">
      <div class="modalform-backdrop" (click)="onClose.emit()"></div>
      <div class="modalform-outer">
        <div class="modalform-card">
          <button type="button" class="modalform-x" (click)="onClose.emit()" aria-label="Cerrar">
            <span aria-hidden="true">&times;</span>
          </button>
          <div class="modalform-header">
            <span *ngIf="icon" class="me-2">{{ icon }}</span>
            <span class="modalform-title">{{ title }}</span>
          </div>
          <form (ngSubmit)="handleSubmit($event)" autocomplete="off">
            <div class="card-body pt-3 pb-2 px-4">
              <div class="mb-3" *ngFor="let field of fields">
                <label class="form-label">
                  {{ field.label }}
                  <span *ngIf="field.required" class="text-danger ms-1">*</span>
                </label>
                <ng-container [ngSwitch]="field.type">
                  <select *ngSwitchCase="'select'" [name]="field.name" class="form-control" [(ngModel)]="field.value" (ngModelChange)="onChange.emit({ name: field.name, value: $event })" [required]="field.required">
                    <option value="">Seleccione...</option>
                    <option *ngFor="let opt of field.options" [value]="opt.value">{{ opt.label }}</option>
                  </select>
                  <input *ngSwitchDefault [name]="field.name" [type]="field.type" class="form-control" [(ngModel)]="field.value" (ngModelChange)="onChange.emit({ name: field.name, value: $event })" [required]="field.required" [autofocus]="field.autoFocus" />
                </ng-container>
                <div *ngIf="localError[field.name]" style="color: #dc2626; font-size: .92em; margin-top: 2px;">{{ localError[field.name] }}</div>
              </div>
              <div *ngIf="error" class="modalform-error">{{ error }}</div>
            </div>
            <div style="height: 1.5rem"></div>
            <div class="modalform-footer">
              <button type="button" class="btn btn-outline-secondary me-3" (click)="onClose.emit()">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ submitLabel || 'Guardar' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ModalFormComponent {
  @Input() show = false;
  @Input() title = '';
  @Input() icon?: string;
  @Input() fields: any[] = [];
  @Input() error: string = '';
  @Input() submitLabel = 'Guardar';
  @Input() form: any;
  @Output() onChange = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  localError: any = {};

  validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  validateDocument(doc: string) {
    return /^\d{10}$/.test(doc);
  }
  validatePhone(phone: string) {
    return /^\d{10,}$/.test(phone);
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    const errors: any = {};
    const values: any = {};
    this.fields.forEach(f => { values[f.name] = f.value; });
    // Validar campos requeridos vacíos
    this.fields.forEach(f => {
      const val = values[f.name];
      // Validación por tipo
      if (f.type === 'number' && val && (!/^\d+$/.test(val.toString()) || parseInt(val, 10) <= 0)) {
        errors[f.name] = 'Debe ser un número entero positivo.';
      } else if (f.type === 'email' && val && !this.validateEmail(val)) {
        errors[f.name] = 'El correo no es válido.';
      } else if ((f.type === 'tel' || f.type === 'phone') && val && !this.validatePhone(val)) {
        errors[f.name] = 'El teléfono debe tener al menos 10 dígitos.';
      } else if (f.name === 'document' && val && !this.validateDocument(val)) {
        errors.document = 'La cédula debe ser numérica y tener exactamente 10 dígitos.';
      } else if (f.required && (!val || val.toString().trim() === '')) {
        errors[f.name] = 'Este campo es obligatorio.';
      }
    });
    this.localError = errors;
    if (Object.keys(errors).length > 0) return;
    this.onSubmit.emit(e);
  }
}
