// Mobile menu
(function nav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    function setOpen(open) {
        menu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? 'Close' : 'Menu';
    }

    toggle.addEventListener('click', () => {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', (e) => {
        if (e.target.closest('a')) setOpen(false);
    });
})();

// Scroll reveal
(function reveal() {
    const items = Array.from(document.querySelectorAll('.reveal'));
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        items.forEach((el) => el.classList.add('is-in'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const siblings = Array.from(el.parentElement.children).filter((n) => n.classList.contains('reveal'));
            const index = Math.min(siblings.indexOf(el), 8);
            el.style.transitionDelay = index * 55 + 'ms';
            el.classList.add('is-in');
            observer.unobserve(el);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    items.forEach((el) => observer.observe(el));
})();

// Contact form: validation + Formspree
(function form() {
    const el = document.querySelector('.contact-form');
    if (!el) return;

    const note = el.querySelector('[data-form-note]');
    const button = el.querySelector('button[type="submit"]');
    const inputs = Array.from(el.querySelectorAll('input[name], textarea[name]'));

    const rules = {
        name: (v) => (v.trim() ? true : 'Please enter your name.'),
        email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? true : 'Please enter a valid email address, for example name@gmail.com.'),
        message: (v) => (v.trim() ? true : 'Please write a short message.')
    };

    function check(input) {
        const error = el.querySelector('[data-error="' + input.name + '"]');
        const result = rules[input.name] ? rules[input.name](input.value) : true;
        if (result === true) {
            input.removeAttribute('aria-invalid');
            if (error) error.hidden = true;
            return true;
        }
        input.setAttribute('aria-invalid', 'true');
        if (error) {
            error.textContent = result;
            error.hidden = false;
        }
        return false;
    }

    inputs.forEach((input) => {
        input.addEventListener('blur', () => check(input));
        input.addEventListener('input', () => {
            if (input.hasAttribute('aria-invalid')) check(input);
        });
    });

    async function handler(event) {
        event.preventDefault();

        const empty = inputs.filter((input) => !check(input));
        if (empty.length) {
            note.textContent = 'Almost — check the highlighted fields above.';
            empty[0].focus();
            return;
        }

        if (!note || note.dataset.busy) return;
        note.dataset.busy = 'true';
        note.textContent = 'Sending…';
        if (button) button.disabled = true;

        try {
            const response = await fetch(el.action, {
                method: 'POST',
                body: new FormData(el),
                headers: { Accept: 'application/json' }
            });
            if (!response.ok) throw new Error(response.status);
            el.reset();
            note.textContent = 'Thanks — your message is on its way.';
        } catch {
            note.textContent = 'That did not go through. Check your email address, press send again to submit the form directly, or message me on LinkedIn.';
            delete note.dataset.busy;
            el.removeEventListener('submit', handler);
        }

        if (button) button.disabled = false;
    }

    el.addEventListener('submit', handler);
})();

(function year() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
})();