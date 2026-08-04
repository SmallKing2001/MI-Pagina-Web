// ========================================
// 2. RENDERIZAR OFERTAS (MEJORADO)
// ========================================
function renderizarOfertas(ofertas) {
    const grid = document.getElementById('productsGrid');
    
    if (!ofertas || ofertas.length === 0) {
        grid.innerHTML = `<div style="text-align:center; padding:3rem; color: #94a3b8; grid-column: 1/-1;">No hay ofertas disponibles.</div>`;
        return;
    }

    const filterStatus = document.getElementById('filterStatus');
    const resetBtn = document.getElementById('resetFilterBtn');
    
    if (categoriaSeleccionada) {
        filterStatus.textContent = `Mostrando ofertas de "${categoriaSeleccionada}" (${ofertas.length} ofertas)`;
        resetBtn.style.display = 'inline-flex';
    } else {
        filterStatus.textContent = `Códigos de descuento actualizados de tus proveedores favoritos.`;
        resetBtn.style.display = 'none';
    }

    grid.innerHTML = ofertas.map((o, index) => {
        // Determinar si mostrar código o solo enlace
        const esCodigo = o.tipo_oferta === 'codigo' && o.codigo;
        
        // Preparar el enlace
        const enlace = o.enlace || '#';
        const enlaceTexto = o.enlace_texto || 'Ver oferta';
        
        // Usar imagen si existe, sino mostrar icono
        const imagenHTML = o.imagen 
            ? `<img src="${o.imagen}" alt="${o.producto}" style="width:100%; height:100%; object-fit:cover;">`
            : `<i class="fas ${o.icono || 'fa-tag'}"></i>`;

        return `
        <div class="product-card fade-in" style="transition-delay: ${index * 0.05}s">
            <div class="product-image" style="position:relative; overflow:hidden;">
                ${imagenHTML}
                <span class="discount-tag">${o.descuento}</span>
                ${o.destacado ? '<span class="featured-badge">⭐ Destacado</span>' : ''}
                ${o.tipo_oferta === 'afiliado' ? '<span class="featured-badge" style="background:#f59e0b;">🔗 Afiliado</span>' : ''}
            </div>
            <div class="product-content">
                <div class="product-provider"><i class="fas fa-store"></i> ${o.proveedor}</div>
                <h3 class="product-title">${o.producto}</h3>
                <p class="product-description">${o.descripcion}</p>
                
                ${esCodigo ? `
                <div class="code-box">
                    <span class="code">${o.codigo}</span>
                    <button class="copy-btn" onclick="copyCode(this, '${o.codigo}')">
                        <i class="fas fa-copy"></i> Copiar
                    </button>
                </div>
                ` : `
                <div class="code-box" style="border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.05);">
                    <span style="color: var(--text-muted); font-size:0.85rem;">
                        <i class="fas fa-link" style="color: var(--secondary);"></i> Oferta sin código
                    </span>
                    <a href="${enlace}" target="_blank" class="copy-btn" style="text-decoration:none; background: var(--gradient-2);">
                        <i class="fas fa-arrow-right"></i> Ver
                    </a>
                </div>
                `}
                
                <div class="product-footer">
                    <span class="expiry"><i class="fas fa-clock"></i> ${o.fecha_expiracion}</span>
                    <a href="${enlace}" class="visit-btn" target="_blank">
                        ${enlaceTexto} <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `}).join('');

    setTimeout(() => {
        document.querySelectorAll('.product-card.fade-in').forEach(el => el.classList.add('visible'));
    }, 150);
}