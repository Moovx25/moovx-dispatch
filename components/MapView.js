import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const TOMTOM_API_KEY = '7wjmlJ32cE1FKkAlTpAtCcIUiNRxA7Kc';

const MapView = ({ origin, destination, userLocation, riders = [], route = [] }) => {
  const webviewRef = useRef(null);

  const getInjectedJS = () => {
    const originLon = origin?.longitude ?? 0;
    const originLat = origin?.latitude ?? 0;
    const userLon = userLocation?.longitude ?? originLon;
    const userLat = userLocation?.latitude ?? originLat;

    return `
      (function() {
        function initMap() {
          if (!window.map) {
            window.map = tt.map({
              key: '${TOMTOM_API_KEY}',
              container: 'map',
              center: [${userLon}, ${userLat}],
              zoom: 13
            });
          }

          function addMarker(lon, lat, color, popup) {
            if (lon == null || lat == null) return;
            const marker = new tt.Marker({ color })
              .setLngLat([lon, lat])
              .setPopup(new tt.Popup().setHTML(popup))
              .addTo(window.map);
            window.markers = window.markers || [];
            window.markers.push(marker);
          }

          // Remove old markers
          if (window.markers) {
            window.markers.forEach(m => m.remove());
            window.markers = [];
          }

          // Add markers
          ${userLocation ? `addMarker(${userLon}, ${userLat}, 'blue', 'You');` : ''}
          ${origin ? `addMarker(${originLon}, ${originLat}, 'green', 'Pickup');` : ''}
          ${destination ? `addMarker(${destination.longitude}, ${destination.latitude}, 'red', 'Destination');` : ''}
          ${riders.length > 0
            ? riders
                .map(r => r.location ? `addMarker(${r.location.longitude}, ${r.location.latitude}, 'purple', '${r.name}');` : '')
                .join('')
            : ''}

          // Draw route if exists
          ${route.length > 0
            ? `
            const coordinates = ${JSON.stringify(route.map(c => [c.longitude, c.latitude]))};
            if (window.map.getLayer('route')) window.map.removeLayer('route');
            window.map.addLayer({
              id: 'route',
              type: 'line',
              source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coordinates } } },
              paint: { 'line-color': '#007bff', 'line-width': 4 }
            });
          `
            : ''}
        }

        // Load TomTom SDK if not loaded
        if (!window.tt) {
          const script = document.createElement('script');
          script.src = "https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js";
          script.onload = initMap;
          document.head.appendChild(script);
        } else {
          initMap();
        }
      })();
    `;
  };

  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(getInjectedJS());
    }
  }, [origin, destination, userLocation, riders, route]);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ html: '<html><body><div id="map" style="width:100%;height:100%"></div></body></html>' }}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

export default MapView;
