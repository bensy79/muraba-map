import raw from './data/locations.json';
import type { Localized } from './i18n';

export interface PlaceLink {
  url: string;
  label: Localized;
}

export interface Place {
  id: string;
  lat: number;
  lng: number;
  /** Filenames inside public/images/, shown as a swipeable gallery. */
  images?: string[];
  links?: PlaceLink[];
  name: Localized;
  text: Localized;
}

export const places: Place[] = raw as Place[];
