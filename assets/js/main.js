/**
 * NETHAWK SOLUTIONS - Tactical Mil-Tech Interactive Engine & Scroll Storytelling
 * Features: Scroll Progress Bar, Intersection Observer Reveal Animations, 
 * Parallax Scroll Engine, 3D Interactive Card Tilt, Tactical Cursor Reticle,
 * Dynamic Stat Counters & Navbar Dynamics, GIF-Style 3D Post-Hero Showcase.
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgressBar();
    initNavbarDynamics();
    initScrollReveals();
    initParallaxEngine();
    initInteractive3DTilt();
    initTacticalCursorReticle();
    initStatCounters();
    initTypewriterEffects();
    initPostHero3DShowcase();
});

/**
 * 1. Scroll Progress Bar
 */
function initScrollProgressBar() {
    let progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        document.body.appendChild(progressBar);
    }

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true });
}

/**
 * 2. Dynamic Sticky Navbar Backdrop & Telemetry Indicator
 */
function initNavbarDynamics() {
    const navbar = document.querySelector('.site-header');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    }, { passive: true });
}

/**
 * 3. Intersection Observer Scroll Reveal System
 */
function initScrollReveals() {
    const revealTargets = [
        { selector: '.section-title-main', type: 'reveal-up' },
        { selector: '.section-subtitle-text', type: 'reveal-up' },
        { selector: '.hero-title', type: 'reveal-up' },
        { selector: '.hero-subtitle', type: 'reveal-up' },
        { selector: '.hero-cta-group', type: 'reveal-up' },
        { selector: '.about-media-card', type: 'reveal-zoom' },
        { selector: '.capability-card', type: 'reveal-stagger' },
        { selector: '.why-choose-card', type: 'reveal-stagger' },
        { selector: '.mission-card', type: 'reveal-stagger' },
        { selector: '.value-card', type: 'reveal-stagger' },
        { selector: '.service-detail-card', type: 'reveal-stagger' },
        { selector: '.contact-info-card', type: 'reveal-left' },
        { selector: '.contact-form-card', type: 'reveal-right' },
        { selector: '.footer-giant-banner', type: 'reveal-up' }
    ];

    revealTargets.forEach(target => {
        document.querySelectorAll(target.selector).forEach((el, idx) => {
            if (!el.classList.contains('reveal-init')) {
                el.classList.add('reveal-init', target.type);
                if (target.type === 'reveal-stagger') {
                    el.style.transitionDelay = `${(idx % 4) * 0.12}s`;
                }
            }
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-init').forEach(el => observer.observe(el));
}

/**
 * 4. Parallax Scroll Engine
 */
function initParallaxEngine() {
    const heroBg = document.querySelector('.hero-video');
    const heroOverlay = document.querySelector('.hero-overlay');
    const parallaxImages = document.querySelectorAll('.about-media-card img, .why-choose-card img');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (heroBg && scrollY < 1200) {
            heroBg.style.transform = `translateY(${scrollY * 0.35}px) scale(${1 + scrollY * 0.0003})`;
        }
        if (heroOverlay && scrollY < 1200) {
            heroOverlay.style.opacity = `${0.6 + (scrollY / 1200) * 0.4}`;
        }

        parallaxImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.08;
                const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
                img.style.transform = `translateY(${offset}px) scale(1.08)`;
            }
        });
    }, { passive: true });
}

/**
 * 5. Interactive 3D Card Tilt & Mouse Specular Spotlight
 */
function initInteractive3DTilt() {
    const cards = document.querySelectorAll(
        '.capability-card, .why-choose-card, .mission-card, .value-card, .service-detail-card, .contact-info-card, .contact-form-card'
    );

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });
}

/**
 * 6. Tactical Cursor Reticle (Desktop Only)
 */
function initTacticalCursorReticle() {
    if (window.innerWidth < 1024 || 'ontouchstart' in window) return;

    const reticle = document.createElement('div');
    reticle.className = 'tactical-cursor-reticle';
    reticle.innerHTML = `<div class="reticle-dot"></div><div class="reticle-ring"></div>`;
    document.body.appendChild(reticle);

    let mouseX = -100, mouseY = -100;
    let reticleX = -100, reticleY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function render() {
        reticleX += (mouseX - reticleX) * 0.2;
        reticleY += (mouseY - reticleY) * 0.2;
        reticle.style.transform = `translate3d(${reticleX}px, ${reticleY}px, 0)`;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    const interactives = 'a, button, input, textarea, select, .capability-card, .value-card, .service-detail-card, .showcase-pill-btn';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactives)) {
            reticle.classList.add('reticle-hover');
        } else {
            reticle.classList.remove('reticle-hover');
        }
    });
}

/**
 * 7. Stat Counter Animation
 */
function initStatCounters() {
    const statElements = document.querySelectorAll('.stat-number, [data-count]');
    if (statElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const targetNum = parseInt(entry.target.getAttribute('data-count') || entry.target.innerText.replace(/[^0-9]/g, ''));
                if (isNaN(targetNum)) return;
                
                let start = 0;
                const duration = 1800;
                const stepTime = 30;
                const steps = duration / stepTime;
                const increment = targetNum / steps;

                const timer = setInterval(() => {
                    start += increment;
                    if (start >= targetNum) {
                        entry.target.innerText = targetNum + (entry.target.dataset.suffix || '');
                        clearInterval(timer);
                    } else {
                        entry.target.innerText = Math.floor(start) + (entry.target.dataset.suffix || '');
                    }
                }, stepTime);
            }
        });
    }, { threshold: 0.5 });

    statElements.forEach(el => observer.observe(el));
}

/**
 * 8. Typewriter Effect for Tactical Badges
 */
function initTypewriterEffects() {
    const typewriterEls = document.querySelectorAll('.typewriter-text');
    typewriterEls.forEach(el => {
        const text = el.innerText;
        el.innerText = '';
        let i = 0;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !el.classList.contains('typed')) {
                    el.classList.add('typed');
                    const interval = setInterval(() => {
                        if (i < text.length) {
                            el.innerText += text.charAt(i);
                            i++;
                        } else {
                            clearInterval(interval);
                        }
                    }, 40);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(el);
    });
}

/**
 * 9. Post-Hero GIF-Style 3D Showcase Engine
 */
function initPostHero3DShowcase() {
    const showcaseSection = document.querySelector('.post-hero-3d-showcase');
    if (!showcaseSection) return;

    const cards = showcaseSection.querySelectorAll('.showcase-3d-card');
    const buttons = showcaseSection.querySelectorAll('.showcase-pill-btn');
    const bgText = document.getElementById('showcase-bg-text');
    const stage = showcaseSection.querySelector('.showcase-3d-stage');

    let currentIndex = 0;
    let autoRotateTimer = null;

    function switchCard(index) {
        if (index < 0 || index >= cards.length) return;

        cards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('active');
                card.style.transform = 'rotateY(0deg) translateZ(0px) scale(1)';
            } else if (i < index) {
                card.classList.remove('active');
                card.style.transform = 'rotateY(-45deg) translateZ(-250px) scale(0.85)';
            } else {
                card.classList.remove('active');
                card.style.transform = 'rotateY(45deg) translateZ(-250px) scale(0.85)';
            }
        });

        buttons.forEach((btn, i) => {
            if (i === index) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (bgText && cards[index]) {
            bgText.innerText = cards[index].getAttribute('data-bgtext') || 'NETHAWK INTELLIGENCE';
        }

        currentIndex = index;
    }

    buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            switchCard(i);
            resetAutoRotate();
        });
    });

    // Mouse movement 3D stage tilt
    if (stage) {
        stage.addEventListener('mousemove', (e) => {
            const rect = stage.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;

            const activeCard = stage.querySelector('.showcase-3d-card.active');
            if (activeCard) {
                activeCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1)`;
            }
        });

        stage.addEventListener('mouseleave', () => {
            const activeCard = stage.querySelector('.showcase-3d-card.active');
            if (activeCard) {
                activeCard.style.transform = 'rotateY(0deg) translateZ(0px) scale(1)';
            }
        });
    }

    // Scroll progress trigger for auto-rotating cards
    window.addEventListener('scroll', () => {
        const rect = showcaseSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const scrollRatio = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
            const targetIndex = Math.floor(scrollRatio * cards.length);
            if (targetIndex >= 0 && targetIndex < cards.length && targetIndex !== currentIndex && !stage.matches(':hover')) {
                switchCard(targetIndex);
            }
        }
    }, { passive: true });

    function startAutoRotate() {
        autoRotateTimer = setInterval(() => {
            let nextIndex = (currentIndex + 1) % cards.length;
            switchCard(nextIndex);
        }, 5000);
    }

    function resetAutoRotate() {
        if (autoRotateTimer) clearInterval(autoRotateTimer);
        startAutoRotate();
    }

    startAutoRotate();
}
