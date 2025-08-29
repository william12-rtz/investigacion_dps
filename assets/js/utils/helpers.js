/**
 * Utilidades y funciones helper para TechStore
 * Funciones reutilizables para toda la aplicación
 */

const Utils = {
    /**
     * Formatear precio con símbolo de moneda
     */
    formatearPrecio(precio, moneda = '$') {
        return `${moneda}${parseFloat(precio).toFixed(2)}`;
    },

    /**
     * Formatear fecha en español
     */
    formatearFecha(fecha, opciones = {}) {
        const opcionesPorDefecto = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        return new Date(fecha).toLocaleDateString('es-ES', { ...opcionesPorDefecto, ...opciones });
    },

    /**
     * Generar ID único
     */
    generarId(prefijo = '') {
        return prefijo + Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Validar email
     */
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Validar número de teléfono
     */
    validarTelefono(telefono) {
        const regex = /^[\+]?[1-9][\d]{0,15}$/;
        return regex.test(telefono);
    },

    /**
     * Capitalizar primera letra
     */
    capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    },

    /**
     * Truncar texto
     */
    truncar(texto, longitud = 50) {
        return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto;
    },

    /**
     * Debounce function
     */
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Throttle function
     */
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();

            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    },

    /**
     * Guardar en localStorage
     */
    guardarEnStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
            return false;
        }
    },

    /**
     * Cargar desde localStorage
     */
    cargarDeStorage(key, valorPorDefecto = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : valorPorDefecto;
        } catch (error) {
            console.error('Error al cargar de localStorage:', error);
            return valorPorDefecto;
        }
    },

    /**
     * Eliminar de localStorage
     */
    eliminarDeStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error al eliminar de localStorage:', error);
            return false;
        }
    },

    /**
     * Scroll suave a elemento
     */
    scrollSuave(elemento, comportamiento = 'smooth') {
        if (typeof elemento === 'string') {
            elemento = document.querySelector(elemento);
        }

        if (elemento) {
            elemento.scrollIntoView({ behavior: comportamiento });
        }
    },

    /**
     * Animar elemento
     */
    animar(elemento, clase, duracion = 300) {
        if (typeof elemento === 'string') {
            elemento = document.querySelector(elemento);
        }

        if (elemento) {
            elemento.classList.add(clase);
            setTimeout(() => {
                elemento.classList.remove(clase);
            }, duracion);
        }
    },

    /**
     * Copiar texto al portapapeles
     */
    async copiarAlPortapapeles(texto) {
        try {
            await navigator.clipboard.writeText(texto);
            return true;
        } catch (error) {
            console.error('Error al copiar al portapapeles:', error);
            return false;
        }
    },

    /**
     * Detectar dispositivo móvil
     */
    esMovil() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Generar número de factura
     */
    generarNumeroFactura() {
        const fecha = new Date();
        const año = fecha.getFullYear().toString().slice(-2);
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        const secuencial = Date.now().toString().slice(-4);

        return `INV-${año}${mes}${dia}-${secuencial}`;
    },

    /**
     * Validar datos de producto
     */
    validarProducto(producto) {
        const errores = [];

        if (!producto.nombre || producto.nombre.trim().length < 3) {
            errores.push('El nombre debe tener al menos 3 caracteres');
        }

        if (!producto.precio || producto.precio <= 0) {
            errores.push('El precio debe ser mayor a 0');
        }

        if (producto.cantidad < 0) {
            errores.push('La cantidad no puede ser negativa');
        }

        if (!producto.categoria || producto.categoria.trim().length === 0) {
            errores.push('La categoría es requerida');
        }

        return errores;
    },

    /**
     * Formatear número con separadores de miles
     */
    formatearNumero(numero) {
        return new Intl.NumberFormat('es-ES').format(numero);
    },

    /**
     * Calcular porcentaje
     */
    calcularPorcentaje(valor, total) {
        return total > 0 ? (valor / total) * 100 : 0;
    },

    /**
     * Generar colores aleatorios
     */
    colorAleatorio() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    },

    /**
     * Crear elemento DOM con atributos
     */
    crearElemento(tag, atributos = {}, contenido = '') {
        const elemento = document.createElement(tag);

        Object.entries(atributos).forEach(([key, value]) => {
            if (key === 'className') {
                elemento.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(elemento.style, value);
            } else {
                elemento.setAttribute(key, value);
            }
        });

        if (contenido) {
            elemento.innerHTML = contenido;
        }

        return elemento;
    },

    /**
     * Crear evento personalizado
     */
    crearEvento(nombre, detalle = {}) {
        return new CustomEvent(nombre, {
            detail: detalle,
            bubbles: true,
            cancelable: true
        });
    },

    /**
     * Obtener información del navegador
     */
    obtenerInfoNavegador() {
        return {
            userAgent: navigator.userAgent,
            idioma: navigator.language,
            plataforma: navigator.platform,
            cookiesHabilitadas: navigator.cookieEnabled,
            conexion: navigator.onLine
        };
    }
};

// Logger personalizado
const Logger = {
    niveles: {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3
    },

    nivelActual: 2, // INFO por defecto

    log(nivel, mensaje, ...datos) {
        if (this.niveles[nivel] <= this.nivelActual) {
            const timestamp = new Date().toISOString();
            const metodo = nivel === 'ERROR' ? 'error' :
                nivel === 'WARN' ? 'warn' :
                    nivel === 'DEBUG' ? 'debug' : 'log';

            console[metodo](`[${timestamp}] ${nivel}:`, mensaje, ...datos);
        }
    },

    error(mensaje, ...datos) {
        this.log('ERROR', mensaje, ...datos);
    },

    warn(mensaje, ...datos) {
        this.log('WARN', mensaje, ...datos);
    },

    info(mensaje, ...datos) {
        this.log('INFO', mensaje, ...datos);
    },

    debug(mensaje, ...datos) {
        this.log('DEBUG', mensaje, ...datos);
    },

    setNivel(nivel) {
        this.nivelActual = this.niveles[nivel] || this.nivelActual;
    }
};

// Exportar utilidades
window.Utils = Utils;
window.Logger = Logger;

// Log de inicialización
Logger.info('🔧 Utilidades de TechStore cargadas correctamente');
