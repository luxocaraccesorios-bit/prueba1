
  let currentFilter = 'todas';
  let currentBrand = 'todas';
  let allProducts = [];
  let config = null;

  function filterBrand(brand) {
    currentBrand = brand;
    document.querySelectorAll('.brand-pill').forEach(p => p.classList.remove('active'));
    event.target.classList.add('active');
    applyFilters();
  }

  function setFilter(el, cat) {
    currentFilter = cat;
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    applyFilters();
  }

  function searchProducts() {
    applyFilters();
  }

  function applyFilters() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
      const cat = card.dataset.cat;
      const brand = card.dataset.brand;
      const text = card.innerText.toLowerCase();
      const catOk = currentFilter === 'todas' || cat === currentFilter;
      const brandOk = currentBrand === 'todas' || brand === currentBrand;
      const searchOk = query === '' || text.includes(query);
      card.style.display = (catOk && brandOk && searchOk) ? '' : 'none';
    });
  }

  // Cargar datos del footer desde config.json
  async function loadFooterLinks() {
    try {
      const response = await fetch('config.json');
      config = await response.json();
      
      // Actualizar links del footer
      const footerLinks = document.querySelector('.footer-links');
      if (footerLinks) {
        footerLinks.innerHTML = `
          <a href="${config.whatsapp}" target="_blank">💬 WhatsApp</a>
          <a href="${config.instagram}" target="_blank">📱 Instagram</a>
          <a href="${config.tiktok}" target="_blank">🎵 TikTok</a>
          <a href="#">📍 Colombia</a>
        `;
      }
      
      // Actualizar footer text
      const footerBottom = document.querySelector('.footer-bottom span');
      if (footerBottom) {
        footerBottom.textContent = config.footerText;
      }
      
      // Actualizar todos los links de WhatsApp hardcodeados
      updateWhatsAppLinks(config.whatsapp);
    } catch (error) {
      console.error('Error cargando config:', error);
    }
  }

  // Actualizar todos los links de WhatsApp en el sitio
  function updateWhatsAppLinks(whatsappUrl) {
    // Floating WhatsApp
    const floatWa = document.querySelector('.float-wa');
    if (floatWa) {
      floatWa.href = `${whatsappUrl}?text=Hola!%20Vi%20el%20catálogo%20de%20Nardo%20Puro%20y%20quiero%20pedir`;
    }
    
    // Header WhatsApp button
    const headerWa = document.querySelector('.whatsapp-btn');
    if (headerWa) {
      headerWa.href = whatsappUrl;
    }
    
    // Hero WhatsApp button
    const heroWa = document.querySelector('.hero-cta .btn-outline');
    if (heroWa) {
      heroWa.href = whatsappUrl;
    }
    
    // Promo banner WhatsApp button
    const promoWa = document.querySelector('.promo-banner .btn-dark');
    if (promoWa) {
      promoWa.href = `${whatsappUrl}?text=Hola!%20Quiero%20ver%20los%20combos%20especiales`;
    }
  }

  // Ejecutar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', async () => {
    await loadFooterLinks(); // Cargar config primero
    await loadProducts(); // Luego cargar productos
  });

  // Cargar productos desde products.json
  async function loadProducts() {
    try {
      const response = await fetch('products.json');
      allProducts = await response.json();
      renderProducts(allProducts);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  }

  // Renderizar productos en el HTML
  function renderProducts(products) {
    if (!config) return; // Esperar a que config esté cargado

    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => {
      const savings = product.priceRevista - product.priceNew;
      const badgeHTML = product.badge 
        ? `<div class="badge-hot${product.badge.includes('-') ? ' badge-sale' : ' badge-new'}">${product.badge}</div>`
        : '';

      return `
        <div class="product-card" data-cat="${product.category}" data-brand="${product.brand}">
          ${badgeHTML}
          <div class="product-img">
            ${product.image.startsWith('h') 
              ? `<img src="${product.image}" alt="${product.name}" loading="lazy">` 
              : product.image}
          </div>
          <div class="product-info">
            <div class="product-brand">${product.brand.charAt(0).toUpperCase() + product.brand.slice(1)}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-desc">${product.description}</div>
            <div class="price-row">
              <div class="price-group">
                <span class="price-revista">Revista: $${product.priceRevista.toLocaleString('es-CO')}</span>
                <span class="price-new">$${product.priceNew.toLocaleString('es-CO')}</span>
                <span class="price-savings">Ahorras $${savings.toLocaleString('es-CO')} 💚</span>
              </div>
              <a class="add-btn" href="${config.whatsapp}?text=Quiero%20${encodeURIComponent(product.name)}" target="_blank">+</a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }