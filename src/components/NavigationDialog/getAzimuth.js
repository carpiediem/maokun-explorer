// Azimuth = cos-1 [ sin(∂) / cos(φ) ]

// ∂ = star's declination
// φ = observer's latitude

export default function getAzimuth(
  deg = 0,
  min = 0,
  sec = 0,
  lat = 0,
  isSetting = false
) {
  const decl = deg + min / 60 + sec / 3600;
  const azimRad = Math.acos(
    Math.sin((decl / 180) * Math.PI) / Math.cos((lat / 180) * Math.PI)
  );
  return isSetting
    ? `${Math.round(360 - (180 / Math.PI) * azimRad)}º`
    : `${Math.round((180 / Math.PI) * azimRad)}º`;
}
