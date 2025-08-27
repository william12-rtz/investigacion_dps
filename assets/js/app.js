/**
 * Archivo principal de inicialización de TechStore
 * Carga todas las dependencias y inicializa la aplicación
 */

// Instancia global de la tienda
let tienda;

// Función para verificar que todas las dependencias están cargadas
function verificarDependencias() {
    const dependenciasRequeridas = [
        "Producto",
        "ItemCarrito",
        "CarritoCompras",
        "NotificacionManager",
        "TechStore",
    ];

    const dependenciasFaltantes = dependenciasRequeridas.filter(
        (dep) => typeof window[dep] === "undefined"
    );

    if (dependenciasFaltantes.length > 0) {
        console.error("❌ Dependencias faltantes:", dependenciasFaltantes);
        return false;
    }

    console.log("✅ Todas las dependencias cargadas correctamente");
    return true;
}

// Función principal de inicialización
function inicializarTechStore() {
    try {
        if (!verificarDependencias()) {
            throw new Error("Faltan dependencias requeridas");
        }

        // Crear instancia principal de la tienda
        tienda = new TechStore();

        // Inicializar la aplicación
        tienda.inicializar();

        // Agregar productos adicionales después de 2 segundos (demo)
        setTimeout(() => {
            try {
                const productosExtra = [
                    new Producto(
                        11,
                        "Mouse Inalámbrico Premium",
                        35.99,
                        16,
                        "Tecnología",
                        "Mouse ergonómico con sensor óptico de alta precisión.",
                        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop&crop=center"
                    ),
                    new Producto(
                        12,
                        "Teclado Mecánico RGB",
                        89.99,
                        9,
                        "Tecnología",
                        "Teclado mecánico con retroiluminación RGB personalizable.",
                        "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop&crop=center"
                    ),
                    new Producto(
                        13,
                        "Auriculares Bluetooth Pro",
                        78.5,
                        12,
                        "Tecnología",
                        "Auriculares inalámbricos con cancelación de ruido activa.",
                        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop&crop=center"
                    ),
                    new Producto(
                        14,
                        "Tablet Digitalizadora",
                        156.75,
                        7,
                        "Tecnología",
                        "Tablet para diseño digital con stylus de precisión incluido.",
                        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&h=300&fit=crop&crop=center"
                    ),
                ];

                productosExtra.forEach((producto) => {
                    if (producto.esValido()) {
                        tienda.productos.push(producto);
                    }
                });

                tienda.inicializarFiltros();
                tienda.renderProductos();

                console.log("✨ Productos adicionales agregados via POO");
                NotificacionManager.info("🆕 Nuevos productos agregados al catálogo");
            } catch (error) {
                console.error("❌ Error al agregar productos adicionales:", error);
            }
        }, 2000);

        // Configurar manejadores globales de errores
        window.addEventListener("error", (e) => {
            console.error("❌ Error global capturado:", e.error);
            NotificacionManager.error("Ha ocurrido un error inesperado");
        });

        // Configurar funciones globales para compatibilidad
        window.filtrarPorCategoria = () => {
            const filtroSelect = document.getElementById("categoria-filter");
            if (filtroSelect && tienda) {
                const categoriaSeleccionada = filtroSelect.value;
                const productosFiltrados = tienda.filtrarPorCategoria(
                    categoriaSeleccionada
                );
                tienda.renderProductos(productosFiltrados);
            }
        };

        window.cambiarVista = (vista) => {
            if (tienda) {
                tienda.cambiarVista(vista);
            }
        };

        window.descargarFactura = () => {
            TicketGenerator.imprimirTicket();
        };

        window.imprimirTicket = () => {
            TicketGenerator.imprimirTicket();
        };

        // Exponer objetos para debugging en desarrollo
        if (typeof console !== "undefined") {
            window.debug = {
                tienda,
                Producto,
                ItemCarrito,
                CarritoCompras,
                NotificacionManager,
                TechStore,
                TicketGenerator,
                version: tienda ? tienda.version : "No inicializada",
            };

            console.log("🔧 Objetos de debug disponibles en window.debug");
        }

        console.log("🎉 TechStore inicializado completamente");
    } catch (error) {
        console.error("❌ Error al inicializar TechStore:", error);

        // Mostrar mensaje de error al usuario
        document.body.innerHTML = `
        <div style="
        display: flex; 
        justify-content: center; 
        align-items: center; 
        height: 100vh; 
        background: #fee2e2; 
        color: #dc2626;
        font-family: Arial, sans-serif;
        text-align: center;
        ">
        <div>
        <h1>❌ Error al cargar TechStore</h1>
        <p>Ha ocurrido un error al inicializar la aplicación.</p>
        <p><small>Error: ${error.message}</small></p>
        <button onclick="window.location.reload()" style="
            background: #dc2626; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 5px; 
            cursor: pointer;
            margin-top: 10px;
        ">
            Recargar Página
        </button>
        </div>
    </div>
    `;
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarTechStore);
} else {
    // El DOM ya está cargado
    inicializarTechStore();
}

// Exportar función de inicialización para uso manual si es necesario
window.inicializarTechStore = inicializarTechStore;
