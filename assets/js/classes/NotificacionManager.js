/**
 * Clase para manejar las notificaciones del sistema
 * Proporciona diferentes tipos de notificaciones con animaciones
 */
class NotificacionManager {
    static configuracion = {
        duracion: 3000,
        posicion: 'top-right',
        animacion: 'slide'
    };

    static tipos = {
        success: {
            icono: 'check-circle',
            color: '#10b981',
            titulo: 'Éxito'
        },
        error: {
            icono: 'times-circle',
            color: '#ef4444',
            titulo: 'Error'
        },
        warning: {
            icono: 'exclamation-triangle',
            color: '#f59e0b',
            titulo: 'Advertencia'
        },
        info: {
            icono: 'info-circle',
            color: '#3b82f6',
            titulo: 'Información'
        }
    };

    static mostrar(mensaje, tipo = 'info', opciones = {}) {
        const config = { ...this.configuracion, ...opciones };
        const tipoConfig = this.tipos[tipo] || this.tipos.info;

        const notificacion = document.createElement('div');
        notificacion.className = `notification notification-${tipo}`;
        notificacion.innerHTML = this.crearContenido(mensaje, tipoConfig);

        this.aplicarEstilos(notificacion, tipoConfig, config);
        this.mostrarNotificacion(notificacion, config);

        return notificacion;
    }

    static crearContenido(mensaje, tipoConfig) {
        return `
        <div class="notification-header">
        <i class="fas fa-${tipoConfig.icono}"></i>
        <span class="notification-title">${tipoConfig.titulo}</span>
        </div>
        <div class="notification-message">${mensaje}</div>
        <button class="notification-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
        </button>
    `;
    }

    static aplicarEstilos(notificacion, tipoConfig, config) {
        Object.assign(notificacion.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: tipoConfig.color,
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            maxWidth: '300px',
            minWidth: '250px',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
        });

        // Estilos adicionales para elementos internos
        const header = notificacion.querySelector('.notification-header');
        if (header) {
            Object.assign(header.style, {
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600'
            });
        }

        const closeBtn = notificacion.querySelector('.notification-close');
        if (closeBtn) {
            Object.assign(closeBtn.style, {
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                opacity: '0.7',
                transition: 'opacity 0.2s'
            });

            closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
            closeBtn.onmouseout = () => closeBtn.style.opacity = '0.7';
        }
    }

    static mostrarNotificacion(notificacion, config) {
        document.body.appendChild(notificacion);

        // Animación de entrada
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
        }, 100);

        // Auto-close después del tiempo configurado
        setTimeout(() => {
            this.ocultarNotificacion(notificacion);
        }, config.duracion);

        // Click para cerrar
        notificacion.onclick = () => {
            this.ocultarNotificacion(notificacion);
        };
    }

    static ocultarNotificacion(notificacion) {
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }

    // Métodos específicos para cada tipo de notificación
    static success(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'success', opciones);
    }

    static error(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'error', opciones);
    }

    static warning(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'warning', opciones);
    }

    static info(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'info', opciones);
    }

    // Método para limpiar todas las notificaciones
    static limpiarTodas() {
        const notificaciones = document.querySelectorAll('.notification');
        notificaciones.forEach(notif => this.ocultarNotificacion(notif));
    }

    // Método para configurar las opciones globales
    static configurar(nuevaConfig) {
        this.configuracion = { ...this.configuracion, ...nuevaConfig };
    }

    // Método para mostrar notificación de progreso
    static progreso(mensaje, porcentaje = 0) {
        const notificacion = this.mostrar(mensaje, 'info', { duracion: 0 });

        const barraProgreso = document.createElement('div');
        barraProgreso.style.cssText = `
        width: 100%;
        height: 4px;
        background: rgba(255,255,255,0.3);
        border-radius: 2px;
        margin-top: 0.5rem;
        overflow: hidden;
    `;

        const progreso = document.createElement('div');
        progreso.style.cssText = `
        width: ${porcentaje}%;
        height: 100%;
        background: white;
        transition: width 0.3s ease;
    `;

        barraProgreso.appendChild(progreso);
        notificacion.appendChild(barraProgreso);

        return {
            actualizar: (nuevoPorcentaje) => {
                progreso.style.width = `${nuevoPorcentaje}%`;
            },
            cerrar: () => this.ocultarNotificacion(notificacion)
        };
    }
}

// Exportar la clase para uso en otros módulos
window.NotificacionManager = NotificacionManager;
