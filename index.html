import { supabase } from "./supabase-config.js";

// ======================================
// VELORA — INTERACCIONES DEL SITIO
// ======================================

// NÚMERO DE WHATSAPP
const whatsappNumber = "5491122801630";

// CREAR ENLACES DE WHATSAPP
function createWhatsAppUrl(message) {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// BOTONES GENERALES DE WHATSAPP
document.querySelectorAll('[data-whatsapp="general"]').forEach((link) => {
    link.href = createWhatsAppUrl(
        "Hola VELORA, quisiera hacer una consulta."
    );
});


// ======================================
// MENÚ ADAPTABLE PARA CELULARES
// ======================================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}


// ======================================
// CATÁLOGO DE PRODUCTOS
// ======================================

const productGrid = document.getElementById("productGrid");
const categoryButtons = document.querySelectorAll(".category-chip");
const productSearch = document.getElementById("productSearch");
const noProductsMessage = document.getElementById("noProductsMessage");
const productSort = document.getElementById("productSort");

let selectedCategory = "todos";
let selectedSearchTerm = "";

function formatPrice(price) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(price);
}

function formatCategory(category) {
    const categories = {
        femenino: "FEMENINO",
        masculino: "MASCULINO",
        unisex: "UNISEX"
    };

    return categories[category] || "FRAGANCIA";
}

// NORMALIZAR TEXTO PARA LAS BÚSQUEDAS
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


// ======================================
// GALERÍA DE FOTOGRAFÍAS
// ======================================

const galleryModal = document.getElementById("galleryModal");
const galleryClose = document.getElementById("galleryClose");
const galleryMainImage = document.getElementById("galleryMainImage");
const galleryTitle = document.getElementById("galleryTitle");
const galleryPrice = document.getElementById("galleryPrice");
const galleryDescription = document.getElementById("galleryDescription");
const galleryThumbnails = document.getElementById("galleryThumbnails");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");
const galleryWhatsapp = document.getElementById("galleryWhatsapp");

let currentGalleryImages = [];
let currentGalleryIndex = 0;

async function getImageUrl(storagePath) {
    const { data, error } = await supabase.storage
        .from("product-images")
        .createSignedUrl(storagePath, 3600);

    if (error) {
        throw error;
    }

    return data.signedUrl;
}


// MOSTRAR LA FOTOGRAFÍA SELECCIONADA

function updateGalleryImage() {
    const image = currentGalleryImages[currentGalleryIndex];

    if (!image) {
        return;
    }

    galleryMainImage.src = image.url;
    galleryMainImage.alt = image.alt || "Fotografía del perfume";

    galleryPrev.disabled = currentGalleryIndex === 0;
    galleryNext.disabled =
        currentGalleryIndex === currentGalleryImages.length - 1;

    galleryThumbnails.querySelectorAll(".gallery-thumbnail").forEach((button, index) => {
        button.classList.toggle("active", index === currentGalleryIndex);
    });
}


// ABRIR LA GALERÍA

async function openGallery(product, images) {
    if (!galleryModal || images.length === 0) {
        return;
    }

    try {
        currentGalleryImages = await Promise.all(
            images.map(async (image) => ({
                url: await getImageUrl(image.storage_path),
                alt: image.alt_text || product.name
            }))
        );
    } catch (error) {
        console.error("Error al cargar las fotografías:", error);
        return;
    }

    currentGalleryIndex = 0;

    galleryTitle.textContent = product.name;
    galleryPrice.textContent = formatPrice(product.price);
    galleryDescription.textContent =
        product.description || "Descubrí esta fragancia de VELORA.";

    galleryWhatsapp.href = createWhatsAppUrl(
        `Hola VELORA, quisiera consultar por el perfume ${product.name}. ¿Me podrían brindar más información?`
    );

    galleryThumbnails.textContent = "";

    currentGalleryImages.forEach((image, index) => {
        const button = document.createElement("button");
        button.className = "gallery-thumbnail";
        button.type = "button";
        button.setAttribute("aria-label", `Ver fotografía ${index + 1}`);

        const thumbnail = document.createElement("img");
        thumbnail.src = image.url;
        thumbnail.alt = image.alt;

        button.appendChild(thumbnail);

        button.addEventListener("click", () => {
            currentGalleryIndex = index;
            updateGalleryImage();
        });

        galleryThumbnails.appendChild(button);
    });

    updateGalleryImage();

    galleryModal.classList.add("open");
    galleryModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    galleryClose.focus();
}


// CERRAR LA GALERÍA

function closeGallery() {
    if (!galleryModal) {
        return;
    }

    galleryModal.classList.remove("open");
    galleryModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    currentGalleryImages = [];
    currentGalleryIndex = 0;

    galleryMainImage.src = "";
}


// BOTONES DE NAVEGACIÓN

if (galleryPrev) {
    galleryPrev.addEventListener("click", () => {
        if (currentGalleryIndex > 0) {
            currentGalleryIndex--;
            updateGalleryImage();
        }
    });
}

if (galleryNext) {
    galleryNext.addEventListener("click", () => {
        if (currentGalleryIndex < currentGalleryImages.length - 1) {
            currentGalleryIndex++;
            updateGalleryImage();
        }
    });
}


// EVENTOS PARA CERRAR

if (galleryClose) {
    galleryClose.addEventListener("click", closeGallery);
}

if (galleryModal) {
    galleryModal.querySelectorAll("[data-gallery-close]").forEach((element) => {
        element.addEventListener("click", closeGallery);
    });
}


// CERRAR CON ESCAPE Y NAVEGAR CON LAS FLECHAS

document.addEventListener("keydown", (event) => {
    if (!galleryModal || !galleryModal.classList.contains("open")) {
        return;
    }

    if (event.key === "Escape") {
        closeGallery();
    }

    if (event.key === "ArrowLeft" && currentGalleryIndex > 0) {
        currentGalleryIndex--;
        updateGalleryImage();
    }

    if (
        event.key === "ArrowRight" &&
        currentGalleryIndex < currentGalleryImages.length - 1
    ) {
        currentGalleryIndex++;
        updateGalleryImage();
    }
});


// ======================================
// CREAR UNA TARJETA DE PRODUCTO
// ======================================

async function createProductCard(product, images) {
    const card = document.createElement("article");

    card.className = "product-card";
    card.dataset.category = product.category || "";
    card.dataset.price = Number(product.price) || 0;

    // TEXTO QUE SE UTILIZARÁ EN EL BUSCADOR
    card.dataset.search = normalizeText(
        `${product.name} ${product.description || ""} ${product.category || ""}`
    );

    // IMAGEN DEL PRODUCTO

    const imageContainer = document.createElement("div");

    imageContainer.className = "product-image";

    if (product.stock <= 0) {
        imageContainer.classList.add("out-of-stock");
    }

    if (images.length > 0) {
        const imageUrl = await getImageUrl(images[0].storage_path);

        imageContainer.style.backgroundImage = `url("${imageUrl}")`;
        imageContainer.style.backgroundSize = "cover";
        imageContainer.style.backgroundPosition = "center";

        imageContainer.setAttribute("role", "button");
        imageContainer.setAttribute("tabindex", "0");
        imageContainer.setAttribute("aria-label", `Ver fotografías de ${product.name}`);

        imageContainer.addEventListener("click", () => {
            openGallery(product, images);
        });

        imageContainer.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openGallery(product, images);
            }
        });
    }

    const label = document.createElement("span");

    label.className = "product-label";
    label.textContent = product.stock > 0 ? "DISPONIBLE" : "AGOTADO";

    imageContainer.appendChild(label);

    // INFORMACIÓN DEL PRODUCTO

    const meta = document.createElement("div");

    meta.className = "product-meta";

    const categoryText = document.createElement("span");

    categoryText.textContent = formatCategory(product.category);

    meta.appendChild(categoryText);

    // NOMBRE Y PRECIO

    const titleRow = document.createElement("div");

    titleRow.className = "product-title-row";

    const title = document.createElement("h3");

    title.textContent = product.name;

    const price = document.createElement("span");

    price.className = "price";
    price.textContent = formatPrice(product.price);

    titleRow.append(title, price);

    // DESCRIPCIÓN

    const description = document.createElement("p");

    description.className = "product-description";
    description.textContent =
        product.description || "Descubrí esta fragancia de VELORA.";

    // UNIDADES DISPONIBLES

    const stockInfo = document.createElement("p");

    stockInfo.className = "product-stock";

    if (product.stock <= 0) {
        stockInfo.textContent = "Sin stock disponible";
    } else if (product.stock <= 3) {
        stockInfo.textContent = `¡Últimas unidades! (${product.stock} disponibles)`;
    } else {
        stockInfo.textContent = `${product.stock} unidades disponibles`;
    }

    // BOTÓN PARA AGREGAR AL CARRITO

    const addButton = document.createElement("button");

    addButton.className = "add-to-cart";
    addButton.type = "button";
    addButton.textContent = "AGREGAR AL CARRITO";

    if (product.stock <= 0) {
        addButton.disabled = true;
        addButton.textContent = "SIN STOCK";
    } else {
        addButton.addEventListener("click", () => {
            addToCart(product);
        });
    }

// ENLACE DE WHATSAPP

const link = document.createElement("a");

link.className = "product-link";

link.href = createWhatsAppUrl(
    `Hola VELORA, quisiera consultar por el perfume ${product.name}. ¿Me podrían brindar más información?`
);

link.target = "_blank";
link.rel = "noopener";
link.dataset.product = product.name;

// ÍCONO DE WHATSAPP
const whatsappIcon = document.createElement("i");

whatsappIcon.className = "fa-brands fa-whatsapp whatsapp-icon";
whatsappIcon.setAttribute("aria-hidden", "true");

link.appendChild(whatsappIcon);

link.appendChild(
    document.createTextNode(" Consultar por WhatsApp ")
);

const arrow = document.createElement("span");

arrow.textContent = "↗";

link.appendChild(arrow);

    // ARMAR LA TARJETA

    card.append(
        imageContainer,
        meta,
        titleRow,
        description,
        stockInfo,
        addButton,
        link
    );

    return card;
}

// ======================================
// APLICAR FILTROS Y BÚSQUEDA
// ======================================

function applyCategoryFilter() {
    const cards = productGrid.querySelectorAll(".product-card");

    let visibleProducts = 0;

    cards.forEach((card) => {
        const matchesCategory =
            selectedCategory === "todos" ||
            card.dataset.category === selectedCategory;

        const matchesSearch =
            card.dataset.search.includes(selectedSearchTerm);

        const isVisible = matchesCategory && matchesSearch;

        card.hidden = !isVisible;

        if (isVisible) {
            visibleProducts++;
        }
    });

    if (noProductsMessage) {
        noProductsMessage.hidden = visibleProducts > 0;
    }
}

// ======================================
// ORDENAR PRODUCTOS POR PRECIO
// ======================================

function sortProducts() {
    const cards = Array.from(
        productGrid.querySelectorAll(".product-card")
    );

    const sortMode = productSort ? productSort.value : "original";

    cards.sort((a, b) => {
        if (sortMode === "ascending") {
            return Number(a.dataset.price) - Number(b.dataset.price);
        }

        if (sortMode === "descending") {
            return Number(b.dataset.price) - Number(a.dataset.price);
        }

        return Number(a.dataset.originalOrder) -
               Number(b.dataset.originalOrder);
    });

    cards.forEach((card) => {
        productGrid.appendChild(card);
    });
}

// EVENTOS DE LOS FILTROS

categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.filter;

        categoryButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        applyCategoryFilter();
    });
});


// EVENTO DEL BUSCADOR

if (productSearch) {
    productSearch.addEventListener("input", () => {
        selectedSearchTerm = normalizeText(productSearch.value.trim());

        applyCategoryFilter();
    });
}

// EVENTO DEL ORDENAMIENTO

if (productSort) {
    productSort.addEventListener("change", () => {
        sortProducts();
    });
}

// ======================================
// CARGAR PRODUCTOS DESDE SUPABASE
// ======================================

async function loadProducts() {
    if (!productGrid) {
        return;
    }

    try {
        // OBTENER PRODUCTOS PUBLICADOS

        const { data: products, error: productsError } = await supabase
            .from("Productos")
            .select("*")
            .eq("is_published", true)
            .order("created_at", { ascending: false });

        if (productsError) {
            throw productsError;
        }

        // SI NO HAY PRODUCTOS

        if (!products || products.length === 0) {
            productGrid.textContent = "";

            const message = document.createElement("p");

            message.className = "catalog-message";
            message.textContent =
                "Próximamente vas a encontrar nuevas fragancias.";

            productGrid.appendChild(message);

            return;
        }

        // OBTENER LAS FOTOGRAFÍAS

        const { data: images, error: imagesError } = await supabase
            .from("product_images")
            .select("product_id, storage_path, position, alt_text")
            .order("position", { ascending: true });

        if (imagesError) {
            throw imagesError;
        }

        // LIMPIAR EL CATÁLOGO

        productGrid.textContent = "";

        // CREAR LAS TARJETAS

        for (let index = 0; index < products.length; index++) {
            const product = products[index];

            const productImages = (images || []).filter((image) => {
                return image.product_id === product.id;
            });

            const card = await createProductCard(product, productImages);

            card.dataset.originalOrder = index;

            productGrid.appendChild(card);
        }

        // APLICAR LOS FILTROS SELECCIONADOS

        // APLICAR LOS FILTROS Y EL ORDENAMIENTO

        sortProducts();
        applyCategoryFilter();

    } catch (error) {
        console.error("Error al cargar los productos:", error);

        productGrid.textContent = "";

        const message = document.createElement("p");

        message.className = "catalog-message";
        message.textContent =
            "No pudimos cargar las fragancias. Por favor, intentá nuevamente más tarde.";

        productGrid.appendChild(message);
    }
}


// INICIAR EL CATÁLOGO

loadProducts();


// ======================================
// BOTÓN PARA VOLVER AL INICIO
// ======================================

const backToTop = document.querySelector(".back-to-top");

if (backToTop) {
    window.addEventListener("scroll", () => {
        backToTop.classList.toggle(
            "visible",
            window.scrollY > 450
        );
    });
}

// =========================
// FUNCIONAMIENTO DEL CARRITO
// =========================

const cartToggle = document.getElementById("cartToggle");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartCheckout = document.getElementById("cartCheckout");
const cartClear = document.getElementById("cartClear");

// Recuperar el carrito guardado
let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("veloraCart")) || [];
} catch (error) {
    cart = [];
}

// Guardar los cambios
function saveCart() {
    localStorage.setItem("veloraCart", JSON.stringify(cart));
}

// Actualizar el carrito
function renderCart() {
    cartItems.textContent = "";

    let total = 0;
    let quantityTotal = 0;

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "cart-empty";
        emptyMessage.textContent = "Todavía no agregaste productos.";

        cartItems.appendChild(emptyMessage);
    }

    cart.forEach((item) => {
        const subtotal = item.price * item.quantity;

        total += subtotal;
        quantityTotal += item.quantity;

        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(item.price);

        info.append(name, price);

        const controls = document.createElement("div");
        controls.className = "cart-item-controls";

        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.textContent = "−";
        decrease.setAttribute("aria-label", "Disminuir cantidad");

        decrease.addEventListener("click", () => {
            changeCartQuantity(item.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const increase = document.createElement("button");
        increase.type = "button";
        increase.textContent = "+";
        increase.setAttribute("aria-label", "Aumentar cantidad");
        increase.disabled = item.quantity >= item.stock;

        increase.addEventListener("click", () => {
            changeCartQuantity(item.id, 1);
        });

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Eliminar";
        remove.className = "cart-remove";

        remove.addEventListener("click", () => {
            removeFromCart(item.id);
        });

        controls.append(decrease, quantity, increase, remove);
        itemElement.append(info, controls);
        cartItems.appendChild(itemElement);
    });

    cartCount.textContent = quantityTotal;
    cartTotal.textContent = formatPrice(total);

    cartCheckout.disabled = cart.length === 0;
}

// Mostrar aviso flotante
function showCartToast(message) {
    let toast = document.querySelector(".cart-toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "cart-toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toast.timeout);

    toast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Agregar un producto
function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            alert("No hay más unidades disponibles de este producto.");
            return;
        }

        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            stock: Number(product.stock),
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    showCartToast(`${product.name} se agregó al carrito.`);

    cartToggle.classList.add("cart-added");

    setTimeout(() => {
        cartToggle.classList.remove("cart-added");
    }, 500);
}

// Cambiar cantidad
function changeCartQuantity(productId, amount) {
    const item = cart.find((product) => product.id === productId);

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (item.quantity > item.stock) {
        item.quantity = item.stock;
    }

    saveCart();
    renderCart();
}

// Eliminar producto
function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);

    saveCart();
    renderCart();
}

// Vaciar todo el carrito
function clearCart() {
    if (cart.length === 0) {
        return;
    }

    const confirmClear = confirm(
        "¿Estás seguro de que querés vaciar el carrito?"
    );

    if (!confirmClear) {
        return;
    }

    cart = [];

    saveCart();
    renderCart();
}

// Abrir carrito
function openCart() {
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

// Cerrar carrito
function closeCart() {
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

cartToggle.addEventListener("click", openCart);
cartClear.addEventListener("click", clearCart);
cartClose.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", function(event) {
    if (event.target === cartOverlay) {
        closeCart();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeCart();
    }
});

// Mostrar el contenido guardado
renderCart();

// =========================
// FINALIZAR PEDIDO POR WHATSAPP
// CON VALIDACIÓN DE STOCK
// =========================

cartCheckout.addEventListener("click", async function() {
    if (cart.length === 0) {
        return;
    }

    cartCheckout.disabled = true;
    cartCheckout.textContent = "VERIFICANDO STOCK...";

    try {
        // CONSULTAR LOS PRODUCTOS ACTUALES EN SUPABASE

        const productIds = cart.map((item) => item.id);

        const { data: products, error } = await supabase
            .from("Productos")
            .select("id, name, price, stock, is_published")
            .in("id", productIds);

        if (error) {
            throw error;
        }

        // COMPROBAR DISPONIBILIDAD

        const unavailable = [];

        cart.forEach((item) => {
            const currentProduct = products.find(
                (product) => product.id === item.id
            );

            if (
                !currentProduct ||
                !currentProduct.is_published ||
                currentProduct.stock < item.quantity
            ) {
                unavailable.push(item.name);
            }

            if (currentProduct) {
                item.stock = Number(currentProduct.stock);
            } else {
                item.stock = 0;
            }
        });

        saveCart();
        renderCart();

        if (unavailable.length > 0) {
            alert(
                "No podemos continuar con el pedido. Revisá la disponibilidad de estos productos:\n\n" +
                unavailable.join("\n") +
                "\n\nActualizamos la información del carrito."
            );

            return;
        }

        // GENERAR MENSAJE DE WHATSAPP

        let message = "Hola VELORA, quisiera realizar el siguiente pedido:\n\n";

        cart.forEach((item) => {
            message += `${item.name} x ${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
        });

        const total = cart.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        message += `\nTOTAL: ${formatPrice(total)}`;
        message += "\n\n¿Podrían confirmarme la disponibilidad?";

        window.open(createWhatsAppUrl(message), "_blank");

    } catch (error) {
        console.error("Error al verificar el stock:", error);

        alert(
            "No pudimos verificar la disponibilidad de los productos. Intentá nuevamente."
        );

    } finally {
        cartCheckout.textContent = "FINALIZAR PEDIDO";
        cartCheckout.disabled = cart.length === 0;
    }
});
