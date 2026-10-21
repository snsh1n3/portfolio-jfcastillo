/* Progressive enhancement only: the page is fully readable without JS. */

// 1) Email: assembled in the browser from reversed fragments, never present as plain text in the HTML.
const rev = (s: string) => [...s].reverse().join('');
document.querySelectorAll<HTMLElement>('[data-mail-u]').forEach((el) => {
  const addr = `${rev(el.dataset.mailU ?? '')}@${rev(el.dataset.mailD ?? '')}`;
  if (el instanceof HTMLAnchorElement) el.href = `mailto:${addr}`;
  const target = el.querySelector<HTMLElement>('[data-mail-text]');
  if (target) target.textContent = addr;
});

// 2) Bottom navigation: mark the section currently in view.
const ids = ['profile', 'experience', 'work', 'contact'];
const links = new Map(
  ids.map((id) => [id, document.querySelector<HTMLAnchorElement>(`.bn a[href="#${id}"]`)] as const),
);
let raf = 0;
const sync = () => {
  raf = 0;
  const vh = window.innerHeight;
  const doc = document.documentElement;
  let cur: string | null = null;
  if (doc.scrollHeight > vh + 4) {
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= vh * 0.45) cur = id;
    }
    if (window.scrollY + vh >= doc.scrollHeight - 4) cur = 'contact';
  }
  links.forEach((a, id) => a?.setAttribute('aria-current', String(id === cur)));
};
const schedule = () => { if (!raf) raf = requestAnimationFrame(sync); };
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', schedule);
sync();
