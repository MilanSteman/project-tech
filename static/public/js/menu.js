let hamburgerMenu = document.querySelector('.hamburger-menu');
let primaryNavigation = document.querySelector('body > header nav ul');
let overlay = document.querySelector('.overlay');
let outside = document.querySelector('.outside');

// Function to toggle all classes at once   
toggleClasses = () => {
    primaryNavigation.classList.toggle('open');
    overlay.classList.toggle('show-overlay');
    outside.classList.toggle('show-outside');
}

// Close hamburger menu when clicking outside of the menu
window.addEventListener('click', (event) => {   
    if (event.target === hamburgerMenu) {
        toggleClasses();
    }  else if (event.target === outside) {
        toggleClasses();
    }
});
