import { supabase } from "./supabase-config.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");

const recoveryForm = document.getElementById("recoveryForm");
const recoveryEmail = document.getElementById("recoveryEmail");
const recoveryButton = document.getElementById("recoveryButton");
const recoveryMessage = document.getElementById("recoveryMessage");
const backToLogin = document.getElementById("backToLogin");

const newPasswordForm = document.getElementById("newPasswordForm");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const newPasswordButton = document.getElementById("newPasswordButton");
const newPasswordMessage = document.getElementById("newPasswordMessage");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginButton.disabled = true;
    loginButton.textContent = "INGRESANDO...";
    loginMessage.textContent = "";

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
    console.error("Error de Supabase:", error);

    loginMessage.textContent = error.message;

    loginButton.disabled = false;
    loginButton.textContent = "INICIAR SESIÓN";
    return;
    }

    const userId = data.user.id;

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    if (profileError || !profile ||
        (profile.role !== "owner" && profile.role !== "employee")) {

        await supabase.auth.signOut();

        loginMessage.textContent = "Tu cuenta no tiene permisos para acceder.";

        loginButton.disabled = false;
        loginButton.textContent = "INICIAR SESIÓN";
        return;
    }

    loginMessage.style.color = "#52734d";
    loginMessage.textContent = "Inicio de sesión correcto. ¡Bienvenida a VELORA!";

    loginButton.textContent = "SESIÓN INICIADA";
});

// MOSTRAR FORMULARIO DE RECUPERACIÓN
forgotPasswordLink.addEventListener("click", function (event) {
    event.preventDefault();

    loginForm.hidden = true;
    recoveryForm.hidden = false;
    newPasswordForm.hidden = true;

    recoveryEmail.value = emailInput.value.trim();
    recoveryMessage.textContent = "";
});


// VOLVER AL INICIO DE SESIÓN
backToLogin.addEventListener("click", function (event) {
    event.preventDefault();

    recoveryForm.hidden = true;
    newPasswordForm.hidden = true;
    loginForm.hidden = false;

    recoveryMessage.textContent = "";
});


// ENVIAR CORREO DE RECUPERACIÓN
recoveryForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    recoveryButton.disabled = true;
    recoveryButton.textContent = "ENVIANDO...";
    recoveryMessage.textContent = "";

    const { error } = await supabase.auth.resetPasswordForEmail(
        recoveryEmail.value.trim(),
        {
            redirectTo: "https://perfumes-velora.netlify.app/admin.html"
        }
    );

    if (error) {
        console.error("Error al recuperar contraseña:", error);
        recoveryMessage.textContent = "No se pudo enviar el correo. Intentá nuevamente.";
    } else {
        recoveryMessage.style.color = "#52734d";
        recoveryMessage.textContent =
            "Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.";
    }

    recoveryButton.disabled = false;
    recoveryButton.textContent = "ENVIAR ENLACE";
});


// DETECTAR CUANDO SE ABRE EL ENLACE DE RECUPERACIÓN
supabase.auth.onAuthStateChange(function (event) {
    if (event === "PASSWORD_RECOVERY") {
        loginForm.hidden = true;
        recoveryForm.hidden = true;
        newPasswordForm.hidden = false;
    }
});


// GUARDAR LA NUEVA CONTRASEÑA
newPasswordForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    newPasswordMessage.textContent = "";

    if (newPassword.length < 8) {
        newPasswordMessage.textContent =
            "La contraseña debe tener al menos 8 caracteres.";
        return;
    }

    if (newPassword !== confirmPassword) {
        newPasswordMessage.textContent =
            "Las contraseñas no coinciden.";
        return;
    }

    newPasswordButton.disabled = true;
    newPasswordButton.textContent = "GUARDANDO...";

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        console.error("Error al cambiar contraseña:", error);
        newPasswordMessage.textContent =
            "No se pudo actualizar la contraseña. Intentá nuevamente.";
    } else {
        newPasswordMessage.style.color = "#52734d";
        newPasswordMessage.textContent =
            "¡Contraseña actualizada! Ya podés iniciar sesión.";

        newPasswordForm.reset();
    }

    newPasswordButton.disabled = false;
    newPasswordButton.textContent = "GUARDAR NUEVA CONTRASEÑA";
});
