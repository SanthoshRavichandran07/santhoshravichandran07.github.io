const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const navItems = navLinks.querySelectorAll("a");

// Toggle menu
hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});

// Close menu on link click
navItems.forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
    });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
    }
});




// Animation of roles in about section
const roles = [
    "Backend Developer",
    "Full Stack Developer",
    "Java Developer",
    "Software Engineer"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const roleElement = document.getElementById("role");

function typeEffect() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        roleElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
            setTimeout(() => isDeleting = true, 1200);
        }
    } else {
        roleElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typeEffect, isDeleting ? 60 : 100);
}

typeEffect();




//nav bar bg color change while scroll
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".nav-bar");
    navbar.classList.toggle("scrolled", window.scrollY > 50);
});

//reveal 

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;

        if (revealTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);