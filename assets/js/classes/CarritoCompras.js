/**
 * CRUD CARRITO Y TOTALES
 */
class CarritoCompras {
    constructor(tasaImpuesto = 0.13) {
        this.items = [];
        this.tasaImpuesto = tasaImpuesto;
        this.fechaCreacion = new Date();
        this.id = 'cart_' + Date.now();
    }

    // Método para agregar un producto al carrito
    agregarProducto(producto, cantidad = 1) {
        if (!producto instanceof Producto) {
            throw new Error('Debe proporcionar un producto válido');
        }

        const itemExistente = this.items.find(item => item.producto.id === producto.id);

        if (itemExistente) {
            itemExistente.aumentarCantidad(cantidad);
        } else {
            const nuevoItem = new ItemCarrito(producto, cantidad);
            this.items.push(nuevoItem);
        }

        return this.items.length;
    }

    // Método para eliminar un producto del carrito
    eliminarProducto(productoId) {
        const indiceInicial = this.items.length;
        this.items = this.items.filter(item => item.producto.id !== productoId);
        return this.items.length < indiceInicial;
    }

    // Método para actualizar la cantidad de un producto
    actualizarCantidad(productoId, nuevaCantidad) {
        const item = this.items.find(item => item.producto.id === productoId);

        if (!item) {
            return false;
        }

        if (nuevaCantidad <= 0) {
            return this.eliminarProducto(productoId);
        } else {
            item.setCantidad(nuevaCantidad);
            return true;
        }
    }

    // Método para obtener un item específico
    obtenerItem(productoId) {
        return this.items.find(item => item.producto.id === productoId);
    }

    // Método para verificar si un producto está en el carrito
    tieneProducto(productoId) {
        return this.items.some(item => item.producto.id === productoId);
    }

    // Método para calcular el subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
    }

    // Método para calcular el impuesto
    getImpuesto() {
        return this.getSubtotal() * this.tasaImpuesto;
    }

    // Método para calcular el total
    getTotal() {
        return this.getSubtotal() + this.getImpuesto();
    }

    // Método para obtener el total de items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }

    // Método para obtener el número de productos únicos
    getTotalProductosUnicos() {
        return this.items.length;
    }

    // Método para verificar si el carrito está vacío
    estaVacio() {
        return this.items.length === 0;
    }

    // Método para limpiar el carrito
    limpiar() {
        this.items = [];
        return true;
    }

    // Método para obtener información completa del carrito
    getResumen() {
        return {
            id: this.id,
            items: this.items.map(item => item.getInfo()),
            subtotal: this.getSubtotal(),
            impuesto: this.getImpuesto(),
            total: this.getTotal(),
            totalItems: this.getTotalItems(),
            totalProductosUnicos: this.getTotalProductosUnicos(),
            tasaImpuesto: this.tasaImpuesto,
            fechaCreacion: this.fechaCreacion,
            estaVacio: this.estaVacio()
        };
    }

    // Método para obtener estadísticas del carrito
    getEstadisticas() {
        const categorias = {};
        let productoMasCaro = null;
        let productoMasBarato = null;

        this.items.forEach(item => {
            // Conteo por categorías
            categorias[item.producto.categoria] = (categorias[item.producto.categoria] || 0) + item.cantidad;

            // Producto más caro
            if (!productoMasCaro || item.producto.precio > productoMasCaro.precio) {
                productoMasCaro = item.producto;
            }

            // Producto más barato
            if (!productoMasBarato || item.producto.precio < productoMasBarato.precio) {
                productoMasBarato = item.producto;
            }
        });

        return {
            categorias,
            productoMasCaro,
            productoMasBarato,
            promedioPrecios: this.items.length > 0 ? this.getSubtotal() / this.getTotalItems() : 0
        };
    }

    // Método para validar el carrito
    esValido() {
        return this.items.every(item => item.esValido()) && this.items.length > 0;
    }

    // Método para duplicar el carrito
    clonar() {
        const nuevoCarrito = new CarritoCompras(this.tasaImpuesto);
        this.items.forEach(item => {
            nuevoCarrito.agregarProducto(item.producto, item.cantidad);
        });
        return nuevoCarrito;
    }
}

// Exportar la clase para uso en otros módulos
window.CarritoCompras = CarritoCompras;
