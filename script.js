// ========================================
// Inicialización
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initOpenGiftButton();
    initScrollAnimations();
    handleImagePlaceholders();
});

// ========================================
// Partículas flotantes de fondo
// ========================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20;
    const colors = ['#D4AF37', '#F4D03F', '#C41E3A', '#FFD700'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Posición aleatoria horizontal
        particle.style.left = Math.random() * 100 + '%';

        // Delay aleatorio para escalonar las animaciones
        particle.style.animationDelay = Math.random() * 6 + 's';

        // Duración aleatoria para variedad
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';

        // Tamaño aleatorio
        const size = 4 + Math.random() * 8;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Color aleatorio
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        particlesContainer.appendChild(particle);
    }
}

// ========================================
// Botón para abrir el regalo
// ========================================
function initOpenGiftButton() {
    const openButton = document.getElementById('open-gift');
    const welcomeScreen = document.getElementById('welcome-screen');
    const giftCard = document.getElementById('gift-card');

    openButton.addEventListener('click', () => {
        // Animación de salida de la pantalla de bienvenida
        welcomeScreen.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transform = 'scale(1.1)';

        // Lanzar confeti
        launchConfetti();

        // Mostrar la tarjeta de regalo
        setTimeout(() => {
            welcomeScreen.classList.remove('active');
            giftCard.classList.add('active');

            // Scroll suave al inicio
            window.scrollTo({ top: 0, behavior: 'instant' });

            // Iniciar animaciones de entrada
            setTimeout(() => {
                triggerScrollAnimations();
            }, 300);
        }, 800);
    });
}

// ========================================
// Animaciones al hacer scroll
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });
}

function triggerScrollAnimations() {
    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('visible');
        }, index * 200);
    });
}

// ========================================
// Sistema de Confeti
// ========================================
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    // Ajustar tamaño del canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = ['#D4AF37', '#F4D03F', '#C41E3A', '#8B0A1A', '#FFD700', '#FF6B6B', '#4ECDC4'];
    const confettiCount = 150;

    // Crear piezas de confeti
    for (let i = 0; i < confettiCount; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * 100,
            width: 8 + Math.random() * 8,
            height: 6 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            speedX: (Math.random() - 0.5) * 4,
            speedY: 2 + Math.random() * 4,
            oscillationSpeed: 0.02 + Math.random() * 0.03,
            oscillationDistance: 20 + Math.random() * 30,
            phase: Math.random() * Math.PI * 2
        });
    }

    let animationFrame;
    let startTime = Date.now();
    const duration = 5000; // 5 segundos de confeti

    function animateConfetti() {
        const elapsed = Date.now() - startTime;

        if (elapsed > duration) {
            // Fade out gradual
            ctx.fillStyle = 'rgba(253, 248, 240, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (elapsed > duration + 2000) {
                cancelAnimationFrame(animationFrame);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        confettiPieces.forEach((piece, index) => {
            // Actualizar posición
            piece.phase += piece.oscillationSpeed;
            piece.x += piece.speedX + Math.sin(piece.phase) * 0.5;
            piece.y += piece.speedY;
            piece.rotation += piece.rotationSpeed;

            // Dibujar confeti
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate(piece.rotation * Math.PI / 180);

            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);

            // Añadir brillo
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width / 2, piece.height / 2);

            ctx.restore();

            // Reiniciar si sale de la pantalla
            if (piece.y > canvas.height + 20) {
                if (elapsed < duration - 1000) {
                    piece.y = -20;
                    piece.x = Math.random() * canvas.width;
                }
            }
        });

        animationFrame = requestAnimationFrame(animateConfetti);
    }

    animateConfetti();

    // Manejar redimensionamiento
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========================================
// Manejo de placeholders de imágenes
// ========================================
function handleImagePlaceholders() {
    const imagePlaceholders = document.querySelectorAll('.image-placeholder img');

    imagePlaceholders.forEach(img => {
        // Manejar errores de carga de imagen
        img.onerror = function() {
            this.style.opacity = '0';
            this.parentElement.querySelector('.placeholder-text').style.display = 'flex';
        };

        // Manejar carga exitosa
        img.onload = function() {
            if (this.src && !this.src.endsWith('/')) {
                this.style.opacity = '1';
                const placeholder = this.parentElement.querySelector('.placeholder-text');
                if (placeholder) {
                    placeholder.style.display = 'none';
                }
            }
        };

        // Verificar si la imagen ya está cargada (para cache)
        if (img.complete && img.naturalHeight !== 0) {
            img.style.opacity = '1';
            const placeholder = img.parentElement.querySelector('.placeholder-text');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
    });
}

// ========================================
// Efecto de corazones al hacer click
// ========================================
document.addEventListener('click', (e) => {
    // Solo en la tarjeta de regalo
    if (!document.getElementById('gift-card').classList.contains('active')) return;

    createHeartEffect(e.clientX, e.clientY);
});

function createHeartEffect(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 1.5rem;
        pointer-events: none;
        z-index: 1000;
        animation: heartFloat 1.5s ease-out forwards;
        transform: translate(-50%, -50%);
    `;

    // Añadir keyframes si no existen
    if (!document.querySelector('#heart-float-style')) {
        const style = document.createElement('style');
        style.id = 'heart-float-style';
        style.textContent = `
            @keyframes heartFloat {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(0.5);
                }
                50% {
                    opacity: 1;
                    transform: translate(-50%, -100%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -150%) scale(0.8);
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(heart);

    // Eliminar después de la animación
    setTimeout(() => {
        heart.remove();
    }, 1500);
}

// ========================================
// Efectos adicionales de hover en galería
// ========================================
document.querySelectorAll('.gallery-item, .extra-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.zIndex = '10';
    });

    item.addEventListener('mouseleave', () => {
        item.style.zIndex = '1';
    });
});

// ========================================
// Parallax sutil en el scroll
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const particles = document.getElementById('particles');

    if (particles) {
        particles.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});
