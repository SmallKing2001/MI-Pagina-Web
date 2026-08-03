/**
 * ========================================
 * DESCUENTOS PRO - MAIN.JS
 * ========================================
 * Funcionalidades:
 * 1. Cargar ofertas desde JSON
 * 2. Renderizar tarjetas de productos
 * 3. Renderizar categorías
 * 4. Copiar códigos al portapapeles
 * 5. Toast notifications
 * 6. Scroll animations
 * 7. Mobile menu
 * 8. Navbar scroll effect
 * ========================================
 */

// ========================================
// 1. CARGAR OFERTAS DESDE JSON
// ========================================
async function cargarOfertas() {
    try {
        const response = await fetch('ofertas.json');
        if (!response.ok) throw new Error('No se pudo cargar ofertas.json');
        const ofertas = await response.json();
        
        // Renderizar todo
        renderizarOfertas(ofertas);
        actualizarEstadisticas(ofertas);
        renderizarCategorias(ofertas);
        renderizarFooterProveedores(ofertas);
        
        return ofertas;
    } catch (error) {
        console.error('Error cargando ofertas:', error);
        document.getElementById('productsGrid').innerHTML = `
            <div style="text-align:center; padding:3rem; color: var(--text-muted); grid-column: 1/-1;">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem; color: var(--secondary);"></i>
                <p style="margin-top:1rem;">No se pudieron cargar las ofertas.</p>
                <p style="font-size:0.8rem; margin-top:0.5rem; color: var(--text-muted);">
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
        grid.innerHTML = `
            <div style="text-align:center; padding:3rem; color: var(--text-muted); grid-column: 1/-1;">
                <i class="fas fa-inbox" style="font-size:3rem;"></i>
                <p style="margin-top:1rem;">No hay ofertas disponibles. Agrega algunas a <strong>ofertas.json</strong></p>
            </div>
        `;
        return;
    }

    grid.innerHTML = ofertas.map((o, index) => `
        <div class="product-card fade-in" style="transition-delay: ${index * 0.05}s">
            <div class="product-image">
                <i class="fas ${o.icono || 'fa-tag'}"></i>
                <span class="discount-tag">${o.descuento}</span>
                ${o.destacado ? '<span class="featured-badge">⭐ Destacado</span>' : ''}
            </div>
            <div class="product-content">
                <div class="product-provider">
                    <i class="fas fa-store"></i> ${o.proveedor}
                </div>
                <h3 class="product-title">${o.producto}</h3>
                <p class="product-description">${o.descripcion}</p>
                <div class="code-box">
                    <span class="code">${o.codigo}</span>
                    <button class="copy-btn" onclick="copyCode(this, '${o.codigo}')">
                        <i class="fas fa-copy"></i> Copiar
                    </button>
                </div>
                <div class="product-footer">
                    <span class="expiry">
                        <i class="fas fa-clock"></i> ${o.fecha_expiracion}
                    </span>
                    <a href="${o.enlace || '#'}" class="visit-btn" target="_blank" rel="noopener noreferrer">
                        Ir <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    // Activar animaciones de fade-in (con pequeño delay)
    setTimeout(() => {
        document.querySelectorAll('.product-card.fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 150);
}

// ========================================
// 3. ACTUALIZAR ESTADÍSTICAS DEL HERO
// ========================================
function actualizarEstadisticas(ofertas) {
    // Total de ofertas
    document.getElementById('totalOfertas').textContent = ofertas.length;
    
    // Total de proveedores únicos
    const proveedores = new Set(ofertas.map(o => o.proveedor));
    document.getElementById('totalProveedores').textContent = proveedores.size;
}

// ========================================
// 4. RENDERIZAR CATEGORÍAS
// ========================================
function renderizarCategorias(ofertas) {
    // Contar ofertas por categoría
    const categorias = {};
    ofertas.forEach(o => {
        const cat = o.categoria || 'Otros';
        categorias[cat] = (categorias[cat] || 0) + 1;
    });

    // Mapa de iconos por categoría
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
        <div class="category-card fade-in" style="transition-delay: ${index * 0.08}s">
            <i class="fas ${iconos[cat] || 'fa-tag'}"></i>
            <h4>${cat}</h4>
            <span>${categorias[cat]} oferta${categorias[cat] > 1 ? 's' : ''}</span>
        </div>
    `).join('');

    // Activar animaciones
    setTimeout(() => {
        document.querySelectorAll('.category-card.fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 200);
}

// ========================================
// 5. RENDERIZAR PROVEEDORES EN FOOTER
// ========================================
function renderizarFooterProveedores(ofertas) {
    const proveedores = [...new Set(ofertas.map(o => o.proveedor))];
    const list = document.getElementById('footerProveedores');
    
    if (proveedores.length === 0) {
        list.innerHTML = '<li>No hay proveedores</li>';
        return;
    }

    // Mostrar hasta 6 proveedores
    const proveedoresMostrar = proveedores.slice(0, 6);
    list.innerHTML = proveedoresMostrar.map(p => `
        <li><a href="#ofertas">${p}</a></li>
    `).join('');

    // Si hay más de 6, mostrar un "y más"
    if (proveedores.length > 6) {
        list.innerHTML += `<li><a href="#ofertas">+${proveedores.length - 6} más</a></li>`;
    }
}

// ========================================
// 6. COPIAR CÓDIGO AL PORTAPAPELES
// ========================================
function copyCode(btn, code) {
    // Usar el API moderno de clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
            mostrarCopiado(btn, code);
        }).catch(() => {
            // Fallback: método antiguo
            fallbackCopy(btn, code);
        });
    } else {
        // Fallback para navegadores antiguos
        fallbackCopy(btn, code);
    }
}

function fallbackCopy(btn, code) {
    const textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        mostrarCopiado(btn, code);
    } catch (err) {
        showToast('Error', 'No se pudo copiar el código. Intenta manualmente.');
    }
    document.body.removeChild(textarea);
}

function mostrarCopiado(btn, code) {
    btn.innerHTML = '<i class="fas fa-check"></i> Copiado';
    btn.classList.add('copied');
    showToast('¡Código copiado!', `El código ${code} está en tu portapapeles.`);
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
        btn.classList.remove('copied');
    }, 2000);
}

// ========================================
// 7. TOAST NOTIFICATION
// ========================================
let toastTimeout = null;

function showToast(title, message) {
    const toast = document.getElementById('toast');
    const titleEl = document.getElementById('toast-title');
    const messageEl = document.getElementById('toast-message');
    
    // Actualizar contenido
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    // Mostrar toast
    toast.classList.add('show');
    
    // Limpiar timeout anterior
    if (toastTimeout) clearTimeout(toastTimeout);
    
    // Ocultar después de 3 segundos
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========================================
// 8. NAVBAR SCROLL EFFECT
// ========================================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========================================
// 9. SMOOTH SCROLL PARA ENLACES INTERNOS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// 10. SCROLL REVEAL ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar elementos .fade-in (excepto los que ya se manejan desde JS)
document.querySelectorAll('.fade-in:not(.product-card):not(.category-card)').forEach(el => {
    observer.observe(el);
});

// ========================================
// 11. MOBILE MENU TOGGLE
// ========================================
document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const isVisible = navLinks.style.display === 'flex';
        navLinks.style.display = isVisible ? 'none' : 'flex';
    }
});

// ========================================
// 12. CERRAR MENÚ MÓVIL AL HACER CLICK EN UN ENLACE
// ========================================
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (window.innerWidth <= 768 && navLinks) {
            navLinks.style.display = 'none';
        }
    });
});

// ========================================
// 13. CARGAR OFERTAS AL INICIALIZAR
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    cargarOfertas();
});

// ========================================
// 14. RECARGAR OFERTAS SI CAMBIA EL JSON (Opcional)
// ========================================
// Si quieres que se actualice automáticamente cuando cambia el JSON,
// puedes usar este código (solo funciona en desarrollo local):
/*
setInterval(() => {
    cargarOfertas();
}, 30000); // Cada 30 segundos
*/

// Exportar funciones para usar en el HTML (si es necesario)
window.copyCode = copyCode;
window.showToast = showToast;