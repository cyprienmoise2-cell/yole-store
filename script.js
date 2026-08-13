```javascript
/* =====================================================
   YOLE STORE
   JAVASCRIPT
   Boutique de mode - Vêtements & Chaussures
   ===================================================== */


/* ================= VARIABLES ================= */

let cart = [];

const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

const closeCartButton = document.getElementById("close-cart");
const checkoutButton = document.getElementById("checkout-button");

const addCartButtons = document.querySelectorAll(".add-cart");
const filterButtons = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");


/* ================= OUVRIR LE PANIER ================= */

const cartButton = document.querySelector(
    '.nav-icons button[title="Panier"]'
);

if (cartButton) {
    cartButton.addEventListener("click", () => {
        cartModal.classList.add("show");
        updateCart();
    });
}


/* ================= FERMER LE PANIER ================= */

if (closeCartButton) {
    closeCartButton.addEventListener("click", () => {
        cartModal.classList.remove("show");
    });
}


/* Fermer le panier en cliquant à l'extérieur */

if (cartModal) {

    cartModal.addEventListener("click", (event) => {

        if (event.target === cartModal) {
            cartModal.classList.remove("show");
        }

    });

}


/* ================= AJOUTER AU PANIER ================= */

addCartButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existingProduct = cart.find(
            product => product.name === name
        );


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }


        updateCart();

        showNotification(
            `${name} a été ajouté au panier 🛒`
        );

    });

});


/* ================= METTRE À JOUR LE PANIER ================= */

function updateCart() {

    if (!cartCount || !cartItems || !cartTotal) {
        return;
    }


    /* Nombre total d'articles */

    const totalQuantity = cart.reduce(
        (total, product) => total + product.quantity,
        0
    );

    cartCount.textContent = totalQuantity;


    /* Panier vide */

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Votre panier est vide.
            </p>
        `;

        cartTotal.textContent = "0 HTG";

        return;
    }


    /* Afficher les produits */

    cartItems.innerHTML = "";


    cart.forEach((product, index) => {

        const item = document.createElement("div");

        item.classList.add("cart-item");


        item.innerHTML = `
            <div>
                <h4>${product.name}</h4>

                <p>
                    ${formatPrice(product.price)} HTG
                    × ${product.quantity}
                </p>
            </div>

            <div>
                <strong>
                    ${formatPrice(product.price * product.quantity)}
                    HTG
                </strong>

                <br>

                <button
                    class="remove-item"
                    data-index="${index}">
                    Supprimer
                </button>
            </div>
        `;


        cartItems.appendChild(item);

    });


    /* Total */

    const total = cart.reduce(
        (sum, product) =>
            sum + product.price * product.quantity,
        0
    );


    cartTotal.textContent =
        `${formatPrice(total)} HTG`;


    /* Boutons supprimer */

    const removeButtons =
        document.querySelectorAll(".remove-item");


    removeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const index =
                Number(button.dataset.index);

            removeFromCart(index);

        });

    });

}


/* ================= SUPPRIMER DU PANIER ================= */

function removeFromCart(index) {

    if (index < 0 || index >= cart.length) {
        return;
    }


    const productName = cart[index].name;

    cart.splice(index, 1);

    updateCart();


    showNotification(
        `${productName} a été retiré du panier.`
    );

}


/* ================= FORMAT PRIX ================= */

function formatPrice(price) {

    return new Intl.NumberFormat("fr-FR").format(price);

}


/* ================= FILTRAGE DES PRODUITS ================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        /* Retirer active des autres boutons */

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        /* Ajouter active au bouton sélectionné */

        button.classList.add("active");


        const category =
            button.dataset.category;


        productCards.forEach(card => {

            const cardCategory =
                card.dataset.category;


            if (
                category === "all" ||
                cardCategory === category
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

});


/* ================= COMMANDE WHATSAPP ================= */

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        sendWhatsAppOrder
    );

}


function sendWhatsAppOrder() {

    /* Vérifier si le panier est vide */

    if (cart.length === 0) {

        showNotification(
            "Votre panier est vide."
        );

        return;
    }


    /* Construire le message */

    let message =
        "Bonjour YOLE STORE 👋%0A%0A";

    message +=
        "Je souhaite passer la commande suivante :%0A%0A";


    cart.forEach(product => {

        const subtotal =
            product.price * product.quantity;


        message +=
            `• ${product.name} x${product.quantity} — ` +
            `${formatPrice(subtotal)} HTG%0A`;

    });


    const total = cart.reduce(
        (sum, product) =>
            sum + product.price * product.quantity,
        0
    );


    message +=
        `%0A💰 Total : ${formatPrice(total)} HTG%0A%0A`;

    message +=
        "Merci de me contacter pour confirmer la commande.";


    /* Numéro WhatsApp de YOLE STORE */

    const phoneNumber =
        "50933284730";


    const whatsappURL =
        `https://wa.me/${phoneNumber}?text=${message}`;


    window.open(
        whatsappURL,
        "_blank"
    );

}


/* ================= NOTIFICATION ================= */

function showNotification(message) {

    /* Supprimer une ancienne notification */

    const oldNotification =
        document.querySelector(".store-notification");

    if (oldNotification) {
        oldNotification.remove();
    }


    /* Créer la notification */

    const notification =
        document.createElement("div");


    notification.className =
        "store-notification";


    notification.textContent =
        message;


    /* Style de la notification */

    notification.style.position = "fixed";
    notification.style.bottom = "25px";
    notification.style.right = "25px";
    notification.style.background = "#111111";
    notification.style.color = "#ffffff";
    notification.style.padding = "15px 22px";
    notification.style.borderRadius = "5px";
    notification.style.fontSize = "14px";
    notification.style.fontWeight = "bold";
    notification.style.zIndex = "5000";
    notification.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.2)";


    document.body.appendChild(
        notification
    );


    /* Faire disparaître après 3 secondes */

    setTimeout(() => {

        notification.style.opacity = "0";
        notification.style.transition =
            "opacity 0.4s ease";


        setTimeout(() => {
            notification.remove();
        }, 400);

    }, 3000);

}


/* ================= BOUTON RECHERCHE ================= */

const searchButton = document.querySelector(
    '.nav-icons button[title="Rechercher"]'
);


if (searchButton) {

    searchButton.addEventListener(
        "click",
        () => {

            const searchTerm =
                prompt(
                    "Quel produit recherchez-vous ?"
                );


            if (!searchTerm) {
                return;
            }


            const search =
                searchTerm.toLowerCase().trim();


            let found = false;


            productCards.forEach(card => {

                const productName =
                    card.querySelector("h3")
                        .textContent
                        .toLowerCase();


                const category =
                    card.dataset.category
                        .toLowerCase();


                if (
                    productName.includes(search) ||
                    category.includes(search)
                ) {

                    card.style.display = "";

                    found = true;

                } else {

                    card.style.display = "none";

                }

            });


            if (!found) {

                showNotification(
                    "Aucun produit trouvé."
                );

            }

        }
    );

}


/* ================= BOUTON COMPTE ================= */

const accountButton = document.querySelector(
    '.nav-icons button[title="Compte"]'
);


if (accountButton) {

    accountButton.addEventListener(
        "click",
        () => {

            showNotification(
                "La fonctionnalité compte client sera bientôt disponible."
            );

        }
    );

}


/* ================= ANIMATION AU SCROLL ================= */

const animatedElements =
    document.querySelectorAll(
        ".product-card, .category-card, .feature"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";
                    entry.target.style.transform =
                        "translateY(0)";

                }

            });

        },
        {
            threshold: 0.1
        }
    );


animatedElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform =
        "translateY(20px)";

    element.style.transition =
        "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(element);

});


/* ================= MESSAGE CONSOLE ================= */

console.log(
    "YOLE STORE est prêt ! 🛍️"
);
```
