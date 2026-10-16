(() => {
    if (document.getElementById('navToggle')) return;

    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const pageDepth = window.location.pathname.endsWith('/')
        ? pathSegments.length
        : Math.max(0, pathSegments.length - 1);
    const prefix = '../'.repeat(pageDepth);
    const links = [
        ['Home', `${prefix}index.html#home`],
        ['About', `${prefix}index.html#about`],
        ['Projects', `${prefix}projects-new.html`],
        ['Blog', `${prefix}blog.html`],
        ['Tutorials', `${prefix}tutorials.html`],
        ['Case Studies', `${prefix}case-studies.html`],
        ['Insights', `${prefix}insights.html`],
        ['Resume', `${prefix}resume-new.html`],
        ['Contact', `${prefix}index.html#contact`]
    ];

    const toggle = document.createElement('button');
    toggle.className = 'site-menu-toggle';
    toggle.id = 'site-menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.setAttribute('aria-controls', 'site-menu-panel');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span aria-hidden="true">&#9776;</span>';

    const backdrop = document.createElement('button');
    backdrop.className = 'site-menu-backdrop';
    backdrop.type = 'button';
    backdrop.setAttribute('aria-label', 'Close navigation');
    backdrop.hidden = true;

    const navigation = document.createElement('nav');
    navigation.className = 'site-menu-panel';
    navigation.id = 'site-menu-panel';
    navigation.setAttribute('aria-label', 'Site navigation');
    navigation.setAttribute('aria-hidden', 'true');
    navigation.inert = true;
    navigation.innerHTML = `
        <a class="site-menu-brand" href="${prefix}index.html">Klaus<span>.</span></a>
        <ul>${links.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul>
    `;

    document.body.classList.add('has-site-menu');
    document.body.prepend(backdrop, navigation, toggle);

    const setOpen = (open, restoreFocus = false) => {
        document.body.classList.toggle('site-menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
        toggle.innerHTML = `<span aria-hidden="true">${open ? '&times;' : '&#9776;'}</span>`;
        navigation.setAttribute('aria-hidden', String(!open));
        navigation.inert = !open;
        backdrop.hidden = !open;

        if (open) {
            navigation.querySelector('a')?.focus({ preventScroll: true });
        } else if (restoreFocus) {
            toggle.focus();
        }
    };

    toggle.addEventListener('click', () => {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    backdrop.addEventListener('click', () => setOpen(false, true));
    navigation.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setOpen(false));
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setOpen(false, true);
        }

        if (event.key === 'Tab' && toggle.getAttribute('aria-expanded') === 'true') {
            const focusableLinks = [...navigation.querySelectorAll('a')];
            const firstLink = focusableLinks[0];
            const lastLink = focusableLinks[focusableLinks.length - 1];
            if (event.shiftKey && document.activeElement === firstLink) {
                event.preventDefault();
                lastLink.focus();
            } else if (!event.shiftKey && document.activeElement === lastLink) {
                event.preventDefault();
                firstLink.focus();
            }
        }
    });
})();
