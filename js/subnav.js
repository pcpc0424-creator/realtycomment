/**
 * Header Hide/Show + Sub Navigation Sticky
 * Learning-crew style scroll behavior
 */
function initHeaderAndSubNav() {
    var header = document.getElementById('siteHeader');
    var subNav = document.getElementById('subNav');
    var placeholder = document.getElementById('subNavPlaceholder');
    var lastScrollY = 0;
    var headerHeight = 72;
    var subNavHeight = 0;
    var subNavOriginalTop = 0;
    var isSubNavSticky = false;
    var headerVisible = false;
    var ticking = false;

    if (!header) return;

    // Calculate sub-nav original position and height
    if (subNav) {
        subNavOriginalTop = subNav.offsetTop;
        subNavHeight = subNav.offsetHeight;
    }

    function updateScroll() {
        var currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Add/remove scrolled class based on scroll position
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Header hide/show logic
        if (currentScrollY > 200 && currentScrollY > lastScrollY) {
            // Scrolling DOWN past 200px - hide header
            header.classList.add('header-hidden');
            header.classList.remove('header-visible');
            headerVisible = false;
        } else if (currentScrollY < lastScrollY && header.classList.contains('header-hidden')) {
            // Scrolling UP while header is hidden - show header
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
            header.classList.add('scrolled');
            headerVisible = true;
        }

        // At top - reset all
        if (currentScrollY <= 10) {
            header.classList.remove('header-hidden');
            header.classList.remove('header-visible');
            headerVisible = false;
        }

        // Sub-nav sticky logic
        if (subNav && placeholder) {
            // Recalculate original top if not sticky (in case of dynamic content)
            if (!isSubNavSticky) {
                subNavOriginalTop = subNav.offsetTop;
                subNavHeight = subNav.offsetHeight;
            }

            if (currentScrollY >= subNavOriginalTop - (headerVisible ? headerHeight : 0)) {
                if (!isSubNavSticky) {
                    // Make sticky
                    isSubNavSticky = true;
                    placeholder.style.height = subNavHeight + 'px';
                    placeholder.classList.add('active');
                    subNav.classList.add('is-sticky');
                }
                // Adjust position based on header visibility
                if (headerVisible) {
                    subNav.classList.add('below-header');
                } else {
                    subNav.classList.remove('below-header');
                }
            } else {
                if (isSubNavSticky) {
                    // Unstick
                    isSubNavSticky = false;
                    placeholder.style.height = '0';
                    placeholder.classList.remove('active');
                    subNav.classList.remove('is-sticky');
                    subNav.classList.remove('below-header');
                }
            }

            // Active section highlighting
            highlightActiveSection();
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    function highlightActiveSection() {
        var links = subNav.querySelectorAll('.sub-nav-link');
        // Total offset: header (if visible) + sub-nav bar height + buffer
        var totalOffset = (headerVisible ? headerHeight : 0) + subNavHeight + 20;
        var scrollPos = window.pageYOffset + totalOffset;
        var activeLink = null;

        links.forEach(function(link) {
            var href = link.getAttribute('href');
            if (!href || href.charAt(0) !== '#') return;
            var section = document.querySelector(href);
            if (!section) return;

            if (section.offsetTop <= scrollPos) {
                activeLink = link;
            }
        });

        links.forEach(function(link) { link.classList.remove('active'); });
        if (activeLink) {
            activeLink.classList.add('active');
        } else if (links.length > 0) {
            links[0].classList.add('active');
        }
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }, { passive: true });

    // Smooth scroll for sub-nav links + immediate active update
    if (subNav) {
        subNav.querySelectorAll('.sub-nav-link').forEach(function(link) {
            link.addEventListener('click', function(e) {
                var href = this.getAttribute('href');
                if (!href || href.charAt(0) !== '#') return;
                var target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();

                // Immediately update active class on click
                var allLinks = subNav.querySelectorAll('.sub-nav-link');
                allLinks.forEach(function(l) { l.classList.remove('active'); });
                this.classList.add('active');

                // Calculate scroll position
                var offset = (headerVisible ? headerHeight : 0) + subNavHeight + 10;
                var targetPos = target.offsetTop - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            });
        });
    }

    // Initial check
    updateScroll();
}
