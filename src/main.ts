import './styles.css';
import { LANGS, detectLang, saveLang, t, type Lang } from './i18n';
import { places } from './locations';
import { createMap, isTouch } from './map';
import { createPanel } from './panel';

let lang: Lang = detectLang();

const panel = createPanel(document.getElementById('panel')!, closePanel);
const view = createMap(
  document.getElementById('map')!,
  places,
  lang,
  (place) => {
    panel.show(place, lang);
    view.setActive(place.id);
  },
  () => {
    if (panel.current()) closePanel();
  },
);

function closePanel() {
  panel.hide();
  view.setActive(null);
}

// Language switch
const switcher = document.getElementById('lang-switch')!;
function renderSwitcher() {
  switcher.replaceChildren(
    ...LANGS.map((code) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = code.toUpperCase();
      btn.setAttribute('aria-pressed', String(code === lang));
      btn.addEventListener('click', () => setLang(code));
      return btn;
    }),
  );
}

function setLang(next: Lang) {
  lang = next;
  saveLang(next);
  document.documentElement.lang = next;
  renderSwitcher();
  view.setLang(next);
  hint.textContent = t('touchHint', next);
  const open = panel.current();
  if (open) panel.show(open, next);
}

// On touch devices, dragging stays off until the user taps the map once,
// so the embedding WordPress page can still be scrolled past it.
const hint = document.getElementById('touch-hint')!;
if (isTouch) {
  hint.hidden = false;
  hint.addEventListener(
    'click',
    () => {
      hint.hidden = true;
      view.map.dragging.enable();
    },
    { once: true },
  );
}

setLang(lang);
