const menuButton = document.getElementById("menu-button");
const sideNav = document.getElementById("side-nav");
const closeNavButton = document.getElementById("close-nav");
const navOverlay = document.getElementById("nav-overlay");


function openNavigation() {
    sideNav.classList.add("open");
    navOverlay.classList.add("open");
}


function closeNavigation() {
    sideNav.classList.remove("open");
    navOverlay.classList.remove("open");
}


if (menuButton && sideNav && closeNavButton && navOverlay) {

    menuButton.addEventListener("click", openNavigation);

    closeNavButton.addEventListener("click", closeNavigation);

    navOverlay.addEventListener("click", closeNavigation);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNavigation();
        }
    });

}