/* ==========================================================================
   NetHawk Solutions - Exact Trionn.com Animation Engine
   Lenis Inertia Scroll, GSAP ScrollTrigger Pinned Scrubbing & Rolling Character Hovers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initLenisSmoothScroll();
    initRollingCharacterLinks();
    initGSAPPinned3DShowcase();
    initSplitTextKineticReveals();
    initTacticalCursor();
    initUniversalCard3DTilt();
    initAmbientLightBlob();
});

/* ==========================================================================
   1. Lenis Smooth Momentum Scroll Engine
   ========================================================================== */
let lenis;
function initLenisSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smoothTouch: false,
        touchMultiplier: 2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis scroll with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0, 0);
    }
}

/* ==========================================================================
   2. Trionn Dual-Layer Rolling Character Link Hover (.trionn-roll-link)
   ========================================================================== */
function initRollingCharacterLinks() {
    const rollLinks = document.querySelectorAll(
        '.nav-menu-links a, .btn-primary-blue, .btn-glass-outline, .btn-header-cta, .showcase-pill-btn, .trionn-roll-link'
    );

    rollLinks.forEach((link) => {
        // Skip if already processed
        if (link.querySelector('.trionn-roll-wrap')) return;

        const originalText = link.innerText.trim();
        if (!originalText) return;

        link.innerHTML = '';
        const wrap = document.createElement('span');
        wrap.className = 'trionn-roll-wrap';

        const origLayer = document.createElement('span');
        origLayer.className = 'trionn-layer-orig';

        const cloneLayer = document.createElement('span');
        cloneLayer.className = 'trionn-layer-clone';

        // Split text into individual characters for staggered roll physics
        [...originalText].forEach((char, index) => {
            const spanO = document.createElement('span');
            spanO.className = 'trionn-char';
            spanO.style.transitionDelay = `${index * 0.015}s`;
            spanO.innerHTML = char === ' ' ? '&nbsp;' : char;
            origLayer.appendChild(spanO);

            const spanC = document.createElement('span');
            spanC.className = 'trionn-char';
            spanC.style.transitionDelay = `${index * 0.015}s`;
            spanC.innerHTML = char === ' ' ? '&nbsp;' : char;
            cloneLayer.appendChild(spanC);
        });

        wrap.appendChild(origLayer);
        wrap.appendChild(cloneLayer);
        link.appendChild(wrap);
    });
}

/* ==========================================================================
   3. Pinned Scroll-Triggered 3D Storytelling Showcase (GSAP ScrollTrigger)
   ========================================================================== */
function initGSAPPinned3DShowcase() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const showcaseSection = document.querySelector('.post-hero-3d-showcase');
    const cards = document.querySelectorAll('.showcase-3d-card');
    const pillBtns = document.querySelectorAll('.showcase-pill-btn');

    if (!showcaseSection || cards.length === 0) return;

    // Mobile / small viewport fallback
    if (window.innerWidth < 992) {
        pillBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const targetIndex = parseInt(btn.getAttribute('data-target'));
                pillBtns.forEach(b => b.classList.remove('active'));
                cards.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                if (cards[targetIndex]) cards[targetIndex].classList.add('active');
            });
        });
        return;
    }

    // Pinned Scroll Timeline
    const totalCards = cards.length;
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: showcaseSection,
            start: 'top top',
            end: `+=${totalCards * 100}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1
        }
    });

    cards.forEach((card, index) => {
        if (index === 0) {
            gsap.set(card, { opacity: 1, scale: 1, display: 'grid' });
            if (pillBtns[0]) pillBtns[0].classList.add('active');
        } else {
            gsap.set(card, { opacity: 0, scale: 0.9, display: 'none' });
        }
    });

    cards.forEach((card, index) => {
        if (index < totalCards - 1) {
            const nextCard = cards[index + 1];

            timeline
                .to(card, {
                    opacity: 0,
                    scale: 0.88,
                    rotateY: -10,
                    duration: 1,
                    onComplete: () => { card.style.display = 'none'; }
                })
                .set(nextCard, { display: 'grid', opacity: 0, scale: 0.9, rotateY: 10 })
                .to(nextCard, {
                    opacity: 1,
                    scale: 1,
                    rotateY: 0,
                    duration: 1,
                    onStart: () => {
                        pillBtns.forEach(b => b.classList.remove('active'));
                        if (pillBtns[index + 1]) pillBtns[index + 1].classList.add('active');
                    }
                });
        }
    });

    // Manual Pill Click Override
    pillBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetIndex = parseInt(btn.getAttribute('data-target'));
            pillBtns.forEach(b => b.classList.remove('active'));
            cards.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            cards.forEach((c, idx) => {
                if (idx === targetIndex) {
                    c.style.display = 'grid';
                    gsap.to(c, { opacity: 1, scale: 1, rotateY: 0, duration: 0.4 });
                } else {
                    gsap.to(c, { opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => { c.style.display = 'none'; } });
                }
            });
        });
    });
}

/* ==========================================================================
   4. Split-Text Line & Word Reveal Animations
   ========================================================================== */
function initSplitTextKineticReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const headings = document.querySelectorAll('.section-title-main, .hero-headline');

    headings.forEach((heading) => {
        if (heading.getAttribute('data-split-init')) return;
        heading.setAttribute('data-split-init', 'true');

        const text = heading.innerText;
        heading.innerHTML = '';

        const lines = text.split('\n');
        lines.forEach((lineText) => {
            const lineWrap = document.createElement('span');
            lineWrap.className = 'trionn-line-mask';

            const lineContent = document.createElement('span');
            lineContent.className = 'trionn-line-content';
            lineContent.innerText = lineText;

            lineWrap.appendChild(lineContent);
            heading.appendChild(lineWrap);
        });

        gsap.fromTo(
            heading.querySelectorAll('.trionn-line-content'),
            { y: '110%', opacity: 0 },
            {
                y: '0%',
                opacity: 1,
                duration: 1.1,
                ease: 'power3.out',
                stagger: 0.15,
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

/* ==========================================================================
   5. Interactive Tactical Custom Cursor
   ========================================================================== */
function initTacticalCursor() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

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

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

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

        if (el.classList.contains('btn-primary-blue') || el.classList.contains('btn-glass-outline') || el.classList.contains('showcase-pill-btn') || el.classList.contains('btn-header-cta')) {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const relX = e.clientX - rect.left - rect.width / 2;
                const relY = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate3d(${relX * 0.22}px, ${relY * 0.22}px, 0) scale(1.03)`;
            });
        }
    });
}

/* ==========================================================================
   6. Universal Card 3D Tilt & Ambient Light
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

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
            
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            card.style.backgroundImage = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0, 102, 255, 0.18) 0%, transparent 70%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            card.style.backgroundImage = '';
        });
    });
}

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
