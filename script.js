
document.addEventListener("DOMContentLoaded", function () {
    const cartCounter = document.getElementById("cart-counter");
    const dataContainer = document.getElementById("container");
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-btn');
    const url = "https://fakestoreapi.com/products";
    let products = [];

    if (!cartCounter || !dataContainer || !searchInput || !searchButton) {
        console.error('One or more elements not found. Please check your HTML IDs.');
        return;
    }

    function updateCartCounter() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            cartCounter.style.display = "flex";
            cartCounter.textContent = totalItems;
        } else {
            cartCounter.style.display = "none";
        }
    }

    async function getItem() {
        try {
            const result = await fetch(url);
            products = await result.json();
            displayProducts(products);
        } catch (err) {
            console.error("Something went wrong!", err);
        }
    }

    function displayProducts(filteredProducts) {
        dataContainer.innerHTML = '';
        if (filteredProducts.length === 0) {
            dataContainer.innerHTML = '<p>No products found</p>';
            return;
        }
        filteredProducts.forEach(item => {
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
                updateCartCounter();
            });
        });
        updateCartCounter();
    }

    function searchProducts() {
        const searchValue = searchInput.value.toLowerCase().trim();
        if (searchValue === "") {
            displayProducts(products);
        } else {
            const filteredProducts = products.filter(product =>
                product.title.toLowerCase().includes(searchValue)
            );
            displayProducts(filteredProducts);
        }
    }

    searchButton.addEventListener('click', searchProducts);
    getItem();
});