/**
 * Clase para representar un Producto
 * Maneja toda la lógica relacionada con productos individuales
 */
class Producto {
    constructor(id, nombre, precio, cantidad, categoria, descripcion, icono) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.icono = icono;
    }

    // Método para verificar si hay stock disponible
    tieneStock(cantidadSolicitada = 1) {
        return this.cantidad >= cantidadSolicitada;
    }

    // Método para reducir el stock
    reducirStock(cantidad) {
        if (this.tieneStock(cantidad)) {
            this.cantidad -= cantidad;
            return true;
        }
        return false;
    }

    // Método para restaurar el stock
    restaurarStock(cantidad) {
        this.cantidad += cantidad;
    }

    // Método para verificar si el stock es bajo
    esStockBajo() {
        return this.cantidad < 5;
    }

    // Método para obtener el estado del stock
    getEstadoStock() {
        if (this.cantidad === 0) return 'agotado';
        if (this.esStockBajo()) return 'bajo';
        return 'disponible';
    }

    // Método para clonar el producto (útil para el carrito)
    clonar() {
        return new Producto(
            this.id,
            this.nombre,
            this.precio,
            this.cantidad,
            this.categoria,
            this.descripcion,
            this.icono
        );
    }

    // Método para obtener información completa del producto
    getInfo() {
        return {
            id: this.id,
            nombre: this.nombre,
            precio: this.precio,
            cantidad: this.cantidad,
            categoria: this.categoria,
            descripcion: this.descripcion,
            icono: this.icono,
            estadoStock: this.getEstadoStock(),
            esStockBajo: this.esStockBajo()
        };
    }

    // Método para validar los datos del producto
    esValido() {
        return this.id &&
            this.nombre &&
            this.precio > 0 &&
            this.cantidad >= 0 &&
            this.categoria &&
            this.icono;
    }
}

// Exportar la clase para uso en otros módulos
window.Producto = Producto;
