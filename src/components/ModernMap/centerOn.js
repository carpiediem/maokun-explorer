const MING_PALACE = [118.8127, 32.0426];

export default function centerOn(mapRef, center = MING_PALACE, margin = 0.06) {
  if (!mapRef.current) return;
  if (!Array.isArray(center)) return;
  if (center.length === 0) return;
  if (typeof center[0] === 'number') {
    const leafletBounds = [
      { lng: center[0] - margin, lat: center[1] - margin },
      { lng: center[0] + margin, lat: center[1] + margin },
    ];
    mapRef.current.leafletElement.flyToBounds(leafletBounds, {
      duration: 2,
    });
    return;
  }

  if (Array.isArray(center[0]) && typeof center[0][0] === 'number') {
    mapRef.current.leafletElement.flyToBounds(
      center.map((latLng) => latLng.reverse()),
      {
        duration: 2,
      },
    );
  }
}
