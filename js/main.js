/**
 * BUCOMANT - Premium Main JavaScript
 * 부동산 경매 컨설팅 No.1
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Preloader.init();
    Header.init();
    MobileMenu.init();
    SearchTabs.init();
    Counter.init();
    Testimonials.init();
    ContactForm.init();
    BackToTop.init();
    SmoothScroll.init();

    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });
});

/**
 * Preloader
 */
const Preloader = {
    init() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = '';
            }, 500);
        });

        // Fallback - hide preloader after 3 seconds
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 3000);
    }
};

/**
 * Header Scroll Effect
 */
const Header = {
    header: null,
    lastScroll: 0,

    init() {
        this.header = document.getElementById('header');
        if (!this.header) return;

        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        this.onScroll();
    },

    onScroll() {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        this.lastScroll = currentScroll;
    }
};

/**
 * Mobile Menu
 */
const MobileMenu = {
    toggle: null,
    menu: null,
    links: null,
    isOpen: false,

    init() {
        this.toggle = document.getElementById('menuToggle');
        this.menu = document.getElementById('mobileMenu');
        this.links = document.querySelectorAll('.mobile-nav-link');

        if (!this.toggle || !this.menu) return;

        this.toggle.addEventListener('click', () => this.toggleMenu());

        this.links.forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
                this.close();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    },

    toggleMenu() {
        this.isOpen ? this.close() : this.open();
    },

    open() {
        this.isOpen = true;
        this.toggle.classList.add('active');
        this.menu.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.isOpen = false;
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
    }
};

/**
 * Search Tabs
 */
const SearchTabs = {
    init() {
        const tabs = document.querySelectorAll('.search-tab');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }
};

/**
 * Counter Animation
 */
const Counter = {
    counters: null,
    animated: false,

    init() {
        this.counters = document.querySelectorAll('.counter');
        if (this.counters.length === 0) return;

        // Use Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animated = true;
                    this.animateAll();
                }
            });
        }, { threshold: 0.5 });

        const statsBar = document.querySelector('.stats-bar');
        if (statsBar) {
            observer.observe(statsBar);
        }
    },

    animateAll() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            this.animate(counter, target);
        });
    },

    animate(element, target) {
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out-expo)
            const easeOutExpo = 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(target * easeOutExpo);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(update);
    }
};

/**
 * Testimonials Slider (Swiper)
 */
const Testimonials = {
    init() {
        if (typeof Swiper === 'undefined') return;

        const swiperEl = document.querySelector('.testimonials-swiper');
        if (!swiperEl) return;

        new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                prevEl: '.swiper-prev',
                nextEl: '.swiper-next',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                }
            }
        });
    }
};

/**
 * Contact Form
 */
const ContactForm = {
    form: null,

    init() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Phone number formatting
        const phoneInput = this.form.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 3 && value.length < 7) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                } else if (value.length >= 7) {
                    value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
                }
                e.target.value = value;
            });
        }
    },

    handleSubmit(e) {
        e.preventDefault();

        const submitBtn = this.form.querySelector('.form-submit');
        const originalContent = submitBtn.innerHTML;

        // Validate
        const name = this.form.querySelector('input[name="name"]');
        const phone = this.form.querySelector('input[name="phone"]');
        const privacy = this.form.querySelector('#privacy');

        if (!name.value.trim()) {
            this.showMessage('이름을 입력해주세요.', 'error');
            name.focus();
            return;
        }

        if (!phone.value.trim() || phone.value.length < 12) {
            this.showMessage('올바른 연락처를 입력해주세요.', 'error');
            phone.focus();
            return;
        }

        if (!privacy.checked) {
            this.showMessage('개인정보 수집 및 이용에 동의해주세요.', 'error');
            return;
        }

        // Loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>전송 중...</span>';
        submitBtn.disabled = true;

        // API 전송
        const formData = {
            category: this.form.querySelector('[name="category"]')?.value || '',
            name: name.value,
            phone: phone.value,
            email: this.form.querySelector('[name="email"]')?.value || '',
            region: this.form.querySelector('[name="region"]')?.value || '',
            property_type: this.form.querySelector('[name="propertyType"]')?.value || '',
            budget: this.form.querySelector('[name="budget"]')?.value || '',
            invest_purpose: this.form.querySelector('[name="investPurpose"]:checked')?.value || '',
            case_number: this.form.querySelector('[name="caseNumber"]')?.value || '',
            message: this.form.querySelector('[name="message"]')?.value || ''
        };

        fetch('/realtycomment/api/consultations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                this.showMessage('상담 신청이 완료되었습니다.<br>빠른 시일 내에 연락드리겠습니다.', 'success');
                this.form.reset();
            } else {
                this.showMessage('전송 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
            }
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        })
        .catch(() => {
            this.showMessage('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        });
    },

    showMessage(message, type) {
        // Remove existing message
        const existing = this.form.querySelector('.form-message');
        if (existing) existing.remove();

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.style.cssText = `
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 24px;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: fadeIn 0.3s ease;
            ${type === 'success'
                ? 'background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); color: #065f46; border: 1px solid #a7f3d0;'
                : 'background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); color: #991b1b; border: 1px solid #fecaca;'
            }
        `;

        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        messageEl.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span>`;

        // Insert at top of form
        const formHeader = this.form.querySelector('.form-header');
        formHeader.insertAdjacentElement('afterend', messageEl);

        // Auto remove
        setTimeout(() => {
            messageEl.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => messageEl.remove(), 300);
        }, 5000);
    }
};

/**
 * Back to Top Button
 */
const BackToTop = {
    btn: null,

    init() {
        this.btn = document.getElementById('backToTop');
        if (!this.btn) return;

        window.addEventListener('scroll', () => this.toggle(), { passive: true });
        this.btn.addEventListener('click', () => this.scrollToTop());
    },

    toggle() {
        if (window.pageYOffset > 500) {
            this.btn.classList.add('visible');
        } else {
            this.btn.classList.remove('visible');
        }
    },

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

/**
 * Smooth Scroll
 */
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

/**
 * Add CSS Animation Keyframes
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

/**
 * Parallax Effect
 */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroGlow = document.querySelector('.hero-glow');

    if (heroGlow && scrolled < 800) {
        heroGlow.style.transform = `translateX(-50%) translateY(${scrolled * 0.3}px)`;
    }
}, { passive: true });

/**
 * Intersection Observer for Animations
 */
const observeElements = () => {
    const elements = document.querySelectorAll('.service-card, .step-card, .timeline-step');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
};

// Run after DOM loaded
document.addEventListener('DOMContentLoaded', observeElements);
