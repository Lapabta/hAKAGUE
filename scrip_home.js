//   ==========================================
// FUNCIONALIDADES PARA LA PANTALLA DE INICIO
// ==========================================

// Datos de ejemplo (luego vendrán de una base de datos)
let posts = [
    {
        id: 1,
        user: "María González",
        avatar: "images/user1.jpg",
        time: "Hace 2 horas",
        location: "🌋 Masaya",
        content: "¡Les comparto esta receta familiar de indio viejo que preparaba mi abuela! 🍲 #TradiciónNicaragüense",
        image: "images/comida-tipica.jpg",
        type: "image", // "image", "video", "text",
        likes: 42,
        comments: 8,
        liked: false,
        comments: [
            {
                id: 1,
                user: "Juan Pérez",
                avatar: "images/user3.jpg",
                text: "¡Qué receta tan auténtica! 👏",
                time: "Hace 1 hora",
                likes: 3,
                replies: [ // ← COMENTARIOS ANIDADOS
                    {
                        id: 2,
                        user: "María González",
                        avatar: "images/user1.jpg", 
                        text: "¡Gracias Juan! Es de generación en generación 🥰",
                        time: "Hace 45 min",
                        likes: 1
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        user: "Carlos Ruiz",
        avatar: "images/user2.jpg",
        time: "Ayer",
        location: "🎭 Granada",
        content: "Video de la tradicional danza del Güegüense en las fiestas patronales! 💃🕺",
        video: "images/danza-traditional.mp4",
        likes: 87,
        comments: 15,
        liked: false,
        comments: [
            {
                id: 1,
                user: "Juan Pérez",
                avatar: "images/user3.jpg",
                text: "¡Qué receta tan auténtica! 👏",
                time: "Hace 1 hora",
                likes: 3,
                replies: [ // ← COMENTARIOS ANIDADOS
                    {
                        id: 2,
                        user: "María González",
                        avatar: "images/user1.jpg", 
                        text: "¡Gracias Juan! Es de generación en generación 🥰",
                        time: "Hace 45 min",
                        likes: 1
                    }
                ]
            }
        ]
    }
];

// ======================
// FUNCIONALIDAD DE POSTS
// ======================

function crearPost() {
    const postText = document.querySelector('.create-header input').value;
    const postImage = document.getElementById('post-image-preview'); // Imagen previsualizada
    
    if (!postText.trim() && !postImage) {
        alert('Por favor escribe algo o sube una imagen');
        return;
    }

    const nuevoPost = {
        id: Date.now(),
        user: "Tú",
        avatar: "images/user-avatar.jpg",
        time: "Ahora mismo",
        location: "📍 Tu ubicación",
        content: postText,
        image: postImage ? postImage.src : null, // ← IMAGEN EN BASE64 O URL
        type: postImage ? "image" : "text",
        likes: 0,
        comments: 0,
        liked: false
    };

    posts.unshift(nuevoPost);
    renderizarPosts();
    limpiarFormularioPost();
    alert('¡Publicación creada!');
}

// ======================
// SISTEMA DE ME GUSTA
// ======================

function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        renderizarPosts();
    }
}

// ======================
// SISTEMA DE COMENTARIOS
// ======================

function toggleComentarios(postId) {
    const comentariosSection = document.getElementById(`comentarios-${postId}`);
    const comentariosBtn = document.querySelector(`[onclick="toggleComentarios(${postId})"]`);
    
    if (comentariosSection.style.display === 'none') {
        comentariosSection.style.display = 'block';
        comentariosBtn.textContent = '💬 Ocultar comentarios';
        cargarComentarios(postId);
    } else {
        comentariosSection.style.display = 'none';
        comentariosBtn.textContent = '💬 Ver comentarios';
    }
}

function cargarComentarios(postId) {
    const post = posts.find(p => p.id === postId);
    const comentariosSection = document.getElementById(`comentarios-${postId}`);
    
    let comentariosHTML = `
        <div class="nuevo-comentario">
            <img src="images/user-avatar.jpg" alt="Usuario" class="user-avatar-small">
            <input type="text" placeholder="Escribe un comentario..." id="comentario-${postId}">
            <button onclick="agregarComentario(${postId})">💬</button>
            <button onclick="subirImagenComentario(${postId})">📷</button>
        </div>
        <div class="lista-comentarios">
    `;

    // Renderizar comentarios y respuestas
    post.comments.forEach(comment => {
        comentariosHTML += `
            <div class="comentario">
                <img src="${comment.avatar}" alt="Usuario" class="user-avatar-small">
                <div class="comentario-content">
                    <div class="comentario-header">
                        <strong>${comment.user}</strong>
                        <span class="comentario-time">${comment.time}</span>
                    </div>
                    <p>${comment.text}</p>
                    <div class="comentario-actions">
                        <button onclick="toggleLikeComentario(${postId}, ${comment.id})">
                            👍 ${comment.likes}
                        </button>
                        <button onclick="toggleRespuestas(${postId}, ${comment.id})">
                            💬 Responder
                        </button>
                    </div>
                    
                    <!-- Zona de respuestas (comentarios anidados) -->
                    <div class="respuestas" id="respuestas-${postId}-${comment.id}" style="display: none;">
                        ${renderizarRespuestas(comment.replies)}
                        <div class="nueva-respuesta">
                            <input type="text" placeholder="Escribe una respuesta..." id="respuesta-${postId}-${comment.id}">
                            <button onclick="agregarRespuesta(${postId}, ${comment.id})">Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    comentariosSection.innerHTML = comentariosHTML + '</div>';
}



function agregarComentario(postId) {
    const texto = document.getElementById(`comentario-${postId}`).value;
    if (!texto.trim()) return;
    
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments += 1;
        renderizarPosts();
        document.getElementById(`comentario-${postId}`).value = '';
        alert('¡Comentario agregado!');
    }
}

// ======================
// RENDERIZAR POSTS
// ======================

function renderizarPosts() {
    const feed = document.querySelector('.content-feed');
    let postsHTML = `
        <div class="create-post">
            <div class="create-header">
                <img src="images/user-avatar.jpg" alt="Usuario" class="user-avatar-small">
                <input type="text" placeholder="Comparte una vivencia nicaragüense...">
            </div>
            <div class="create-options">
                <button class="option-btn" onclick="subirImagenPost()">📷 Foto</button>
                <button class="option-btn" onclick="subirArchivo('video')">🎥 Video</button>
                <button class="option-btn" onclick="crearPost()">📖 Publicar</button>
            </div>
        </div>
    `;

    posts.forEach(post => {
        postsHTML += `
            <div class="post" id="post-${post.id}">
                <div class="post-header">
                    <img src="${post.avatar}" alt="Usuario" class="user-avatar">
                    <div class="post-user-info">
                        <div class="user-name">${post.user}</div>
                        <div class="post-time">${post.time} · ${post.location}</div>
                    </div>
                </div>
                
                <div class="post-content">
                    <p>${post.content}</p>
                    ${post.image ? `
                        <div class="post-image-container">
                            <img src="${post.image}" alt="Publicación" class="post-image">
                        </div>
                    ` : ''}
                </div>
                
                <div class="post-stats">
                    <span>👍 ${post.likes} me gusta</span>
                    <span>💬 ${post.comments} comentarios</span>
                </div>
                
                <div class="post-actions">
                    <button class="action-btn ${post.liked ? 'liked' : ''}" 
                            onclick="toggleLike(${post.id})">
                        ${post.liked ? '❤️' : '👍'} Me gusta
                    </button>
                    <button class="action-btn" onclick="toggleComentarios(${post.id})">
                        💬 Comentar
                    </button>
                    <button class="action-btn" onclick="compartirPost(${post.id})">
                        ↗️ Compartir
                    </button>
                </div>
                
                <div class="comentarios-section" id="comentarios-${post.id}" style="display: none;">
                    <!-- Comentarios aquí -->
                </div>
            </div>
        `;
    });

    feed.innerHTML = postsHTML;
}

// ======================
// FUNCIONES ADICIONALES
// ======================

function subirArchivo(tipo) {
    alert(`Próximamente podrás subir ${tipo}s. Por ahora usa texto.`);
}

function compartirPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        alert(`Compartiendo: "${post.content.substring(0, 50)}..."`);
        // Aquí integrarías con APIs de redes sociales
    }
}

// ======================
// BUSCADOR
// ======================

function buscarContenido() {
    const termino = document.querySelector('.search-bar input').value.toLowerCase();
    const postsVisibles = posts.filter(post => 
        post.content.toLowerCase().includes(termino) ||
        post.user.toLowerCase().includes(termino) ||
        post.location.toLowerCase().includes(termino)
    );
    
    // Aquí iría la lógica para filtrar y mostrar solo posts relevantes
    console.log('Buscando:', termino, 'Resultados:', postsVisibles.length);
}

// ======================
// EVENT LISTENERS
// ======================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar
    renderizarPosts();
    
    // Buscador en tiempo real
    document.querySelector('.search-bar input').addEventListener('input', buscarContenido);
    
    // Buscar al presionar Enter
    document.querySelector('.search-bar input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') buscarContenido();
    });
    
    // Botón de búsqueda
    document.querySelector('.search-bar button').addEventListener('click', buscarContenido);
    
    // Botón de crear publicación
    document.querySelector('.btn-create').addEventListener('click', function() {
        document.querySelector('.create-header input').focus();
    });
});

// ======================
// MENÚ DE NAVEGACIÓN
// ======================

function navegarA(seccion) {
    alert(`Navegando a: ${seccion}`);
    // Aquí cambiarías el contenido según la sección
}

javascript
// ======================
// FUNCIÓN DE NAVEGACIÓN
// ======================

function navegarA(seccion) {
    console.log('Navegando a:', seccion);
    
    // 1. Remover 'active' de todos los items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 2. Agregar 'active' al item clickeado
    event.currentTarget.classList.add('active');
    
    // 3. Cambiar contenido según la sección
    cambiarContenido(seccion);
}

function cambiarContenido(seccion) {
    const feed = document.querySelector('.content-feed');
    
    switch(seccion) {
        case 'inicio':
            // Tu contenido actual de posts
            renderizarPosts(); // Tu función existente
            break;
            
        case 'mapa':
            feed.innerHTML = `
                <div class="section-header">
                    <h2>🗺️ Mapa Cultural de Nicaragua</h2>
                    <p>Explora nuestra riqueza cultural</p>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <p>Mapa interactivo en desarrollo...</p>
                </div>
            `;
            break;
            
        case 'juegos':
            feed.innerHTML = `
                <div class="section-header">
                    <h2>🎮 Juegos Didácticos</h2>
                    <p>Aprende sobre Nicaragua jugando</p>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <p>Juegos en desarrollo...</p>
                </div>
            `;
            break;
            
        // Agrega los demás casos similares...
        default:
            renderizarPosts();
    }
}

//respuestas
function renderizarRespuestas(replies) {
    if (!replies || replies.length === 0) return '';
    
    return replies.map(reply => `
        <div class="respuesta">
            <img src="${reply.avatar}" alt="Usuario" class="user-avatar-small">
            <div class="respuesta-content">
                <div class="respuesta-header">
                    <strong>${reply.user}</strong>
                    <span>${reply.time}</span>
                </div>
                <p>${reply.text}</p>
                <button onclick="toggleLikeComentario(${postId}, ${reply.id})">
                    👍 ${reply.likes}
                </button>
            </div>
        </div>
    `).join('');
}


function subirImagenComentario(postId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                // Crear comentario con imagen
                agregarComentarioConImagen(postId, event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

function agregarComentarioConImagen(postId, imagenData) {
    const post = posts.find(p => p.id === postId);
    const nuevoComentario = {
        id: Date.now(),
        user: "Tú",
        avatar: "images/user-avatar.jpg",
        text: "", // Comentario sin texto, solo imagen
        imagen: imagenData, // ← IMAGEN EN BASE64
        time: "Ahora mismo",
        likes: 0,
        replies: []
    };
    
    post.comments.push(nuevoComentario);
    post.comments += 1;
    renderizarPosts();
}

//interactuar
// Alternar visibilidad de respuestas
function toggleRespuestas(postId, commentId) {
    const respuestasDiv = document.getElementById(`respuestas-${postId}-${commentId}`);
    respuestasDiv.style.display = respuestasDiv.style.display === 'none' ? 'block' : 'none';
}

// Agregar respuesta anidada
function agregarRespuesta(postId, commentId) {
    const texto = document.getElementById(`respuesta-${postId}-${commentId}`).value;
    if (!texto.trim()) return;
    
    const post = posts.find(p => p.id === postId);
    const comentario = post.comments.find(c => c.id === commentId);
    
    const nuevaRespuesta = {
        id: Date.now(),
        user: "Tú",
        avatar: "images/user-avatar.jpg",
        text: texto,
        time: "Ahora mismo",
        likes: 0
    };
    
    if (!comentario.replies) comentario.replies = [];
    comentario.replies.push(nuevaRespuesta);
    renderizarPosts();
}

// Función para subir imagen al post
function subirImagenPost() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                mostrarPrevisualizacionImagen(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Mostrar previsualización de la imagen
function mostrarPrevisualizacionImagen(imagenData) {
    // Crear o actualizar previsualización
    let preview = document.getElementById('post-image-preview');
    
    if (!preview) {
        preview = document.createElement('img');
        preview.id = 'post-image-preview';
        preview.className = 'image-preview';
        
        // Insertar después del input de texto
        const createHeader = document.querySelector('.create-header');
        createHeader.parentNode.insertBefore(preview, createHeader.nextSibling);
    }
    
    preview.src = imagenData;
    preview.style.display = 'block';
    
    // Agregar botón para eliminar imagen
    agregarBotonEliminarImagen();
}

// Botón para eliminar imagen seleccionada
function agregarBotonEliminarImagen() {
    let removeBtn = document.getElementById('remove-image-btn');
    
    if (!removeBtn) {
        removeBtn = document.createElement('button');
        removeBtn.id = 'remove-image-btn';
        removeBtn.textContent = '❌ Eliminar imagen';
        removeBtn.className = 'remove-image-btn';
        removeBtn.onclick = eliminarImagenPost;
        
        const preview = document.getElementById('post-image-preview');
        preview.parentNode.insertBefore(removeBtn, preview.nextSibling);
    }
}

function eliminarImagenPost() {
    const preview = document.getElementById('post-image-preview');
    const removeBtn = document.getElementById('remove-image-btn');
    
    if (preview) preview.remove();
    if (removeBtn) removeBtn.remove();
}

function verImagenGrande(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <img src="${imageSrc}" alt="Imagen ampliada">
        <button onclick="cerrarModal()" style="
            position: absolute; 
            top: 20px; 
            right: 20px; 
            background: red; 
            color: white; 
            border: none; 
            padding: 10px; 
            cursor: pointer;
        ">X</button>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) cerrarModal();
    };
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function cerrarModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) modal.remove();
}

// Modifica el HTML de la imagen para hacerla clickeable
// En renderizarPosts, cambia la línea de la imagen por:
`<img src="${post.image}" alt="Publicación" class="post-image" onclick="verImagenGrande('${post.image}')">`