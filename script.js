// =====================
// HAMBURGER MENU
// =====================
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");
const navItems  = navLinks.querySelectorAll("a");

hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});

navItems.forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
    });
});

document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
    }
});


// =====================
// TYPING ROLE ANIMATION
// =====================
const roles = [
    "Backend Developer",
    "Full Stack Developer",
    "Java Developer",
    "Software Engineer"
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
const roleElement = document.getElementById("role");

function typeEffect() {
    const currentRole = roles[roleIndex];
    if (!isDeleting) {
        roleElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentRole.length) {
            setTimeout(() => { isDeleting = true; }, 1200);
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


// =====================
// NAVBAR SCROLL COLOR
// =====================
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".nav-bar");
    navbar.classList.toggle("scrolled", window.scrollY > 50);
});


// =====================
// REVEAL ON SCROLL
// =====================
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
    reveals.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();


// =====================
// PROJECT CAROUSEL
// Zoom-fade · 3 visible (left | center | right)
// Hidden cards fade + scale down out of sight
// =====================
(function () {
    const wrapper       = document.querySelector(".carousel-wrapper");
    const inner         = document.querySelector(".project-inner");
    const prevBtn       = document.querySelector(".carousel-btn.prev");
    const nextBtn       = document.querySelector(".carousel-btn.next");
    const dotsContainer = document.querySelector(".carousel-dots");

    if (!wrapper || !inner || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = Array.from(inner.querySelectorAll(".project"));
    const total = cards.length;
    if (total === 0) return;

    let current   = 0;
    let animating = false;

    // ── Build dots ─────────────────────────────────────────────────
    cards.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => { if (!animating) jumpTo(i); });
        dotsContainer.appendChild(dot);
    });

    // ── Slot geometry ──────────────────────────────────────────────
    // rel: -1 = left, 0 = center, +1 = right
    function getSlotStyle(rel) {
        const W = wrapper.offsetWidth;
        const H = wrapper.offsetHeight;

        const cW = rel === 0 ? Math.min(W * 0.34, 280) : Math.min(W * 0.26, 210);
        const cH = rel === 0 ? Math.min(H * 0.85, 240) : Math.min(H * 0.70, 195);

        const gap     = W * 0.04;
        const centerX = W / 2 - cW / 2;
        const centerW = Math.min(W * 0.34, 280);

        let left;
        if      (rel ===  0) left = centerX;
        else if (rel === -1) left = centerX - cW - gap;
        else                 left = W / 2 + centerW / 2 + gap;

        const top     = H / 2 - cH / 2;
        const opacity = rel === 0 ? 1 : 0.45;
        const scale   = rel === 0 ? 1 : 0.88;
        const zIndex  = rel === 0 ? 5 : 3;
        const shadow  = rel === 0 ? "0 20px 55px rgba(0,0,0,0.65)" : "none";

        return { left, top, width: cW, height: cH, opacity, scale, zIndex, shadow };
    }

    // ── Show a card in a slot ──────────────────────────────────────
    function showCard(card, rel, instant) {
        const s = getSlotStyle(rel);
        if (instant) { card.style.transition = "none"; }

        card.style.left          = s.left   + "px";
        card.style.top           = s.top    + "px";
        card.style.width         = s.width  + "px";
        card.style.height        = s.height + "px";
        card.style.opacity       = s.opacity;
        card.style.transform     = `scale(${s.scale})`;
        card.style.zIndex        = s.zIndex;
        card.style.boxShadow     = s.shadow;
        card.style.pointerEvents = "auto";

        if (instant) { card.offsetHeight; card.style.transition = ""; }
    }

    // ── Hide a card (zoom-fade to center, scale down + fade out) ──
    function hideCard(card, instant) {
        const W = wrapper.offsetWidth;
        const H = wrapper.offsetHeight;
        if (instant) { card.style.transition = "none"; }

        card.style.left          = (W / 2 - 100) + "px";
        card.style.top           = (H / 2 - 90)  + "px";
        card.style.width         = "200px";
        card.style.height        = "180px";
        card.style.opacity       = "0";
        card.style.transform     = "scale(0.55)";
        card.style.zIndex        = "1";
        card.style.boxShadow     = "none";
        card.style.pointerEvents = "none";

        if (instant) { card.offsetHeight; card.style.transition = ""; }
    }

    // ── Render ─────────────────────────────────────────────────────
    function render(instant) {
        const visibleIndices = [-1, 0, 1].map(rel =>
            ((current + rel) % total + total) % total
        );

        // hide cards not in the visible 3
        cards.forEach((c, i) => {
            if (!visibleIndices.includes(i)) {
                hideCard(c, instant);
            }
        });

        // show the 3 visible cards in their slots
        [-1, 0, 1].forEach(rel => {
            const idx = ((current + rel) % total + total) % total;
            showCard(cards[idx], rel, instant);
        });

        // sync dots
        dotsContainer.querySelectorAll(".dot").forEach((d, i) =>
            d.classList.toggle("active", i === current)
        );
    }

    // ── Slide ──────────────────────────────────────────────────────
    function slide(dir) {
        if (animating) return;
        animating = true;
        current   = ((current + dir) % total + total) % total;
        render(false);
        setTimeout(() => { animating = false; }, 560);
    }

    // ── Jump (dot) ─────────────────────────────────────────────────
    function jumpTo(idx) {
        if (animating) return;
        animating = true;
        current   = idx;
        render(false);
        setTimeout(() => { animating = false; }, 560);
    }

    // ── Init ───────────────────────────────────────────────────────
    cards.forEach(c => hideCard(c, true));
    render(true);

    // ── Events ─────────────────────────────────────────────────────
    prevBtn.addEventListener("click", (e) => { e.stopPropagation(); slide(-1); });
    nextBtn.addEventListener("click", (e) => { e.stopPropagation(); slide(+1); });

    document.addEventListener("keydown", (e) => {
        const rect = document.getElementById("projects").getBoundingClientRect();
        if (rect.top >= window.innerHeight || rect.bottom <= 0) return;
        if (e.key === "ArrowLeft")  slide(-1);
        if (e.key === "ArrowRight") slide(+1);
    });

    let touchStartX = 0;
    inner.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    inner.addEventListener("touchend",   e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 45) diff > 0 ? slide(+1) : slide(-1);
    });

    window.addEventListener("resize", () => render(true));
})();