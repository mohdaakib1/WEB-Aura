const products = [
  {
    id: "dignity",
    name: "Web Aura DIGNITY Oversized T-Shirt",
    category: "oversized",
    price: 499,
    mrp: 1399,
    gsm: "240 GSM heavyweight cotton",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "blessed",
    name: "Web Aura BLESSED Oversized T-Shirt",
    category: "oversized",
    price: 449,
    mrp: 1299,
    gsm: "240 GSM premium cotton",
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "red-fire",
    name: "Web Aura RED FIRE Oversized T-Shirt",
    category: "oversized",
    price: 449,
    mrp: 1299,
    gsm: "100% cotton bold print",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "streetform",
    name: "Streetform Heavyweight Unisex Tee",
    category: "oversized",
    price: 499,
    mrp: 1299,
    gsm: "Ultra-quality graphic print",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "regular-fit",
    name: "Web Aura Regular Fit T-Shirt",
    category: "regular",
    price: 299,
    mrp: 899,
    gsm: "180 GSM premium cotton",
    image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "game-time",
    name: "Web Aura GAME TIME Heavyweight Tee",
    category: "regular",
    price: 349,
    mrp: 499,
    gsm: "Everyday long-lasting print",
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "acid-wash",
    name: "Web Aura Acid Wash Oversize T-Shirt",
    category: "acid",
    price: 449,
    mrp: 1349,
    gsm: "French collar streetwear",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "love",
    name: "Web Aura LOVE Heavyweight Oversize Tee",
    category: "oversized",
    price: 449,
    mrp: 1299,
    gsm: "Premium 240 GSM cotton",
    image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=900&q=82",
  },
];

const state = {
  category: "all",
  query: "",
  sort: "featured",
  selectedSizes: {},
  cart: [],
  coupon: false,
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const grid = document.querySelector("#productGrid");
const search = document.querySelector("#productSearch");
const sort = document.querySelector("#sortProducts");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const subtotalEl = document.querySelector("#subtotal");
const discountEl = document.querySelector("#discount");
const totalEl = document.querySelector("#total");
const couponMessage = document.querySelector("#couponMessage");
const toast = document.querySelector("#toast");

function formatPrice(value) {
  return currency.format(value).replace("₹", "₹");
}

function getVisibleProducts() {
  const query = state.query.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const inCategory = state.category === "all" || product.category === state.category;
    const inQuery = `${product.name} ${product.gsm}`.toLowerCase().includes(query);
    return inCategory && inQuery;
  });

  return filtered.sort((a, b) => {
    if (state.sort === "low") return a.price - b.price;
    if (state.sort === "high") return b.price - a.price;
    if (state.sort === "saving") return b.mrp - b.price - (a.mrp - a.price);
    return products.indexOf(a) - products.indexOf(b);
  });
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  grid.innerHTML = visibleProducts
    .map((product) => {
      const selected = state.selectedSizes[product.id] || "M";
      const saving = Math.round(((product.mrp - product.price) / product.mrp) * 100);
      return `
        <article class="product-card">
          <div class="product-image">
            <span class="sale-badge">${saving}% OFF</span>
            <img src="${product.image}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-info">
            <div>
              <h3>${product.name}</h3>
              <span class="meta">${product.gsm}</span>
            </div>
            <div class="product-price">
              <strong>${formatPrice(product.price)}</strong>
              <span>${formatPrice(product.mrp)}</span>
            </div>
            <div class="size-row" aria-label="Choose size for ${product.name}">
              ${["S", "M", "L", "XL"]
                .map(
                  (size) => `
                    <button class="${selected === size ? "is-selected" : ""}" type="button" data-size="${size}" data-id="${product.id}">
                      ${size}
                    </button>
                  `,
                )
                .join("")}
            </div>
            <div class="product-actions">
              <button class="add-button" type="button" data-add="${product.id}">Add</button>
              <button class="quick-button" type="button" data-quick="${product.id}" aria-label="Quick view ${product.name}">＋</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  if (!visibleProducts.length) {
    grid.innerHTML = `<p>No products found. Try a different search.</p>`;
  }
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  const size = state.selectedSizes[productId] || "M";
  const existing = state.cart.find((item) => item.id === productId && item.size === size);

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ ...product, size, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} added in ${size}`);
}

function updateQuantity(index, delta) {
  state.cart[index].quantity += delta;
  if (state.cart[index].quantity <= 0) {
    state.cart.splice(index, 1);
  }
  renderCart();
}

function renderCart() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = state.coupon ? Math.round(subtotal * 0.3) : 0;

  cartCount.textContent = count;
  subtotalEl.textContent = formatPrice(subtotal);
  discountEl.textContent = `-${formatPrice(discount)}`;
  totalEl.textContent = formatPrice(Math.max(subtotal - discount, 0));

  cartItems.innerHTML = state.cart.length
    ? state.cart
        .map(
          (item, index) => `
            <article class="cart-item">
              <img src="${item.image}" alt="${item.name}">
              <div>
                <h3>${item.name}</h3>
                <p>Size ${item.size} · ${formatPrice(item.price)}</p>
                <div class="quantity-row">
                  <button type="button" data-qty="${index}" data-delta="-1" aria-label="Decrease quantity">−</button>
                  <strong>${item.quantity}</strong>
                  <button type="button" data-qty="${index}" data-delta="1" aria-label="Increase quantity">+</button>
                </div>
              </div>
            </article>
          `,
        )
        .join("")
    : `<p>Your cart is empty. Pick a tee and start the drop.</p>`;
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

document.addEventListener("click", (event) => {
  const sizeButton = event.target.closest("[data-size]");
  const addButton = event.target.closest("[data-add]");
  const quickButton = event.target.closest("[data-quick]");
  const qtyButton = event.target.closest("[data-qty]");

  if (sizeButton) {
    state.selectedSizes[sizeButton.dataset.id] = sizeButton.dataset.size;
    renderProducts();
  }

  if (addButton) {
    addToCart(addButton.dataset.add);
    openCart();
  }

  if (quickButton) {
    const product = products.find((item) => item.id === quickButton.dataset.quick);
    showToast(`${product.name}: ${product.gsm}, sale price ${formatPrice(product.price)}`);
  }

  if (qtyButton) {
    updateQuantity(Number(qtyButton.dataset.qty), Number(qtyButton.dataset.delta));
  }
});

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("is-active"));
    button.classList.add("is-active");
    state.category = button.dataset.category;
    renderProducts();
  });
});

search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

sort.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

document.querySelector("#searchToggle").addEventListener("click", () => {
  search.focus();
  document.querySelector("#catalog").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#cartOpen").addEventListener("click", openCart);
document.querySelector("#cartClose").addEventListener("click", closeCart);
cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});

document.querySelector("[data-add-featured]").addEventListener("click", () => {
  state.selectedSizes.dignity = "L";
  addToCart("dignity");
  openCart();
});

document.querySelector("#applyCoupon").addEventListener("click", () => {
  const code = document.querySelector("#couponCode").value.trim().toUpperCase();
  state.coupon = code === "AURA30";
  couponMessage.textContent = state.coupon ? "AURA30 applied. 30% off unlocked." : "Use coupon AURA30 for the demo discount.";
  renderCart();
});

document.querySelector(".newsletter").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("You are on the Web Aura drop list.");
});

renderProducts();
renderCart();
