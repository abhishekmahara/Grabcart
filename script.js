document.addEventListener("DOMContentLoaded", function () {
    const cartCounter = document.getElementById("cart-counter");
    const dataContainer = document.getElementById("container");
    const url = "https://fakestoreapi.com/products";

    function updateCartCounter() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            cartCounter.style.display = "flex"; // Show badge if items exist
            cartCounter.textContent = totalItems;
        } else {
            cartCounter.style.display = "none"; // Hide badge if empty
        }
    }

    async function getItem() {
        try {
            const result = await fetch(url);
            const data = await result.json();

            data.forEach(item => {
                const card = document.createElement("div");
                card.classList.add("add");
                card.innerHTML = `
                    <h3>${item.title}</h3>
                    <img src="${item.image}" alt="${item.title}">
                    <p><strong>Price: $${item.price}</strong></p>
                    <button class="add-to-cart" data-id="${item.id}" data-name="${item.title}" data-price="${item.price}">Add to Cart</button>
                `;
                dataContainer.appendChild(card);
            });

            document.querySelectorAll(".add-to-cart").forEach(button => {
                button.addEventListener("click", function () {
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];
                    let productId = this.getAttribute("data-id");
                    let productName = this.getAttribute("data-name");
                    let productPrice = parseFloat(this.getAttribute("data-price"));

                    let existingItem = cart.find(item => item.id === productId);
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
                    }

                    localStorage.setItem("cart", JSON.stringify(cart));
                    updateCartCounter(); // Update counter on the cart badge
                });
            });

            updateCartCounter(); // Update counter on page load

        } catch (err) {
            console.error("Something went wrong!", err);
        }
    }

    getItem();
});

