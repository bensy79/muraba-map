import { t, type Lang } from './i18n';
import type { Place } from './locations';

export interface Panel {
  show(place: Place, lang: Lang): void;
  hide(): void;
  current(): Place | null;
}

export function createPanel(root: HTMLElement, onClose: () => void): Panel {
  const body = root.querySelector<HTMLElement>('#panel-body')!;
  const closeBtn = root.querySelector<HTMLButtonElement>('#panel-close')!;
  let current: Place | null = null;

  closeBtn.addEventListener('click', onClose);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current) onClose();
  });

  return {
    show(place, lang) {
      current = place;
      closeBtn.setAttribute('aria-label', t('close', lang));
      body.replaceChildren();

      const images = place.images ?? [];
      if (images.length) {
        // Horizontal scroll-snap strip; swipe (or trackpad-scroll) between photos.
        const gallery = document.createElement('div');
        gallery.className = 'gallery';
        images.forEach((file, i) => {
          const img = document.createElement('img');
          img.src = `${import.meta.env.BASE_URL}images/${file}`;
          img.alt =
            images.length > 1
              ? `${place.name[lang]} (${i + 1}/${images.length})`
              : place.name[lang];
          img.loading = 'lazy';
          gallery.append(img);
        });
        body.append(gallery);
      }

      const h2 = document.createElement('h2');
      h2.textContent = place.name[lang];
      body.append(h2);

      // Blank lines in the description become separate paragraphs.
      for (const para of place.text[lang].split(/\n\s*\n/)) {
        const p = document.createElement('p');
        p.textContent = para.trim();
        body.append(p);
      }

      if (place.links?.length) {
        const h3 = document.createElement('h3');
        h3.textContent = t('links', lang);
        const ul = document.createElement('ul');
        for (const link of place.links) {
          const a = document.createElement('a');
          a.href = link.url;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = link.label[lang];
          const li = document.createElement('li');
          li.append(a);
          ul.append(li);
        }
        body.append(h3, ul);
      }

      root.hidden = false;
      body.scrollTop = 0;
    },
    hide() {
      current = null;
      root.hidden = true;
    },
    current: () => current,
  };
}
