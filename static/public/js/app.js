/* eslint-disable prettier/prettier */
const banner = document.querySelector('.output-banner');
const inputBanner = document.querySelector('#banner')

inputBanner.addEventListener('change', (e) =>{
    banner.src = URL.createObjectURL(e.target.files[0]);
})
