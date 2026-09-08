(function initTyping() {
    const el = document.querySelector('.typing-text');
    const names = ['Habiba Khaled'];
    let nameIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = names[nameIndex];
        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 60 : 120;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            nameIndex = (nameIndex + 1) % names.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }
    setTimeout(type, 800);
})();

// ── Scroll Reveal ──
(function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const staggerItems = document.querySelectorAll('.stagger-item');

    function checkReveal() {
        const windowHeight = window.innerHeight;

        reveals.forEach((el, i) => {
            const top = el.getBoundingClientRect().top;
            if (top < windowHeight - 80) {
                el.classList.add('active');
            }
        });

        staggerItems.forEach((el, i) => {
            const top = el.getBoundingClientRect().top;
            if (top < windowHeight - 60) {
                setTimeout(() => {
                    el.classList.add('visible');
                }, i * 100);
            }
        });
    }

    window.addEventListener('scroll', checkReveal);
    checkReveal();
})();


