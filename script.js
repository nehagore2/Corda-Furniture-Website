
function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("active");
  document.getElementById("menuOverlay").classList.toggle("active");
}

function closeMenu() {
  document.getElementById("sideMenu").classList.remove("active");
  document.getElementById("menuOverlay").classList.remove("active");
}

// Close menu when clicking a page link
document.querySelectorAll(".side-menu a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

// CART FUNCTIONALITY
let cart = JSON.parse(localStorage.getItem("cordaCart")) || [];

function addToCart(name, image) {

  cart.push({
    name: name,
    image: image
  });

  localStorage.setItem("cordaCart", JSON.stringify(cart));

  alert(name + " added to cart!");

}

function displayCart() {

  const container = document.getElementById("cartItems");

  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach((item, index) => {

    const div = document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <button onclick="removeFromCart(${index})">
        Remove
      </button>
    `;

    container.appendChild(div);

  });

}

function removeFromCart(index) {

  cart.splice(index, 1);

  localStorage.setItem("cordaCart", JSON.stringify(cart));

  displayCart();

}

displayCart();

// ========================================
// CORDA - SCROLL REVEAL ANIMATIONS
// ========================================

const revealElements = document.querySelectorAll(
  '.section, .story-section, .details-section, .about-section'
);

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach((element) => {
  element.classList.add('reveal-hidden');
  revealObserver.observe(element);
});