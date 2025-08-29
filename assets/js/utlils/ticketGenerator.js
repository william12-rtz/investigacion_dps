/**
 * Generador de Tickets de Compra - TechStore
 * Maneja toda la funcionalidad relacionada con la generación e impresión de tickets
 */

class TicketGenerator {
    
    /**
     * Configuración por defecto del ticket
     */
    static config = {
        storeName: '🛒 TECHSTORE',
        storeInfo: {
            description: 'Tu tienda de confianza',
            email: 'info@techstore.com',
            phone: '+1 (555) 123-4567'
        },
        ticket: {
            width: 300, // Ancho en px para impresoras térmicas
            fontSize: 12,
            headerFontSize: 18,
            separatorChar: '=',
            separatorLength: 40
        },
        social: '@TechStore'
    };

    /**
     * Imprime el ticket directamente
     */
    static imprimirTicket() {
        // Obtener datos de la factura actual
        const facturaContainer = document.getElementById('factura');
        if (!facturaContainer || !facturaContainer.innerHTML.trim()) {
            NotificacionManager.warning('⚠️ No hay factura disponible para imprimir');
            return;
        }

        // Extraer datos de la factura
        const numeroFacturaElement = facturaContainer.querySelector('.invoice-number');
        const tablaFactura = facturaContainer.querySelector('.invoice-table tbody');
        const totalesFactura = facturaContainer.querySelector('.invoice-totals');
        
        if (!numeroFacturaElement || !tablaFactura || !totalesFactura) {
            NotificacionManager.error('❌ Error al procesar los datos de la factura');
            return;
        }

        // Generar contenido del ticket e imprimir directamente
        const ticketContent = this.generarContenidoTicket(numeroFacturaElement, tablaFactura, totalesFactura);
        this.abrirVentanaImpresion(ticketContent);
    }

    /**
     * Genera el contenido HTML del ticket
     */
    static generarContenidoTicket(numeroFacturaElement, tablaFactura, totalesFactura) {
        const fechaActual = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        const numeroFactura = numeroFacturaElement.textContent
            .split('No. Factura:')[1]?.split('Fecha:')[0]?.trim() || 'N/A';

        // Extraer items de la tabla
        const itemsHTML = this.extraerItemsFactura(tablaFactura);
        
        // Extraer totales
        const totalesHTML = this.extraerTotalesFactura(totalesFactura);

        return this.generarHTMLTicket(numeroFactura, fechaActual, itemsHTML, totalesHTML);
    }

    /**
     * Extrae los items de la tabla de factura
     */
    static extraerItemsFactura(tablaFactura) {
        const filas = tablaFactura.querySelectorAll('tr');
        let itemsHTML = '';
        
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            if (celdas.length >= 4) {
                const nombre = celdas[0].textContent.trim();
                const cantidad = celdas[1].textContent.trim();
                const precio = celdas[2].textContent.trim();
                const subtotal = celdas[3].textContent.trim();
                
                itemsHTML += `
                    <tr>
                        <td style="padding: 8px 4px; border-bottom: 1px dashed #ccc; font-size: 12px; max-width: 200px; word-wrap: break-word;">
                            ${nombre}
                        </td>
                        <td style="padding: 8px 4px; border-bottom: 1px dashed #ccc; font-size: 12px; text-align: center; width: 40px;">
                            ${cantidad}
                        </td>
                        <td style="padding: 8px 4px; border-bottom: 1px dashed #ccc; font-size: 12px; text-align: right; width: 70px;">
                            ${precio}
                        </td>
                        <td style="padding: 8px 4px; border-bottom: 1px dashed #ccc; font-size: 12px; text-align: right; width: 80px; font-weight: bold;">
                            ${subtotal}
                        </td>
                    </tr>
                `;
            }
        });

        return itemsHTML;
    }

    /**
     * Extrae los totales de la factura
     */
    static extraerTotalesFactura(totalesFactura) {
        const filasTotal = totalesFactura.querySelectorAll('.summary-row');
        let totalesHTML = '';
        
        filasTotal.forEach(fila => {
            const spans = fila.querySelectorAll('span');
            if (spans.length >= 2) {
                const concepto = spans[0].textContent.trim();
                const valor = spans[1].textContent.trim();
                const esTotal = fila.classList.contains('total');
                
                totalesHTML += `
                    <tr>
                        <td style="padding: 4px; text-align: right; font-size: ${esTotal ? '14px' : '12px'}; ${esTotal ? 'font-weight: bold; border-top: 2px solid #000;' : ''}">${concepto}</td>
                        <td style="padding: 4px; text-align: right; font-size: ${esTotal ? '14px' : '12px'}; font-weight: bold; ${esTotal ? 'border-top: 2px solid #000;' : ''}">${valor}</td>
                    </tr>
                `;
            }
        });

        return totalesHTML;
    }

    /**
     * Genera el HTML completo del ticket
     */
    static generarHTMLTicket(numeroFactura, fecha, itemsHTML, totalesHTML) {
        const { storeName, storeInfo, ticket, social } = this.config;
        const separator = ticket.separatorChar.repeat(ticket.separatorLength);

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Ticket - ${numeroFactura}</title>
            <style>
                ${this.generarEstilosTicket()}
            </style>
        </head>
        <body>
            <div class="ticket-header">
                <div class="logo">${storeName}</div>
                <div class="store-info">
                    ${storeInfo.description}<br>
                    ${storeInfo.email}<br>
                    ${storeInfo.phone}
                </div>
            </div>

            <div class="invoice-info">
                <strong>TICKET DE COMPRA</strong><br>
                No: ${numeroFactura}<br>
                Fecha: ${fecha}<br>
                Atendido por: Sistema
            </div>

            <div class="separator">${separator}</div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th style="width: 40px; text-align: center;">Cant</th>
                        <th style="width: 70px; text-align: right;">Precio</th>
                        <th style="width: 80px; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>

            <div class="separator">${separator}</div>

            <table class="totals-table">
                <tbody>
                    ${totalesHTML}
                </tbody>
            </table>

            <div class="footer">
                <div class="separator">${separator}</div>
                <strong>¡GRACIAS POR SU COMPRA!</strong><br>
                Conserve este ticket como comprobante<br>
                <br>
                Síguenos en redes sociales<br>
                ${social}
                <div style="margin-top: 10px; font-size: 8px;">
                    Ticket generado el ${new Date().toLocaleString('es-ES')}
                </div>
            </div>

            <div class="no-print" style="margin-top: 20px; text-align: center;">
                <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px;">
                    🖨️ Imprimir
                </button>
                <button onclick="window.close()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px;">
                    ❌ Cerrar
                </button>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Genera los estilos CSS para el ticket
     */
    static generarEstilosTicket() {
        const { ticket } = this.config;
        
        return `
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body { 
            font-family: 'Courier New', monospace; 
            font-size: ${ticket.fontSize}px; 
            line-height: 1.4; 
            color: #000;
            max-width: ${ticket.width}px;
            margin: 0 auto;
            padding: 10px;
        }
        
        .ticket-header { 
            text-align: center; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        
        .logo { 
            font-size: ${ticket.headerFontSize}px; 
            font-weight: bold; 
            margin-bottom: 5px; 
        }
        
        .store-info { 
            font-size: 10px; 
            margin-bottom: 10px; 
        }
        
        .invoice-info { 
            margin-bottom: 15px; 
            font-size: 11px;
        }
        
        .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 15px; 
        }
        
        .items-table th {
            background: #f0f0f0;
            padding: 5px 2px;
            font-size: 10px;
            border-bottom: 1px solid #000;
            text-align: left;
        }
        
        .totals-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px; 
        }
        
        .footer { 
            text-align: center; 
            margin-top: 20px; 
            padding-top: 10px; 
            border-top: 1px dashed #000; 
            font-size: 10px; 
        }
        
        .separator { 
            text-align: center; 
            margin: 10px 0; 
            font-weight: bold; 
        }
        
        @media print {
            body { 
                max-width: none; 
                margin: 0; 
                padding: 5px; 
            }
            .no-print { 
                display: none !important; 
            }
        }
        `;
    }

    /**
     * Abre la ventana de impresión
     */
    static abrirVentanaImpresion(ticketContent) {
        const ventanaImpresion = window.open('', '_blank', 'width=400,height=600,scrollbars=yes,resizable=yes');
        
        if (!ventanaImpresion) {
            NotificacionManager.warning('⚠️ No se pudo abrir la ventana de impresión. Verifique que los pop-ups estén habilitados.');
            return;
        }

        ventanaImpresion.document.write(ticketContent);
        ventanaImpresion.document.close();
        
        // Esperar a que se cargue el contenido antes de imprimir
        ventanaImpresion.onload = function() {
            setTimeout(() => {
                ventanaImpresion.print();
            }, 500);
        };

        NotificacionManager.success('🖨️ Abriendo ventana de impresión...');
    }

    /**
     * Configura los ajustes del ticket
     */
    static configurar(nuevaConfig) {
        this.config = { ...this.config, ...nuevaConfig };
    }

    /**
     * Obtiene la configuración actual
     */
    static obtenerConfiguracion() {
        return { ...this.config };
    }
}

// Hacer disponible globalmente
window.TicketGenerator = TicketGenerator;
