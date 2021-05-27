/**
 * Deze functie laat de input van de gebruiker zien bij het uploaden
 * van een profielfoto of -banner.
 */

const banner = document.querySelector(".output-banner");
const inputBanner = document.querySelector("#banner");

const avatar = document.querySelector(".output-avatar");
const inputAvatar = document.querySelector("#avatar");

inputAvatar.addEventListener("change", (e) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    avatar.src = URL.createObjectURL(e.target.files[0]);
});

inputBanner.addEventListener("change", (e) => {
    banner.src = URL.createObjectURL(e.target.files[0]);
});
