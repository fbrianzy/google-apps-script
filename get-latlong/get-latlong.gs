function GetLatitude(address) {
  if (address === "") {
    return "";
  }
  const geocoder = Maps.newGeocoder();
  const location = geocoder.geocode(address);
  
  if (location.status === "OK") {
    const lat = location.results[0].geometry.location.lat;
    return lat;
  } else {
    return "Not Found";
  }
}

function GetLongitude(address) {
  if (address === "") {
    return "";
  }
  const geocoder = Maps.newGeocoder();
  const location = geocoder.geocode(address);
  
  if (location.status === "OK") {
    const lng = location.results[0].geometry.location.lng;
    return lng;
  } else {
    return "Not Found";
  }
}
