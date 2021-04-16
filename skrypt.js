const mymap = L.map("mapid").setView([52, 19], 4);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
  {
    minZoom: 1,
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1
  }
).addTo(mymap);

function tu_jestes() {
  mymap.locate({ watch: false, setView: false });
}
function onLocationFound(e) {
  let radius = e.accuracy;
  L.marker(e.latlng)
    .addTo(mymap)
    .bindPopup("Jesteś w promieniu " + radius.toFixed(0) + " metrów od tego punktu.");
    // .openPopup();
  L.circle(e.latlng, radius).addTo(mymap);
}
function onLocationError(e) {
  alert("Użytkownik nie pozwolił na ujawnienie lokalizacji.");
  // alert("Geolocation error: User denied Geolocation.");
  // alert(e.message);
}
tu_jestes();
mymap.on("locationfound", onLocationFound);
mymap.on("locationerror", onLocationError);

NASA = L.marker([29.558149773930957, -95.08894707446908]).addTo(mymap);
/// NASA = L.marker([29.558149773930957, -95.08894707446908], {title: 'NASA Mission Control Center'}).addTo(mymap);
NASA.bindPopup("NASA Mission Control Center", { autoClose: false });
// NASA.bindTooltip("NASA Mission Control Center").openTooltip();
RKA = L.marker([55.912560343035615, 37.81067284794196]).addTo(mymap);
RKA.bindPopup("RKA Mission Control Center", { autoClose: false });

const ISSIcon1 = L.icon({
  iconUrl: "issv1.png",
  // shadowUrl: 'leaf-shadow.png',
  iconSize: [100, 100], // size of the icon, width x height
  // shadowSize:   [50, 64], // size of the shadow
  iconAnchor: [50, 50] // point of the icon which will correspond to marker's location
  // shadowAnchor: [4, 62],  // the same for the shadow
  // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const ISSIcon2 = L.icon({
  iconUrl: "issv2.png",
  // shadowUrl: 'leaf-shadow.png',
  iconSize: [130, 92], // size of the icon, width x height
  // shadowSize:   [50, 64], // size of the shadow
  iconAnchor: [65, 46] // point of the icon which will correspond to marker's location
  // shadowAnchor: [4, 62],  // the same for the shadow
  // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

let marker = L.marker([52, 19], { icon: ISSIcon1 }).addTo(mymap);
let ikonka = Math.floor(Math.random() * 2) + 1;

zmien_ikonke();

function zmien_ikonke() {
  if (ikonka === 1) {
    ikonka = 2;
    marker.setIcon(ISSIcon2);
  } else {
    ikonka = 1;
    marker.setIcon(ISSIcon1);
  }
}

let swoboda = 1;
zmien_swobode();
function zmien_swobode() {
  if (swoboda === 0) {
    swoboda = 1;
    document.getElementById("swoboda").textContent = "Śledź ISS: wyłączone";
    document.getElementById("swoboda").style.color = "green";
  } else {
    swoboda = 0;
    document.getElementById("swoboda").textContent = "Śledź ISS: włączone";
    document.getElementById("swoboda").style.color = "red";
  }
}

// na wypadek, gdyby API nie działał:
document.getElementById("lat").textContent = "brak danych";
document.getElementById("lon").textContent = "brak danych";
document.getElementById("vel").textContent = "brak danych";
document.getElementById("alt").textContent = "brak danych";

const api_url = "https://api.wheretheiss.at/v1/satellites/25544";
async function getISS() {
  const response = await fetch(api_url);
  const { latitude, longitude, velocity, altitude } = await response.json();
  if (!response.ok) {
    document.getElementById("zerwanie").textContent =
      "Houston, mamy problem. Błąd połączenia. Poczekaj.";
    document.getElementById("ostatnie").textContent =
      "Ostatnie dane, jeśli dostępne:";
  }
  if (response.ok) {
    document.getElementById("zerwanie").textContent = "";
    document.getElementById("ostatnie").textContent = "";
    document.getElementById("lat").innerHTML =
      latitude.toFixed(2) + "<span style='color: white;'>°</span>";
    document.getElementById("lon").innerHTML =
      longitude.toFixed(2) + "<span style='color: white;'>°</span>";
    document.getElementById("vel").innerHTML =
      velocity.toFixed(2) + "<span style='color: white;'> km/h</span>";
    document.getElementById("alt").innerHTML =
      altitude.toFixed(2) + "<span style='color: white;'> km</span>";
    if (swoboda === 0) {
      mymap.setView([latitude, longitude]);
    }
    marker.setLatLng([latitude, longitude]);
  }
  const z = mymap.getZoom();
  document.getElementById("zoom").textContent = z;
  // console.log(swoboda);
}
// console.log("test2");
getISS();
setInterval(getISS, 1500);