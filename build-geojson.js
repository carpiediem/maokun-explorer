const fetch = require("node-fetch");
const { writeFileSync } = require("fs");
const { SHEETY_URL, SHEETY_TOKEN } = require("./.sheety.json");
const opts = { headers: { Authorization: `Bearer ${SHEETY_TOKEN}` } };

(async () => {
  try {
    const responses = await Promise.all([
      fetch(`${SHEETY_URL}/points`, opts),
      fetch(`${SHEETY_URL}/navigation`, opts),
      fetch(`${SHEETY_URL}/zoomifyPaths`, opts),
      fetch(`${SHEETY_URL}/latLngPaths`, opts)
    ]);

    const [
      { points },
      { navigation },
      { zoomifyPaths },
      { latLngPaths }
    ] = await Promise.all(responses.map(res => res.json()));

    const pointFeatures = points.map(item => ({
      type: "Feature",
      geometry: {
        type: "Point",
        zoomify: [item.geometryZoomify0, item.geometryZoomify1],
        coordinates:
          item.geometryCoordinates0 === "" || !item.geometryCoordinates0
            ? []
            : [item.geometryCoordinates0, item.geometryCoordinates1],
        kamalAngle:
          item.geometryKamalAngle === "" ? null : item.geometryKamalAngle
      },
      properties: {
        id: item.id,
        labelTc: item.propertiesLabelTc,
        labelEn: item.propertiesLabelEn,
        nameTc: item.propertiesNameTc,
        nameEn: item.propertiesNameEn,
        category: item.propertiesCategory,
        navigationNotes: item.propertiesNavigationNotes,
        referenceUrl: item.propertiesReferenceUrl,
        aboutEn: item.propertiesAboutEn,
        aboutTc: item.propertiesAboutZh
      }
    }));

    const lineStringFeatures = navigation.map(item => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        zoomify: zoomifyPaths
          .filter(({ code }) => code === item.code)
          .map(({ x, y }) => [parseInt(x, 10), parseInt(y, 10)]),
        coordinates: latLngPaths
          .filter(row => row.code === navigation[1].code)
          .map(({ lng, lat }) => [lng, lat])
      },
      properties: {
        id: item.id,
        code: item.code,
        name: item.name,
        locUrl: item.locUrl,
        mapText: item.mapText,
        inEnglish: item.inEnglish
      }
    }));

    const geojson = JSON.stringify({
      type: "FeatureCollection",
      features: pointFeatures.concat(lineStringFeatures)
    });
    const known = JSON.stringify({
      type: "FeatureCollection",
      features: pointFeatures
        .concat(lineStringFeatures)
        .filter(
          f => f.geometry.coordinates.length >= 2 && !!f.geometry.coordinates[0]
        )
    });

    writeFileSync("public/maokun.geo.json", geojson, { encoding: "UTF-8" });
    writeFileSync("public/maokun-known.geo.json", known, { encoding: "UTF-8" });

    console.log(
      `Saved ${pointFeatures.length +
        lineStringFeatures.length} fetures in public/maokun.geo.json`
    );
  } catch (e) {
    console.error(e);
  }
})();
