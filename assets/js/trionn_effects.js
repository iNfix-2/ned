/* ==========================================================================
   NetHawk Solutions - Trionn-Style 3D Storytelling & Animation Engine
   Interactive 3D Perspective Stage, Universal Card Tilt, Magnetic Cursor & Kinetic Motion
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTacticalCursor();
    init3DStoryStage();
    initUniversalCard3DTilt();
    initAmbientLightBlob();
    initKineticScrollReveals();
});

/* ==========================================================================
   1. Interactive Tactical Custom Cursor with Magnetic Physics
   ========================================================================== */
function initTacticalCursor() {
    // Disable custom cursor on touch devices to ensure native fluid scrolling
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    // Create Cursor Elements if not present
    let dot = document.querySelector('.tactical-cursor-dot');
    let ring = document.querySelector('.tactical-cursor-ring');

    if (!dot) {
        dot = document.createElement('div');
        dot.className = 'tactical-cursor-dot';
        document.body.appendChild(dot);
    }
    if (!ring) {
        ring = document.createElement('div');
        ring.className = 'tactical-cursor-ring';
        ring.innerHTML = '<span class="cursor-label-text"></span>';
        document.body.appendChild(ring);
    }

    const labelText = ring.querySelector('.cursor-label-text');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    // Smooth Lerp loop for ring physics
    function animateCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Attach Magnetic & Hover Label Listeners
    const interactiveElements = document.querySelectorAll(
        'a, button, .showcase-3d-card, .capability-card, .solution-finder-card, .value-card, .industry-icon-card'
    );

    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            ring.classList.add('active');

            const cursorText = el.getAttribute('data-cursor');
            if (cursorText) {
                ring.classList.add('has-label');
                if (labelText) labelText.innerText = cursorText;
            } else {
                ring.classList.remove('has-label');
                if (labelText) labelText.innerText = '';
            }
        });

        el.addEventListener('mouseleave', () => {
            ring.classList.remove('active', 'has-label');
            if (labelText) labelText.innerText = '';
            el.style.transform = '';
        });

        // Magnetic displacement effect for buttons
        if (el.classList.contains('btn-primary-blue') || el.classList.contains('btn-glass-outline') || el.classList.contains('showcase-pill-btn') || el.classList.contains('btn-header-cta')) {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const relX = e.clientX - rect.left - rect.width / 2;
                const relY = e.clientY - rect.top - rect.height / 2;

                el.style.transform = `translate3d(${relX * 0.25}px, ${relY * 0.25}px, 0) scale(1.03)`;
            });
        }
    });
}

/* ==========================================================================
   2. 3D Story Stage Perspective & Specular Lighting Glare Physics
   ========================================================================== */
function init3DStoryStage() {
    const stage = document.querySelector('.showcase-3d-stage');
    const cards = document.querySelectorAll('.showcase-3d-card');
    const pillBtns = document.querySelectorAll('.showcase-pill-btn');

    if (!stage || cards.length === 0) return;

    // Interactive Story Switcher
    pillBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetIndex = parseInt(btn.getAttribute('data-target'));

            pillBtns.forEach(b => b.classList.remove('active'));
            cards.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            if (cards[targetIndex]) {
                cards[targetIndex].classList.add('active');
            }
        });
    });

    // 3D Perspective Card Tilt & Specular Lighting Physics on Mouse Move
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

            // Specular Glare Movement
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;

            const mediaFrame = card.querySelector('.showcase-card-media');
            if (mediaFrame) {
                mediaFrame.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0, 102, 255, 0.28) 0%, transparent 65%), #000000`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            const mediaFrame = card.querySelector('.showcase-card-media');
            if (mediaFrame) {
                mediaFrame.style.background = '#000000';
            }
        });
    });
}

/* ==========================================================================
   3. Universal Card 3D Tilt & Specular Glow Physics across Entire Site
   ========================================================================== */
function initUniversalCard3DTilt() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cards = document.querySelectorAll(
        '.capability-card, .value-card, .solution-finder-card, .industry-icon-card'
    );

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            card.style.backgroundImage = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0, 102, 255, 0.15) 0%, transparent 70%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            card.style.backgroundImage = '';
        });
    });
}

/* ==========================================================================
   4. Ambient Tactical Light Blob Trailing Cursor
   ========================================================================== */
function initAmbientLightBlob() {
    let blob = document.querySelector('.ambient-tactical-blob');
    if (!blob) {
        blob = document.createElement('div');
        blob.className = 'ambient-tactical-blob';
        document.body.appendChild(blob);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let blobX = mouseX;
    let blobY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateBlob() {
        blobX += (mouseX - blobX) * 0.05;
        blobY += (mouseY - blobY) * 0.05;

        blob.style.transform = `translate3d(${blobX - 250}px, ${blobY - 250}px, 0)`;
        requestAnimationFrame(animateBlob);
    }
    animateBlob();
}

/* ==========================================================================
   5. Kinetic Scroll Reveals & Image Parallax Scaling
   ========================================================================== */
function initKineticScrollReveals() {
    const revealElements = document.querySelectorAll(
        '.section-title-main, .section-subtitle-text, .capability-card, .solution-finder-card, .value-card, .industry-icon-card, .about-content-left, .why-choose-glass-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach((el) => {
        el.classList.add('trionn-reveal-init');
        observer.observe(el);
    });
}
