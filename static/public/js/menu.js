let hamburgerMenu = document.querySelector('.hamburger-menu');
let primaryNavigation = document.querySelector('body > header nav ul');
let overlay = document.querySelector('.overlay');
let outside = document.querySelector('.outside');


// // Open navigation with hamburger menu
// hamburgerMenu.addEventListener('click', () => {
//     console.log("test");
//     primaryNavigation.classList.toggle('open');
//     overlay.classList.toggle('show-overlay');
//     menuOpen = !menuOpen;
//     console.log(menuOpen)
// });

// Close hamburger menu when clicking outside of the menu
window.addEventListener('click', (event) => {   
    if (event.target === hamburgerMenu) {
        console.log("test");
        primaryNavigation.classList.toggle('open');
        overlay.classList.toggle('show-overlay');
        outside.classList.toggle('show-outside');
    }  else if (event.target === outside) {
        primaryNavigation.classList.toggle('open');
        overlay.classList.toggle('show-overlay');    
        outside.classList.toggle('show-outside');
    }
})
