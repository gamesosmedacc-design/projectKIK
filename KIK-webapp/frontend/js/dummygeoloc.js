navigator.geolocation.getCurrentPosition(
(position) => {
    console.log("lintang", position.coords.latitude);
    console.log("bujur", position.coords.longitude);
    console.log("posisimu", position.coords.accuracy, "meter");

},
(error) => {
    console.log("cannot reach your location", error.message);
}
);