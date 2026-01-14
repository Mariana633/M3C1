document.addEventListener("DOMContentLoaded", () => {

  console.log("Hero de cafetería cargado ☕");

  /* ======================
     TOAST
  ====================== */
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  function showToast(message) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  /* ======================
     CARRITO
  ====================== */
  const cartBtn = document.getElementById("cartBtn");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartItemsEl = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  /* OPEN / CLOSE */
  if (cartBtn && cartOverlay) {
    cartBtn.addEventListener("click", () => {
      cartOverlay.classList.add("active");
    });
  }

  // Cerrar carrito al presionar el botón "Cerrar" o al hacer click fuera del carrito
  if (cartOverlay) {
    cartOverlay.addEventListener("click", (e) => {
      // Si hace click en el overlay o en el botón con clase close-cart (o en un elemento hijo)
      if (e.target === cartOverlay || (e.target.closest && e.target.closest('.close-cart'))) {
        cartOverlay.classList.remove("active");
      }
    });
  }

  // Delegated click handler: robustly close cart when any element with .close-cart is clicked
  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest && e.target.closest('.close-cart');
    if (closeBtn) {
      if (cartOverlay) cartOverlay.classList.remove("active");
    }
  });

  // Close the cart with the Escape key for convenience
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      if (cartOverlay) cartOverlay.classList.remove("active");
    }
  });

  /* ======================
     ADD PRODUCTS
  ====================== */
  document.querySelectorAll(".product-footer button").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name || "Producto";
      const price = Number(btn.dataset.price) || 0;

      const item = cart.find(p => p.name === name);

      if (item) {
        item.qty++;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      saveCart();
      renderCart();
      showToast(`"${name}" agregado al carrito`);
    });
  });

  /* ======================
     REMOVE ITEM
  ====================== */
  window.removeItem = function (name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    renderCart();
  };

  /* ======================
     RENDER
  ====================== */
  function renderCart() {
    if (!cartItemsEl || !cartTotal || !cartCount) return;

    cartItemsEl.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
      total += item.price * item.qty;
      count += item.qty;

      cartItemsEl.innerHTML += `
        <div class="cart-item">
          <div>
            ${item.name} x${item.qty}<br>
            <span>$${item.price * item.qty}</span>
          </div>
          <div class="remove" onclick="removeItem('${item.name}')">✖</div>
        </div>
      `;
    });

    cartTotal.textContent = `$${total}`;
    cartCount.textContent = count;
  }

  /* ======================
     SAVE
  ====================== */
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

    /* INIT */
  renderCart();
  /* ========================
      CONFIRMAR COMPRA
  ======================== */
  const checkoutBtn = document.querySelector(".checkout");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Tu carrito está vacío"); return;
      }

      showToast("Gracias por tu compra ☕");
      cart = [];
      saveCart();
      renderCart();
      // Cerrar el overlay después de la compra
      if (cartOverlay) cartOverlay.classList.remove("active");
    });
  }
});


  