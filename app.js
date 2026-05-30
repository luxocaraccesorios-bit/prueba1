// Datos de productos
const products = [
  {
    id: 1,
    name: "Perfume Signature",
    brand: "esika",
    category: "perfumes",
    emoji: "🌸",
    priceOriginal: 89000,
    priceRevista: 120000,
    description: "Fragancia floral y sofisticada",
    badge: "hot"
  },
  {
    id: 2,
    name: "Base de Maquillaje",
    brand: "lbel",
    category: "maquillaje",
    emoji: "💄",
    priceOriginal: 45000,
    priceRevista: 65000,
    description: "Cobertura total y larga duración",
    badge: "sale"
  },
  {
    id: 3,
    name: "Labial Mate",
    brand: "cyzone",
    category: "maquillaje",
    emoji: "💋",
    priceOriginal: 32000,
    priceRevista: 48000,
    description: "Color intenso y resistente",
    badge: "new"
  },
  {
    id: 4,
    name: "Crema Facial",
    brand: "yanbal",
    category: "cuidado",
    emoji: "✨",
    priceOriginal: 55000,
    priceRevista: 85000,
    description: "Hidratación profunda 24h",
    badge: null
  },
  {
    id: 5,
    name: "Sérum Vitamina C",
    brand: "unique",
    category: "cuidado",
    emoji: "🧴",
    priceOriginal: 62000,
    priceRevista: 95000,
    description: "Antioxidante y luminosidad",
    badge: "sale"
  },
  {
    id: 6,
    name: "Perfume Floral",
    brand: "lbel",
    category: "perfumes",
    emoji: "🌺",
    priceOriginal: 75000,
    priceRevista: 110000,
    description: "Aroma fresco y duradero",
    badge: null
  }
];

let currentFilter = 'todas';
let currentCategory = 'todas';

// Actualizar número de WhatsApp (REEMPLAZAR CON TU NÚMERO)
const WHATSAPP_NUMBER = '573001234567'; // ← Reemplazar con tu número
const WHATSAPP_MESSAGE = 'Hola, quiero hacer un pedido en Nardo Puro Colombia';

function initializeApp() {
  updateWhatsAppLinks();
  renderProducts(products);
  setupEventListeners();
}

function updateWhatsAppLinks() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  
  document.querySelectorAll('.float-wa, .whatsapp-btn').forEach(el => {
    el.href = waLink;
  });
  
  document.querySelectorAll('.btn-outline').forEach(el => {
    el.href = waLink;
  });
  
  document.querySelector('.btn-dark').href = waLink;
}

function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', searchProducts);
  }
}

function filterBrand(brand) {
  currentFilter = brand;
  const brandPills = document.querySelectorAll('.brand-pill');
  brandPills.forEach(pill => pill.classList.remove('active'));
  event.target.classList.add('active');
  
  const filtered = brand === 'todas' 
    ? products 
    : products.filter(p => p.brand === brand);
  
  renderProducts(filtered);
}

function setFilter(element, category) {
  currentCategory = category;
  document.querySelectorAll('.filter-pill').forEach(el => el.classList.remove('active'));
  element.classList.add('active');
  
  const filtered = filterProductsByCategory();
  renderProducts(filtered);
}

function filterProductsByCategory() {
  let filtered = products;
  
  if (currentFilter !== 'todas') {
    filtered = filtered.filter(p => p.brand === currentFilter);
  }
  
  if (currentCategory !== 'todas') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }
  
  return filtered;
}

function searchProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
  if (!searchTerm) {
    renderProducts(filterProductsByCategory());
    return;
  }
  
  const filtered = filterProductsByCategory().filter(p => 
    p.name.toLowerCase().includes(searchTerm) ||
    p.brand.toLowerCase().includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm)
  );
  
  renderProducts(filtered);
}

function renderProducts(productsToRender) {
  const grid = document.getElementById('productGrid');
  
  if (!grid) return;
  
  if (productsToRender.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--muted);">No hay productos disponibles</div>';
    return;
  }
  
  grid.innerHTML = productsToRender.map(product => {
    const savings = Math.round(((product.priceRevista - product.priceOriginal) / product.priceRevista) * 100);
    const badgeClass = product.badge ? `badge-${product.badge}` : '';
    const badgeText = product.badge ? product.badge.toUpperCase() : '';
    
    return `
      <div class="product-card">
        <div class="product-img">
          ${product.emoji}
          ${product.badge ? `<div class="badge-hot ${badgeClass}">${badgeText}</div>` : ''}
        </div>
        <div class="product-info">
          <div class="product-brand">${product.brand.toUpperCase()}</div>
          <div class="product-name">${product.name}</div>
          <div class="product-desc">${product.description}</div>
          <div class="price-row">
            <div class="price-group">
              <div class="price-revista">Revista: $${product.priceRevista.toLocaleString()}</div>
              <div class="price-new">$${product.priceOriginal.toLocaleString()}</div>
              <div class="price-savings">-${savings}% de ahorro</div>
            </div>
            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE + ' - ' + product.name)}" class="add-btn" target="_blank">💬</a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
