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
  /** Filename inside public/images/, or empty for no photo. */
  image?: string;
  links?: PlaceLink[];
  name: Localized;
  text: Localized;
}

export const places: Place[] = raw as Place[];
