import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Lang } from './i18n';
import type { Place } from './locations';

export interface MapView {
  map: L.Map;
  setLang(lang: Lang): void;
  setActive(id: string | null): void;
}

const isTouch = window.matchMedia('(pointer: coarse)').matches;

function pinIcon(label: string, active: boolean): L.DivIcon {
  const span = document.createElement('span');
  span.className = 'pin-label';
  span.textContent = label;
  return L.divIcon({
    className: `pin${active ? ' pin--active' : ''}`,
    html: `<span class="pin-dot"></span>${span.outerHTML}`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export function createMap(
  el: HTMLElement,
  places: Place[],
  lang: Lang,
  onSelect: (place: Place) => void,
  onBackgroundTap: () => void,
): MapView {
  const map = L.map(el, {
    zoomControl: !isTouch,
    // On phones the map sits inside a WordPress page; one-finger drags should
    // scroll the page until the user deliberately activates the map.
    dragging: !isTouch,
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng] as L.LatLngTuple));
  map.fitBounds(bounds, { padding: [48, 48] });

  let currentLang = lang;
  let activeId: string | null = null;
  const markers = new Map<string, L.Marker>();

  for (const place of places) {
    const marker = L.marker([place.lat, place.lng], {
      icon: pinIcon(place.name[lang], false),
      keyboard: true,
      title: place.name[lang],
    })
      .on('click', () => onSelect(place))
      .addTo(map);
    markers.set(place.id, marker);
  }

  map.on('click', onBackgroundTap);

  const refresh = () => {
    for (const place of places) {
      const marker = markers.get(place.id)!;
      marker.setIcon(pinIcon(place.name[currentLang], place.id === activeId));
      marker.getElement()?.setAttribute('title', place.name[currentLang]);
    }
  };

  return {
    map,
    setLang(next) {
      currentLang = next;
      refresh();
    },
    setActive(id) {
      activeId = id;
      refresh();
      const place = places.find((p) => p.id === id);
      if (place) map.panTo([place.lat, place.lng]);
    },
  };
}

export { isTouch };
