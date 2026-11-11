(() => {
  const pages = {
    home: 'This is the home page',
    about: 'This is the about page',
    contact: 'This is the contact page',
  };

  const knownRoute = /\/(about|contact)\/?$/;
  const currentPath = window.location.pathname;
  const routeMatch = currentPath.match(knownRoute);
  const basePath = routeMatch
    ? currentPath.slice(0, routeMatch.index + 1)
    : currentPath.endsWith('/')
      ? currentPath
      : `${currentPath.slice(0, currentPath.lastIndexOf('/') + 1)}`;

  const content = document.querySelector('#page-content');
  const sidebar = document.querySelector('#sidebar');
  const toggle = document.querySelector('.menu-toggle');
  const links = [...document.querySelectorAll('[data-page]')];

  function pageFromPath(path) {
    const relativePath = path.slice(basePath.length).replace(/^\/+|\/+$/g, '');
    return pages[relativePath] ? relativePath : 'home';
  }

  function render(page) {
    content.replaceChildren(Object.assign(document.createElement('p'), { textContent: pages[page] }));
    document.title = page[0].toUpperCase() + page.slice(1);
    links.forEach((link) => {
      const linkPage = link.dataset.page;
      const selected = linkPage === page;
      link.setAttribute('href', linkPage === 'home' ? basePath : `${basePath}${linkPage}/`);
      if (selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  toggle.addEventListener('click', () => {
    const hidden = document.body.classList.toggle('sidebar-hidden');
    toggle.setAttribute('aria-expanded', String(!hidden));
    toggle.textContent = hidden ? 'Show menu' : 'Hide menu';
  });

  sidebar.addEventListener('click', (event) => {
    const link = event.target.closest('[data-page]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const page = link.dataset.page;
    const destination = page === 'home' ? basePath : `${basePath}${page}/`;
    if (window.location.pathname !== destination) history.pushState({}, '', destination);
    render(page);
    content.focus();
  });

  window.addEventListener('popstate', () => render(pageFromPath(window.location.pathname)));
  render(pageFromPath(currentPath));
})();
