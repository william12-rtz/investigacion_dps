/**
 * Clase principal de la Tienda TechStore
 * Maneja toda la lógica de la aplicación, coordinando las demás clases
 */
class TechStore {
    constructor() {
        this.productos = [];
        this.carrito = new CarritoCompras();
        this.vistaActual = 'grid';
        this.filtroActual = 'all';
        this.version = '2.0.0';

        this.inicializarProductos();
        this.configurarNotificaciones();
    }

    // Configuración inicial de notificaciones
    configurarNotificaciones() {
        NotificacionManager.configurar({
            duracion: 3500,
            posicion: 'top-right'
        });
    }

    // Método para inicializar los productos
    inicializarProductos() {
        const datosProductos = [
            {
                id: 1,
                nombre: 'Cuaderno Universitario Premium',
                precio: 12.50,
                cantidad: 15,
                categoria: 'Papelería',
                descripcion: 'Cuaderno de 200 hojas con papel de alta calidad, ideal para estudiantes universitarios.',
                icono: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop&crop=center'
            },
            {
                id: 2,
                nombre: 'Set de Lápices Profesionales',
                precio: 8.99,
                cantidad: 25,
                categoria: 'Escritura',
                descripcion: 'Kit completo con lápices de diferentes graduaciones para dibujo técnico.',
                icono: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop&crop=center'
            },
            {
                id: 3,
                nombre: 'Mochila Ejecutiva Anti-robo',
                precio: 89.99,
                cantidad: 8,
                categoria: 'Accesorios',
                descripcion: 'Mochila impermeable con compartimento para laptop y sistema anti-robo.',
                icono: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center'
            },
            {
                id: 4,
                nombre: 'Regla Arquitectónica 30cm',
                precio: 6.75,
                cantidad: 20,
                categoria: 'Medición',
                descripcion: 'Regla de aluminio con medidas precisas, ideal para dibujo técnico.',
                icono: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop&crop=center'
            },
            {
                id: 5,
                nombre: 'Bolígrafos Gel Premium Pack',
                precio: 15.25,
                cantidad: 18,
                categoria: 'Escritura',
                descripcion: 'Set de 12 bolígrafos de gel de alta calidad en diferentes colores.',
                icono: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center'
            },
            {
                id: 6,
                nombre: 'Organizador de Escritorio',
                precio: 24.50,
                cantidad: 12,
                categoria: 'Organización',
                descripcion: 'Organizador multifuncional con compartimentos para optimizar tu espacio.',
                icono: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=300&fit=crop&crop=center'
            },
            {
                id: 7,
                nombre: 'Marcadores Fluorescentes Pro',
                precio: 18.75,
                cantidad: 10,
                categoria: 'Resaltado',
                descripcion: 'Set de 8 marcadores fluorescentes de colores vibrantes y duraderos.',
                icono: 'https://images.unsplash.com/photo-1623018035782-b269248df916?w=300&h=300&fit=crop&crop=center'
            },
            {
                id: 8,
                nombre: 'Compás Geométrico Profesional',
                precio: 32.25,
                cantidad: 6,
                categoria: 'Geometría',
                descripcion: 'Compás de precisión con accesorios para dibujo técnico profesional.',
                icono: 'https://panafargo.com/wp-content/uploads/2024/08/kit-geometrico-pelikan.jpg?w=300&h=300&fit=crop&crop=center'
            },
            {
                id: 9,
                nombre: 'Calculadora Científica Avanzada',
                precio: 45.99,
                cantidad: 14,
                categoria: 'Tecnología',
                descripcion: 'Calculadora con funciones científicas avanzadas y pantalla LCD.',
                icono: 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=300&h=300&fit=crop&crop=center'
            },
            {
                id: 10,
                nombre: 'Agenda Planificadora 2025',
                precio: 28.90,
                cantidad: 22,
                categoria: 'Planificación',
                descripcion: 'Agenda anual con diseño minimalista y secciones de productividad.',
                icono: 'https://img.joomcdn.net/bc6e39a55caee824a40940e4fd9f43ded69d28c0_original.jpeg?w=300&h=300&fit=crop&crop=center'
            }
        ];

        this.productos = datosProductos.map(data =>
            new Producto(data.id, data.nombre, data.precio, data.cantidad, data.categoria, data.descripcion, data.icono)
        );
    }

    // =================== MÉTODOS DE PRODUCTOS ===================

    obtenerProducto(id) {
        return this.productos.find(producto => producto.id === id);
    }

    obtenerCategorias() {
        return [...new Set(this.productos.map(producto => producto.categoria))];
    }

    filtrarPorCategoria(categoria) {
        if (categoria === 'all') {
            return this.productos;
        }
        return this.productos.filter(producto => producto.categoria === categoria);
    }

    buscarProductos(termino) {
        const terminoLower = termino.toLowerCase();
        return this.productos.filter(producto =>
            producto.nombre.toLowerCase().includes(terminoLower) ||
            producto.categoria.toLowerCase().includes(terminoLower) ||
            producto.descripcion.toLowerCase().includes(terminoLower)
        );
    }

    agregarProducto(datosProducto) {
        const nuevoId = Math.max(...this.productos.map(p => p.id)) + 1;
        const nuevoProducto = new Producto(
            nuevoId,
            datosProducto.nombre,
            datosProducto.precio,
            datosProducto.cantidad,
            datosProducto.categoria,
            datosProducto.descripcion,
            datosProducto.icono
        );

        this.productos.push(nuevoProducto);
        this.actualizarVistas();
        NotificacionManager.success(`✅ Producto "${nuevoProducto.nombre}" agregado al catálogo`);

        return nuevoProducto;
    }

    // =================== MÉTODOS DEL CARRITO ===================

    agregarAlCarrito(productoId, cantidad = 1) {
        const producto = this.obtenerProducto(productoId);

        if (!producto) {
            NotificacionManager.error('❌ Producto no encontrado');
            return false;
        }

        if (!this.validarCantidad(cantidad, producto)) {
            return false;
        }

        const itemExistente = this.carrito.obtenerItem(productoId);

        if (itemExistente) {
            const nuevaCantidad = itemExistente.cantidad + cantidad;
            if (!producto.tieneStock(nuevaCantidad)) {
                NotificacionManager.error(`❌ Solo hay ${producto.cantidad} unidades disponibles`);
                return false;
            }
            itemExistente.aumentarCantidad(cantidad);
            NotificacionManager.success(`✅ Se agregaron ${cantidad} unidades más de ${producto.nombre}`);
        } else {
            this.carrito.agregarProducto(producto, cantidad);
            NotificacionManager.success(`✅ ${producto.nombre} agregado al carrito`);
        }

        producto.reducirStock(cantidad);
        this.actualizarVistas();
        return true;
    }

    eliminarDelCarrito(productoId) {
        const item = this.carrito.obtenerItem(productoId);
        const producto = this.obtenerProducto(productoId);

        if (item && producto) {
            producto.restaurarStock(item.cantidad);
            this.carrito.eliminarProducto(productoId);
            NotificacionManager.info(`🗑️ ${producto.nombre} eliminado del carrito`);
            this.actualizarVistas();
        }
    }

    actualizarCantidadCarrito(productoId, nuevaCantidad) {
        const item = this.carrito.obtenerItem(productoId);
        const producto = this.obtenerProducto(productoId);

        if (!item || !producto) return;

        if (nuevaCantidad <= 0) {
            this.eliminarDelCarrito(productoId);
            return;
        }

        const diferencia = nuevaCantidad - item.cantidad;

        if (diferencia > producto.cantidad) {
            NotificacionManager.error(`❌ Solo hay ${producto.cantidad + item.cantidad} unidades disponibles`);
            return;
        }

        producto.cantidad -= diferencia;
        this.carrito.actualizarCantidad(productoId, nuevaCantidad);
        this.actualizarVistas();
    }

    validarCantidad(cantidad, producto) {
        if (!cantidad || cantidad <= 0) {
            NotificacionManager.warning('⚠️ Ingresa una cantidad válida');
            return false;
        }

        if (!producto.tieneStock(cantidad)) {
            NotificacionManager.error(`❌ Solo hay ${producto.cantidad} unidades disponibles`);
            return false;
        }

        return true;
    }

    // =================== MÉTODOS DE FACTURACIÓN ===================

    facturar() {
        if (this.carrito.estaVacio()) {
            NotificacionManager.warning('⚠️ Tu carrito está vacío. Agrega productos antes de facturar.');
            return;
        }

        const resumen = this.carrito.getResumen();
        const numeroFactura = 'INV-' + Date.now().toString().slice(-8);
        const fechaActual = new Date();

        this.mostrarFactura(numeroFactura, fechaActual, resumen);
        NotificacionManager.success('✅ Factura generada exitosamente');
    }

    limpiarCompra() {
        this.carrito.items.forEach(item => {
            const producto = this.obtenerProducto(item.producto.id);
            if (producto) {
                producto.restaurarStock(item.cantidad);
            }
        });

        this.carrito.limpiar();

        const facturaSection = document.getElementById('factura-section');
        if (facturaSection) {
            facturaSection.style.display = 'none';
        }

        this.actualizarVistas();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        NotificacionManager.info('🔄 ¡Listo para una nueva compra!');
    }

    // =================== MÉTODOS DE VISTA ===================

    cambiarVista(nuevaVista) {
        this.vistaActual = nuevaVista;

        const gridBtn = document.getElementById('grid-view');
        const listBtn = document.getElementById('list-view');

        if (gridBtn && listBtn) {
            gridBtn.classList.toggle('active', nuevaVista === 'grid');
            listBtn.classList.toggle('active', nuevaVista === 'list');
        }

        this.renderProductos();
    }

    actualizarVistas() {
        this.renderProductos();
        this.renderCarrito();
        this.actualizarContadorCarrito();
        this.animarIconoCarrito();
    }

    // =================== MÉTODOS DE RENDERIZADO ===================
    // (Estos métodos se mantendrán en el archivo principal por ahora)
    // En una estructura más avanzada, podrían moverse a clases de Vista separadas

    renderProductos(productosAMostrar = this.productos) {
        const container = document.getElementById('productos');
        if (!container) return;

        container.className = this.vistaActual === 'grid' ? 'products-grid' : 'products-list';

        if (productosAMostrar.length === 0) {
            container.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-search"></i>
          <h3>No se encontraron productos</h3>
          <p>Intenta cambiar los filtros de búsqueda</p>
        </div>`;
            return;
        }

        container.innerHTML = productosAMostrar.map(producto => this.crearTarjetaProducto(producto)).join('');
    }

    crearTarjetaProducto(producto) {
        const estadoStock = producto.getEstadoStock();
        const stockClass = estadoStock === 'bajo' ? 'low' : '';
        const stockBadge = estadoStock === 'bajo' ?
            `<div class="product-badge low-stock">⚠️ Pocas unidades</div>` :
            estadoStock === 'agotado' ? `<div class="product-badge">❌ Agotado</div>` : '';

        const isDisabled = estadoStock === 'agotado';

        return `
      <div class="product-card" data-categoria="${producto.categoria}">
        <div class="product-image">
          <img src="${producto.icono}" alt="${producto.nombre}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div style="display: none; width: 100%; height: 200px; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 8px; color: #6b7280; font-size: 3rem;">
            <i class="fas fa-image"></i>
          </div>
          ${stockBadge}
        </div>
        <div class="product-info">
          <div class="product-category">${producto.categoria}</div>
          <h3 class="product-name">${producto.nombre}</h3>
          <p class="product-description">${producto.descripcion}</p>
          
          <div class="product-pricing">
            <span class="product-price">$${producto.precio.toFixed(2)}</span>
            <span class="product-stock ${stockClass}">
              ${estadoStock === 'agotado' ? 'Agotado' : `${producto.cantidad} disponibles`}
            </span>
          </div>
          
          <div class="product-actions">
            <input 
              type="number" 
              min="1" 
              max="${producto.cantidad}" 
              value="1" 
              id="cant-${producto.id}" 
              class="quantity-input"
              ${isDisabled ? 'disabled' : ''}
            >
            <button 
              onclick="tienda.agregarAlCarrito(${producto.id}, parseInt(document.getElementById('cant-${producto.id}').value))" 
              class="add-to-cart"
              ${isDisabled ? 'disabled' : ''}
            >
              <i class="fas fa-${isDisabled ? 'times' : 'plus'}"></i>
              ${isDisabled ? 'Agotado' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>`;
    }

    renderCarrito() {
        const container = document.getElementById('carrito-items');
        const summary = document.getElementById('cart-summary');

        if (!container || !summary) return;

        if (this.carrito.estaVacio()) {
            container.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <h3>Tu carrito está vacío</h3>
          <p>¡Explora nuestros productos y encuentra lo que necesitas!</p>
        </div>`;
            summary.innerHTML = '';
            return;
        }

        container.innerHTML = this.carrito.items.map(item => this.crearItemCarrito(item)).join('');

        const resumen = this.carrito.getResumen();
        summary.innerHTML = `
      <div class="summary-title">Resumen del Pedido</div>
      <div class="summary-row">
        <span>Items (${resumen.totalItems})</span>
        <span>$${resumen.subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Impuesto (${(resumen.tasaImpuesto * 100)}%)</span>
        <span>$${resumen.impuesto.toFixed(2)}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>$${resumen.total.toFixed(2)}</span>
      </div>
      <button onclick="tienda.facturar()" class="checkout-btn">
        <i class="fas fa-credit-card"></i>
        Proceder al Pago
      </button>`;
    }

    crearItemCarrito(item) {
        const info = item.getInfo();
        return `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${info.icono}" alt="${info.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div style="display: none; width: 60px; height: 60px; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 6px; color: #6b7280; font-size: 1.5rem;">
            <i class="fas fa-image"></i>
          </div>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${info.nombre}</div>
          <div class="cart-item-category">${info.categoria}</div>
        </div>
        <div class="cart-item-controls">
          <div class="cart-item-quantity">
            <button class="quantity-btn" onclick="tienda.actualizarCantidadCarrito(${info.id}, ${info.cantidad - 1})">
              <i class="fas fa-minus"></i>
            </button>
            <span style="min-width: 30px; text-align: center; font-weight: 600;">${info.cantidad}</span>
            <button class="quantity-btn" onclick="tienda.actualizarCantidadCarrito(${info.id}, ${info.cantidad + 1})">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="cart-item-price">$${info.subtotal.toFixed(2)}</div>
          <button class="remove-btn" onclick="tienda.eliminarDelCarrito(${info.id})" title="Eliminar producto">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>`;
    }

    mostrarFactura(numeroFactura, fecha, resumen) {
        const facturaSection = document.getElementById('factura-section');
        const facturaContainer = document.getElementById('factura');

        if (!facturaSection || !facturaContainer) return;

        facturaContainer.innerHTML = `
      <div class="invoice-header">
        <h2><i class="fas fa-receipt"></i> Factura de Compra</h2>
        <div class="invoice-number">
          <div><strong>No. Factura:</strong> ${numeroFactura}</div>
          <div><strong>Fecha:</strong> ${fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</div>
        </div>
      </div>
      
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unit.</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${resumen.items.map(item => `
            <tr>
              <td style="display: flex; align-items: center; gap: 10px;">
                <img src="${item.icono}" alt="${item.nombre}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';"
                />
                <div style="display: none; width: 40px; height: 40px; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 4px; color: #6b7280; font-size: 1rem;">
                  <i class="fas fa-image"></i>
                </div>
                <span>${item.nombre}</span>
              </td>
              <td style="text-align: center;">${item.cantidad}</td>
              <td>$${item.precio.toFixed(2)}</td>
              <td>$${item.subtotal.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="invoice-totals">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>$${resumen.subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Impuesto (${(resumen.tasaImpuesto * 100)}%):</span>
          <span>$${resumen.impuesto.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
          <span>💰 Total a Pagar:</span>
          <span>$${resumen.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 12px; margin-top: 2rem;">
        <h3 style="color: #0369a1; margin-bottom: 1rem;">
          <i class="fas fa-check-circle"></i> ¡Gracias por tu compra!
        </h3>
        <p style="color: #0369a1; margin: 0;">
          Tu pedido será procesado en las próximas 24 horas.<br>
          <small>Recibirás un email de confirmación en breve.</small>
        </p>
      </div>`;

        facturaSection.style.display = 'block';
        facturaSection.scrollIntoView({ behavior: 'smooth' });
    }

    actualizarContadorCarrito() {
        const contador = document.getElementById('cart-count');
        if (!contador) return;

        const totalItems = this.carrito.getTotalItems();
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    animarIconoCarrito() {
        const icono = document.querySelector('.cart-icon');
        if (!icono) return;

        icono.style.transform = 'scale(1.2)';
        setTimeout(() => {
            icono.style.transform = 'scale(1)';
        }, 200);
    }

    // =================== INICIALIZACIÓN ===================

    inicializarFiltros() {
        const categorias = this.obtenerCategorias();
        const filtroSelect = document.getElementById('categoria-filter');

        if (!filtroSelect) return;

        // Limpiar opciones existentes (excepto "Todas las categorías")
        const opcionesTodas = filtroSelect.querySelector('option[value="all"]');
        filtroSelect.innerHTML = '';
        if (opcionesTodas) {
            filtroSelect.appendChild(opcionesTodas);
        }

        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            filtroSelect.appendChild(option);
        });
    }

    configurarEventListeners() {
        const btnSeguirComprando = document.getElementById('seguir-comprando');
        if (btnSeguirComprando) {
            btnSeguirComprando.onclick = () => this.limpiarCompra();
        }

        const filtroCategoria = document.getElementById('categoria-filter');
        if (filtroCategoria) {
            filtroCategoria.onchange = () => {
                this.filtroActual = filtroCategoria.value;
                const productosFiltrados = this.filtrarPorCategoria(this.filtroActual);
                this.renderProductos(productosFiltrados);
            };
        }

        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.onclick = () => {
                const carritoSection = document.getElementById('carrito');
                if (carritoSection) {
                    carritoSection.scrollIntoView({ behavior: 'smooth' });
                }
            };
        }

        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            };
        });

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('quantity-input')) {
                e.target.blur();
            }
        });

        const gridViewBtn = document.getElementById('grid-view');
        const listViewBtn = document.getElementById('list-view');

        if (gridViewBtn) {
            gridViewBtn.onclick = () => this.cambiarVista('grid');
        }

        if (listViewBtn) {
            listViewBtn.onclick = () => this.cambiarVista('list');
        }
    }

    inicializar() {
        console.log(`🚀 TechStore v${this.version} iniciado correctamente con POO`);

        this.renderProductos();
        this.renderCarrito();
        this.inicializarFiltros();
        this.configurarEventListeners();
        this.actualizarContadorCarrito();

        console.log(`📦 ${this.productos.length} productos cargados`);
        console.log('📋 Clases disponibles:', {
            Producto: typeof Producto !== 'undefined' ? 'OK' : 'NO CARGADA',
            ItemCarrito: typeof ItemCarrito !== 'undefined' ? 'OK' : 'NO CARGADA',
            CarritoCompras: typeof CarritoCompras !== 'undefined' ? 'OK' : 'NO CARGADA',
            NotificacionManager: typeof NotificacionManager !== 'undefined' ? 'OK' : 'NO CARGADA',
            TechStore: 'OK'
        });

        NotificacionManager.success('🎉 TechStore cargado exitosamente');
    }

    // =================== MÉTODOS UTILITARIOS ===================

    obtenerEstadisticas() {
        return {
            totalProductos: this.productos.length,
            categorias: this.obtenerCategorias().length,
            carritoInfo: this.carrito.getResumen(),
            estadisticasCarrito: this.carrito.getEstadisticas(),
            version: this.version
        };
    }

    exportarDatos() {
        return {
            productos: this.productos.map(p => p.getInfo()),
            carrito: this.carrito.getResumen(),
            configuracion: {
                vista: this.vistaActual,
                filtro: this.filtroActual
            },
            timestamp: new Date().toISOString()
        };
    }
}

// Exportar la clase para uso en otros módulos
window.TechStore = TechStore;
