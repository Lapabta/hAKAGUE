 // Función para el login de Google (placeholder)
        function handleGoogleLogin() {
            console.log("Iniciando sesión con Google...");
            // Aquí irá la integración con la API de Google
            alert("Login con Google funcionará pronto");
        }

// ======================
// BASE DE DATOS DE USUARIOS
// ======================

let usuarios = [
    {
        id: 1,
        username: "admin",
        email: "admin@nicaviva.com",
        password: "admin123", // En producción esto debe estar hasheado
        role: "admin",
        avatar: "admin-avatar.jpg",
        fechaRegistro: new Date().toISOString()
    },
    {
        id: 2, 
        username: "usuario_ejemplo",
        email: "usuario@ejemplo.com",
        password: "user123",
        role: "user",
        avatar: "user-avatar.jpg",
        fechaRegistro: new Date().toISOString()
    }
];

// ======================
// SISTEMA DE AUTENTICACIÓN
// ======================

function login(email, password) {
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (usuario) {
        // Guardar en sessionStorage (persiste mientras la pestaña esté abierta)
        sessionStorage.setItem('usuarioActual', JSON.stringify(usuario));
        
        // Redirigir a la página principal
        window.location.href = 'index.html'; // Cambia por tu página principal
        return true;
    }
    
    alert('Email o contraseña incorrectos');
    return false;
}

function registrarUsuario(username, email, password, esAdmin = false) {
    // Verificar si el email ya existe
    if (usuarios.find(u => u.email === email)) {
        alert('Este email ya está registrado');
        return false;
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = {
        id: usuarios.length + 1,
        username,
        email,
        password, // ¡En producción debe hashearse!
        role: esAdmin ? "admin" : "user",
        avatar: "default-avatar.jpg",
        fechaRegistro: new Date().toISOString()
    };
    
    usuarios.push(nuevoUsuario);
    console.log('Usuario registrado:', nuevoUsuario);
    return true;
}

function obtenerUsuarioActual() {
    const usuarioGuardado = sessionStorage.getItem('usuarioActual');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
}

function esAdmin() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.role === "admin";
}

// ======================
// MANEJADORES DE FORMULARIOS
// ======================

// Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    if (!email || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }
    
    login(email, password);
});

// Registro  
document.getElementById('registro-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    const esAdmin = document.getElementById('es-admin').checked;
    
    if (registrarUsuario(username, email, password, esAdmin)) {
        alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
        cerrarRegistro();
    }
});

// ======================
// MODAL DE REGISTRO
// ======================

function mostrarRegistro() {
    document.getElementById('modal-registro').style.display = 'flex';
    
    // Solo mostrar opción de admin si ya hay un admin logueado
    const usuarioActual = obtenerUsuarioActual();
    document.getElementById('admin-field').style.display = 
        usuarioActual && usuarioActual.role === "admin" ? "block" : "none";
}

function cerrarRegistro() {
    document.getElementById('modal-registro').style.display = 'none';
}

// ======================
// LOGIN CON REDES SOCIALES (Placeholder)
// ======================

function handleGoogleLogin() {
    console.log("Iniciando sesión con Google...");
    alert("Login con Google - Para el hackathon usaremos login normal");
}

function handleFacebookLogin() {
    alert("Login con Facebook - Usa el formulario normal por ahora");
}

function handleAppleLogin() {
    alert("Login con Apple - Usa el formulario normal por ahora");
}

// ======================
// VERIFICACIÓN AL CARGAR LA PÁGINA
// ======================

document.addEventListener('DOMContentLoaded', function() {
    // Si ya está logueado, redirigir a index
    if (obtenerUsuarioActual()) {
        window.location.href = 'index.html';
    }
});