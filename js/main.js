/* ============================================================
   CRIME SHOPPERS - Main JavaScript
   ============================================================ */

'use strict';

// ============================================================
// PAGE LOADER
// ============================================================
(function () {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  document.body.prepend(loader);
  setTimeout(() => loader.remove(), 900);
})();

// ============================================================
// PRODUCT DATA
// ============================================================
const PRODUCTS = [
  {
    id: 1,
    name: 'Serial Chiller T-Shirt',
    price: 24.99,
    category: 'T-Shirts',
    icon: '👕',
    color: '#1a3a5c',
    bestSeller: false,
    description: 'Relax like you have an alibi.'
  },
  {
    id: 2,
    name: 'True Crime Addict Hoodie',
    price: 44.99,
    category: 'Hoodies',
    icon: '🧥',
    color: '#2d1b1b',
    bestSeller: true,
    description: 'Cozy enough for 12-hour podcast sessions.'
  },
  {
    id: 3,
    name: '"I Didn\'t Do It (Probably)" Mug',
    price: 14.99,
    category: 'Mugs',
    icon: '☕',
    color: '#1b2d1b',
    bestSeller: false,
    description: 'Start every morning with reasonable doubt.'
  },
  {
    id: 4,
    name: '"Crime Scene – Do Not Eat" Apron',
    price: 29.99,
    category: 'Accessories',
    icon: '🍳',
    color: '#2d2d1b',
    bestSeller: false,
    description: 'Keep evidence off your clothes.'
  },
  {
    id: 5,
    name: 'Forensic Files Marathon Champion Cap',
    price: 22.99,
    category: 'Accessories',
    icon: '🧢',
    color: '#1b1b2d',
    bestSeller: true,
    description: '72 episodes. Zero breaks. Certified.'
  },
  {
    id: 6,
    name: '"In My Defense, I Was Unsupervised" Tote',
    price: 18.99,
    category: 'Accessories',
    icon: '👜',
    color: '#2d1b2d',
    bestSeller: false,
    description: 'A valid legal argument, and a great bag.'
  },
  {
    id: 7,
    name: '"My Other Car is a Crime Scene" Sticker',
    price: 6.99,
    category: 'Accessories',
    icon: '🚗',
    color: '#1b2d2d',
    bestSeller: false,
    description: 'Great for bumpers, laptops, evidence boards.'
  },
  {
    id: 8,
    name: 'Murderino Enamel Pin',
    price: 9.99,
    category: 'Accessories',
    icon: '📌',
    color: '#2d2020',
    bestSeller: true,
    description: 'SSDGM. Stay Sexy, Don\'t Get Murdered.'
  },
  {
    id: 9,
    name: 'True Crime Junkie Tumbler',
    price: 27.99,
    category: 'Mugs',
    icon: '🥤',
    color: '#1a1a1a',
    bestSeller: false,
    description: 'Hydrate between episodes. Stay sharp.'
  },
  {
    id: 10,
    name: 'Crime Tape Socks',
    price: 12.99,
    category: 'Accessories',
    icon: '🧦',
    color: '#3d2b00',
    bestSeller: false,
    description: 'Step carefully. You\'re on the scene.'
  },
  {
    id: 11,
    name: '"The Butler Didn\'t Do It" Throw Pillow',
    price: 34.99,
    category: 'Accessories',
    icon: '🛋️',
    color: '#1a2a1a',
    bestSeller: false,
    description: 'Rest your head on unsolved mysteries.'
  },
  {
    id: 12,
    name: '"Innocent Until Proven Guilty" Phone Case',
    price: 19.99,
    category: 'Accessories',
    icon: '📱',
    color: '#2a1a2a',
    bestSeller: false,
    description: 'Protect your phone and your rights.'
  }
];

// ============================================================
// CART STATE (localStorage)
// ============================================================
const CART_KEY = 'crimeshoppers_cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  updateCartUI();
  return cart;
}

function removeFromCart(productId) {
  let cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  updateCartUI();
}

function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = Math.max(0, item.qty + delta);
    if (item.qty === 0) {
      const idx = cart.indexOf(item);
      cart.splice(idx, 1);
    }
  }
  saveCart(cart);
  updateCartUI();
}

// ============================================================
// CART UI
// ============================================================
function updateCartUI() {
  const cart = getCart();
  const count = getCartCount(cart);
  const total = getCartTotal(cart);

  // Update all count badges on the page
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  });

  // Render cart items
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartEmptyEl = document.getElementById('cart-empty');
  const cartContentEl = document.getElementById('cart-content');

  if (!cartItemsEl) return;

  if (cart.length === 0) {
    if (cartEmptyEl) cartEmptyEl.style.display = 'flex';
    if (cartContentEl) cartContentEl.style.display = 'none';
  } else {
    if (cartEmptyEl) cartEmptyEl.style.display = 'none';
    if (cartContentEl) cartContentEl.style.display = 'flex';

    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-img" style="background-color: ${item.color || '#222'}">
          ${item.icon || '🛍️'}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item">✕</button>
      </div>
    `).join('');
  }

  if (cartTotalEl) {
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  // Re-bind cart item events
  bindCartItemEvents();
}

function bindCartItemEvents() {
  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => updateQty(parseInt(btn.dataset.id), -1));
  });
  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => updateQty(parseInt(btn.dataset.id), 1));
  });
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
  });
}

// ============================================================
// CART SIDEBAR TOGGLE
// ============================================================
function openCart() {
  document.getElementById('cart-sidebar')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-sidebar')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ============================================================
// MOBILE HAMBURGER MENU
// ============================================================
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ============================================================
// INTERSECTION OBSERVER - Fade In
// ============================================================
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ============================================================
// NEWSLETTER FORM
// ============================================================
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const success = document.getElementById('newsletter-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input?.value) return;

    // Simulate submission
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'Sending...';
      btn.disabled = true;
    }

    setTimeout(() => {
      form.style.display = 'none';
      if (success) {
        success.classList.add('visible');
      }
    }, 1000);
  });
}

// ============================================================
// CONTACT FORM
// ============================================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn?.textContent;
    if (btn) {
      btn.textContent = 'Sending...';
      btn.disabled = true;
    }

    setTimeout(() => {
      const success = document.getElementById('contact-success');
      form.style.display = 'none';
      if (success) success.classList.add('visible');
    }, 1200);
  });
}

// ============================================================
// PRODUCT FILTER (shop page)
// ============================================================
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  const productCards = document.querySelectorAll('.product-card[data-category]');
  const countEl = document.getElementById('product-count');
  const noResults = document.getElementById('no-results');

  function filterProducts(category) {
    let visible = 0;
    productCards.forEach(card => {
      const match = category === 'All' || card.dataset.category === category;
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    if (countEl) {
      countEl.innerHTML = `Showing <strong>${visible}</strong> product${visible !== 1 ? 's' : ''}`;
    }

    if (noResults) {
      noResults.classList.toggle('visible', visible === 0);
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      filterProducts(btn.dataset.filter);
    });
  });
}

// ============================================================
// ADD TO CART BUTTONS
// ============================================================
function initAddToCart() {
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.dataset.productId);
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product) return;

      addToCart(product);
      openCart();

      // Visual feedback
      const originalText = btn.innerHTML;
      btn.classList.add('added');
      btn.innerHTML = '✓ Added to Cart';
      setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = originalText;
      }, 2000);
    });
  });
}

// ============================================================
// RENDER PRODUCTS (used on homepage and shop page)
// ============================================================
function renderProducts(containerSelector, products, limit = null) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const toRender = limit ? products.slice(0, limit) : products;

  container.innerHTML = toRender.map(product => `
    <div class="product-card fade-in" data-category="${product.category}">
      ${product.bestSeller ? '<div class="badge-wanted">⭐ Best Seller</div>' : ''}
      <div class="product-img" style="background-color: ${product.color}">
        <div class="product-img-pattern"></div>
        <span class="product-icon">${product.icon}</span>
      </div>
      <div class="product-info">
        <div class="product-meta">
          <span class="badge-category">${product.category}</span>
        </div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button
          class="btn-add-cart"
          data-product-id="${product.id}"
          aria-label="Add ${product.name} to cart"
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  `).join('');

  // Rebind add to cart after rendering
  initAddToCart();
  // Reinit fade-in for newly rendered elements
  initFadeIn();
}

// ============================================================
// ACTIVE NAV LINK
// ============================================================
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Cart sidebar open/close
  document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.addEventListener('click', openCart);
  });

  const cartClose = document.getElementById('cart-close');
  if (cartClose) cartClose.addEventListener('click', closeCart);

  const cartOverlay = document.getElementById('cart-overlay');
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });

  // Core init
  initHamburger();
  initActiveNav();
  initFadeIn();
  initSmoothScroll();
  initNewsletter();
  initContactForm();
  initProductFilter();

  // Render products if containers exist
  renderProducts('#featured-products', PRODUCTS, 4);
  renderProducts('#all-products', PRODUCTS);

  // If add-to-cart buttons already in HTML (not rendered by JS)
  initAddToCart();

  // Update cart UI on load
  updateCartUI();

  // Checkout button (placeholder)
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) return;
      // In a real store, redirect to Shopify checkout
      alert('🛒 Checkout integration coming soon!\n\nConnect Shopify, Printful, or your preferred platform via the Integrations guide.');
    });
  }

  console.log('%c CRIME SHOPPERS 🔍 ', 'background: #FFD700; color: #0d0d0d; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 4px;');
  console.log('%c See Something? Buy Something! ', 'color: #FFD700; font-size: 11px;');
});

// Expose closeCart globally for inline event handlers
window.closeCart = closeCart;
