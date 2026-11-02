import { supabase } from "./supabase-config.js";

// ELEMENTOS DEL PANEL

const totalProducts = document.getElementById("totalProducts");
const publishedProducts = document.getElementById("publishedProducts");
const outOfStock = document.getElementById("outOfStock");

const logoutButton = document.getElementById("logoutButton");

// ELEMENTOS DE MI CUENTA

const changePasswordForm = document.getElementById("changePasswordForm");
const accountNewPassword = document.getElementById("accountNewPassword");
const accountConfirmPassword = document.getElementById("accountConfirmPassword");
const changePasswordButton = document.getElementById("changePasswordButton");
const changePasswordMessage = document.getElementById("changePasswordMessage");

const addProductButton = document.getElementById("addProductButton");
const cancelProductButton = document.getElementById("cancelProductButton");

const productFormSection = document.getElementById("productFormSection");
const productForm = document.getElementById("productForm");
const productFormMessage = document.getElementById("productFormMessage");

const productList = document.getElementById("productList");

// CAMPOS DEL FORMULARIO

const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productCategory = document.getElementById("productCategory");
const productStock = document.getElementById("productStock");
const productDescription = document.getElementById("productDescription");
const productPublished = document.getElementById("productPublished");
const productImages = document.getElementById("productImages");

// ADMINISTRADOR DE IMÁGENES

const existingImagesSection =
    document.getElementById("existingImagesSection");

const existingImagesList =
    document.getElementById("existingImagesList");

// TODAS LAS IMÁGENES SE GUARDAN EN UNA SOLA LISTA

let imageItems = [];

// ELEMENTOS DEL MODO EDICIÓN

let editingProductId = null;

const formTitle = productFormSection.querySelector("h2");
const saveButton = productForm.querySelector('button[type="submit"]');

// VERIFICAR ACCESO

async function verifyAccess() {

    const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
        window.location.href = "admin.html";
        return false;
    }

    const userId = sessionData.session.user.id;

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    if (
        profileError ||
        !profile ||
        (profile.role !== "owner" && profile.role !== "employee")
    ) {
        await supabase.auth.signOut();
        window.location.href = "admin.html";
        return false;
    }

    return true;
}

// CARGAR ESTADÍSTICAS

async function loadStatistics() {

    const { data: products, error } = await supabase
        .from("Productos")
        .select("id, stock, is_published");

    if (error) {
        console.error("Error al cargar productos:", error);
        return;
    }

    let published = 0;
    let withoutStock = 0;

    for (let i = 0; i < products.length; i++) {

        if (products[i].is_published === true) {
            published++;
        }

        if (products[i].stock === 0) {
            withoutStock++;
        }
    }

    totalProducts.textContent = products.length;
    publishedProducts.textContent = published;
    outOfStock.textContent = withoutStock;
}

// CARGAR LISTA DE PRODUCTOS

async function loadProducts() {

    productList.innerHTML = "<p>Cargando productos...</p>";

    const { data: products, error } = await supabase
        .from("Productos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error al cargar productos:", error);
        productList.innerHTML =
            "<p>No se pudieron cargar los productos.</p>";
        return;
    }

    if (products.length === 0) {

        productList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">◇</span>
                <h3>Tu catálogo está vacío</h3>
                <p>Cuando agregues productos, aparecerán aquí.</p>
            </div>
        `;

        return;
    }

    // OBTENER LAS IMÁGENES DE LOS PRODUCTOS

    const productIds = products.map(function (product) {
        return product.id;
    });

    const { data: images, error: imagesError } = await supabase
        .from("product_images")
        .select("*")
        .in("product_id", productIds)
        .order("position", { ascending: true });

    if (imagesError) {
        console.error("Error al cargar imágenes:", imagesError);
    }

    productList.innerHTML = "";

    for (let i = 0; i < products.length; i++) {

        const product = products[i];

        const productCard = document.createElement("article");
        productCard.classList.add("admin-product-card");

        const status = product.is_published
            ? "Publicado"
            : "Oculto";

        const stockStatus = product.stock === 0
            ? "Sin stock"
            : product.stock + " unidades";

        // CREAR CARRUSEL DE IMÁGENES

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("admin-product-carousel");

        const imageTrack = document.createElement("div");
        imageTrack.classList.add("admin-product-image-track");

        if (!imagesError && images) {

            const productImageList = images.filter(function (image) {
                return image.product_id === product.id;
            });

            if (productImageList.length > 0) {

                for (let j = 0; j < productImageList.length; j++) {

                    const image = productImageList[j];

                    const { data: signedUrlData, error: signedUrlError } =
                        await supabase
                            .storage
                            .from("product-images")
                            .createSignedUrl(image.storage_path, 3600);

                    if (signedUrlError) {
                        console.error("Error al generar el enlace de la imagen:", signedUrlError);
                        continue;
                    }

const imageElement = document.createElement("img");

imageElement.src = signedUrlData.signedUrl;
imageElement.alt = image.alt_text || product.name;
imageElement.loading = "lazy";

                    imageTrack.appendChild(imageElement);
                }

                imageContainer.appendChild(imageTrack);

                // FLECHAS DEL CARRUSEL

                if (productImageList.length > 1) {

                    const previousButton = document.createElement("button");

                    previousButton.type = "button";
                    previousButton.textContent = "‹";
                    previousButton.classList.add("carousel-arrow");
                    previousButton.setAttribute(
                        "aria-label",
                        "Imagen anterior"
                    );

                    const nextButton = document.createElement("button");

                    nextButton.type = "button";
                    nextButton.textContent = "›";
                    nextButton.classList.add("carousel-arrow");
                    nextButton.setAttribute(
                        "aria-label",
                        "Imagen siguiente"
                    );

                    previousButton.addEventListener("click", function () {
                        imageTrack.scrollBy({
                            left: -imageTrack.clientWidth,
                            behavior: "smooth"
                        });
                    });

                    nextButton.addEventListener("click", function () {
                        imageTrack.scrollBy({
                            left: imageTrack.clientWidth,
                            behavior: "smooth"
                        });
                    });

                    imageContainer.appendChild(previousButton);
                    imageContainer.appendChild(nextButton);
                }

            } else {

                imageContainer.textContent = "Sin fotografías";

            }

        } else {

            imageContainer.textContent =
                "No se pudieron cargar las fotografías";

        }

// BOTÓN EDITAR

const editButton = document.createElement("button");

editButton.type = "button";
editButton.textContent = "Editar";
editButton.classList.add("secondary-button");

editButton.addEventListener("click", function () {
    editProduct(product);
});

// BOTÓN ELIMINAR PRODUCTO

const deleteButton = document.createElement("button");

deleteButton.type = "button";
deleteButton.textContent = "Eliminar";
deleteButton.classList.add("delete-image-button");

deleteButton.addEventListener("click", function () {
    deleteProduct(product);
});

        productCard.innerHTML = `
            <div class="admin-product-info">
                <h3></h3>
                <p class="admin-product-category"></p>
                <p class="admin-product-description"></p>
            </div>

            <div class="admin-product-details">
                <strong class="admin-product-price"></strong>

                <div class="admin-product-availability">
                    <span class="admin-product-stock"></span>
                    <span class="admin-product-status"></span>
                </div>
            </div>
        `;

        productCard.querySelector("h3").textContent =
            product.name;

        productCard.querySelector(".admin-product-category").textContent =
            product.category
                ? product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)
                : "Sin categoría";

        productCard.querySelector(".admin-product-description").textContent =
            product.description || "Sin descripción";

        productCard.querySelector(".admin-product-price").textContent =
            "$" + Number(product.price).toLocaleString("es-AR");

        productCard.querySelector(".admin-product-stock").textContent =
            stockStatus;

        productCard.querySelector(".admin-product-status").textContent =
            status;

        productCard.insertBefore(imageContainer, productCard.firstChild);
        const productActions = document.createElement("div");

        productActions.classList.add("existing-image-actions");

        productActions.appendChild(editButton);
        productActions.appendChild(deleteButton);

productCard.appendChild(productActions);

        productList.appendChild(productCard);
    }
}

// ELIMINAR PRODUCTO COMPLETO

async function deleteProduct(product) {

    const confirmed = confirm(
        `¿Estás seguro de que querés eliminar "${product.name}" y todas sus fotografías? Esta acción no se puede deshacer.`
    );

    if (!confirmed) {
        return;
    }

    const { data: images, error: imagesError } = await supabase
        .from("product_images")
        .select("id, storage_path")
        .eq("product_id", product.id);

    if (imagesError) {
        console.error("Error al obtener las fotografías:", imagesError);
        alert("No se pudieron obtener las fotografías del producto.");
        return;
    }

    // ELIMINAR ARCHIVOS DEL ALMACENAMIENTO

    if (images && images.length > 0) {

        const storagePaths = images.map(function (image) {
            return image.storage_path;
        });

        const { error: storageError } = await supabase
            .storage
            .from("product-images")
            .remove(storagePaths);

        if (storageError) {
            console.error("Error al eliminar fotografías:", storageError);
            alert("No se pudieron eliminar las fotografías. El producto sigue guardado.");
            return;
        }

        // ELIMINAR REGISTROS DE LAS FOTOGRAFÍAS

        const { error: databaseImagesError } = await supabase
            .from("product_images")
            .delete()
            .eq("product_id", product.id);

        if (databaseImagesError) {
            console.error("Error al eliminar registros:", databaseImagesError);
            alert("No se pudieron eliminar los registros de las fotografías.");
            return;
        }
    }

    // ELIMINAR PRODUCTO

    const { error: productError } = await supabase
        .from("Productos")
        .delete()
        .eq("id", product.id);

    if (productError) {
        console.error("Error al eliminar producto:", productError);
        alert("No se pudo eliminar el producto. Revisá los permisos de Supabase.");
        return;
    }

    alert("Producto eliminado correctamente.");

    await loadStatistics();
    await loadProducts();
}

// LIBERAR LAS VISTAS PREVIAS TEMPORALES

function clearImageItems() {

    for (let i = 0; i < imageItems.length; i++) {

        if (imageItems[i].type === "new") {
            URL.revokeObjectURL(imageItems[i].previewUrl);
        }
    }

    imageItems = [];
}

// CARGAR IMÁGENES EXISTENTES

async function loadExistingImages(productId) {

    existingImagesSection.hidden = false;
    existingImagesList.innerHTML = "<p>Cargando fotografías...</p>";

    const { data, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("position", { ascending: true });

    if (error) {

        console.error("Error al cargar fotografías:", error);

        existingImagesList.innerHTML =
            "<p>No se pudieron cargar las fotografías.</p>";

        return;
    }

    imageItems = [];

    for (let i = 0; i < data.length; i++) {

        imageItems.push({
            type: "existing",
            id: data[i].id,
            storage_path: data[i].storage_path,
            alt_text: data[i].alt_text,
            position: data[i].position
        });
    }

    await renderImageItems();
}

// MOSTRAR TODAS LAS IMÁGENES EN UNA SOLA CUADRÍCULA

async function renderImageItems() {

    existingImagesList.innerHTML = "";

    if (imageItems.length === 0) {

        existingImagesList.innerHTML =
            "<p>Este producto todavía no tiene fotografías.</p>";

        return;
    }

    for (let i = 0; i < imageItems.length; i++) {

        const image = imageItems[i];

        const imageCard = document.createElement("div");
        imageCard.classList.add("existing-image-card");

        const imageElement = document.createElement("img");

        // DETERMINAR LA DIRECCIÓN DE LA IMAGEN

        if (image.type === "existing") {

            const { data: signedUrlData, error } = await supabase
                .storage
                .from("product-images")
                .createSignedUrl(image.storage_path, 3600);

            if (error) {
                console.error("Error al generar el enlace de la imagen:", error);
                imageElement.alt = "No se pudo cargar la fotografía";
            } else {
                imageElement.src = signedUrlData.signedUrl;
                imageElement.alt =
                    image.alt_text || "Fotografía del producto";
            }

        } else {

            imageElement.src = image.previewUrl;
            imageElement.alt = image.file.name;

        }

        const actions = document.createElement("div");
        actions.classList.add("existing-image-actions");

        // BOTÓN MOVER A LA IZQUIERDA

        const leftButton = document.createElement("button");

        leftButton.type = "button";
        leftButton.textContent = "←";
        leftButton.title = "Mover a la izquierda";
        leftButton.disabled = i === 0;

        leftButton.addEventListener("click", function () {
            moveImage(i, -1);
        });

        // BOTÓN MOVER A LA DERECHA

        const rightButton = document.createElement("button");

        rightButton.type = "button";
        rightButton.textContent = "→";
        rightButton.title = "Mover a la derecha";
        rightButton.disabled = i === imageItems.length - 1;

        rightButton.addEventListener("click", function () {
            moveImage(i, 1);
        });

        // BOTÓN ELIMINAR

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Eliminar";
        deleteButton.classList.add("delete-image-button");

        deleteButton.addEventListener("click", function () {

            if (image.type === "existing") {
                deleteImage(image);
            } else {
                deleteNewImage(i);
            }

        });

        actions.appendChild(leftButton);
        actions.appendChild(rightButton);
        actions.appendChild(deleteButton);

        imageCard.appendChild(imageElement);
        imageCard.appendChild(actions);

        existingImagesList.appendChild(imageCard);
    }
}

// AGREGAR IMÁGENES NUEVAS A LA MISMA LISTA

productImages.addEventListener("change", async function () {

    const files = productImages.files;

    for (let i = 0; i < files.length; i++) {

        const file = files[i];

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            alert("Solo se permiten imágenes JPG, PNG o WEBP.");
            continue;
        }

        if (file.size > 5 * 1024 * 1024) {

            alert("Cada imagen debe pesar como máximo 5 MB.");
            continue;
        }

        const previewUrl = URL.createObjectURL(file);

        imageItems.push({
            type: "new",
            file: file,
            previewUrl: previewUrl
        });
    }

    // LIMPIAR EL SELECTOR PARA PODER VOLVER A ELEGIR ARCHIVOS

    productImages.value = "";

    // MOSTRAR TODAS LAS IMÁGENES JUNTAS

    existingImagesSection.hidden = false;

    await renderImageItems();
});

// MOVER UNA IMAGEN

async function moveImage(index, direction) {

    const newIndex = index + direction;

    if (
        newIndex < 0 ||
        newIndex >= imageItems.length
    ) {
        return;
    }

    const temporaryImage = imageItems[index];

    imageItems[index] = imageItems[newIndex];
    imageItems[newIndex] = temporaryImage;

    await renderImageItems();

    productFormMessage.style.color = "#52734d";
    productFormMessage.textContent =
        "Orden actualizado. Guardá los cambios para conservarlo.";
}

// ELIMINAR UNA IMAGEN NUEVA

async function deleteNewImage(index) {

    const confirmed = confirm(
        "¿Querés quitar esta fotografía de la selección?"
    );

    if (!confirmed) {
        return;
    }

    URL.revokeObjectURL(imageItems[index].previewUrl);

    imageItems.splice(index, 1);

    await renderImageItems();

    productFormMessage.style.color = "#52734d";
    productFormMessage.textContent =
        "Fotografía quitada de la selección.";
}

// ELIMINAR UNA IMAGEN EXISTENTE

async function deleteImage(image) {

    const confirmed = confirm(
        "¿Estás seguro de que querés eliminar esta fotografía?"
    );

    if (!confirmed) {
        return;
    }

    // ELIMINAR EL REGISTRO DE LA BASE DE DATOS

    const { error: databaseError } = await supabase
        .from("product_images")
        .delete()
        .eq("id", image.id);

    if (databaseError) {

        console.error("Error al eliminar el registro:", databaseError);

        productFormMessage.style.color = "#a33b32";
        productFormMessage.textContent =
            "No se pudo eliminar la fotografía.";

        return;
    }

    // ELIMINAR EL ARCHIVO DEL ALMACENAMIENTO

    const { error: storageError } = await supabase
        .storage
        .from("product-images")
        .remove([image.storage_path]);

    if (storageError) {

        console.error("Error al eliminar el archivo:", storageError);

        productFormMessage.style.color = "#a33b32";
        productFormMessage.textContent =
            "Se eliminó el registro, pero no se pudo borrar el archivo almacenado.";

    } else {

        productFormMessage.style.color = "#52734d";
        productFormMessage.textContent =
            "Fotografía eliminada correctamente.";

    }

    // QUITARLA DE LA CUADRÍCULA

    imageItems = imageItems.filter(function (currentImage) {
        return currentImage.id !== image.id;
    });

    await renderImageItems();

    await loadProducts();
}

// GUARDAR TODAS LAS IMÁGENES Y SU ORDEN

async function saveImageItems(productId) {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    // VALIDAR LAS IMÁGENES NUEVAS

    for (let i = 0; i < imageItems.length; i++) {

        if (imageItems[i].type === "new") {

            const file = imageItems[i].file;

            if (!allowedTypes.includes(file.type)) {

                productFormMessage.textContent =
                    "Una de las imágenes tiene un formato no permitido.";

                return false;
            }

            if (file.size > 5 * 1024 * 1024) {

                productFormMessage.textContent =
                    "Cada imagen debe pesar como máximo 5 MB.";

                return false;
            }
        }
    }

    // GUARDAR CADA IMAGEN EN SU POSICIÓN

    for (let i = 0; i < imageItems.length; i++) {

        const image = imageItems[i];

        // SI YA EXISTE EN SUPABASE, ACTUALIZAR SU POSICIÓN

        if (image.type === "existing") {

            const { error } = await supabase
                .from("product_images")
                .update({ position: i })
                .eq("id", image.id);

            if (error) {

                console.error("Error al guardar el orden:", error);

                productFormMessage.textContent =
                    "No se pudo guardar el orden de las fotografías.";

                return false;
            }

            image.position = i;
        }

        // SI ES NUEVA, SUBIRLA Y REGISTRARLA

        else {

            const file = image.file;

            const extension = file.type === "image/jpeg"
                ? "jpg"
                : file.type === "image/png"
                    ? "png"
                    : "webp";

            const storagePath =
                productId + "/" + crypto.randomUUID() + "." + extension;

            const { error: uploadError } = await supabase
                .storage
                .from("product-images")
                .upload(storagePath, file, {
                    contentType: file.type
                });

            if (uploadError) {

                console.error("Error al subir imagen:", uploadError);

                productFormMessage.textContent =
                    "No se pudo subir una de las fotografías.";

                return false;
            }

            const { data: insertedImage, error: databaseError } =
                await supabase
                    .from("product_images")
                    .insert({
                        product_id: productId,
                        storage_path: storagePath,
                        alt_text: file.name,
                        position: i
                    })
                    .select()
                    .single();

            if (databaseError) {

                console.error("Error al registrar imagen:", databaseError);

                await supabase
                    .storage
                    .from("product-images")
                    .remove([storagePath]);

                productFormMessage.textContent =
                    "No se pudo registrar una de las fotografías.";

                return false;
            }

            // CONVERTIRLA EN UNA IMAGEN GUARDADA

            URL.revokeObjectURL(image.previewUrl);

            imageItems[i] = {
                type: "existing",
                id: insertedImage.id,
                storage_path: insertedImage.storage_path,
                alt_text: insertedImage.alt_text,
                position: i
            };
        }
    }

    return true;
}

// EDITAR PRODUCTO

async function editProduct(product) {

    editingProductId = product.id;

    productName.value = product.name;
    productPrice.value = product.price;
    productCategory.value = product.category;
    productStock.value = product.stock;
    productDescription.value = product.description || "";
    productPublished.checked = product.is_published;

    productImages.value = "";

    clearImageItems();

    formTitle.textContent = "Editar perfume";
    saveButton.textContent = "Guardar cambios";

    productFormMessage.textContent = "";

    productFormSection.hidden = false;

    await loadExistingImages(product.id);

    productFormSection.scrollIntoView({
        behavior: "smooth"
    });
}

// ABRIR FORMULARIO PARA AGREGAR

addProductButton.addEventListener("click", function () {

    editingProductId = null;

    productForm.reset();

    clearImageItems();

    existingImagesList.innerHTML = "";
    existingImagesSection.hidden = true;

    formTitle.textContent = "Agregar perfume";
    saveButton.textContent = "Guardar producto";

    productFormMessage.textContent = "";

    productFormSection.hidden = false;

    productFormSection.scrollIntoView({
        behavior: "smooth"
    });

});

// CERRAR FORMULARIO

cancelProductButton.addEventListener("click", function () {

    editingProductId = null;

    productForm.reset();

    clearImageItems();

    productFormMessage.textContent = "";

    existingImagesList.innerHTML = "";
    existingImagesSection.hidden = true;

    formTitle.textContent = "Agregar perfume";
    saveButton.textContent = "Guardar producto";

    productFormSection.hidden = true;

});

// GUARDAR O ACTUALIZAR PRODUCTO

productForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = productName.value.trim();
    const price = Number(productPrice.value);
    const category = productCategory.value;
    const stock = Number(productStock.value);
    const description = productDescription.value.trim();
    const isPublished = productPublished.checked;

    if (
        name === "" ||
        !Number.isFinite(price) ||
        price <= 0 ||
        category === "" ||
        !Number.isInteger(stock) ||
        stock < 0
    ) {

        productFormMessage.style.color = "#a33b32";
        productFormMessage.textContent = "Revisá los datos ingresados.";

        return;
    }

    saveButton.disabled = true;
    saveButton.textContent = "GUARDANDO...";

    productFormMessage.textContent = "";

    const productData = {
        name: name,
        price: price,
        category: category,
        stock: stock,
        description: description,
        is_published: isPublished
    };

    let error;
    let productId;

    // SI ES UN PRODUCTO NUEVO

    if (editingProductId === null) {

        const result = await supabase
            .from("Productos")
            .insert(productData)
            .select("id")
            .single();

        error = result.error;

        if (!error) {
            productId = result.data.id;
        }

    }

    // SI ESTAMOS EDITANDO UN PRODUCTO

    else {

        productId = editingProductId;

        const result = await supabase
            .from("Productos")
            .update(productData)
            .eq("id", editingProductId);

        error = result.error;
    }

    // SI HUBO UN ERROR

    if (error) {

        console.error("Error al guardar el producto:", error);

        productFormMessage.style.color = "#a33b32";
        productFormMessage.textContent =
            "No se pudo guardar el producto. Revisá la conexión e intentá nuevamente.";

        saveButton.disabled = false;

        saveButton.textContent = editingProductId === null
            ? "Guardar producto"
            : "Guardar cambios";

        return;
    }

    // GUARDAR IMÁGENES Y ORDEN

    const imagesSaved = await saveImageItems(productId);

    if (!imagesSaved) {

        editingProductId = productId;

        productFormMessage.style.color = "#a33b32";

        saveButton.disabled = false;
        saveButton.textContent = "Guardar cambios";

        await loadStatistics();
        await loadProducts();

        return;
    }

    // GUARDADO CORRECTO

    productFormMessage.style.color = "#52734d";
    productFormMessage.textContent =
        "¡Producto y fotografías guardados correctamente!";

    editingProductId = null;

    productForm.reset();

    clearImageItems();

    existingImagesList.innerHTML = "";
    existingImagesSection.hidden = true;

    formTitle.textContent = "Agregar perfume";
    saveButton.textContent = "Guardar producto";

    await loadStatistics();
    await loadProducts();

    saveButton.disabled = false;

});

// CAMBIAR CONTRASEÑA

changePasswordForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const newPassword = accountNewPassword.value;
    const confirmPassword = accountConfirmPassword.value;

    changePasswordMessage.style.color = "#a33b32";
    changePasswordMessage.textContent = "";

    if (newPassword.length < 8) {
        changePasswordMessage.textContent =
            "La contraseña debe tener al menos 8 caracteres.";
        return;
    }

    if (newPassword !== confirmPassword) {
        changePasswordMessage.textContent =
            "Las contraseñas no coinciden.";
        return;
    }

    changePasswordButton.disabled = true;
    changePasswordButton.textContent = "ACTUALIZANDO...";

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {

        console.error("Error al cambiar contraseña:", error);

        changePasswordMessage.textContent =
            "No se pudo actualizar la contraseña. Intentá nuevamente.";

    } else {

        changePasswordMessage.style.color = "#52734d";
        changePasswordMessage.textContent =
            "¡Tu contraseña se actualizó correctamente!";

        changePasswordForm.reset();

    }

    changePasswordButton.disabled = false;
    changePasswordButton.textContent = "CAMBIAR CONTRASEÑA";

});

// CERRAR SESIÓN

logoutButton.addEventListener("click", async function () {

    const { error } = await supabase.auth.signOut();

    if (error) {
        alert("No se pudo cerrar la sesión.");
        console.error(error);
        return;
    }

    window.location.href = "admin.html";

});

// INICIAR PANEL

async function initializeDashboard() {

    const hasAccess = await verifyAccess();

    if (!hasAccess) {
        return;
    }

    await loadStatistics();
    await loadProducts();
}

initializeDashboard();
