
export const geocodeLatLng = async (lat: number, lng: number): Promise<string> => {

  const geocoder = new google.maps.Geocoder();
  const latlng = { lat, lng };

  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        resolve(results[0].formatted_address);
      } else {
        reject(new Error("Geocoding failed"));
      }
    });
  });
};
