/* =========================================================
   CORDA FURNITURE | INTERACTIONS AND CART
   ========================================================= */

const CART_KEY = "cordaFurnitureCart";

function getCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function toggleMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  if (!sideMenu || !menuOverlay) return;

  sideMenu.classList.toggle("active");
  menuOverlay.classList.toggle("active");
  document.body.classList.toggle("menu-open");
}

function closeMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  if (!sideMenu || !menuOverlay) return;

  sideMenu.classList.remove("active");
  menuOverlay.classList.remove("active");
  document.body.classList.remove("menu-open");
}

function formatCurrency(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function addToCart(name, price, image) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: `${name}-${Date.now()}`,
      name,
      price: Number(price),
      image,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
  showCartMessage(`${name} added to your cart.`);
}

function removeFromCart(id) {
  const updatedCart = getCart().filter((item) => item.id !== id);
  saveCart(updatedCart);
  renderCart();
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + Number(item.quantity || 1), 0);
  const countElement = document.getElementById("menuCartCount");

  if (countElement) {
    countElement.textContent = count > 0 ? `(${count})` : "";
  }

  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = count;
  }
}

function showCartMessage(message) {
  let messageBox = document.getElementById("cartMessage");

  if (!messageBox) {
    messageBox = document.createElement("div");
    messageBox.id = "cartMessage";
    messageBox.style.position = "fixed";
    messageBox.style.right = "20px";
    messageBox.style.bottom = "20px";
    messageBox.style.zIndex = "100";
    messageBox.style.maxWidth = "calc(100% - 40px)";
    messageBox.style.padding = "14px 18px";
    messageBox.style.borderRadius = "999px";
    messageBox.style.background = "#24150f";
    messageBox.style.color = "#fffdf9";
    messageBox.style.fontSize = "13px";
    messageBox.style.boxShadow = "0 12px 35px rgba(36,21,15,.25)";
    document.body.appendChild(messageBox);
  }

  messageBox.textContent = message;
  messageBox.style.display = "block";

  window.clearTimeout(showCartMessage.timer);
  showCartMessage.timer = window.setTimeout(() => {
    messageBox.style.display = "none";
  }, 2400);
}

function renderCart() {
  const cartItemsElement = document.getElementById("cartItems");
  const emptyCartElement = document.getElementById("emptyCart");
  const subtotalElement = document.getElementById("cartSubtotal");
  const totalElement = document.getElementById("cartTotal");

  if (!cartItemsElement) return;

  const cart = getCart();
  cartItemsElement.innerHTML = "";

  if (cart.length === 0) {
    if (emptyCartElement) {
      emptyCartElement.style.display = "block";
    }

    if (subtotalElement) subtotalElement.textContent = "₹0";
    if (totalElement) totalElement.textContent = "₹0";
    updateCartCount();
    return;
  }

  if (emptyCartElement) {
    emptyCartElement.style.display = "none";
  }

  let subtotal = 0;

  cart.forEach((item) => {
    const quantity = Number(item.quantity || 1);
    const itemTotal = Number(item.price) * quantity;
    subtotal += itemTotal;

    const itemElement = document.createElement("article");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div>
        <h3>${item.name}</h3>
        <p>Quantity: ${quantity}</p>
        <button class="remove-cart-btn" onclick="removeFromCart('${item.id}')">Remove item</button>
      </div>
      <div class="cart-price">${formatCurrency(itemTotal)}</div>
    `;

    cartItemsElement.appendChild(itemElement);
  });

  if (subtotalElement) {
    subtotalElement.textContent = formatCurrency(subtotal);
  }

  if (totalElement) {
    totalElement.textContent = formatCurrency(subtotal);
  }

  updateCartCount();
}

function checkoutCart() {
  const cart = getCart();

  if (cart.length === 0) {
    showCartMessage("Your cart is empty. Add a product first.");
    return;
  }

  showCartMessage("Checkout demo: your enquiry can be confirmed with our team.");
}

function submitContactForm(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formMessage = document.getElementById("formMessage");

  if (formMessage) {
    formMessage.textContent = "Thank you! Your enquiry has been recorded for this demo.";
  }

  form.reset();
}

function setupRevealAnimations() {
  const elements = document.querySelectorAll(".reveal-on-scroll");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  elements.forEach((element) => observer.observe(element));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();
  setupRevealAnimations();
});
