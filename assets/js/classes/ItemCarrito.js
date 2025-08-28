/**
 * LOGICA PRODUCTOS DEL CARRITO :D
 */
class ItemCarrito {
    constructor(producto, cantidad) {
        if (!producto instanceof Producto) {
            throw new Error('El parámetro producto debe ser una instancia de la clase Producto');
        }

        this.producto = producto.clonar();
        this.cantidad = Math.max(1, cantidad || 1);
        this.fechaAgregado = new Date();
    }

    // Método para calcular el subtotal del item
    getSubtotal() {
        return this.producto.precio * this.cantidad;
    }

    // Método para aumentar la cantidad
    aumentarCantidad(cantidad = 1) {
        this.cantidad += Math.max(0, cantidad);
        return this.cantidad;
    }

    // Método para disminuir la cantidad
    disminuirCantidad(cantidad = 1) {
        this.cantidad = Math.max(0, this.cantidad - cantidad);
        return this.cantidad;
    }

    // Método para establecer una nueva cantidad
    setCantidad(nuevaCantidad) {
        this.cantidad = Math.max(0, nuevaCantidad);
        return this.cantidad;
    }

    // Método para verificar si el item tiene cantidad válida
    esValido() {
        return this.cantidad > 0 && this.producto.esValido();
    }

    // Método para obtener la información básica del item
    getInfo() {
        return {
            id: this.producto.id,
            nombre: this.producto.nombre,
            precio: this.producto.precio,
            cantidad: this.cantidad,
            subtotal: this.getSubtotal(),
            categoria: this.producto.categoria,
            icono: this.producto.icono,
            fechaAgregado: this.fechaAgregado,
            producto: this.producto.getInfo()
        };
    }

    // Método para comparar items (útil para operaciones de carrito)
    esIgualA(otroItem) {
        return this.producto.id === otroItem.producto.id;
    }

    // Método para obtener descripción del item
    getDescripcion() {
        return `${this.cantidad}x ${this.producto.nombre} - $${this.getSubtotal().toFixed(2)}`;
    }
}

// Exportar la clase para uso en otros módulos
window.ItemCarrito = ItemCarrito;
