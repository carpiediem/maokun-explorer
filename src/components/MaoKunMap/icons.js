import L from 'leaflet';

const icon = (url, className) =>
  new L.Icon({
    iconUrl: url,
    iconSize: [25, 25],
    iconAnchor: [23, 23],
  });

export const identified = {
  town: icon('./icons/town-identified.svg'),
  area: icon('./icons/area-identified.svg'),
  building: icon('./icons/building-identified.svg'),
  mountain: icon('./icons/mountain-identified.svg'),
  peninsula: icon('./icons/peninsula-identified.svg'),
  island: icon('./icons/island-identified.svg'),
  'water body': icon('./icons/water body-identified.svg'),
};
export const unidentified = {
  town: icon('./icons/town-unidentified.svg'),
  area: icon('./icons/area-unidentified.svg'),
  building: icon('./icons/building-unidentified.svg'),
  mountain: icon('./icons/mountain-unidentified.svg'),
  peninsula: icon('./icons/peninsula-unidentified.svg'),
  island: icon('./icons/island-unidentified.svg'),
  'water body': icon('./icons/water body-unidentified.svg'),
  descriptor: icon('./icons/descriptor-unidentified.svg'),
};

export const unknown = icon('./icons/unknown.svg');
