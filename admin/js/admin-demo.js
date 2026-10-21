// Janz.Front: admin panelin statik nümunəsi. Formalar heç yerə göndərilmir, yalnız bildiriş göstərilir;
// MVC-də (Areas/Admin) eyni səhifələr API ilə işləyir.

function adminFlash(text, isError) {
    var box = document.querySelector(".admin-flash");
    if (!box) {
        box = document.createElement("p");
        var heading = document.querySelector(".page-heading");
        heading.insertBefore(box, heading.firstChild);
    }
    box.className = "admin-flash " + (isError ? "admin-flash-error" : "admin-flash-ok");
    box.textContent = text;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var button = form.querySelector("[type=submit]");
        var label = button ? button.textContent.trim().toLowerCase() : "";

        // "Delete": cədvəl sətri və ya rəy kartı silinir
        if (label === "delete") {
            var row = form.closest("tr, .admin-review");
            if (row) row.remove();
            var count = document.querySelector(".admin-head h1 span:not(.admin-status)");
            if (count && /^\d+$/.test(count.textContent)) count.textContent = Math.max(0, Number(count.textContent) - 1);
            adminFlash("Deleted.");
            return;
        }

        // Rəyi gizlətmək / göstərmək
        if (form.hasAttribute("data-review-toggle")) {
            var card = form.closest(".admin-review");
            var badgeReview = card.querySelector(".admin-status");
            var hide = button.textContent.trim() === "Hide";
            badgeReview.textContent = hide ? "Hidden" : "Published";
            badgeReview.className = "admin-status " + (hide ? "status-hidden" : "status-published");
            card.setAttribute("data-filter", card.getAttribute("data-filter").replace(/published|hidden/, hide ? "hidden" : "published"));
            button.textContent = hide ? "Show" : "Hide";
            adminFlash(hide ? "The review is hidden." : "The review is published.");
            return;
        }

        // İstifadəçini bloklamaq / blokdan çıxarmaq: başlıqdakı nişan və düymə dəyişir
        if (form.hasAttribute("data-block")) {
            var badgeUser = document.querySelector("[data-user-status]");
            var blocked = badgeUser.textContent.trim() === "Blocked";
            badgeUser.textContent = blocked ? "Active" : "Blocked";
            badgeUser.className = "admin-status " + (blocked ? "status-active" : "status-blocked");
            button.textContent = blocked ? "Block user" : "Unblock user";
            adminFlash(blocked ? "The user is unblocked." : "The user is blocked.");
            return;
        }

        // Rol
        var role = form.querySelector("select[name=role]");
        if (role) {
            adminFlash("Role changed to " + role.value + ".");
            return;
        }

        // Sifarişin statusu: başlıqdakı nişan da dəyişir
        var select = form.querySelector("select[name=status]");
        if (select) {
            var badge = document.querySelector(".admin-head .admin-status");
            if (badge) {
                badge.textContent = select.value;
                badge.className = "admin-status status-" + select.value.toLowerCase();
            }
            adminFlash("Status changed to " + select.value + ".");
            return;
        }

        adminFlash("Saved.");
    });
});

// Orders: statusa görə filtr (orders.html#shipped)
(function () {
    var filter = document.querySelector(".admin-filter");
    if (!filter) return;
    var rows = document.querySelectorAll(".admin-table tbody tr, .admin-review");
    var title = document.querySelector(".admin-head h1 span");
    var emptyBox = document.querySelector(".admin-reviews + .admin-empty");

    function apply() {
        var status = location.hash.replace("#", "");
        var shown = 0;
        rows.forEach(function (row) {
            var badge = row.querySelector(".admin-status");
            var tags = (row.getAttribute("data-filter") || "").split(" ");
            var match = !status || tags.indexOf(status) >= 0 || (badge && badge.classList.contains("status-" + status));
            row.hidden = !match;
            if (match) shown += 1;
        });
        filter.querySelectorAll("a").forEach(function (link) {
            var target = link.getAttribute("href").split("#")[1] || "";
            link.classList.toggle("is-on", target === status);
        });
        if (title) title.textContent = shown;
        if (emptyBox) emptyBox.hidden = shown > 0;
    }

    window.addEventListener("hashchange", apply);
    apply();
})();

// Axtarış (Users): ad və ya email-ə görə sətirləri süzür
(function () {
    var input = document.querySelector(".admin-search input");
    if (!input) return;
    var rows = document.querySelectorAll(".admin-table tbody tr");
    var empty = document.querySelector(".admin-card .admin-empty");

    input.addEventListener("input", function () {
        var text = input.value.trim().toLowerCase();
        var shown = 0;
        rows.forEach(function (row) {
            var match = row.textContent.toLowerCase().indexOf(text) >= 0;
            row.classList.toggle("is-searched-out", !match);
            if (match && !row.hidden) shown += 1;
        });
        if (empty) empty.hidden = shown > 0;
    });
})();
