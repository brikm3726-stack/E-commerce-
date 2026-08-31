/* EcomDZ theme — vanilla JS, no build step (porté depuis la version Next.js) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  /* ---- Reveal on scroll ------------------------------------------------ */
  var io;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
  }
  function watchReveals(root) {
    (root || document).querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
      if (io) io.observe(el); else el.classList.add("is-visible");
    });
  }

  /* ---- Mobile menu --------------------------------------------------- */
  function bindMenu() {
    var menu = document.getElementById("MobileMenu");
    if (!menu) return;
    document.querySelectorAll("[data-menu-open]").forEach(function (b) {
      b.addEventListener("click", function () { menu.classList.add("is-open"); document.body.style.overflow = "hidden"; });
    });
    menu.querySelectorAll("[data-menu-close]").forEach(function (b) {
      b.addEventListener("click", closeMenu);
    });
    function closeMenu() { menu.classList.remove("is-open"); document.body.style.overflow = ""; }
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ---- Cart drawer -------------------------------------------------- */
  var drawer = null;
  function getDrawer() { return document.getElementById("CartDrawer"); }
  function openCart() {
    drawer = getDrawer();
    if (!drawer) return;
    drawer.classList.add("is-open");
    document.body.style.overflow = "hidden";
    refreshCart();
  }
  function closeCart() {
    if (!drawer) drawer = getDrawer();
    if (!drawer) return;
    drawer.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  function money(cents) {
    if (window.Shopify && Shopify.formatMoney) return Shopify.formatMoney(cents, window.themeMoneyFormat);
    return (cents / 100).toLocaleString() + " DA";
  }
  function renderCart(cart) {
    var badge = document.querySelector(".cart-count");
    if (badge) { badge.textContent = cart.item_count || ""; badge.hidden = !cart.item_count; }
    var d = getDrawer();
    if (!d) return;
    var list = d.querySelector(".drawer__items");
    var sub = d.querySelector("[data-cart-subtotal]");
    if (sub) sub.textContent = money(cart.total_price);
    if (!list) return;
    if (!cart.item_count) {
      list.innerHTML = '<p>' + (d.dataset.emptyText || "Votre panier est vide") + "</p>";
      return;
    }
    list.innerHTML = cart.items.map(function (it) {
      return '<div class="line-item">' +
        (it.image ? '<img src="' + it.image.replace(/(\.[a-z]+)(\?|$)/i, "_120x$1$2") + '" alt="" width="64" height="80">' : "<span></span>") +
        '<div><a href="' + it.url + '">' + it.product_title + "</a>" +
        (it.variant_title && it.variant_title !== "Default Title" ? "<div style=\"font-size:.8rem;color:#948b76\">" + it.variant_title + "</div>" : "") +
        '<div style="font-size:.85rem">' + it.quantity + " × " + money(it.final_price) + "</div></div>" +
        '<button class="header__icon" data-remove="' + it.key + '" aria-label="Retirer">&times;</button>' +
        "</div>";
    }).join("");
    list.querySelectorAll("[data-remove]").forEach(function (b) {
      b.addEventListener("click", function () { changeLine(b.dataset.remove, 0); });
    });
  }
  function refreshCart() {
    fetch(window.Shopify.routes.root + "cart.js", { headers: { "Accept": "application/json" } })
      .then(function (r) { return r.json(); }).then(renderCart).catch(function () {});
  }
  function changeLine(key, qty) {
    fetch(window.Shopify.routes.root + "cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ id: key, quantity: qty })
    }).then(function (r) { return r.json(); }).then(renderCart).catch(function () {});
  }

  function bindCart() {
    document.querySelectorAll("[data-cart-open]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        if (document.body.classList.contains("cart-drawer-disabled")) return;
        e.preventDefault(); openCart();
      });
    });
    var d = getDrawer();
    if (d) {
      d.querySelectorAll("[data-cart-close]").forEach(function (b) { b.addEventListener("click", closeCart); });
    }
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCart(); });

    document.querySelectorAll('form[action$="/cart/add"]').forEach(function (form) {
      form.addEventListener("submit", function (e) {
        if (document.body.classList.contains("cart-drawer-disabled")) return;
        e.preventDefault();
        var btn = form.querySelector('[type="submit"]');
        if (btn) btn.disabled = true;
        fetch(window.Shopify.routes.root + "cart/add.js", {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(form)
        }).then(function (r) { return r.json(); })
          .then(function () { openCart(); })
          .catch(function () { form.submit(); })
          .finally(function () { if (btn) btn.disabled = false; });
      });
    });
  }

  /* ---- Quantity steppers ------------------------------------------- */
  function bindQty() {
    document.querySelectorAll(".qty").forEach(function (q) {
      var input = q.querySelector("input");
      q.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          var step = b.dataset.step === "down" ? -1 : 1;
          var v = Math.max(1, (parseInt(input.value, 10) || 1) + step);
          input.value = v;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        });
      });
    });
  }

  /* ---- Variant selection on product page -------------------------- */
  function bindVariants() {
    var root = document.querySelector("[data-product-json]");
    if (!root) return;
    var product;
    try { product = JSON.parse(root.textContent); } catch (e) { return; }
    var form = document.querySelector("[data-product-form]");
    if (!form) return;
    var idInput = form.querySelector('[name="id"]');
    var priceEl = document.querySelector("[data-pdp-price]");
    var addBtn = form.querySelector('[type="submit"]');

    function selectedOptions() {
      return Array.prototype.map.call(form.querySelectorAll("[data-option-index]"), function (el) {
        if (el.type === "radio") { var c = form.querySelector('[name="' + el.name + '"]:checked'); return c ? c.value : null; }
        return el.value;
      });
    }
    function update() {
      var opts = selectedOptions();
      var match = product.variants.find(function (v) {
        return v.options.every(function (o, i) { return !opts[i] || o === opts[i]; });
      });
      if (!match) return;
      idInput.value = match.id;
      if (priceEl && window.Shopify && Shopify.formatMoney) priceEl.textContent = Shopify.formatMoney(match.price, window.themeMoneyFormat);
      if (addBtn) {
        addBtn.disabled = !match.available;
        addBtn.textContent = match.available ? (addBtn.dataset.labelAdd || addBtn.textContent) : (addBtn.dataset.labelSoldout || "Épuisé");
      }
    }
    form.addEventListener("change", update);
    update();
  }

  document.addEventListener("DOMContentLoaded", function () {
    watchReveals(document);
    bindMenu();
    bindCart();
    bindQty();
    bindVariants();
    refreshCart();
  });

  document.addEventListener("shopify:section:load", function (e) {
    watchReveals(e.target);
    bindCart();
    bindQty();
    bindVariants();
  });
})();
