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

        // Cədvəldə "Delete": sətir silinir
        if (label === "delete") {
            var row = form.closest("tr");
            if (row) row.remove();
            adminFlash("Deleted.");
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
    var rows = document.querySelectorAll(".admin-table tbody tr");
    var title = document.querySelector(".admin-head h1 span");

    function apply() {
        var status = location.hash.replace("#", "");
        var shown = 0;
        rows.forEach(function (row) {
            var badge = row.querySelector(".admin-status");
            var match = !status || (badge && badge.classList.contains("status-" + status));
            row.hidden = !match;
            if (match) shown += 1;
        });
        filter.querySelectorAll("a").forEach(function (link) {
            var target = link.getAttribute("href").split("#")[1] || "";
            link.classList.toggle("is-on", target === status);
        });
        if (title) title.textContent = shown;
    }

    window.addEventListener("hashchange", apply);
    apply();
})();
