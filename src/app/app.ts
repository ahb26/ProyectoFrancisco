import { CurrencyPipe, DOCUMENT, NgFor, NgIf } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TarjetaProductoComponent } from './componentes/tarjeta-producto/tarjeta-producto.component';

type IdCategoria = 'deporte' | 'mujer' | 'hombre' | 'ninos' | 'descuento';

type Producto = {
  id: string;
  categoria: IdCategoria;
  nombre: string;
  descripcionCorta: string;
  precio: number;
  precioOriginal?: number;
  urlImagen: string;
  detalles: string[];
};

type ItemCarrito = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  urlImagen: string;
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, NgFor, CurrencyPipe, TarjetaProductoComponent],
  templateUrl: './app.html',
})
export class App {
  private readonly document = inject(DOCUMENT);

  protected readonly titulo = signal('JoyLine');
  protected readonly carritoAbierto = signal(false);

  protected readonly busquedaAbierta = signal(false);
  protected readonly consultaBusqueda = signal('');

  protected readonly contactoAbierto = signal(false);

  protected readonly mensajeNotificacion = signal('');
  protected readonly notificacionVisible = signal(false);
  private temporizadorNotificacion: number | null = null;

  protected readonly productoSeleccionado = signal<Producto | null>(null);
  protected readonly detalleProductoAbierto = computed(() => this.productoSeleccionado() !== null);

  protected readonly productosDeporte: Producto[] = [
    {
      id: 'zapatilla1',
      categoria: 'deporte',
      nombre: 'Zapatillas running',
      descripcionCorta: 'Amortiguación cómoda para salir a correr.',
      precio: 79.99,
      urlImagen: 'images/zapatilla1.jpg',
      detalles: ['Suela con buen agarre', 'Tejido transpirable', 'Uso: asfalto y pista'],
    },
    {
      id: 'pelota1',
      categoria: 'deporte',
      nombre: 'Balón de fútbol',
      descripcionCorta: 'Tacto suave y buena durabilidad.',
      precio: 19.99,
      urlImagen: 'images/pelota.jpg',
      detalles: ['Tamaño 5', 'Cubierta resistente', 'Apto para césped artificial'],
    },
    {
      id: 'mancuernas1',
      categoria: 'deporte',
      nombre: 'Mancuernas (par)',
      descripcionCorta: 'Entrena fuerza en casa sin complicaciones.',
      precio: 24.99,
      urlImagen: 'images/mancuernas.jpg',
      detalles: ['Agarre cómodo', 'Antirrodadura', 'Ideal para rutinas full body'],
    },
  ];

  protected readonly productosMujer: Producto[] = [
    {
      id: 'legging1',
      categoria: 'mujer',
      nombre: 'Leggings training',
      descripcionCorta: 'Ajuste cómodo para entrenar y moverte.',
      precio: 29.99,
      urlImagen: 'images/legins.jpg',
      detalles: ['Cintura alta', 'Tejido elástico', 'Bolsillo lateral'],
    },
    {
      id: 'chaqueta1',
      categoria: 'mujer',
      nombre: 'Chaqueta ligera',
      descripcionCorta: 'Perfecta para entretiempo y salidas.',
      precio: 44.99,
      urlImagen: 'images/chaquetamujer.jpg',
      detalles: ['Corta-viento', 'Bolsillos con cierre', 'Secado rápido'],
    },
  ];

  protected readonly productosHombre: Producto[] = [
    {
      id: 'chaqueta2',
      categoria: 'hombre',
      nombre: 'Chaqueta deportiva',
      descripcionCorta: 'Capa extra para entrenar al aire libre.',
      precio: 49.99,
      urlImagen: 'images/chaquetahombre.jpg',
      detalles: ['Corta-viento', 'Ligera', 'Capucha ajustable'],
    },
    {
      id: 'zapatilla2',
      categoria: 'hombre',
      nombre: 'Zapatillas multiuso',
      descripcionCorta: 'Para gimnasio y caminatas diarias.',
      precio: 59.99,
      urlImagen: 'images/zapatilla.jpg',
      detalles: ['Plantilla cómoda', 'Refuerzos laterales', 'Uso: indoor/outdoor'],
    },
  ];

  protected readonly productosNinos: Producto[] = [
    {
      id: 'pack1',
      categoria: 'ninos',
      nombre: 'Pack básico kids',
      descripcionCorta: 'Comodidad para el cole y el deporte.',
      precio: 24.99,
      urlImagen: 'images/pack1.jpg',
      detalles: ['Tejido suave', 'Fácil de lavar', 'Para actividad diaria'],
    },
    {
      id: 'pelota2',
      categoria: 'ninos',
      nombre: 'Mini balón',
      descripcionCorta: 'Tamaño pequeño, ideal para peques.',
      precio: 9.99,
      urlImagen: 'images/minipelota.jpg',
      detalles: ['Tamaño mini', 'Ligero', 'Para patio y parque'],
    },
  ];

  protected readonly productosDescuento: Producto[] = [
    {
      id: 'oferta1',
      categoria: 'descuento',
      nombre: 'Camiseta deportiva',
      descripcionCorta: 'Últimas unidades a mejor precio.',
      precio: 14.99,
      precioOriginal: 24.99,
      urlImagen: 'images/camisetarebaja.jpg',
      detalles: ['Unidades limitadas', 'Hasta fin de stock', 'Devolución estándar'],
    },
    {
      id: 'oferta2',
      categoria: 'descuento',
      nombre: 'Zapatillas outlet',
      descripcionCorta: 'Chollo de temporada, tallas limitadas.',
      precio: 39.99,
      precioOriginal: 69.99,
      urlImagen: 'images/zapatillasrebaja.jpg',
      detalles: ['Stock limitado', 'Cambio de talla sujeto a disponibilidad', 'Ideal para caminar'],
    },
  ];

  protected readonly itemsCarrito = signal<ItemCarrito[]>([]);

  protected readonly unidadesCarrito = computed(() =>
    this.itemsCarrito().reduce((sum, item) => sum + item.cantidad, 0),
  );

  protected readonly subtotalCarrito = computed(() =>
    this.itemsCarrito().reduce((sum, item) => sum + item.precio * item.cantidad, 0),
  );

  protected readonly totalCarrito = computed(() => this.subtotalCarrito());

  protected readonly todosLosProductos = computed<Producto[]>(() => [
    ...this.productosDeporte,
    ...this.productosMujer,
    ...this.productosHombre,
    ...this.productosNinos,
    ...this.productosDescuento,
  ]);

  protected readonly resultadosBusqueda = computed<Producto[]>(() =>
    this.filtrarProductos(this.todosLosProductos(), this.consultaBusqueda()),
  );

  constructor(private readonly router: Router) {
    effect(() => {
      const busquedaAbierta = this.busquedaAbierta();
      const contactoAbierto = this.contactoAbierto();
      const debeBloquearScroll = busquedaAbierta || contactoAbierto;
      const body = this.document?.body;
      const html = this.document?.documentElement;

      const topbar = this.document?.querySelector<HTMLElement>('.sitio__barra-superior');
      const topbarHeight = topbar?.getBoundingClientRect().height ?? 0;
      html?.style.setProperty('--topbar-h', `${topbarHeight}px`);

      body?.classList.toggle('pagina--bloqueo-scroll', debeBloquearScroll);
      html?.classList.toggle('pagina--bloqueo-scroll', debeBloquearScroll);

      if (busquedaAbierta) {
        window.setTimeout(() => {
          const input = this.document?.querySelector<HTMLInputElement>('.sitio__buscador-entrada');
          input?.focus();
          input?.select();
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.limpiarTemporizadorNotificacion();

    this.document?.body?.classList.remove('pagina--bloqueo-scroll');
    this.document?.documentElement?.classList.remove('pagina--bloqueo-scroll');
    this.document?.documentElement?.style.removeProperty('--topbar-h');
  }

  protected alEnviarBusqueda(event: Event, consultaBruta: string): void {
    event.preventDefault();
    const consulta = consultaBruta.trim();

    this.consultaBusqueda.set(consulta);

    if (!consulta.length) {
      this.busquedaAbierta.set(false);
    } else {
      this.carritoAbierto.set(false);
      this.productoSeleccionado.set(null);
      this.busquedaAbierta.set(true);
    }

    void this.router.navigate([], {
      queryParams: {
        q: consulta.length ? consulta : null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected alEscribirBusqueda(consultaBruta: string): void {
    const consulta = consultaBruta.trim();
    this.consultaBusqueda.set(consulta);

    this.carritoAbierto.set(false);
    this.productoSeleccionado.set(null);
    this.busquedaAbierta.set(true);
  }

  protected alFocoBusqueda(): void {
    this.carritoAbierto.set(false);
    this.productoSeleccionado.set(null);
    this.busquedaAbierta.set(true);
  }

  protected cerrarBusqueda(): void {
    this.busquedaAbierta.set(false);
  }

  protected abrirContacto(): void {
    this.carritoAbierto.set(false);
    this.busquedaAbierta.set(false);
    this.productoSeleccionado.set(null);
    this.contactoAbierto.set(true);
  }

  protected cerrarContacto(): void {
    this.contactoAbierto.set(false);
  }

  protected alternarCarrito(): void {
    const seAbrira = !this.carritoAbierto();
    if (seAbrira) {
      this.productoSeleccionado.set(null);
    }

    this.carritoAbierto.set(seAbrira);
  }

  protected cerrarCarrito(): void {
    this.carritoAbierto.set(false);
  }

  protected alPulsarEscape(): void {
    if (this.detalleProductoAbierto()) {
      this.cerrarProducto();
      return;
    }

    if (this.busquedaAbierta()) {
      this.cerrarBusqueda();
      return;
    }

    if (this.contactoAbierto()) {
      this.cerrarContacto();
      return;
    }

    if (this.carritoAbierto()) {
      this.cerrarCarrito();
    }
  }

  protected abrirProducto(producto: Producto): void {
    this.carritoAbierto.set(false);
    this.busquedaAbierta.set(false);
    this.productoSeleccionado.set(producto);
  }

  protected cerrarProducto(): void {
    this.productoSeleccionado.set(null);
  }

  protected anadirAlCarrito(producto: Producto): void {
    this.itemsCarrito.update((items) => {
      const existente = items.find((item) => item.id === producto.id);

      if (existente) {
        return items.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        );
      }

      const siguiente: ItemCarrito = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        urlImagen: producto.urlImagen,
      };

      return [siguiente, ...items];
    });

    this.mostrarNotificacion(`Añadido a la cesta: ${producto.nombre}`);
  }

  private mostrarNotificacion(mensaje: string): void {
    this.mensajeNotificacion.set(mensaje);
    this.notificacionVisible.set(true);
    this.limpiarTemporizadorNotificacion();

    this.temporizadorNotificacion = window.setTimeout(() => {
      this.notificacionVisible.set(false);
      this.temporizadorNotificacion = window.setTimeout(() => {
        this.mensajeNotificacion.set('');
        this.temporizadorNotificacion = null;
      }, 250);
    }, 1600);
  }

  private limpiarTemporizadorNotificacion(): void {
    if (this.temporizadorNotificacion === null) {
      return;
    }

    window.clearTimeout(this.temporizadorNotificacion);
    this.temporizadorNotificacion = null;
  }

  protected aumentarCantidad(id: string): void {
    this.itemsCarrito.update((items) =>
      items.map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item)),
    );
  }

  protected disminuirCantidad(id: string): void {
    this.itemsCarrito.update((items) =>
      items
        .map((item) =>
          item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad - 1) } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  }

  protected eliminarItem(id: string): void {
    this.itemsCarrito.update((items) => items.filter((item) => item.id !== id));
  }

  protected vaciarCarrito(): void {
    this.itemsCarrito.set([]);
  }

  protected identificarItemCarrito(index: number, item: { id: string }): string {
    return item.id;
  }

  protected identificarProducto(index: number, producto: Producto): string {
    return producto.id;
  }

  private filtrarProductos(productos: Producto[], consulta: string): Producto[] {
    const consultaNormalizada = this.normalizarBusqueda(consulta);
    if (!consultaNormalizada.length) {
      return productos;
    }

    return productos.filter((producto) => {
      const texto = this.normalizarBusqueda(
        [producto.nombre, producto.descripcionCorta, ...producto.detalles].join(' '),
      );
      return texto.includes(consultaNormalizada);
    });
  }

  private normalizarBusqueda(valor: string): string {
    return valor
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
