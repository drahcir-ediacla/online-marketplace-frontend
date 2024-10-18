import React, { useState, useEffect } from 'react';

const SellerLocationMap = ({ latitude, longitude }) => {
  const [staticMapUrl, setStaticMapUrl] = useState('');
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const center = { lat: latitude, lng: longitude };
  const radiusInMeters = '3000'

  useEffect(() => {
    const createStaticMapUrl = () => {
      const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
      const size = '600x400';
      const zoom = calculateZoomLevel(radiusInMeters);
      const params = [
        `center=${center.lat},${center.lng}`,
        `zoom=${zoom}`,
        `size=${size}`,
        `maptype=roadmap`,
        `key=${apiKey}`,
        `markers=color:red|label:C|${center.lat},${center.lng}`,
        `path=color:0x162F2C|weight:2|fillcolor:0x6c757d|enc:${generateEncodedCirclePath(center, radiusInMeters)}`,
      ];

      return `${baseUrl}?${params.join('&')}`;
    };

    setStaticMapUrl(createStaticMapUrl());
  }, [center, radiusInMeters, apiKey]);

  const calculateZoomLevel = (radius) => {
    const scale = radius / 500; // 500 is an arbitrary distance in meters
    const zoom = Math.floor(16 - Math.log(scale) / Math.log(2));
    return Math.max(1, Math.min(20, zoom)); // Ensure zoom level is between 1 and 20
  };

  const generateEncodedCirclePath = (center, radius) => {
    const circlePoints = [];
    const numPoints = 50;
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const dx = radius * Math.cos(angle) / 111320; // Longitude distance (meters to degrees)
      const dy = radius * Math.sin(angle) / 110540; // Latitude distance (meters to degrees)
      circlePoints.push([center.lat + dy, center.lng + dx]);
    }

    return encodePolyline(circlePoints);
  };

  const encodePolyline = (points) => {
    let encoded = '';
    let prevLat = 0;
    let prevLng = 0;
    points.forEach(point => {
      let lat = Math.round(point[0] * 1e5);
      let lng = Math.round(point[1] * 1e5);
      encoded += encodePoint(lat - prevLat);
      encoded += encodePoint(lng - prevLng);
      prevLat = lat;
      prevLng = lng;
    });
    return encoded;
  };

  const encodePoint = (point) => {
    let encoded = '';
    point = point < 0 ? ~(point << 1) : point << 1;
    while (point >= 0x20) {
      encoded += String.fromCharCode((0x20 | (point & 0x1f)) + 63);
      point >>= 5;
    }
    encoded += String.fromCharCode(point + 63);
    return encoded;
  };



  return (
    <>
      {staticMapUrl ? (
        <img
          src={staticMapUrl}
          alt="Static Google Map"
          style={{ height: 'auto', width: '100%' }}
        />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default SellerLocationMap;
