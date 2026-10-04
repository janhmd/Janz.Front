document.addEventListener("click", function (event) {
    if (event.target.closest(".menu-toggle")) event.preventDefault();
    document.querySelectorAll(".click-menu[open]").forEach(function (menu) {
        if (!menu.contains(event.target)) menu.removeAttribute("open");
    });
});

document.querySelectorAll(".shot").forEach(function (card) {
    var video = card.querySelector("video");
    if (!video) return;
    card.addEventListener("mouseenter", function () {
        video.play();
    });
    card.addEventListener("mouseleave", function () {
        video.pause();
        video.currentTime = 0;
    });
});

document.querySelectorAll(".grind").forEach(function (menu) {
    var label = menu.querySelector("summary span");
    menu.querySelectorAll(".grind-list button").forEach(function (option) {
        option.addEventListener("click", function () {
            menu.querySelectorAll(".grind-list button").forEach(function (item) {
                item.classList.toggle("is-on", item === option);
            });
            label.textContent = option.textContent;
            menu.removeAttribute("open");
        });
    });
});

document.querySelectorAll(".buy-row").forEach(function (row) {
    var weights = row.querySelectorAll(".weight");
    weights.forEach(function (weight) {
        weight.addEventListener("click", function () {
            weights.forEach(function (item) {
                item.classList.toggle("is-on", item === weight);
            });
        });
    });
});

var promo = document.querySelector(".roast-card");
if (promo) {
    var track = promo.querySelector(".roast-track");
    var slides = promo.querySelectorAll(".roast-slide");
    var dots = promo.querySelectorAll(".dots i");
    var slideIndex = 0;
    function showSlide(next) {
        slideIndex = (next + slides.length) % slides.length;
        track.style.transform = "translateX(" + (-slideIndex * promo.clientWidth) + "px)";
        dots.forEach(function (dot, index) {
            dot.classList.toggle("is-on", index === slideIndex);
        });
    }
    promo.querySelector("[aria-label='Previous']").addEventListener("click", function () {
        showSlide(slideIndex - 1);
    });
    promo.querySelector("[aria-label='Next']").addEventListener("click", function () {
        showSlide(slideIndex + 1);
    });
}
