(function() {
    'use strict';
    var header = document.getElementById('siteHeader');
    if (!header) return;

    var hasHero = !!document.querySelector('.hero');
    var lastSP = 0;

    // 히어로 없는 페이지는 처음부터 scrolled 유지
    if (!hasHero) header.classList.add('scrolled');

    window.addEventListener('scroll', function() {
        var cs = window.pageYOffset;

        // scrolled 클래스: 히어로 있을 때만 토글
        if (cs > 50) {
            header.classList.add('scrolled');
        } else if (hasHero) {
            header.classList.remove('scrolled');
        }

        // 스크롤 방향에 따라 헤더 숨기기/보이기
        if (cs > 200 && cs > lastSP) {
            header.classList.add('header-hidden');
            header.classList.remove('header-visible');
        } else if (cs < lastSP && cs > 72) {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        }
        if (cs <= 10) {
            header.classList.remove('header-hidden');
            header.classList.remove('header-visible');
        }
        lastSP = cs;
    }, { passive: true });

    // 모바일 메뉴
    var toggle = document.getElementById('menuToggle');
    var mobile = document.getElementById('mobileMenu');
    if (toggle && mobile) {
        toggle.addEventListener('click', function() {
            toggle.classList.toggle('active');
            mobile.classList.toggle('open');
        });
        mobile.querySelectorAll('a').forEach(function(a) {
            a.addEventListener('click', function() {
                toggle.classList.remove('active');
                mobile.classList.remove('open');
            });
        });
    }
})();
