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

        // Mövzu / seriya əlavə etmək (Journal)
        if (form.hasAttribute("data-add-chip")) {
            var list = form.parentNode.querySelector("[data-chip-list]");
            var value = form.querySelector("input").value.trim();
            var chip = document.createElement("span");
            chip.className = "admin-tag";
            chip.innerHTML = '<span></span><button type="button" data-remove-chip>×</button>';
            chip.firstChild.textContent = value;
            chip.lastChild.setAttribute("aria-label", "Remove " + value);
            list.appendChild(chip);
            form.reset();
            adminFlash(value + " is added.");
            return;
        }

        // Yeni rol: kartlara əlavə olunur
        if (form.hasAttribute("data-new-role")) {
            var name = form.querySelector("input[name=name]").value.trim();
            var card = document.createElement("article");
            card.className = "admin-role";
            card.innerHTML = '<div class="admin-role-top"><h3></h3><span class="admin-count">0</span></div><p>New role. Tick its permissions below.</p>';
            card.querySelector("h3").textContent = name;
            document.querySelector(".admin-roles").appendChild(card);
            form.reset();
            adminFlash("Role " + name + " is added.");
            return;
        }

        // Balans: məbləğ balansa əlavə olunur (mənfi isə çıxılır), sətir tarixçəyə düşür
        if (form.hasAttribute("data-balance-form")) {
            var amount = parseFloat(form.amount.value);
            var balanceBox = document.querySelector("[data-balance]");
            var total = parseFloat(balanceBox.textContent.replace("₼", "")) + amount;
            balanceBox.textContent = "₼" + total.toFixed(2);
            var line = document.createElement("li");
            line.innerHTML = "<span></span><span>today</span><b></b>";
            line.children[0].textContent = form.reason.value;
            line.children[2].textContent = (amount >= 0 ? "+₼" : "−₼") + Math.abs(amount).toFixed(2);
            line.children[2].className = amount >= 0 ? "is-plus" : "is-minus";
            document.querySelector("[data-ledger]").prepend(line);
            form.reset();
            adminFlash("The balance is now ₼" + total.toFixed(2) + ".");
            return;
        }

        // Community titulu
        var title = form.querySelector("select[name=title]");
        if (title) {
            adminFlash("Community title changed to " + title.value + ".");
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

// Kupon kodu: böyük hərflə yazılır, "Generate" təsadüfi kod yaradır
document.querySelectorAll("input[data-upper]").forEach(function (input) {
    input.addEventListener("input", function () {
        input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    });
});

document.querySelectorAll("[data-generate]").forEach(function (button) {
    button.addEventListener("click", function () {
        var letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var code = "JANZ";
        for (var i = 0; i < 6; i += 1) code += letters[Math.floor(Math.random() * letters.length)];
        button.parentNode.querySelector("input").value = code;
    });
});

// Məhsul şəkilləri: əsas şəkli seçmək, silmək, yenilərini əlavə etmək (yalnız səhifədə)
(function () {
    var box = document.querySelector("[data-thumbs]");
    if (!box) return;

    function markMain(figure) {
        box.querySelectorAll(".admin-thumb").forEach(function (item) {
            item.classList.toggle("is-main", item === figure);
            item.querySelector("[data-main]").textContent = item === figure ? "Main" : "Make main";
        });
    }

    box.addEventListener("click", function (event) {
        var figure = event.target.closest(".admin-thumb");
        if (!figure) return;
        if (event.target.closest("[data-main]")) {
            box.prepend(figure);
            markMain(figure);
        }
        if (event.target.closest("[data-remove-image]")) {
            var wasMain = figure.classList.contains("is-main");
            figure.remove();
            var first = box.querySelector(".admin-thumb");
            if (wasMain && first) markMain(first);
        }
    });

    document.querySelector("[data-image-input]").addEventListener("change", function (event) {
        Array.prototype.forEach.call(event.target.files, function (file) {
            var figure = document.createElement("figure");
            figure.className = "admin-thumb";
            figure.innerHTML = '<img alt="" /><figcaption><button type="button" class="admin-btn-sm" data-main>Make main</button>' +
                '<button type="button" class="admin-btn-sm is-danger" data-remove-image aria-label="Remove image"><i class="bi bi-trash"></i></button></figcaption>';
            figure.querySelector("img").src = URL.createObjectURL(file);
            box.appendChild(figure);
        });
        var first = box.querySelector(".admin-thumb");
        if (first && !box.querySelector(".admin-thumb.is-main")) markMain(first);
        event.target.value = "";
    });
})();

// Mövzu / seriya silmək
document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-remove-chip]");
    if (!button) return;
    button.closest(".admin-tag").remove();
});

// Məqalənin ünvanı başlıqdan yaranır (istifadəçi özü dəyişməyibsə)
(function () {
    var source = document.querySelector("[data-slug-source]");
    var slug = document.querySelector("[data-slug]");
    var preview = document.querySelector("[data-slug-preview]");
    if (!source || !slug) return;
    var touched = slug.value !== "";

    function make(text) {
        return text.toLowerCase()
            .replace(/ə/g, "e").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ü/g, "u")
            .replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g")
            .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    source.addEventListener("input", function () {
        if (touched) return;
        slug.value = make(source.value);
        preview.textContent = slug.value || "...";
    });

    slug.addEventListener("input", function () {
        touched = true;
        slug.value = make(slug.value);
        preview.textContent = slug.value || "...";
    });
})();
