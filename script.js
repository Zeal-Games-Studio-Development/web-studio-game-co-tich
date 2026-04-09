document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CUSTOM PREMIUM CURSOR
       ========================================================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.top = `${mouseY}px`;
            cursorDot.style.left = `${mouseX}px`;
        });

        const animateCursor = () => {
            const distX = mouseX - outlineX;
            const distY = mouseY - outlineY;
            outlineX += distX * 0.12;
            outlineY += distY * 0.12;
            cursorOutline.style.top = `${outlineY}px`;
            cursorOutline.style.left = `${outlineX}px`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover expansion on interactive elements
        const hoverables = document.querySelectorAll('a, button, .gallery-item, .realm-artwork, .related-card, .feature-card');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('expanded'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('expanded'));
        });
    }

    /* ==========================================================================
       2. MAGNETIC BUTTONS
       ========================================================================== */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
        });
        btn.addEventListener('mouseleave', function() {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        btn.addEventListener('mouseenter', function() {
            btn.style.transition = 'none';
        });
    });

    /* ==========================================================================
       3. SPLIT TEXT CHARACTER ANIMATION
       ========================================================================== */
    const splitTexts = document.querySelectorAll('.split-text');
    splitTexts.forEach(text => {
        const content = text.textContent;
        text.innerHTML = '';
        let charIndex = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            const span = document.createElement('span');
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = char;
            }
            span.className = 'split-char';
            span.style.transitionDelay = `${charIndex * 0.03}s`;
            text.appendChild(span);
            charIndex++;
        }
    });

    /* ==========================================================================
       4. INTERSECTION OBSERVER — Scroll Reveals
       ========================================================================== */
    const revealElements = document.querySelectorAll(
        '.fade-in, .slide-up, .slide-left, .slide-right, .scale-in, .text-reveal-container'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       5. ANIMATED COUNTER (Stats)
       ========================================================================== */
    const counters = document.querySelectorAll('[data-count]');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out quart
                const eased = 1 - Math.pow(1 - progress, 4);
                const current = Math.round(eased * target);
                counter.textContent = current + (target >= 100 ? '+' : '');
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };
            requestAnimationFrame(updateCounter);
        });
    };

    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(c => counterObserver.observe(c));
    }

    /* ==========================================================================
       6. PARALLAX SCROLL (Multi-layer Hero + Realm backgrounds)
       ========================================================================== */
    const parallaxLayers = document.querySelectorAll('[data-parallax-speed]');
    const heroBgLayers = document.querySelectorAll('.hero-bg-layer.layer-back');

    const handleParallax = () => {
        const scrolled = window.pageYOffset;

        // Hero parallax layers
        heroBgLayers.forEach(layer => {
            if (scrolled < window.innerHeight * 1.5) {
                const speed = parseFloat(layer.dataset.parallaxSpeed) || 0.3;
                layer.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
            }
        });

        // Realm background images parallax
        parallaxLayers.forEach(el => {
            const parent = el.closest('.realm') || el.closest('.hero');
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            const windowH = window.innerHeight;
            if (rect.top < windowH && rect.bottom > 0) {
                const speed = parseFloat(el.dataset.parallaxSpeed) || 0.15;
                const offset = (rect.top / windowH - 0.5) * speed * 200;
                el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.1)`;
            }
        });
    };

    window.addEventListener('scroll', handleParallax, { passive: true });

    /* ==========================================================================
       7. NAVIGATION — Scroll Effect & Mobile Menu
       ========================================================================== */
    const mainNav = document.getElementById('mainNav');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    // Nav scroll background
    if (mainNav) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 80) {
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // Mobile hamburger toggle
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==========================================================================
       8. DRAGGABLE HORIZONTAL GALLERY (Detail Pages)
       ========================================================================== */
    const slider = document.querySelector('.gallery-scroll-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
        // Mouse wheel → horizontal scroll
        slider.addEventListener('wheel', (e) => {
            e.preventDefault();
            slider.scrollLeft += e.deltaY;
        }, { passive: false });
    }

    /* ==========================================================================
       9. SMOOTH ANCHOR SCROLLING
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ==========================================================================
       10. DETAIL PAGE: Parallax hero background
       ========================================================================== */
    const detailBgs = document.querySelectorAll('.detail-bg');
    if (detailBgs.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            detailBgs.forEach(bg => {
                if (scrolled < window.innerHeight) {
                    bg.style.transform = `translate3d(0, ${scrolled * 0.25}px, 0) scale(1.05)`;
                }
            });
        }, { passive: true });
    }

});
