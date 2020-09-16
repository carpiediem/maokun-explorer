// @flow

import isEqual from 'fast-deep-equal';
import { withLeaflet, GridLayer, GridLayerProps } from 'react-leaflet';
// import { LatLngBounds } from "leaflet";

import { TileLayerZoomify } from './L.TileLayer.Zoomify';

type LeafletElement = TileLayerZoomify;
type Props = { url: string } & GridLayerProps;

const EVENTS_RE = /^on(.+)$/i;

class ZoomifyLayer extends GridLayer<LeafletElement, Props> {
  createLeafletElement(props: Props): LeafletElement {
    const { url, ...params } = props;

    return new TileLayerZoomify(url, this.getOptions(params));
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    super.updateLeafletElement(fromProps, toProps);

    const { url: prevUrl, opacity: _po, zIndex: _pz, ...prevProps } = fromProps;
    const { leaflet: _pl, ...prevParams } = this.getOptions(prevProps);
    const { url, opacity: _o, zIndex: _z, ...props } = toProps;
    const { leaflet: _l, ...params } = this.getOptions(props);

    if (url !== prevUrl) {
      this.leafletElement.setUrl(url);
    }
    if (!isEqual(params, prevParams)) {
      this.leafletElement.setParams(params);
    }
  }

  getOptions(params: Object): Object {
    const superOptions = super.getOptions(params);
    return Object.keys(superOptions).reduce((options, key) => {
      if (!EVENTS_RE.test(key)) {
        options[key] = superOptions[key];
      }
      return options;
    }, {});
  }
}

export default withLeaflet(ZoomifyLayer);
