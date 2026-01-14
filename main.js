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

  /* ======================
   BÚSQUEDA DE PRODUCTOS
====================== */
  const searchBtn = document.getElementById("searchBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const closeSearch = document.getElementById("closeSearch");

  // Mostrar overlay
  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      searchInput.value = "";
      searchResults.innerHTML = "";
      searchInput.focus();
    });
  }

  // Cerrar overlay
  if (closeSearch) {
    closeSearch.addEventListener("click", () => {
      searchOverlay.classList.remove("active");
    });
  }

  // Cerrar con tecla ESC
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Escape" || e.key === "Esc") && searchOverlay.classList.contains("active")) {
      searchOverlay.classList.remove("active");
    }
  });

  // Productos (tomados del HTML)
  const products = [
    { name: "Café Espresso", price: 2500, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93" },
    { name: "Croissant", price: 1800, img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a" },
    { name: "Pan de Campo", price: 3200, img: "https://images.unsplash.com/photo-1597604391235-a7429b4b350c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Capuccino", price: 2900, img: "https://images.unsplash.com/photo-1511920170033-f8396924c348" },
  ];

  // Función para renderizar resultados
  function renderSearchResults(filteredProducts) {
    searchResults.innerHTML = "";
    if (filteredProducts.length === 0) {
      searchResults.innerHTML = "<p>No se encontraron productos</p>";
      return;
    }

    filteredProducts.forEach(prod => {
      const div = document.createElement("div");
      div.classList.add("search-result-item");
      div.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}">
      <div class="info">
        <strong>${prod.name}</strong><br>
        <span>$${prod.price}</span>
      </div>
      <button data-name="${prod.name}" data-price="${prod.price}">Agregar</button>
    `;
      searchResults.appendChild(div);
    });

    // Agregar funcionalidad de agregar al carrito
    searchResults.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        const price = Number(btn.dataset.price);

        const item = cart.find(p => p.name === name);
        if (item) item.qty++;
        else cart.push({ name, price, qty: 1 });

        saveCart();
        renderCart();
        showToast(`"${name}" agregado al carrito`);
      });
    });
  }

  // Filtrar mientras escribes
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(query));
      renderSearchResults(filtered);
    });
  }

});


