// ========================================
// DESCUENTOS PRO - MAIN.JS (CON FILTROS)
// ========================================

// Variables globales
let todasLasOfertas = [];
let categoriaSeleccionada = null;

// ========================================
// 1. CARGAR OFERTAS
// ========================================
async function cargarOfertas() {
    try {
        const response = await fetch('ofertas.json');
        if (!response.ok) throw new Error('No se pudo cargar ofertas.json');
        todasLasOfertas = await response.json();
        
        renderizarOfertas(todasLasOfertas);
        actualizarEstadisticas(todasLasOfertas);
        renderizarCategorias(todasLasOfertas);
        renderizarFooterProveedores(todasLasOfertas);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('productsGrid').innerHTML = `
            <div style="text-align:center; padding:3rem; color: #94a3b8; grid-column: 1/-1;">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem; color: #f59e0b;"></i>
                <p style="margin-top:1rem;">No se pudieron cargar las ofertas.</p>
                <p style="font-size:0.8rem; margin-top:0.5rem; color: #64748b;">
                    Asegúrate de que el archivo <strong>ofertas.json</strong> existe en la raíz del proyecto.
                </p>
            </div>
        `;
    }
}

// ========================================
// 2. RENDERIZAR OFERTAS
// ========================================
function renderizarOfertas(ofertas) {
    const grid = document.getElementById('productsGrid');
    
    if (!ofertas || ofertas.length === 0) {
        grid.innerHTML = `<div style="text-align:center; padding:3rem; color: #94a3b8; grid-column: 1/-1;">No hay ofertas disponibles.</div>`;
        return;
    }

    // Actualizar el texto del filtro
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
        // Solo muestra el código si el tipo de oferta es "codigo" Y tiene un código real
        const esCodigo = o.tipo_oferta === 'codigo' && o.codigo;

        const enlace = o.enlace || '#';
        const enlaceTexto = o.enlace_texto || 'Ver oferta';

        // Imagen real del producto si existe; si no, cae al ícono como antes
        const imagenHTML = o.imagen
            ? `<img src="${o.imagen}" alt="${o.producto}">`
            : `<i class="fas ${o.icono || 'fa-tag'}"></i>`;

        return `
        <div class="product-card fade-in" style="transition-delay: ${index * 0.05}s">
            <div class="product-image">
                ${imagenHTML}
                <span class="discount-tag">${o.descuento}</span>
                ${o.destacado ? '<span class="featured-badge">⭐ Destacado</span>' : ''}
                ${o.tipo_oferta === 'afiliado' ? `<span class="featured-badge affiliate-badge"${o.destacado ? '' : ' style="top:0.8rem;"'}>🔗 Afiliado</span>` : ''}
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
                ` : ''}

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

// ========================================
// 3. RENDERIZAR CATEGORÍAS (CON CLICK)
// ========================================
function renderizarCategorias(ofertas) {
    const categorias = {};
    ofertas.forEach(o => {
        const cat = o.categoria || 'Otros';
        categorias[cat] = (categorias[cat] || 0) + 1;
    });

    const iconos = {
        'Tecnología': 'fa-laptop',
        'Moda': 'fa-tshirt',
        'Hogar': 'fa-home',
        'Deportes': 'fa-dumbbell',
        'Viajes': 'fa-plane',
        'Libros': 'fa-book',
        'Alimentación': 'fa-utensils',
        'Electrónica': 'fa-tv',
        'Juguetes': 'fa-gamepad',
        'Salud': 'fa-heartbeat',
        'Belleza': 'fa-spa',
        'Música': 'fa-music',
        'Cine': 'fa-film',
        'Otros': 'fa-tag'
    };

    const grid = document.getElementById('categoriesGrid');
    
    if (Object.keys(categorias).length === 0) {
        grid.innerHTML = `<div class="category-card">No hay categorías</div>`;
        return;
    }

    grid.innerHTML = Object.keys(categorias).map((cat, index) => `
        <div class="category-card fade-in" style="transition-delay: ${index * 0.08}s;" onclick="filtrarPorCategoria('${cat}')">
            <i class="fas ${iconos[cat] || 'fa-tag'}"></i>
            <h4>${cat}</h4>
            <span>${categorias[cat]} oferta${categorias[cat] > 1 ? 's' : ''}</span>
        </div>
    `).join('');

    setTimeout(() => {
        document.querySelectorAll('.category-card.fade-in').forEach(el => el.classList.add('visible'));
    }, 200);
}

// ========================================
// 4. FILTRAR POR CATEGORÍA
// ========================================
function filtrarPorCategoria(categoria) {
    categoriaSeleccionada = categoria;
    const ofertasFiltradas = todasLasOfertas.filter(o => o.categoria === categoria);
    
    // Scroll suave a la sección de ofertas
    document.getElementById('ofertas').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    renderizarOfertas(ofertasFiltradas);
}

// ========================================
// 5. RESET FILTRO (VER TODAS)
// ========================================
function resetFilter() {
    categoriaSeleccionada = null;
    renderizarOfertas(todasLasOfertas);
}

// ========================================
// 6. ACTUALIZAR ESTADÍSTICAS
// ========================================
function actualizarEstadisticas(ofertas) {
    document.getElementById('totalOfertas').textContent = ofertas.length;
    const proveedores = new Set(ofertas.map(o => o.proveedor));
    document.getElementById('totalProveedores').textContent = proveedores.size;
}

// ========================================
// 7. RENDERIZAR PROVEEDORES EN FOOTER
// ========================================
function renderizarFooterProveedores(ofertas) {
    const proveedores = [...new Set(ofertas.map(o => o.proveedor))];
    const list = document.getElementById('footerProveedores');
    list.innerHTML = proveedores.slice(0, 6).map(p => `<li><a href="#ofertas">${p}</a></li>`).join('');
    if (proveedores.length > 6) {
        list.innerHTML += `<li><a href="#ofertas">+${proveedores.length - 6} más</a></li>`;
    }
}

// ========================================
// 8. COPIAR CÓDIGO
// ========================================
function copyCode(btn, code) {
    navigator.clipboard.writeText(code).then(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Copiado';
        btn.classList.add('copied');
        showToast('¡Código copiado!', `El código ${code} está en tu portapapeles.`);
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
            btn.classList.remove('copied');
        }, 2000);
    });
}

// ========================================
// 9. TOAST
// ========================================
let toastTimeout = null;
function showToast(title, message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-message').textContent = message;
    toast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ========================================
// 10. NAVBAR SCROLL
// ========================================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// ========================================
// 11. SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ========================================
// 12. SCROLL REVEAL
// ========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade-in:not(.product-card):not(.category-card)').forEach(el => {
    observer.observe(el);
});

// ========================================
// 13. MOBILE MENU
// ========================================
// document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
//    const navLinks = document.querySelector('.nav-links');
//    if (navLinks) {
//        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
//    }
//});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (window.innerWidth <= 768 && navLinks) {
            navLinks.style.display = 'none';
        }
    });
});

// ========================================
// 14. BOTÓN RESET (VER TODAS)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('resetFilterBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilter);
    }
    cargarOfertas();
});

// ========================================
// 15. MENÚ MÓVIL MEJORADO
// ========================================

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.getElementById('menuBtn');
    
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('active');
    
    // Cambiar el ícono del botón
    const icon = menuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.className = 'fas fa-times';
        document.body.style.overflow = 'hidden'; // Evitar scroll
    } else {
        icon.className = 'fas fa-bars';
        document.body.style.overflow = '';
    }
}

function cerrarMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.getElementById('menuBtn');
    
    navLinks.classList.remove('active');
    menuBtn.classList.remove('active');
    
    const icon = menuBtn.querySelector('i');
    icon.className = 'fas fa-bars';
    document.body.style.overflow = '';
}

// Cerrar menú al hacer clic fuera (opcional)
document.addEventListener('click', function(e) {
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.getElementById('menuBtn');
    
    if (navLinks.classList.contains('active')) {
        const isClickInside = navLinks.contains(e.target) || menuBtn.contains(e.target);
        if (!isClickInside) {
            cerrarMenu();
        }
    }
});

// Cerrar menú al redimensionar a desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const navLinks = document.getElementById('navLinks');
        if (navLinks.classList.contains('active')) {
            cerrarMenu();
        }
    }
});

// ========================================
// EXPORTAR FUNCIONES
// ========================================
window.copyCode = copyCode;
window.showToast = showToast;
window.filtrarPorCategoria = filtrarPorCategoria;
window.resetFilter = resetFilter;