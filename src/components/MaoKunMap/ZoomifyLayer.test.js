import React from 'react';
import { render } from '@testing-library/react';
import { LeafletProvider } from 'react-leaflet';

import { TileLayerZoomify } from './L.TileLayer.Zoomify';
import ZoomifyLayer from './ZoomifyLayer';

function buildLeafletContext() {
  const unproject = jest.fn(([x, y]) => ({ lat: -y, lng: x }));
  return {
    map: {
      unproject,
      options: {},
      addLayer: jest.fn(),
      removeLayer: jest.fn(),
      getZoom: jest.fn(() => 3),
      attributionControl: { addAttribution: jest.fn(), removeAttribution: jest.fn() },
    },
  };
}

function renderLayer(props, context = buildLeafletContext()) {
  const ref = React.createRef();
  const utils = render(
    <LeafletProvider value={context}>
      <ZoomifyLayer
        ref={ref}
        url="https://example.com/"
        attribution="Attribution text"
        width={300}
        height={300}
        onClick={jest.fn()}
        {...props}
      />
    </LeafletProvider>,
  );
  return { instance: ref.current, ...utils };
}

test('creates a TileLayerZoomify from the props, excluding leaflet event-handler props', () => {
  const { instance } = renderLayer();

  expect(instance.leafletElement).toBeInstanceOf(TileLayerZoomify);
  expect(instance.leafletElement.options.width).toBe(300);
  expect(instance.leafletElement.options.height).toBe(300);
  expect(instance.leafletElement.options.onClick).toBeUndefined();
});

test('mounts the layer onto the map', () => {
  const context = buildLeafletContext();
  const { instance } = renderLayer({}, context);

  expect(context.map.addLayer).toHaveBeenCalledWith(instance.leafletElement);
});

describe('when the url changes', () => {
  test('updates the url on the underlying layer', () => {
    const context = buildLeafletContext();
    const { instance, rerender } = renderLayer({}, context);
    // setUrl's real implementation triggers a full leaflet tile redraw, which needs a live map;
    // stub it out since we only care that ZoomifyLayer calls it with the new url.
    const setUrlSpy = jest.spyOn(instance.leafletElement, 'setUrl').mockImplementation(() => {});

    rerender(
      <LeafletProvider value={context}>
        <ZoomifyLayer
          ref={React.createRef()}
          url="https://example.com/v2/"
          attribution="Attribution text"
          width={300}
          height={300}
          onClick={jest.fn()}
        />
      </LeafletProvider>,
    );

    expect(setUrlSpy).toHaveBeenCalledWith('https://example.com/v2/');
  });
});

describe('when the url is unchanged', () => {
  test('does not update the url', () => {
    const context = buildLeafletContext();
    const { instance, rerender } = renderLayer({}, context);
    const setUrlSpy = jest.spyOn(instance.leafletElement, 'setUrl');

    rerender(
      <LeafletProvider value={context}>
        <ZoomifyLayer
          ref={React.createRef()}
          url="https://example.com/"
          attribution="Attribution text"
          width={300}
          height={300}
          onClick={jest.fn()}
        />
      </LeafletProvider>,
    );

    expect(setUrlSpy).not.toHaveBeenCalled();
  });
});

describe('when other params (e.g. width) change', () => {
  test('updates params on the underlying layer', () => {
    // NOTE: TileLayerZoomify doesn't define setParams (that's a leaflet TileLayer.WMS-only method),
    // so this branch would throw in the real app if it were ever reached with changed params. It
    // isn't reached in practice because MaoKunMap always passes the same constant width/height. We
    // stub setParams here to exercise ZoomifyLayer's own comparison/branch logic in isolation.
    const context = buildLeafletContext();
    const { instance, rerender } = renderLayer({}, context);
    instance.leafletElement.setParams = jest.fn();

    rerender(
      <LeafletProvider value={context}>
        <ZoomifyLayer
          ref={React.createRef()}
          url="https://example.com/"
          attribution="Attribution text"
          width={600}
          height={300}
          onClick={jest.fn()}
        />
      </LeafletProvider>,
    );

    expect(instance.leafletElement.setParams).toHaveBeenCalledWith(expect.objectContaining({ width: 600 }));
  });
});

describe('when nothing relevant changes', () => {
  test('does not update params', () => {
    const context = buildLeafletContext();
    const { instance, rerender } = renderLayer({}, context);
    instance.leafletElement.setParams = jest.fn();

    rerender(
      <LeafletProvider value={context}>
        <ZoomifyLayer
          ref={React.createRef()}
          url="https://example.com/"
          attribution="Attribution text"
          width={300}
          height={300}
          onClick={jest.fn()}
        />
      </LeafletProvider>,
    );

    expect(instance.leafletElement.setParams).not.toHaveBeenCalled();
  });
});
