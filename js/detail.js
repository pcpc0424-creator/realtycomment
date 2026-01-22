/**
 * BUCOMANT - Detail Pages JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all detail page modules
    DetailTabs.init();
    GallerySlider.init();
    BookmarkToggle.init();
    ShareButton.init();
    SidebarForm.init();
    FAQAccordion.init();

    // Re-initialize AOS for detail pages
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }
});

/**
 * Detail Tabs
 */
const DetailTabs = {
    tabs: null,
    panes: null,

    init() {
        this.tabs = document.querySelectorAll('.tab-btn');
        this.panes = document.querySelectorAll('.tab-pane');

        if (this.tabs.length === 0) return;

        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    },

    switchTab(selectedTab) {
        const tabId = selectedTab.dataset.tab;

        // Update tabs
        this.tabs.forEach(tab => tab.classList.remove('active'));
        selectedTab.classList.add('active');

        // Update panes
        this.panes.forEach(pane => {
            pane.classList.remove('active');
            if (pane.id === tabId) {
                pane.classList.add('active');
            }
        });

        // Scroll to tabs if below viewport
        const tabsContainer = document.querySelector('.detail-tabs');
        if (tabsContainer) {
            const rect = tabsContainer.getBoundingClientRect();
            if (rect.top < 80) {
                const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                const targetPosition = tabsContainer.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
};

/**
 * Gallery Slider (Swiper)
 */
const GallerySlider = {
    mainSwiper: null,
    thumbsSwiper: null,

    init() {
        if (typeof Swiper === 'undefined') return;

        const mainEl = document.querySelector('.gallery-main-swiper');
        const thumbsEl = document.querySelector('.gallery-thumbs-swiper');

        if (!mainEl) return;

        // Initialize thumbs swiper first
        if (thumbsEl) {
            this.thumbsSwiper = new Swiper('.gallery-thumbs-swiper', {
                spaceBetween: 10,
                slidesPerView: 4,
                freeMode: true,
                watchSlidesProgress: true,
            });
        }

        // Initialize main swiper
        this.mainSwiper = new Swiper('.gallery-main-swiper', {
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            thumbs: this.thumbsSwiper ? {
                swiper: this.thumbsSwiper,
            } : undefined,
        });
    }
};

/**
 * Bookmark Toggle
 */
const BookmarkToggle = {
    btn: null,

    init() {
        this.btn = document.getElementById('bookmarkBtn');
        if (!this.btn) return;

        this.btn.addEventListener('click', () => this.toggle());

        // Check if already bookmarked (from localStorage)
        const propertyId = this.getPropertyId();
        if (propertyId && this.isBookmarked(propertyId)) {
            this.setActive(true);
        }
    },

    toggle() {
        const isActive = this.btn.classList.contains('active');
        this.setActive(!isActive);

        const propertyId = this.getPropertyId();
        if (propertyId) {
            if (!isActive) {
                this.addBookmark(propertyId);
                this.showToast('관심 물건에 추가되었습니다');
            } else {
                this.removeBookmark(propertyId);
                this.showToast('관심 물건에서 제거되었습니다');
            }
        }
    },

    setActive(active) {
        const icon = this.btn.querySelector('i');
        if (active) {
            this.btn.classList.add('active');
            icon.classList.remove('far');
            icon.classList.add('fas');
        } else {
            this.btn.classList.remove('active');
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
    },

    getPropertyId() {
        // Get property ID from URL or data attribute
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || 'default-property';
    },

    isBookmarked(id) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        return bookmarks.includes(id);
    },

    addBookmark(id) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        if (!bookmarks.includes(id)) {
            bookmarks.push(id);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        }
    },

    removeBookmark(id) {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        bookmarks = bookmarks.filter(b => b !== id);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    },

    showToast(message) {
        // Remove existing toast
        const existing = document.querySelector('.toast-message');
        if (existing) existing.remove();

        // Create toast
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 14px 24px;
            background: #1e293b;
            color: white;
            font-size: 14px;
            font-weight: 500;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: toastIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Add animation keyframes
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes toastIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                @keyframes toastOut {
                    from { opacity: 1; transform: translateX(-50%) translateY(0); }
                    to { opacity: 0; transform: translateX(-50%) translateY(20px); }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove toast after delay
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }
};

/**
 * Share Button
 */
const ShareButton = {
    btn: null,

    init() {
        this.btn = document.getElementById('shareBtn');
        if (!this.btn) return;

        this.btn.addEventListener('click', () => this.share());
    },

    async share() {
        const title = document.querySelector('.property-title')?.textContent || '부코맨트 - 경매물건';
        const url = window.location.href;

        // Try native share API first
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: url
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    this.copyToClipboard(url);
                }
            }
        } else {
            // Fallback to clipboard
            this.copyToClipboard(url);
        }
    },

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            BookmarkToggle.showToast('링크가 복사되었습니다');
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            BookmarkToggle.showToast('링크가 복사되었습니다');
        });
    }
};

/**
 * Sidebar Form
 */
const SidebarForm = {
    form: null,

    init() {
        this.form = document.getElementById('sidebarForm');
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

        const submitBtn = this.form.querySelector('.form-submit-btn');
        const originalContent = submitBtn.innerHTML;

        // Validate
        const name = this.form.querySelector('input[name="name"]');
        const phone = this.form.querySelector('input[name="phone"]');
        const privacy = this.form.querySelector('input[type="checkbox"]');

        if (!name.value.trim()) {
            this.showError('이름을 입력해주세요.');
            name.focus();
            return;
        }

        if (!phone.value.trim() || phone.value.length < 12) {
            this.showError('올바른 연락처를 입력해주세요.');
            phone.focus();
            return;
        }

        if (!privacy.checked) {
            this.showError('개인정보 수집 및 이용에 동의해주세요.');
            return;
        }

        // Loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>전송 중...</span>';
        submitBtn.disabled = true;

        // Simulate submission
        setTimeout(() => {
            BookmarkToggle.showToast('상담 신청이 완료되었습니다');
            this.form.reset();
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }, 1500);
    },

    showError(message) {
        BookmarkToggle.showToast(message);
    }
};

/**
 * FAQ Accordion
 */
const FAQAccordion = {
    items: null,

    init() {
        this.items = document.querySelectorAll('.faq-item');
        if (this.items.length === 0) return;

        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggle(item));
        });
    },

    toggle(clickedItem) {
        const isActive = clickedItem.classList.contains('active');

        // Close all items
        this.items.forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            clickedItem.classList.add('active');
        }
    }
};

/**
 * Smooth scroll for anchor links
 */
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

/**
 * Intersection Observer for animations
 */
const observeDetailElements = () => {
    const elements = document.querySelectorAll('.info-card, .content-card, .sidebar-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
};

// Run after DOM loaded
document.addEventListener('DOMContentLoaded', observeDetailElements);
