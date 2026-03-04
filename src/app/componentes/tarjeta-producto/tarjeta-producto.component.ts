import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type IdCategoria = 'deporte' | 'mujer' | 'hombre' | 'ninos' | 'descuento';

export type ProductoTarjeta = {
  id: string;
  categoria: IdCategoria;
  nombre: string;
  descripcionCorta: string;
  precio: number;
  precioOriginal?: number;
  urlImagen: string;
  detalles: string[];
};

@Component({
  selector: 'app-tarjeta-producto',
  imports: [NgIf, CurrencyPipe],
  templateUrl: './tarjeta-producto.component.html',
  styles: [
    ':host { display: contents; }',
  ],
})
export class TarjetaProductoComponent {
  @Input({ required: true }) producto!: ProductoTarjeta;

  @Output() abrir = new EventEmitter<ProductoTarjeta>();
  @Output() anadir = new EventEmitter<ProductoTarjeta>();

  protected alAbrir(): void {
    this.abrir.emit(this.producto);
  }

  protected alAnadir(event: Event): void {
    event.stopPropagation();
    this.anadir.emit(this.producto);
  }
}
