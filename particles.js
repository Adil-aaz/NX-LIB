/* =========================================
   NX-LIB | INTERACTIVE PARTICLE BACKGROUND
   Three.js-based animated particle system
   Similar to Antigravity's hero background
   ========================================= */

class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = this.isMobile() ? 30 : 60;
        this.mouse = { x: null, y: null, radius: 150 };
        this.colors = ['#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95'];

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('mouseleave', () => this.resetMouse());
    }

    isMobile() {
        return window.innerWidth < 768;
    }

    resize() {
        const hero = this.canvas.parentElement;
        this.canvas.width = hero.offsetWidth;
        this.canvas.height = hero.offsetHeight;
        this.particleCount = this.isMobile() ? 30 : 60;
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    handleTouchMove(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.mouse.x = touch.clientX - rect.left;
        this.mouse.y = touch.clientY - rect.top;
    }

    resetMouse() {
        this.mouse.x = null;
        this.mouse.y = null;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            const size = particle.renderSize || particle.size;
            const opacity = particle.interactionOpacity || particle.opacity;

            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = opacity;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
    }

    connectParticles() {
        const maxDistance = this.isMobile() ? 100 : 150;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.2;
                    this.ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Move particles
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Mouse interaction - УЛУЧШЕННЫЙ ЭФФЕКТ
            if (this.mouse.x && this.mouse.y) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    // Усиленное отталкивание от курсора
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);

                    // Увеличена сила отталкивания
                    particle.x += Math.cos(angle) * force * 5;
                    particle.y += Math.sin(angle) * force * 5;

                    // Пульсация размера при приближении курсора
                    const baseSize = particle.size || 2;
                    particle.renderSize = baseSize + (1 - force) * 3;

                    // Увеличение яркости при взаимодействии
                    particle.interactionOpacity = Math.min(1, particle.opacity + force * 0.5);
                } else {
                    // Возврат к нормальному размеру
                    particle.renderSize = particle.size;
                    particle.interactionOpacity = particle.opacity;
                }
            } else {
                // Нейтральный режим - нормальные размеры
                particle.renderSize = particle.size;
                particle.interactionOpacity = particle.opacity;
            }

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawParticles();
        this.connectParticles();
        this.updateParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground('heroCanvas');
});
