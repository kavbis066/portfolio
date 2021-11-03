const navToggler = document.querySelector('.nav-toggler');
const navMenu = document.querySelector('.navbar ul');
const navLinks = document.querySelectorAll('.navbar a');

// Load all eventListeners
allEventListeners();

// functions of all events
function allEventListeners() {
    navToggler.addEventListener('click', togglerClick);
    navLinks.forEach(link => 
        link.addEventListener('click', navLinkClick));
}

function togglerClick() {
    navToggler.classList.toggle('toggler-open');
    navMenu.classList.toggle('open');
}

function navLinkClick() {
    if(navMenu.classList.contains('open')) {
        navToggler.click();
    }
}