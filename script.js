document.addEventListener('DOMContentLoaded', () => {
    initSmoothAnchors();
    initScrollAnimations();
    initKeyboardSupport();
    restoreModePreference();
    initCollapsedStates();
});

function toggleAnswer(element, withConfirm = false) {
    const card = element.closest('.card');
    if (!card) return;
    const contents = card.querySelectorAll('.answer-content');
    if (!contents.length) return;
    const isCollapsed = card.classList.contains('collapsed');
    const isHidden = card.getAttribute('data-hidden') === '1';
    if (isHidden) {
        card.removeAttribute('data-hidden');
        card.classList.remove('collapsed');
        contents.forEach(content => {
            content.classList.remove('hidden-content');
            content.style.display = '';
            requestAnimationFrame(() => {
                content.style.maxHeight = content.scrollHeight + 'px';
            });
        });
        element.setAttribute('aria-expanded', 'true');
        return;
    }
    if (!isCollapsed) {
        if (withConfirm) {
            const confirmHide = confirm('Apakah Anda ingin menyembunyikan jawaban?');
            if (!confirmHide) return;
        }
        card.classList.add('collapsed');
        card.setAttribute('data-hidden', '1');
        contents.forEach(content => {
            content.classList.add('hidden-content');
            content.style.maxHeight = '0';
            setTimeout(() => {
                content.style.display = 'none';
            }, 350);
        });
        element.setAttribute('aria-expanded', 'false');
    } else {
        card.classList.remove('collapsed');
        card.removeAttribute('data-hidden');
        contents.forEach(content => {
            content.classList.remove('hidden-content');
            content.style.display = '';
            requestAnimationFrame(() => {
                content.style.maxHeight = content.scrollHeight + 'px';
            });
        });
        element.setAttribute('aria-expanded', 'true');
    }
}

function toggleModeSwitch(el) {
    setPageMode(el.checked);
}

function setPageMode(berantakan) {
    const body = document.body;
    if (berantakan) {
        body.classList.add('mode-berantakan');
        body.classList.remove('mode-rapi');
        localStorage.setItem('page-mode', 'berantakan');
    } else {
        body.classList.remove('mode-berantakan');
        body.classList.add('mode-rapi');
        localStorage.setItem('page-mode', 'rapi');
    }
}

function restoreModePreference() {
    const saved = localStorage.getItem('page-mode');
    const sw = document.getElementById('berantakanSwitch');
    if (saved === 'berantakan') {
        document.body.classList.add('mode-berantakan');
        document.body.classList.remove('mode-rapi');
        if (sw) sw.checked = true;
    } else {
        document.body.classList.remove('mode-berantakan');
        document.body.classList.add('mode-rapi');
        if (sw) sw.checked = false;
    }
}

function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.question-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

function initKeyboardSupport() {
    document.querySelectorAll('.question-title').forEach(title => {
        title.setAttribute('tabindex', '0');
        title.setAttribute('role', 'button');
        title.setAttribute('aria-expanded', 'true');
        title.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAnswer(title, false);
            }
        });
        title.addEventListener('click', () => toggleAnswer(title, true));
    });
}

function initCollapsedStates() {
    document.querySelectorAll('.question-item .answer-content').forEach(c => {
        const card = c.closest('.card');
        if (!card) return;
        c.style.maxHeight = '0';
        c.style.display = 'none';
        card.classList.add('collapsed');
        card.setAttribute('data-hidden', '1');
    });
}

window.addEventListener('orientationchange', () => {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
});

console.log('Responsive Web Design with interactivity loaded. Screen width:', window.innerWidth);
