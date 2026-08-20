document.documentElement.classList.add('js');

(() => {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const sections = {
    'style.html':'style','grooming.html':'grooming','fitness.html':'fitness','life.html':'life',
    'standards.html':'standards','library.html':'library','join.html':'club','about.html':'club','privacy.html':'club'
  };
  document.body.dataset.section = sections[path] || 'home';

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const nav = document.querySelector('#site-nav');
  const menu = document.querySelector('.menu');
  if (nav) {
    const navItems = [
      ['index.html#edit','The Edit','index.html'],['style.html','Style','style.html'],['grooming.html','Grooming','grooming.html'],
      ['fitness.html','Fitness','fitness.html'],['life.html','Life','life.html'],['library.html','Library','library.html'],
      ['standards.html','Standards','standards.html'],['join.html','Join','join.html','nav-cta']
    ];
    nav.innerHTML = navItems.map(([href,label,file,cls='']) => {
      const active = path === file || (file === 'index.html' && path === '');
      return `<a href="${href}"${cls ? ` class="${cls}${active ? ' active' : ''}"` : active ? ' class="active"' : ''}${active ? ' aria-current="page"' : ''}>${label}</a>`;
    }).join('');
  }

  const closeMenu = () => {
    if (!nav || !menu) return;
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    menu.setAttribute('aria-expanded','false');
    menu.textContent = 'MENU';
    menu.setAttribute('aria-label','Open menu');
  };
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.textContent = open ? 'CLOSE' : 'MENU';
      menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (innerWidth > 860) closeMenu(); }, {passive:true});
  }

  const footer = document.querySelector('.site-footer');
  if (footer && !footer.querySelector('.footer-utility')) {
    const utility = document.createElement('div');
    utility.className = 'footer-utility';
    utility.innerHTML = '<span>Independent guidance for men who give a damn.</span><span><a href="about.html">About & disclosures</a> · <a href="privacy.html">Privacy</a> · <a href="library.html">Field Library</a></span>';
    footer.appendChild(utility);
    const links = footer.querySelector('.footer-links');
    if (links) links.innerHTML = '<a href="style.html">Style</a><a href="grooming.html">Grooming</a><a href="fitness.html">Fitness</a><a href="life.html">Life</a><a href="library.html">Library</a><a href="standards.html">Standards</a>';
  }

  const announcementTarget = document.querySelector('.site-header');
  if (announcementTarget && !document.querySelector('.announcement') && path !== '404.html') {
    const bar = document.createElement('div');
    bar.className = 'announcement';
    bar.innerHTML = 'The field library is open — <a href="library.html">browse 27 practical guides</a>';
    announcementTarget.parentNode.insertBefore(bar, announcementTarget);
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    }), {threshold:.08, rootMargin:'0px 0px -35px'});
    revealEls.forEach(el => io.observe(el));
  } else revealEls.forEach(el => el.classList.add('visible'));

  const progress = document.querySelector('.reading-progress span');
  const updateProgress = () => {
    if (!progress) return;
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${total > 0 ? Math.min(100, Math.max(0, scrollY / total * 100)) : 0}%`;
  };
  addEventListener('scroll', updateProgress, {passive:true});
  addEventListener('resize', updateProgress, {passive:true});
  updateProgress();

  document.querySelectorAll('[data-tabs]').forEach(tabs => {
    const buttons = [...tabs.querySelectorAll('[data-tab]')];
    const panels = [...tabs.querySelectorAll('.workout-panel')];
    const activate = btn => {
      buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); b.tabIndex = -1; });
      panels.forEach(p => { p.classList.remove('active'); p.hidden = true; });
      btn.classList.add('active'); btn.setAttribute('aria-selected','true'); btn.tabIndex = 0;
      const panel = tabs.querySelector(`#${CSS.escape(btn.dataset.tab)}`);
      if (panel) { panel.hidden = false; panel.classList.add('active'); panel.focus?.({preventScroll:true}); }
    };
    buttons.forEach((btn,index) => {
      btn.addEventListener('click', () => activate(btn));
      btn.addEventListener('keydown', e => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
        e.preventDefault();
        let next = index;
        if (e.key === 'ArrowRight') next = (index + 1) % buttons.length;
        if (e.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = buttons.length - 1;
        buttons[next].focus(); activate(buttons[next]);
      });
    });
  });

  const checklist = document.querySelector('[data-checklist]');
  if (checklist) {
    const key = 'bmc-sunday-reset-v2';
    const inputs = [...checklist.querySelectorAll('input[type="checkbox"]')];
    const count = document.querySelector('[data-reset-count]');
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(key) || '[]'); } catch (_) {}
    const savedSet = new Set(Array.isArray(saved) ? saved : []);
    const update = () => {
      const selected = inputs.filter(i => i.checked).map(i => i.value);
      try { localStorage.setItem(key, JSON.stringify(selected)); } catch (_) {}
      if (count) count.textContent = String(selected.length);
    };
    inputs.forEach(input => { input.checked = savedSet.has(input.value); input.addEventListener('change', update); });
    update();
    document.querySelector('[data-reset-clear]')?.addEventListener('click', () => {
      inputs.forEach(i => i.checked = false);
      try { localStorage.removeItem(key); } catch (_) {}
      update();
    });
  }

  const library = document.querySelector('[data-library]');
  if (library) {
    const input = document.querySelector('[data-library-search]');
    const buttons = [...document.querySelectorAll('[data-library-filter]')];
    const cards = [...library.querySelectorAll('[data-guide]')];
    const count = document.querySelector('[data-library-count]');
    const empty = document.querySelector('[data-library-empty]');
    let category = 'all';
    const apply = () => {
      const q = (input?.value || '').trim().toLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const hay = `${card.dataset.title || ''} ${card.dataset.keywords || ''} ${card.textContent}`.toLowerCase();
        const show = (category === 'all' || card.dataset.category === category) && (!q || hay.includes(q));
        card.hidden = !show; if (show) visible++;
      });
      if (count) count.textContent = `${visible} guide${visible === 1 ? '' : 's'}`;
      empty?.classList.toggle('show', visible === 0);
      const url = new URL(location.href);
      q ? url.searchParams.set('q', q) : url.searchParams.delete('q');
      category !== 'all' ? url.searchParams.set('section', category) : url.searchParams.delete('section');
      history.replaceState({}, '', url);
    };
    const params = new URLSearchParams(location.search);
    if (input && params.get('q')) input.value = params.get('q');
    if (params.get('section') && buttons.some(b => b.dataset.libraryFilter === params.get('section'))) category = params.get('section');
    buttons.forEach(btn => {
      const active = btn.dataset.libraryFilter === category;
      btn.classList.toggle('active', active); btn.setAttribute('aria-pressed', String(active));
      btn.addEventListener('click', () => {
        category = btn.dataset.libraryFilter;
        buttons.forEach(b => { const a = b === btn; b.classList.toggle('active', a); b.setAttribute('aria-pressed', String(a)); });
        apply();
      });
    });
    input?.addEventListener('input', apply);
    apply();
  }

  document.querySelectorAll('.faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const answer = document.getElementById(button.getAttribute('aria-controls'));
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      const mark = button.querySelector('[data-faq-mark]'); if (mark) mark.textContent = open ? '+' : '−';
      if (answer) answer.hidden = open;
    });
  });

  const joinForm = document.querySelector('[data-join-form]');
  if (joinForm) {
    joinForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(joinForm);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const focus = String(data.get('focus') || 'Living well');
      const note = String(data.get('note') || '').trim();
      const status = joinForm.querySelector('[data-form-status]');
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
        if (status) status.textContent = 'Add your name and a valid email address.';
        return;
      }
      const subject = encodeURIComponent(`Founding reader — ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPrimary interest: ${focus}\n\n${note || 'Please add me to the Beautiful Men\'s Club founding reader list.'}`);
      if (status) status.textContent = 'Opening your email app so you can send the request.';
      location.href = `mailto:hello@beautifulmensclub.com?subject=${subject}&body=${body}`;
    });
  }

  const toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role','status'); document.body.appendChild(toast);
  let toastTimer;
  const showToast = text => { toast.textContent = text; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2200); };
  document.querySelectorAll('[data-copy-link]').forEach(btn => btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); showToast('Link copied'); }
    catch (_) { showToast('Copy the address from your browser'); }
  }));

  if (path !== '404.html') {
    const back = document.createElement('button');
    back.className = 'back-to-top'; back.type = 'button'; back.setAttribute('aria-label','Back to top'); back.innerHTML = '↑';
    document.body.appendChild(back);
    const toggleBack = () => back.classList.toggle('show', scrollY > 700);
    addEventListener('scroll', toggleBack, {passive:true}); toggleBack();
    back.addEventListener('click', () => scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
  }

  const pageHero = document.querySelector('.page-hero-copy');
  const mainText = document.querySelector('main')?.innerText || '';
  if (pageHero && !pageHero.querySelector('.page-meta')) {
    const words = mainText.trim().split(/\s+/).length;
    const meta = document.createElement('div');
    meta.className = 'page-meta';
    meta.innerHTML = `<span>${Math.max(3, Math.round(words / 220))} minute read</span><span>Updated August 2026</span><button class="copy-link" type="button" data-copy-link>Copy link</button>`;
    pageHero.appendChild(meta);
    meta.querySelector('[data-copy-link]')?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); showToast('Link copied'); } catch (_) { showToast('Copy the address from your browser'); }
    });
  }

  const relatedMap = {
    'style.html':[['Grooming','The five-minute face','grooming.html#routine'],['Standards','Fit beats price—and the other six rules','standards.html#rules'],['Library','Browse every style guide','library.html?section=style']],
    'grooming.html':[['Style','The 12-piece wardrobe','style.html#twelve-piece-wardrobe'],['Life','Reset the bathroom','life.html#bathroom'],['Library','Browse every grooming guide','library.html?section=grooming']],
    'fitness.html':[['Standards','The Sunday Reset','standards.html#sunday-reset'],['Life','Build evidence, not a performance','life.html#confidence'],['Library','Browse every fitness guide','library.html?section=fitness']],
    'life.html':[['Standards','The Beautiful Man standard','standards.html'],['Style','Buy fewer, better things','style.html#buying'],['Library','Browse every life guide','library.html?section=life']],
    'standards.html':[['Style','Start with fit','style.html#fit'],['Fitness','The 45-minute plan','fitness.html#forty-five'],['Join','Become a founding reader','join.html']]
  };
  const related = relatedMap[path];
  const nextRoom = document.querySelector('.next-room');
  if (related && nextRoom && !document.querySelector('.related-guides')) {
    const section = document.createElement('section');
    section.className = 'related-guides section';
    section.innerHTML = `<p class="section-tag">KEEP READING</p><h2>Good next moves.</h2><div class="related-grid">${related.map(([cat,title,href]) => `<a href="${href}"><small>${cat.toUpperCase()}</small><b>${title}</b></a>`).join('')}</div>`;
    nextRoom.parentNode.insertBefore(section, nextRoom);
  }
})();

(() => {
  let audioContext;
  function playCashRegister() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioContext ||= new AudioContext();
    const now = audioContext.currentTime;
    const master = audioContext.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.22, now + 0.008);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);
    master.connect(audioContext.destination);
    [[1250, 0], [1740, 0.08], [2320, 0.16]].forEach(([frequency, delay]) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, now + delay);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.72, now + delay + 0.18);
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.8, now + delay + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.22);
      oscillator.connect(gain).connect(master);
      oscillator.start(now + delay);
      oscillator.stop(now + delay + 0.24);
    });
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-affiliate-active="true"]');
    if (!link) return;
    playCashRegister();
    const detail = {
      event: 'affiliate_click',
      affiliate_network: link.dataset.affiliateNetwork || 'amazon',
      affiliate_tag: link.dataset.affiliateTag || 'beautifulmensclub-20',
      link_url: link.href,
      link_text: link.textContent.trim().replace(/\s+/g, ' ').slice(0, 120),
      page_path: location.pathname,
    };
    if (typeof window.gtag === 'function') window.gtag('event', 'affiliate_click', detail);
    else (window.dataLayer ||= []).push(detail);
  });
})();
