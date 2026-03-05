document.addEventListener('DOMContentLoaded', () => {

    // ===== LOADING SCREEN =====
    // (Gerenciado pelo script inline no HTML para garantir execução)

    // ===== HEADER SCROLL =====
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ===== MOBILE MENU TOGGLE =====
    const menuToggles = document.querySelectorAll('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggles.length > 0 && navLinks) {
        menuToggles.forEach(btn => {
            btn.addEventListener('click', () => {
                navLinks.classList.toggle('active');

                // Update header hamburger icon if it exists
                const headerIcon = document.querySelector('#header .menu-toggle i');
                if (headerIcon) {
                    if (navLinks.classList.contains('active')) {
                        headerIcon.classList.remove('ph-list');
                        headerIcon.classList.add('ph-x');
                    } else {
                        headerIcon.classList.remove('ph-x');
                        headerIcon.classList.add('ph-list');
                    }
                }
            });
        });
    }

    // ===== MOBILE SUBMENU TOGGLE =====
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggleLink = dropdown.querySelector('a');
        if (toggleLink) {
            toggleLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault(); // Prevent jump to #
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // ===== MOBILE SUB-SUBMENU TOGGLE (Informações flyout) =====
    document.querySelectorAll('.info-dd > li > a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                const li = link.parentElement;
                const hasSub = li.querySelector('.sub-dd');
                if (hasSub) {
                    e.preventDefault();
                    li.classList.toggle('sub-active');
                }
            }
        });
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-links a:not(.dropdown > a)').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024 && navLinks) {
                navLinks.classList.remove('active');
                const headerIcon = document.querySelector('#header .menu-toggle i');
                if (headerIcon) {
                    headerIcon.classList.remove('ph-x');
                    headerIcon.classList.add('ph-list');
                }
            }
        });
    });

    // ===== HERO BACKGROUND SLIDER =====
    const heroSlides = document.querySelectorAll('.hero-slide');
    const slideDots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;

    function goToSlide(index) {
        heroSlides.forEach(s => s.classList.remove('active'));
        slideDots.forEach(d => d.classList.remove('active'));
        currentSlide = index;
        heroSlides[currentSlide].classList.add('active');
        slideDots[currentSlide].classList.add('active');
    }

    if (heroSlides.length > 0) {
        setInterval(() => {
            goToSlide((currentSlide + 1) % heroSlides.length);
        }, 5000);
        slideDots.forEach((dot, i) => {
            dot.addEventListener('click', () => goToSlide(i));
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== PRODUCTS CAROUSEL (3x2 grid, 2 pages, auto-loop) =====
    const productsTrack = document.querySelector('.products-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    let currentPage = 0;
    const totalPages = document.querySelectorAll('.products-page').length;

    function goToPage(page) {
        currentPage = page;
        if (productsTrack) {
            productsTrack.style.transform = `translateX(-${page * 100}%)`;
        }
        dots.forEach((dot, i) => dot.classList.toggle('active', i === page));
    }

    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => goToPage(currentPage < totalPages - 1 ? currentPage + 1 : 0));
        prevBtn.addEventListener('click', () => goToPage(currentPage > 0 ? currentPage - 1 : totalPages - 1));
        dots.forEach((dot, i) => dot.addEventListener('click', () => goToPage(i)));
    }

    // Auto-loop products carousel every 6 seconds
    if (totalPages > 1) {
        setInterval(() => {
            goToPage((currentPage + 1) % totalPages);
        }, 6000);
    }

    // ===== BLOG CAROUSEL (slides 3 at a time, auto-loop) =====
    const blogTrack = document.querySelector('.blog-track');
    const blogPrev = document.querySelector('.blog-prev');
    const blogNext = document.querySelector('.blog-next');
    let blogPosition = 0;

    function getVisibleBlogCards() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function moveBlogTo(pos) {
        if (!blogTrack) return;
        const cards = blogTrack.querySelectorAll('.blog-card');
        const visible = getVisibleBlogCards();
        const maxPos = cards.length - visible;

        blogPosition = pos;
        if (blogPosition > maxPos) blogPosition = 0;
        if (blogPosition < 0) blogPosition = maxPos;

        const gap = 24; // 1.5rem
        const cardWidth = cards[0].getBoundingClientRect().width;
        const offset = blogPosition * (cardWidth + gap);
        blogTrack.style.transform = `translateX(-${offset}px)`;
    }

    if (blogPrev && blogNext) {
        blogNext.addEventListener('click', () => moveBlogTo(blogPosition + 1));
        blogPrev.addEventListener('click', () => moveBlogTo(blogPosition - 1));
    }

    // Auto-loop blog carousel every 4 seconds
    if (blogTrack) {
        setInterval(() => {
            moveBlogTo(blogPosition + 1);
        }, 4000);
    }

    // ===== FADE-IN ON SCROLL =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card, .about-card, .blog-card, .consulting-box, .feature-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

});
