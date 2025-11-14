import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Constants from 'expo-constants';

MapboxGL.setAccessToken(Constants.manifest.extra.mapboxApiKey);

const MapView = ({ userLocation, riderLocations, routeCoordinates }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
    setInitialized(true);
  }, []);

  if (!initialized) return null;

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Street}>
        <MapboxGL.Camera
          zoomLevel={14}
          centerCoordinate={[
            userLocation?.longitude || 0,
            userLocation?.latitude || 0,
          ]}
        />

        {/* User marker */}
        {userLocation && (
          <MapboxGL.PointAnnotation
            id="user-location"
            coordinate={[userLocation.longitude, userLocation.latitude]}
          />
        )}

        {/* Rider markers */}
        {riderLocations?.map((rider) => (
          <MapboxGL.PointAnnotation
            key={rider.id}
            id={`rider-${rider.id}`}
            coordinate={[rider.longitude, rider.latitude]}
          />
        ))}

        {/* Route Polyline */}
        {routeCoordinates && routeCoordinates.length > 0 && (
          <MapboxGL.ShapeSource
            id="routeSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates,
              },
            }}
          >
            <MapboxGL.LineLayer
              id="routeFill"
              style={{ lineWidth: 4, lineColor: '#007AFF' }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>
    </View>
  );
};

export default MapView;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
