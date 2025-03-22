
document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const cartCounter = document.getElementById("cart-counter");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartCounter() {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      if (totalItems > 0) {
        cartCounter.style.display = "flex";
        cartCounter.textContent = totalItems;
      } else {
        cartCounter.style.display = "none";
      }
    }

    function addToCart(product) {
      if (!product || !product.id) {
        console.error("Invalid product data", product);
        return;
      }

      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image || 'https://example.com/placeholder.jpg',
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCounter();
    }

    function renderCart() {
      cartItemsContainer.innerHTML = "";
      let total = 0;

      if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalPriceElement.textContent = "Total: $0.00";
        updateCartCounter();
        return;
      }

      cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}" onerror="this.src='https://example.com/placeholder.jpg';">
          <div>
            <h4>${item.name}</h4>
            <p>Price: $${item.price.toFixed(2)}</p>
            <p>Quantity: <input type="number" value="${item.quantity}" min="1" data-index="${index}"></p>
          </div>
          <button class="remove-btn" data-index="${index}">Remove</button>
        `;

        cartItemsContainer.appendChild(cartItem);
        total += item.price * item.quantity;
      });

      totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
      updateCartCounter();
    }

    cartItemsContainer.addEventListener("input", function (e) {
      if (e.target.tagName === "INPUT") {
        const index = e.target.getAttribute("data-index");
        cart[index].quantity = Math.max(parseInt(e.target.value) || 1, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    });

    cartItemsContainer.addEventListener("click", function (e) {
      if (e.target.classList.contains("remove-btn")) {
        const index = e.target.getAttribute("data-index");
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    });

    document.getElementById("checkout").addEventListener("click", function () {
      if (cart.length === 0) {
        alert("Your cart is empty. Add items to proceed.");
      } else {
        alert("Checkout successful! Thank you for shopping with Grabcart.");
        localStorage.removeItem("cart");
        cart = [];
        renderCart();
      }
    });

    renderCart();
  });
