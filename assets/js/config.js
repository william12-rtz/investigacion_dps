/**
 * Archivo de configuración para TechStore
 * Contiene constantes y configuraciones globales
 */

const CONFIGURACION = {
    // Información de la aplicación
    APP: {
        nombre: 'TechStore',
        version: '2.0.0',
        descripcion: 'Sistema de carrito de compras con POO',
        autor: 'TechStore Team'
    },

    // Configuración del carrito
    CARRITO: {
        impuestoPorDefecto: 0.13,
        moneda: 'USD',
        simboloMoneda: '$',
        stockMinimo: 5,
        cantidadMaximaPorItem: 99
    },

    // Configuración de notificaciones
    NOTIFICACIONES: {
        duracion: 3500,
        posicion: 'top-right',
        tiposPermitidos: ['success', 'error', 'warning', 'info']
    },

    // Configuración de la interfaz
    UI: {
        vistaPorDefecto: 'grid',
        productosPerPage: 20,
        animacionesDuracion: 300,
        coloresThema: {
            primario: '#3b82f6',
            secundario: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        }
    },

    // Configuración de datos
    DATOS: {
        guardarEnLocalStorage: true,
        keyLocalStorage: 'techstore_data',
        formatoFecha: 'es-ES'
    },

    // URLs y endpoints (para futuras integraciones)
    API: {
        baseUrl: 'https://api.techstore.com',
        endpoints: {
            productos: '/productos',
            carrito: '/carrito',
            factura: '/factura'
        },
        timeout: 5000
    },

    // Configuración de desarrollo
    DEBUG: {
        habilitado: true,
        logLevel: 'info', // 'error', 'warn', 'info', 'debug'
        mostrarRendering: false
    }
};

// Función para obtener configuración anidada
function obtenerConfig(ruta, valorPorDefecto = null) {
    return ruta.split('.').reduce((obj, key) =>
        obj && obj[key] !== undefined ? obj[key] : valorPorDefecto,
        CONFIGURACION
    );
}

// Función para actualizar configuración
function actualizarConfig(ruta, valor) {
    const keys = ruta.split('.');
    const lastKey = keys.pop();
    const obj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, CONFIGURACION);
    obj[lastKey] = valor;
}

// Exportar configuración
window.CONFIGURACION = CONFIGURACION;
window.obtenerConfig = obtenerConfig;
window.actualizarConfig = actualizarConfig;

// Log de inicialización
if (obtenerConfig('DEBUG.habilitado')) {
    console.log('⚙️ Configuración de TechStore cargada:', CONFIGURACION);
}
