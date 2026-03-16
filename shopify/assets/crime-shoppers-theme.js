/**
 * Crime Shoppers — Shopify Cart & Product JS
 * Handles Shopify AJAX API integrations:
 *  - Cart operations (add, update, remove)
 *  - Variant selection on product pages
 *  - Dynamic price updating
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Shopify Cart API Helpers
  ---------------------------------------------------------- */
  var CSShopify = {

    /**
     * Add a variant to the cart
     * @param {number} variantId
     * @param {number} quantity
     * @param {Object} properties
     * @returns {Promise}
     */
    addToCart: function (variantId, quantity, properties) {
      quantity = quantity || 1;
      properties = properties || {};

      return fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity,
          properties: properties,
        }),
      })
        .then(function (res) {
          if (!res.ok) {
            return res.json().then(function (err) {
              throw new Error(err.description || 'Could not add to cart');
            });
          }
          return res.json();
        });
    },

    /**
     * Update a cart line item
     * @param {string} key
     * @param {number} quantity
     * @returns {Promise}
     */
    updateItem: function (key, quantity) {
      return fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: quantity }),
      }).then(function (res) { return res.json(); });
    },

    /**
     * Get the current cart
     * @returns {Promise}
     */
    getCart: function () {
      return fetch('/cart.js').then(function (res) { return res.json(); });
    },

    /**
     * Format cents to dollar string
     * @param {number} cents
     * @returns {string}
     */
    formatMoney: function (cents) {
      var amount = (cents / 100).toFixed(2);
      return '$' + amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  };

  /* ----------------------------------------------------------
     Product Page — Variant Selector
  ---------------------------------------------------------- */
  function initVariantSelector() {
    var variantSelects = document.querySelectorAll('.cs-variant-select, .product-form__input select');
    var priceEl = document.querySelector('.cs-product-price-main, .price-item--regular');
    var comparePriceEl = document.querySelector('.cs-product-price-was, .price-item--compare');
    var addToCartBtn = document.querySelector('.cs-product-add-btn, .product-form__cart-submit');
    var variantIdInput = document.querySelector('input[name="id"][form]') ||
                         document.querySelector('input[name="id"]');

    if (!variantSelects.length) return;

    // Try to get variants from page JSON data
    var variantData = [];
    var variantDataEl = document.querySelector('[data-variant-json], script[data-product-json]');
    if (variantDataEl) {
      try {
        var parsed = JSON.parse(variantDataEl.textContent);
        variantData = parsed.variants || parsed || [];
      } catch (e) {
        // ignore parse errors
      }
    }

    function getSelectedVariant() {
      var selectedOptions = [];
      variantSelects.forEach(function (select) {
        selectedOptions.push(select.value);
      });

      if (!variantData.length) return null;

      return variantData.find(function (v) {
        var opts = [v.option1, v.option2, v.option3].filter(Boolean);
        return opts.every(function (opt, i) {
          return opt === selectedOptions[i];
        });
      }) || null;
    }

    function updatePrice(variant) {
      if (!variant) return;

      if (priceEl) {
        priceEl.textContent = CSShopify.formatMoney(variant.price);
      }

      if (comparePriceEl) {
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          comparePriceEl.textContent = CSShopify.formatMoney(variant.compare_at_price);
          comparePriceEl.style.display = '';
        } else {
          comparePriceEl.style.display = 'none';
        }
      }

      if (variantIdInput) {
        variantIdInput.value = variant.id;
      }

      if (addToCartBtn) {
        if (variant.available) {
          addToCartBtn.disabled = false;
          addToCartBtn.textContent = 'Add to Cart';
        } else {
          addToCartBtn.disabled = true;
          addToCartBtn.textContent = 'Sold Out';
        }
      }
    }

    variantSelects.forEach(function (select) {
      select.addEventListener('change', function () {
        var variant = getSelectedVariant();
        if (variant) updatePrice(variant);
      });
    });

    // Init on load
    var initialVariant = getSelectedVariant();
    if (initialVariant) updatePrice(initialVariant);
  }

  /* ----------------------------------------------------------
     Product Form — Add to Cart with drawer open
  ---------------------------------------------------------- */
  function initProductForm() {
    var forms = document.querySelectorAll('.cs-product-form, .product-form');

    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var btn = form.querySelector('button[type="submit"]');
        var originalText = btn ? btn.textContent : '';

        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Adding...';
        }

        var formData = new FormData(form);
        var variantId = formData.get('id');
        var quantity = parseInt(formData.get('quantity') || '1', 10);

        if (!variantId) {
          console.error('CS: No variant ID found in form');
          if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
          }
          return;
        }

        CSShopify.addToCart(variantId, quantity)
          .then(function () {
            if (btn) {
              btn.textContent = 'Added! ✓';
              setTimeout(function () {
                btn.disabled = false;
                btn.textContent = originalText;
              }, 1500);
            }
            // Open the cart drawer
            if (window.CSCart) {
              window.CSCart.open();
            }
          })
          .catch(function (err) {
            console.error('CS Add Error:', err);
            if (btn) {
              btn.disabled = false;
              btn.textContent = originalText;
              btn.style.borderColor = '#CC0000';
              btn.style.color = '#CC0000';
              setTimeout(function () {
                btn.style.borderColor = '';
                btn.style.color = '';
              }, 2000);
            }
            alert(err.message || 'Sorry, could not add to cart.');
          });
      });
    });
  }

  /* ----------------------------------------------------------
     Quick View (basic — opens product link in drawer)
  ---------------------------------------------------------- */
  function initQuickView() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-quick-view]');
      if (!btn) return;
      e.preventDefault();
      var url = btn.dataset.quickView;
      if (!url) return;
      // Fallback: navigate to product page
      window.location.href = url;
    });
  }

  /* ----------------------------------------------------------
     Cart page quantity inputs
  ---------------------------------------------------------- */
  function initCartPage() {
    var cartPage = document.querySelector('.cs-cart-page, #cart');
    if (!cartPage) return;

    // qty +/-  buttons on cart page
    cartPage.addEventListener('click', function (e) {
      var btn = e.target.closest('.cs-qty-btn');
      if (!btn) return;

      var key = btn.dataset.key;
      var qty = parseInt(btn.dataset.qty || '0', 10);
      if (!key) return;

      CSShopify.updateItem(key, qty).then(function () {
        window.location.reload();
      });
    });
  }

  /* ----------------------------------------------------------
     Init
  ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initVariantSelector();
    initProductForm();
    initQuickView();
    initCartPage();
  });

  /* Expose globally */
  window.CSShopify = CSShopify;

})();
