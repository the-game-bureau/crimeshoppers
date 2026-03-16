/**
 * Crime Shoppers Theme JS
 * Custom enhancements for the Crime Shoppers Shopify theme
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Console Branding
  ---------------------------------------------------------- */
  console.log(
    '%c🔍 CRIME SHOPPERS %c See Something? Buy Something! ',
    'background:#FFD700;color:#000;font-size:14px;font-weight:800;padding:6px 12px;',
    'background:#0d0d0d;color:#FFD700;font-size:12px;padding:6px 12px;border:1px solid #FFD700;'
  );

  /* ----------------------------------------------------------
     IntersectionObserver: Fade-in Animations
  ---------------------------------------------------------- */
  function initAnimations() {
    var elements = document.querySelectorAll('.cs-animate');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: make all visible immediately
      elements.forEach(function (el) {
        el.classList.add('cs-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('cs-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     Mobile Hamburger Menu
  ---------------------------------------------------------- */
  function initMobileMenu() {
    var hamburger = document.querySelector('.cs-hamburger');
    var mobileNav = document.querySelector('.cs-mobile-nav');

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        hamburger.classList.contains('open') &&
        !hamburger.contains(e.target) &&
        !mobileNav.contains(e.target)
      ) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------------------------
     Cart Drawer
  ---------------------------------------------------------- */
  var cartDrawer = {
    sidebar: null,
    overlay: null,
    closeBtn: null,
    cartBtns: null,

    init: function () {
      this.sidebar = document.querySelector('.cs-cart-sidebar');
      this.overlay = document.querySelector('.cs-cart-overlay');
      this.closeBtn = document.querySelector('.cs-cart-close');
      this.cartBtns = document.querySelectorAll('[data-open-cart], .cs-cart-btn');

      if (!this.sidebar) return;

      var self = this;

      if (this.overlay) {
        this.overlay.addEventListener('click', function () {
          self.close();
        });
      }

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', function () {
          self.close();
        });
      }

      this.cartBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          self.open();
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          self.close();
        }
      });
    },

    open: function () {
      if (!this.sidebar) return;
      this.sidebar.classList.add('open');
      if (this.overlay) this.overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      this.sidebar.setAttribute('aria-hidden', 'false');
      this.fetchCart();
    },

    close: function () {
      if (!this.sidebar) return;
      this.sidebar.classList.remove('open');
      if (this.overlay) this.overlay.classList.remove('open');
      document.body.style.overflow = '';
      this.sidebar.setAttribute('aria-hidden', 'true');
    },

    fetchCart: function () {
      fetch('/cart.js')
        .then(function (res) {
          return res.json();
        })
        .then(function (cart) {
          cartDrawer.render(cart);
        })
        .catch(function (err) {
          console.error('CS Cart Error:', err);
        });
    },

    render: function (cart) {
      var itemsContainer = document.querySelector('.cs-cart-items');
      var subtotalEl = document.querySelector('.cs-cart-subtotal-value');
      var countEls = document.querySelectorAll('.cs-cart-count');

      // Update count badge
      var totalQty = cart.item_count || 0;
      countEls.forEach(function (el) {
        el.textContent = totalQty;
        el.style.display = totalQty > 0 ? 'flex' : 'none';
        el.classList.add('bounce');
        setTimeout(function () {
          el.classList.remove('bounce');
        }, 400);
      });

      if (subtotalEl) {
        subtotalEl.textContent = cartDrawer.formatMoney(cart.total_price);
      }

      if (!itemsContainer) return;

      if (!cart.items || cart.items.length === 0) {
        itemsContainer.innerHTML =
          '<div class="cs-cart-empty">' +
          '<div class="cs-cart-empty-icon">🛒</div>' +
          '<p>Your cart is empty. No evidence yet.</p>' +
          '<a href="/collections/all" class="btn-cs-secondary btn-sm" style="margin-top:12px;">Browse Products</a>' +
          '</div>';
        return;
      }

      var html = '';
      cart.items.forEach(function (item) {
        html +=
          '<div class="cs-cart-item" data-key="' + item.key + '">' +
          '<div class="cs-cart-item-image">' +
          (item.image
            ? '<img src="' + item.image + '" alt="' + item.product_title + '" loading="lazy">'
            : '') +
          '</div>' +
          '<div class="cs-cart-item-info">' +
          '<div class="cs-cart-item-name">' + item.product_title + '</div>' +
          (item.variant_title && item.variant_title !== 'Default Title'
            ? '<div class="cs-cart-item-variant">' + item.variant_title + '</div>'
            : '') +
          '<div class="cs-cart-item-price">' + cartDrawer.formatMoney(item.line_price) + '</div>' +
          '<div class="cs-cart-qty">' +
          '<button class="cs-qty-btn" data-key="' + item.key + '" data-qty="' + (item.quantity - 1) + '" aria-label="Decrease quantity">-</button>' +
          '<span class="cs-qty-value">' + item.quantity + '</span>' +
          '<button class="cs-qty-btn" data-key="' + item.key + '" data-qty="' + (item.quantity + 1) + '" aria-label="Increase quantity">+</button>' +
          '</div>' +
          '</div>' +
          '<button class="cs-cart-item-remove" data-key="' + item.key + '" aria-label="Remove item">✕</button>' +
          '</div>';
      });

      itemsContainer.innerHTML = html;

      // Bind qty / remove buttons
      itemsContainer.querySelectorAll('.cs-qty-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          cartDrawer.updateItem(btn.dataset.key, parseInt(btn.dataset.qty, 10));
        });
      });

      itemsContainer.querySelectorAll('.cs-cart-item-remove').forEach(function (btn) {
        btn.addEventListener('click', function () {
          cartDrawer.updateItem(btn.dataset.key, 0);
        });
      });
    },

    updateItem: function (key, qty) {
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: qty }),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (cart) {
          cartDrawer.render(cart);
        })
        .catch(function (err) {
          console.error('CS Cart Update Error:', err);
        });
    },

    formatMoney: function (cents) {
      var dollars = (cents / 100).toFixed(2);
      return '$' + dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  };

  /* ----------------------------------------------------------
     Add to Cart — AJAX intercept
  ---------------------------------------------------------- */
  function initAddToCart() {
    document.addEventListener('submit', function (e) {
      var form = e.target;
      if (
        form.getAttribute('action') === '/cart/add' ||
        form.classList.contains('product-form__cart-submit') ||
        form.classList.contains('cs-add-to-cart-form')
      ) {
        e.preventDefault();
        var formData = new FormData(form);

        fetch('/cart/add.js', {
          method: 'POST',
          body: formData,
        })
          .then(function (res) {
            return res.json();
          })
          .then(function () {
            cartDrawer.open();
          })
          .catch(function (err) {
            console.error('CS Add to Cart Error:', err);
          });
      }
    });
  }

  /* ----------------------------------------------------------
     Newsletter Form Enhancement
  ---------------------------------------------------------- */
  function initNewsletter() {
    var form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function () {
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Subscribing...';
        btn.disabled = true;
      }
    });
  }

  /* ----------------------------------------------------------
     Collection Filter Buttons
  ---------------------------------------------------------- */
  function initFilters() {
    var filterBtns = document.querySelectorAll('.cs-filter-btn');
    var productCards = document.querySelectorAll('.cs-product-card');

    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = btn.dataset.filter;

        // Toggle active state
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        // Filter cards
        productCards.forEach(function (card) {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
            card.style.animation = 'cs-fade-in 0.3s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------
     Cart Count Badge Sync (on page load)
  ---------------------------------------------------------- */
  function syncCartCount() {
    fetch('/cart.js')
      .then(function (res) {
        return res.json();
      })
      .then(function (cart) {
        var countEls = document.querySelectorAll('.cs-cart-count');
        var qty = cart.item_count || 0;
        countEls.forEach(function (el) {
          el.textContent = qty;
          el.style.display = qty > 0 ? 'flex' : 'none';
        });
      })
      .catch(function () {
        // Silent fail — cart count is non-critical
      });
  }

  /* ----------------------------------------------------------
     Smooth Scroll for anchor links
  ---------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        var offset = 80; // header height
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ----------------------------------------------------------
     Product Thumbnail Gallery (product page)
  ---------------------------------------------------------- */
  function initProductGallery() {
    var thumbs = document.querySelectorAll('.cs-product-thumb');
    var mainImg = document.querySelector('.cs-product-main-image img');

    if (!thumbs.length || !mainImg) return;

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var src = thumb.dataset.src;
        if (src) {
          mainImg.src = src;
          mainImg.alt = thumb.dataset.alt || '';
        }
        thumbs.forEach(function (t) {
          t.classList.remove('active');
        });
        thumb.classList.add('active');
      });
    });
  }

  /* ----------------------------------------------------------
     Active Nav Link Highlighting
  ---------------------------------------------------------- */
  function initActiveNav() {
    var currentPath = window.location.pathname;
    var navLinks = document.querySelectorAll('.cs-nav-link, .cs-mobile-nav-link');

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href !== '/' && currentPath.startsWith(href)) {
        link.classList.add('active');
      } else if (href === '/' && currentPath === '/') {
        link.classList.add('active');
      }
    });
  }

  /* ----------------------------------------------------------
     Announcement bar close (optional)
  ---------------------------------------------------------- */
  function initAnnouncementClose() {
    var closeBtn = document.querySelector('.cs-announcement-close');
    var bar = document.querySelector('.cs-announcement-bar');
    if (!closeBtn || !bar) return;

    closeBtn.addEventListener('click', function () {
      bar.style.display = 'none';
      try {
        sessionStorage.setItem('cs-announcement-closed', '1');
      } catch (e) {
        // ignore
      }
    });

    try {
      if (sessionStorage.getItem('cs-announcement-closed') === '1') {
        bar.style.display = 'none';
      }
    } catch (e) {
      // ignore
    }
  }

  /* ----------------------------------------------------------
     Init all on DOMContentLoaded
  ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initAnimations();
    initMobileMenu();
    cartDrawer.init();
    initAddToCart();
    initNewsletter();
    initFilters();
    syncCartCount();
    initSmoothScroll();
    initProductGallery();
    initActiveNav();
    initAnnouncementClose();
  });

  /* ----------------------------------------------------------
     Expose cartDrawer globally (for Liquid onclick hooks)
  ---------------------------------------------------------- */
  window.CSCart = cartDrawer;
})();
