(function () {
    var root = document.documentElement;
    if (localStorage.getItem("janz-theme") === "day") root.classList.add("theme-day");
})();

var authOverlay = document.createElement("div");
authOverlay.className = "auth-overlay";
authOverlay.innerHTML =
    '<div class="auth-modal" role="dialog" aria-labelledby="auth-title" aria-modal="true">' +
        "<h2 id=\"auth-title\">Sign in</h2>" +
        '<form>' +
            '<label class="entry-field"><input type="email" name="email" placeholder="Email" autocomplete="email" required /></label>' +
            '<label class="entry-field"><input type="password" name="password" placeholder="Password" autocomplete="current-password" required /><button type="button" class="entry-eye" aria-label="Show password"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.6-6.5 9-6.5S21 12 21 12s-3.6 6.5-9 6.5S3 12 3 12z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button></label>' +
            '<button type="submit" class="account-signin">Sign in</button>' +
            '<a class="entry-forgot" href="#">Forgot password?</a>' +
            '<label class="entry-remember"><input type="checkbox" name="remember" /> Remember password</label>' +
        "</form>" +
    "</div>";
document.body.appendChild(authOverlay);

function openAuth() {
    authOverlay.classList.add("is-on");
    document.querySelectorAll(".click-menu[open]").forEach(function (menu) {
        menu.removeAttribute("open");
    });
}

function closeAuth() {
    authOverlay.classList.remove("is-on");
}

var followOverlay = document.querySelector(".follow-overlay");
var followTitle = followOverlay ? followOverlay.querySelector("#follow-title") : null;
var followSearch = followOverlay ? followOverlay.querySelector(".follow-search input") : null;
var followCopy = {
    subscribers: { title: "My subscribers", search: "Search subscribers" },
    subscriptions: { title: "My subscriptions", search: "Search subscriptions" }
};

function openFollow(kind) {
    if (!followOverlay) return;
    var copy = followCopy[kind] || followCopy.subscribers;
    if (followTitle) followTitle.textContent = copy.title;
    if (followSearch) {
        followSearch.placeholder = copy.search;
        followSearch.value = "";
    }
    followOverlay.classList.add("is-on");
    if (followSearch) followSearch.focus();
}

function closeFollow() {
    if (followOverlay) followOverlay.classList.remove("is-on");
}

if (followOverlay) {
    followOverlay.addEventListener("click", function (event) {
        if (event.target === followOverlay) closeFollow();
    });
}

document.querySelectorAll("[data-follow]").forEach(function (button) {
    button.addEventListener("click", function () {
        openFollow(button.getAttribute("data-follow"));
    });
});

var editOverlay = document.querySelector(".edit-overlay");
var editForm = editOverlay ? editOverlay.querySelector(".edit-modal") : null;

function closeEdit() {
    if (!editOverlay) return;
    editOverlay.classList.remove("is-on");
    editOverlay.querySelectorAll(".edit-fold").forEach(function (fold) {
        fold.classList.remove("is-on");
        var body = fold.querySelector(".edit-fold-body");
        if (body) body.hidden = true;
    });
}

function openEdit() {
    if (!editOverlay || !editForm) return;
    var name = document.querySelector(".details-name");
    var phone = document.querySelector(".details-phone");
    var email = document.querySelector(".details-email");
    if (name) editForm.fullname.value = name.textContent.trim();
    if (email) editForm.email.value = email.textContent.trim();
    if (phone) {
        var raw = phone.textContent.trim();
        var code = editForm.phoneCode.value;
        if (raw.indexOf("+994") === 0) code = "+994";
        else if (raw.indexOf("+90") === 0) code = "+90";
        else if (raw.indexOf("+7") === 0) code = "+7";
        editForm.phoneCode.value = code;
        editForm.phone.value = raw.replace(code, "").trim();
    }
    editOverlay.classList.add("is-on");
}

if (editOverlay && editForm) {
    document.querySelectorAll(".details-edit").forEach(function (button) {
        button.addEventListener("click", openEdit);
    });
    editOverlay.addEventListener("click", function (event) {
        if (event.target === editOverlay) closeEdit();
    });
    editForm.querySelector(".edit-cancel").addEventListener("click", closeEdit);
    editForm.querySelector(".edit-phone-clear").addEventListener("click", function () {
        editForm.phone.value = "";
        editForm.phone.focus();
    });
    editForm.querySelector(".edit-pass-change").addEventListener("click", function () {
        var field = editForm.password;
        field.readOnly = false;
        field.value = "";
        field.focus();
    });
    editForm.querySelectorAll(".edit-fold-toggle").forEach(function (button) {
        button.addEventListener("click", function () {
            var fold = button.parentElement;
            var body = fold.querySelector(".edit-fold-body");
            var open = fold.classList.toggle("is-on");
            body.hidden = !open;
        });
    });
    editForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var name = document.querySelector(".details-name");
        var phone = document.querySelector(".details-phone");
        var email = document.querySelector(".details-email");
        if (name) name.textContent = editForm.fullname.value.trim() || name.textContent;
        if (phone) {
            var number = editForm.phone.value.trim();
            phone.textContent = number ? editForm.phoneCode.value + " " + number : editForm.phoneCode.value;
        }
        if (email) email.textContent = editForm.email.value.trim() || email.textContent;
        closeEdit();
    });
}

var addressOverlay = document.querySelector(".address-overlay");
var addressForm = addressOverlay ? addressOverlay.querySelector(".edit-modal") : null;
var addressList = document.querySelector(".details-address-list");

function closeAddress() {
    if (!addressOverlay) return;
    addressOverlay.classList.remove("is-on");
    if (addressForm) addressForm.reset();
}

function openAddress() {
    if (!addressOverlay) return;
    if (addressForm) addressForm.reset();
    addressOverlay.classList.add("is-on");
    var first = addressForm && addressForm.title;
    if (first) first.focus();
}

if (addressOverlay && addressForm) {
    document.querySelectorAll(".details-add:not(.details-add-card)").forEach(function (button) {
        button.addEventListener("click", openAddress);
    });
    addressOverlay.addEventListener("click", function (event) {
        if (event.target === addressOverlay) closeAddress();
    });
    addressForm.querySelector(".edit-cancel").addEventListener("click", closeAddress);
    addressForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var title = addressForm.title.value.trim() || "Address";
        var city = addressForm.city.value.trim();
        var street = addressForm.street.value.trim();
        var apt = addressForm.apt.value.trim();
        var post = addressForm.postcode.value.trim();
        var line = [street, apt, city, post].filter(Boolean).join(", ");
        if (!line) return;
        if (addressForm.primary.checked && addressList) {
            addressList.querySelectorAll("em").forEach(function (mark) { mark.remove(); });
        }
        var card = document.createElement("div");
        card.className = "details-address-card";
        var head = document.createElement("strong");
        head.textContent = title;
        var text = document.createElement("p");
        text.textContent = line;
        card.appendChild(head);
        card.appendChild(text);
        if (addressForm.primary.checked) {
            var mark = document.createElement("em");
            mark.textContent = "Primary";
            card.appendChild(mark);
        }
        if (addressList) addressList.appendChild(card);
        closeAddress();
    });
}

var cardOverlay = document.querySelector(".card-overlay");
var cardForm = cardOverlay ? cardOverlay.querySelector(".edit-modal") : null;
var cardList = document.querySelector(".details-card-list");

function closeCard() {
    if (!cardOverlay) return;
    cardOverlay.classList.remove("is-on");
    if (cardForm) cardForm.reset();
}

function openCard() {
    if (!cardOverlay) return;
    if (cardForm) cardForm.reset();
    cardOverlay.classList.add("is-on");
    if (cardForm && cardForm.holder) cardForm.holder.focus();
}

if (cardOverlay && cardForm) {
    document.querySelectorAll(".details-add-card").forEach(function (button) {
        button.addEventListener("click", openCard);
    });
    cardOverlay.addEventListener("click", function (event) {
        if (event.target === cardOverlay) closeCard();
    });
    cardForm.querySelector(".edit-cancel").addEventListener("click", closeCard);
    cardForm.number.addEventListener("input", function () {
        var digits = cardForm.number.value.replace(/\D/g, "").slice(0, 16);
        cardForm.number.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    });
    cardForm.expiry.addEventListener("input", function () {
        var digits = cardForm.expiry.value.replace(/\D/g, "").slice(0, 4);
        cardForm.expiry.value = digits.length > 2 ? digits.slice(0, 2) + " / " + digits.slice(2) : digits;
    });
    cardForm.cvc.addEventListener("input", function () {
        cardForm.cvc.value = cardForm.cvc.value.replace(/\D/g, "").slice(0, 4);
    });
    cardForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var digits = cardForm.number.value.replace(/\D/g, "");
        if (digits.length < 16) return;
        var last = digits.slice(-4);
        var holder = cardForm.holder.value.trim() || "Card";
        var expiry = cardForm.expiry.value.trim();
        if (cardForm.primary.checked && cardList) {
            cardList.querySelectorAll("em").forEach(function (mark) { mark.remove(); });
        }
        var item = document.createElement("div");
        item.className = "details-card-item";
        var num = document.createElement("strong");
        num.textContent = "•••• " + last;
        var who = document.createElement("p");
        who.textContent = expiry ? holder + " · " + expiry : holder;
        item.appendChild(num);
        item.appendChild(who);
        if (cardForm.primary.checked) {
            var mark = document.createElement("em");
            mark.textContent = "Primary";
            item.appendChild(mark);
        }
        if (cardList) cardList.appendChild(item);
        closeCard();
    });
}

var topupOverlay = document.querySelector(".topup-overlay");
var topupForm = topupOverlay ? topupOverlay.querySelector(".topup-modal") : null;
var topupKind = "money";

function syncTopupLabel() {
    if (!topupForm) return;
    var mark = topupForm.querySelector(".topup-submit-sum");
    if (!mark) return;
    var add = parseFloat(topupForm.amount.value);
    mark.textContent = topupKind === "money" && add > 0 ? add + "₼" : "";
}

function closeTopup() {
    if (!topupOverlay) return;
    topupOverlay.classList.remove("is-on");
}

function openTopup() {
    if (!topupOverlay || !topupForm) return;
    topupForm.reset();
    topupForm.agree.checked = true;
    topupKind = "money";
    topupForm.querySelectorAll(".topup-tabs button").forEach(function (button) {
        button.classList.toggle("is-on", button.getAttribute("data-topup") === "money");
    });
    topupForm.querySelector(".topup-money").hidden = false;
    topupForm.querySelector(".topup-cert").hidden = true;
    topupOverlay.classList.add("is-on");
    syncTopupLabel();
    if (topupForm.amount) topupForm.amount.focus();
}

function setBalance(value) {
    var sum = document.querySelector(".cabinet-balance-sum strong");
    if (sum) sum.textContent = "Balance " + value + "₼";
}

function readBalance() {
    var sum = document.querySelector(".cabinet-balance-sum strong");
    if (!sum) return 0;
    var n = parseFloat(sum.textContent.replace(/[^\d.]/g, ""));
    return isNaN(n) ? 0 : n;
}

if (topupOverlay && topupForm) {
    document.querySelectorAll(".cabinet-replenish").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            openTopup();
        });
    });
    topupOverlay.addEventListener("click", function (event) {
        if (event.target === topupOverlay) closeTopup();
    });
    topupForm.querySelectorAll(".topup-tabs button").forEach(function (button) {
        button.addEventListener("click", function () {
            topupKind = button.getAttribute("data-topup");
            topupForm.querySelectorAll(".topup-tabs button").forEach(function (tab) {
                tab.classList.toggle("is-on", tab === button);
            });
            topupForm.querySelector(".topup-money").hidden = topupKind !== "money";
            topupForm.querySelector(".topup-cert").hidden = topupKind !== "certificate";
            if (topupKind === "money") topupForm.amount.focus();
            else topupForm.code.focus();
            syncTopupLabel();
        });
    });
    topupForm.amount.addEventListener("input", function () {
        topupForm.amount.value = topupForm.amount.value.replace(/[^\d.,]/g, "").replace(",", ".");
        syncTopupLabel();
    });
    topupForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!topupForm.agree.checked) return;
        if (topupKind === "certificate") {
            if (!topupForm.code.value.trim()) return;
            closeTopup();
            return;
        }
        var add = parseFloat(topupForm.amount.value);
        if (!add || add <= 0) return;
        setBalance(Math.round((readBalance() + add) * 100) / 100);
        closeTopup();
    });
}

var cookOverlay = document.querySelector(".cook-overlay");
var cookForm = cookOverlay ? cookOverlay.querySelector(".cook-modal") : null;
var cookList = document.querySelector(".profile-cook-list");
var cookOther = cookForm ? cookForm.querySelector(".cook-other") : null;
var cookSaved = [];
var cookOtherText = "";

function cookOptionOn(button) {
    return button.classList.contains("is-on");
}

function showCookOther() {
    if (!cookForm || !cookOther) return;
    var other = cookForm.querySelector('.cook-option[data-name="Other"]');
    var on = other && cookOptionOn(other);
    cookOther.hidden = !on;
    if (on) {
        cookForm.other.value = cookOtherText;
        cookForm.other.focus();
    }
}

function fillCookOptions() {
    if (!cookForm) return;
    cookForm.querySelectorAll(".cook-option").forEach(function (button) {
        var name = button.getAttribute("data-name");
        button.classList.toggle("is-on", cookSaved.indexOf(name) !== -1);
    });
    if (cookForm.other) cookForm.other.value = cookOtherText;
    showCookOther();
}

function renderCookList() {
    if (!cookList || !cookForm) return;
    cookList.innerHTML = "";
    cookSaved.forEach(function (name) {
        var option = cookForm.querySelector('.cook-option[data-name="' + name + '"]');
        var icon = option ? option.querySelector("svg") : null;
        var title = name === "Other" && cookOtherText ? cookOtherText : name;
        var card = document.createElement("div");
        card.className = "profile-cook-item";
        if (icon) {
            card.appendChild(icon.cloneNode(true));
        } else {
            var plus = document.createElement("span");
            plus.className = "profile-cook-plus";
            plus.textContent = "+";
            card.appendChild(plus);
        }
        var body = document.createElement("div");
        var strong = document.createElement("strong");
        strong.textContent = title;
        var link = document.createElement("a");
        link.href = "#";
        link.textContent = "Open the guide";
        link.addEventListener("click", function (event) {
            event.preventDefault();
        });
        body.appendChild(strong);
        body.appendChild(link);
        card.appendChild(body);
        cookList.appendChild(card);
    });
}

function closeCook() {
    if (!cookOverlay) return;
    cookOverlay.classList.remove("is-on");
}

function openCook() {
    if (!cookOverlay || !cookForm) return;
    fillCookOptions();
    cookOverlay.classList.add("is-on");
}

if (cookOverlay && cookForm) {
    document.querySelectorAll(".profile-cook-edit").forEach(function (button) {
        button.addEventListener("click", openCook);
    });
    cookOverlay.addEventListener("click", function (event) {
        if (event.target === cookOverlay) closeCook();
    });
    cookForm.querySelector(".edit-cancel").addEventListener("click", closeCook);
    cookForm.querySelectorAll(".cook-option").forEach(function (button) {
        button.addEventListener("click", function () {
            button.classList.toggle("is-on");
            if (button.getAttribute("data-name") === "Other") showCookOther();
        });
    });
    cookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        cookSaved = [];
        cookForm.querySelectorAll(".cook-option.is-on").forEach(function (button) {
            cookSaved.push(button.getAttribute("data-name"));
        });
        cookOtherText = cookForm.other ? cookForm.other.value.trim() : "";
        renderCookList();
        closeCook();
    });
}

var aboutBox = document.querySelector(".profile-about");
var aboutBio = aboutBox ? aboutBox.querySelector(".profile-bio") : null;
var aboutEdit = aboutBox ? aboutBox.querySelector(".profile-edit") : null;
var aboutForm = aboutBox ? aboutBox.querySelector(".profile-bio-form") : null;
var aboutEmpty = "Tell about yourself";

function closeAbout() {
    if (!aboutBox || !aboutForm) return;
    aboutBox.classList.remove("is-on");
    aboutForm.hidden = true;
}

function openAbout() {
    if (!aboutBox || !aboutForm || !aboutBio) return;
    var now = aboutBio.textContent.trim();
    aboutForm.bio.value = now === aboutEmpty ? "" : now;
    aboutBox.classList.add("is-on");
    aboutForm.hidden = false;
    aboutForm.bio.focus();
}

if (aboutBox && aboutForm && aboutEdit) {
    aboutEdit.addEventListener("click", openAbout);
    aboutForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var text = aboutForm.bio.value.trim();
        if (aboutBio) aboutBio.textContent = text || aboutEmpty;
        closeAbout();
    });
}

authOverlay.addEventListener("click", function (event) {
    if (event.target === authOverlay) closeAuth();
});

document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    closeAuth();
    closeFollow();
    closeEdit();
    closeAddress();
    closeCard();
    closeCook();
    closeAbout();
    closeTopup();
    document.querySelectorAll(".search[open], .search-where[open]").forEach(function (menu) {
        menu.removeAttribute("open");
    });
});

authOverlay.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
});

authOverlay.querySelectorAll(".entry-eye").forEach(function (button) {
    button.addEventListener("click", function () {
        var field = button.previousElementSibling;
        var hidden = field.type === "password";
        field.type = hidden ? "text" : "password";
        button.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
    });
});

document.addEventListener("click", function (event) {
    var themeBtn = event.target.closest(".theme-toggle");
    if (themeBtn) {
        var day = document.documentElement.classList.toggle("theme-day");
        localStorage.setItem("janz-theme", day ? "day" : "night");
        themeBtn.setAttribute("aria-label", day ? "Night mode" : "Day mode");
        return;
    }
    var signLink = event.target.closest('a[href="signin.html"]');
    if (signLink) {
        event.preventDefault();
        openAuth();
        return;
    }
    if (event.target.closest(".menu-toggle")) event.preventDefault();
    document.querySelectorAll(".click-menu[open]").forEach(function (menu) {
        if (!menu.contains(event.target)) menu.removeAttribute("open");
    });
    document.querySelectorAll(".search-where[open]").forEach(function (menu) {
        if (!menu.contains(event.target)) menu.removeAttribute("open");
    });
});

document.querySelectorAll(".search").forEach(function (search) {
    var form = search.querySelector(".search-panel");
    var whereLabel = search.querySelector(".search-where > summary");
    var input = search.querySelector("input[name='q']");
    search.addEventListener("toggle", function () {
        if (search.open && input) input.focus();
    });
    search.querySelectorAll(".search-where-list button").forEach(function (option) {
        option.addEventListener("click", function () {
            search.querySelectorAll(".search-where-list button").forEach(function (item) {
                item.classList.toggle("is-on", item === option);
            });
            form.setAttribute("data-where", option.getAttribute("data-where"));
            whereLabel.textContent = option.textContent;
            search.querySelector(".search-where").removeAttribute("open");
        });
    });
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var where = form.getAttribute("data-where") || "catalog.html";
        var query = input.value.trim();
        window.location.href = query ? where + "?q=" + encodeURIComponent(query) : where;
    });
});

document.querySelectorAll(".cabinet-nav").forEach(function (nav) {
    var tabs = nav.querySelectorAll(".cabinet-tab");
    var panes = document.querySelectorAll(".cabinet-pane");
    function showPane(name) {
        tabs.forEach(function (tab) {
            tab.classList.toggle("is-on", tab.getAttribute("data-pane") === name);
        });
        panes.forEach(function (pane) {
            pane.hidden = pane.getAttribute("data-pane") !== name;
        });
    }
    tabs.forEach(function (tab) {
        tab.addEventListener("click", function (event) {
            event.preventDefault();
            var name = tab.getAttribute("data-pane");
            showPane(name);
            if (history.replaceState) {
                history.replaceState(null, "", "#" + name);
            }
        });
    });
    var hash = (location.hash || "").replace("#", "");
    if (hash && nav.querySelector('.cabinet-tab[data-pane="' + hash + '"]')) {
        showPane(hash);
    }
    window.addEventListener("hashchange", function () {
        var next = (location.hash || "").replace("#", "");
        if (next && nav.querySelector('.cabinet-tab[data-pane="' + next + '"]')) {
            showPane(next);
        }
    });
});

document.querySelectorAll(".notice-tabs").forEach(function (tabs) {
    var buttons = tabs.querySelectorAll("button");
    var items = document.querySelectorAll(".notice-list .notice");
    var empty = document.querySelector(".notice-empty");
    function showKind(kind) {
        var visible = 0;
        items.forEach(function (item) {
            var on = kind === "all" || item.getAttribute("data-kind") === kind;
            item.hidden = !on;
            if (on) visible += 1;
        });
        if (empty) empty.hidden = visible > 0;
    }
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            var kind = button.getAttribute("data-kind");
            buttons.forEach(function (item) {
                var on = item === button;
                item.classList.toggle("is-on", on);
                item.setAttribute("aria-pressed", on ? "true" : "false");
            });
            showKind(kind);
        });
    });
});

document.querySelectorAll(".profile-composer").forEach(function (box) {
    var openBtn = box.querySelector(".profile-compose");
    var form = box.querySelector(".profile-post");
    var closeBtn = box.querySelector(".profile-post-close");
    var text = form.querySelector('input[name="text"]');
    function open() {
        box.classList.add("is-on");
        form.hidden = false;
        if (text) text.focus();
    }
    function close() {
        box.classList.remove("is-on");
        form.hidden = true;
        form.classList.remove("has-product");
        form.reset();
        var review = form.querySelector(".profile-review");
        if (review) {
            review.hidden = true;
            review.querySelectorAll(".profile-star").forEach(function (star) {
                star.classList.remove("is-on");
            });
            var brewToggle = review.querySelector(".profile-brew-toggle");
            var more = review.querySelector(".profile-recipe-more");
            var extra = review.querySelector(".profile-recipe-extra");
            if (brewToggle) {
                brewToggle.textContent = "Brewing method";
                brewToggle.style.color = "";
            }
            if (more) more.classList.remove("is-on");
            if (extra) extra.hidden = true;
        }
        box.querySelectorAll(".profile-pick").forEach(function (pick) {
            pick.classList.remove("is-on");
            var drop = pick.querySelector(".profile-pick-drop");
            if (drop) drop.hidden = true;
        });
        var chips = form.querySelector(".profile-tag-chips");
        var tagPick = form.querySelector(".profile-tag-pick");
        var tagDrop = form.querySelector(".profile-tag-drop");
        if (chips) chips.innerHTML = "";
        if (tagPick) tagPick.classList.remove("is-on");
        if (tagDrop) {
            tagDrop.hidden = true;
            tagDrop.querySelectorAll("button").forEach(function (item) { item.hidden = false; });
        }
    }
    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        close();
    });
});

document.querySelectorAll(".profile-pick").forEach(function (pick) {
    var form = pick.closest(".profile-post");
    var search = pick.querySelector(".profile-pick-search");
    var drop = pick.querySelector(".profile-pick-drop");
    var hidden = pick.querySelector('input[name="product"]');
    var items = pick.querySelectorAll(".profile-pick-list button");
    var review = form ? form.querySelector(".profile-review") : null;
    var reviewImg = review ? review.querySelector(".profile-review-img") : null;
    var reviewName = review ? review.querySelector(".profile-review-name") : null;
    var reviewClear = review ? review.querySelector(".profile-review-clear") : null;
    function filter() {
        var q = search.value.trim().toLowerCase();
        items.forEach(function (item) {
            var name = (item.getAttribute("data-name") || "").toLowerCase();
            item.hidden = q !== "" && name.indexOf(q) === -1;
        });
    }
    function openPick() {
        pick.classList.add("is-on");
        drop.hidden = false;
    }
    function closePick() {
        pick.classList.remove("is-on");
        drop.hidden = true;
        if (hidden.value) {
            search.value = hidden.value;
            items.forEach(function (item) { item.hidden = false; });
            return;
        }
        search.value = "";
        filter();
    }
    function clearProduct() {
        hidden.value = "";
        search.value = "";
        items.forEach(function (item) { item.hidden = false; });
        if (form) form.classList.remove("has-product");
        if (review) review.hidden = true;
        if (reviewImg) reviewImg.removeAttribute("src");
        if (reviewName) reviewName.textContent = "";
        if (review) {
            var rating = review.querySelector('input[name="rating"]');
            var brew = review.querySelector('input[name="brew"]');
            var recipe = review.querySelector('input[name="recipe"]');
            var toggle = review.querySelector(".profile-brew-toggle");
            var extra = review.querySelector(".profile-recipe-extra");
            var more = review.querySelector(".profile-recipe-more");
            if (rating) rating.value = "";
            if (brew) brew.value = "";
            if (recipe) recipe.value = "";
            if (toggle) toggle.textContent = "Brewing method";
            review.querySelectorAll(".profile-star").forEach(function (star) {
                star.classList.remove("is-on");
            });
            review.querySelectorAll(".profile-recipe-extra input").forEach(function (field) {
                field.value = "";
            });
            if (extra) extra.hidden = true;
            if (more) more.classList.remove("is-on");
        }
        closePick();
    }
    search.addEventListener("focus", openPick);
    search.addEventListener("pointerdown", function (event) {
        event.stopPropagation();
        openPick();
    });
    search.addEventListener("input", function () {
        hidden.value = "";
        openPick();
        filter();
    });
    search.addEventListener("keydown", function (event) {
        if (event.key === "Enter") event.preventDefault();
    });
    items.forEach(function (item) {
        item.addEventListener("click", function () {
            var name = item.getAttribute("data-name") || "";
            var src = item.getAttribute("data-img") || "";
            hidden.value = name;
            search.value = name;
            items.forEach(function (row) { row.hidden = false; });
            if (reviewImg) reviewImg.src = src;
            if (reviewName) reviewName.textContent = name;
            if (review) review.hidden = false;
            if (form) form.classList.add("has-product");
            closePick();
        });
    });
    if (reviewClear) reviewClear.addEventListener("click", clearProduct);
    document.addEventListener("pointerdown", function (event) {
        if (!pick.contains(event.target)) closePick();
    });
});

document.querySelectorAll(".profile-review").forEach(function (review) {
    var stars = review.querySelectorAll(".profile-star");
    var rating = review.querySelector('input[name="rating"]');
    var brewPick = review.querySelector(".profile-brew-pick");
    var brewToggle = review.querySelector(".profile-brew-toggle");
    var brewDrop = review.querySelector(".profile-brew-drop");
    var brewHidden = review.querySelector('input[name="brew"]');
    var more = review.querySelector(".profile-recipe-more");
    var extra = review.querySelector(".profile-recipe-extra");
    stars.forEach(function (star) {
        star.addEventListener("click", function () {
            var value = Number(star.getAttribute("data-star") || 0);
            if (rating) rating.value = String(value);
            stars.forEach(function (item) {
                item.classList.toggle("is-on", Number(item.getAttribute("data-star") || 0) <= value);
            });
        });
    });
    function closeBrew() {
        if (!brewPick) return;
        brewPick.classList.remove("is-on");
        if (brewDrop) brewDrop.hidden = true;
    }
    if (brewToggle && brewDrop) {
        brewToggle.addEventListener("click", function (event) {
            event.stopPropagation();
            var open = brewPick.classList.toggle("is-on");
            brewDrop.hidden = !open;
        });
        brewDrop.querySelectorAll("button").forEach(function (item) {
            item.addEventListener("click", function () {
                var name = item.getAttribute("data-name") || "";
                if (brewHidden) brewHidden.value = name;
                brewToggle.textContent = name;
                brewToggle.style.color = "inherit";
                closeBrew();
            });
        });
        document.addEventListener("pointerdown", function (event) {
            if (!brewPick.contains(event.target)) closeBrew();
        });
    }
    if (more && extra) {
        more.addEventListener("click", function () {
            var open = extra.hidden;
            extra.hidden = !open;
            more.classList.toggle("is-on", open);
        });
    }
});

document.querySelectorAll(".wish-tabs").forEach(function (tabs) {
    var buttons = tabs.querySelectorAll("button");
    var panes = document.querySelectorAll(".wish-pane");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            buttons.forEach(function (item) {
                var on = item === button;
                item.classList.toggle("is-on", on);
                item.setAttribute("aria-pressed", on ? "true" : "false");
            });
            panes.forEach(function (pane) {
                pane.hidden = pane.getAttribute("data-pane") !== button.getAttribute("data-pane");
            });
        });
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

var cartKey = "janz-cart";

function readCart() {
    try {
        var items = JSON.parse(localStorage.getItem(cartKey) || "[]");
        return Array.isArray(items) ? items : [];
    } catch (error) {
        return [];
    }
}

function writeCart(items) {
    try {
        localStorage.setItem(cartKey, JSON.stringify(items));
    } catch (error) {}
    document.dispatchEvent(new CustomEvent("janz-cart-change"));
}

function readCartCount() {
    return readCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
}

function money(value) {
    return "₼" + value.toFixed(2);
}

function priceOf(element) {
    return element ? parseFloat(element.textContent.replace(/[^0-9.]/g, "")) || 0 : 0;
}

function productFromButton(button) {
    var inCard = button.closest("article, .product");
    var card = inCard || button.closest(".coffee-buy") || document.body;
    var title = inCard ? card.querySelector("h3") : document.querySelector("h1");
    var photo = inCard ? card.querySelector(".product-photo") : document.querySelector(".gallery-photo");
    var link = card.querySelector(".product-link");
    var weights = [];
    var weight = 0;
    card.querySelectorAll(".weight").forEach(function (item, index) {
        var off = item.querySelector("small");
        weights.push({ label: item.firstChild.textContent.trim(), off: off ? off.textContent : "" });
        if (item.classList.contains("is-on")) weight = index;
    });
    var grinds = [];
    var grind = "";
    card.querySelectorAll(".grind-list button").forEach(function (item) {
        grinds.push(item.textContent.trim());
        if (item.classList.contains("is-on")) grind = item.textContent.trim();
    });
    var oldPrice = priceOf(button.querySelector("s"));
    return {
        name: title ? title.textContent.trim() : "Coffee",
        link: link ? link.getAttribute("href") : "product.html",
        photo: photo ? photo.getAttribute("src") : "",
        price: priceOf(button.querySelector("strong")) || priceOf(button),
        oldPrice: oldPrice,
        weights: weights,
        weight: weight,
        grinds: grinds,
        grind: grind || grinds[0] || "",
        qty: 1
    };
}

function sameLine(a, b) {
    return a.name === b.name && a.weight === b.weight && a.grind === b.grind;
}

function addToCart(product) {
    var items = readCart();
    var found = items.filter(function (item) { return sameLine(item, product); })[0];
    if (found) found.qty += 1;
    else items.push(product);
    writeCart(items);
}

function showCartCount(bump) {
    var count = readCartCount();
    document.querySelectorAll(".cart-link").forEach(function (link) {
        var label = link.querySelector("span");
        if (label) label.textContent = count + " pcs";
        link.setAttribute("aria-label", "Cart, " + count + (count === 1 ? " item" : " items"));
        var badge = link.querySelector(".icon-count");
        if (!badge) {
            badge = document.createElement("b");
            badge.className = "icon-count";
            link.appendChild(badge);
        }
        if (bump && badge.textContent !== String(count)) {
            badge.classList.remove("is-bump");
            void badge.offsetWidth;
            badge.classList.add("is-bump");
        }
        badge.textContent = count;
        badge.hidden = count === 0;
    });
}

function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

var trashIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13M10.5 11v5.5M13.5 11v5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function renderMiniCart() {
    document.querySelectorAll(".mini-cart").forEach(function (panel) {
        var items = readCart();
        panel.innerHTML = "";
        panel.appendChild(el("div", "mini-cart-title", "Items in your cart"));

        panel.classList.toggle("is-empty", !items.length);
        if (!items.length) {
            panel.appendChild(el("p", "mini-cart-empty", "Your cart is empty for now"));
            var go = el("a", "mini-cart-order", "Go to catalog");
            go.href = "catalog.html";
            panel.appendChild(go);
            return;
        }

        var list = el("div", "mini-cart-list");
        items.forEach(function (item, index) {
            var row = el("div", "mini-cart-row");

            var photo = el("a", "mini-cart-photo");
            photo.href = item.link || "product.html";
            if (item.photo) {
                var img = el("img");
                img.src = item.photo;
                img.alt = "";
                photo.appendChild(img);
            }
            row.appendChild(photo);

            var info = el("div", "mini-cart-info");
            var name = el("a", "mini-cart-name", item.name);
            name.href = item.link || "product.html";
            info.appendChild(name);
            var options = el("div", "mini-cart-options");
            (item.weights || []).forEach(function (weight, weightIndex) {
                var pill = el("button", "mini-cart-weight" + (weightIndex === item.weight ? " is-on" : ""), weight.label);
                pill.type = "button";
                if (weight.off) pill.appendChild(el("small", "", weight.off));
                pill.addEventListener("click", function () { changeLine(index, { weight: weightIndex }); });
                options.appendChild(pill);
            });
            if (item.grinds && item.grinds.length) {
                var select = el("select", "mini-cart-grind");
                select.setAttribute("aria-label", "Grind");
                item.grinds.forEach(function (grind) {
                    var option = el("option", "", grind);
                    option.selected = grind === item.grind;
                    select.appendChild(option);
                });
                select.addEventListener("change", function () { changeLine(index, { grind: select.value }); });
                options.appendChild(select);
            }
            info.appendChild(options);
            row.appendChild(info);

            var qty = el("div", "mini-cart-qty");
            var minus = el("button", "", "−");
            minus.type = "button";
            minus.setAttribute("aria-label", "Less");
            minus.disabled = item.qty <= 1;
            minus.addEventListener("click", function () { changeLine(index, { qty: item.qty - 1 }); });
            var plus = el("button", "", "+");
            plus.type = "button";
            plus.setAttribute("aria-label", "More");
            plus.addEventListener("click", function () { changeLine(index, { qty: item.qty + 1 }); });
            qty.appendChild(minus);
            qty.appendChild(el("span", "", String(item.qty)));
            qty.appendChild(plus);
            row.appendChild(qty);

            var price = el("div", "mini-cart-price");
            if (item.oldPrice) price.appendChild(el("s", "", money(item.oldPrice * item.qty)));
            price.appendChild(el("strong", "", money(item.price * item.qty)));
            row.appendChild(price);

            var remove = el("button", "mini-cart-remove");
            remove.type = "button";
            remove.setAttribute("aria-label", "Remove " + item.name);
            remove.innerHTML = trashIcon;
            remove.addEventListener("click", function () { changeLine(index, null); });
            row.appendChild(remove);

            list.appendChild(row);
        });
        panel.appendChild(list);

        var total = items.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
        var footer = el("div", "mini-cart-footer");
        var order = el("a", "mini-cart-order", "Place an order");
        order.href = "cart.html";
        footer.appendChild(order);
        footer.appendChild(el("span", "mini-cart-total", "Total " + money(total)));
        panel.appendChild(footer);
    });
}

function changeLine(index, changes) {
    var items = readCart();
    if (!items[index]) return;
    if (changes === null) {
        items.splice(index, 1);
    } else {
        Object.keys(changes).forEach(function (key) { items[index][key] = changes[key]; });
        for (var i = 0; i < items.length; i++) {
            if (i !== index && sameLine(items[i], items[index])) {
                items[i].qty += items[index].qty;
                items.splice(index, 1);
                break;
            }
        }
    }
    writeCart(items);
    showCartCount(false);
    renderMiniCart();
}

document.querySelectorAll(".header-actions .cart-link").forEach(function (link) {
    var wrap = el("div", "cart-drop");
    link.parentNode.insertBefore(wrap, link);
    wrap.appendChild(link);
    var panel = el("div", "mini-cart");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Cart");
    wrap.appendChild(panel);
});

document.querySelectorAll(".price").forEach(function (button) {
    button.addEventListener("click", function () {
        addToCart(productFromButton(button));
        showCartCount(true);
        renderMiniCart();
        showToast("Added to cart");
    });
});

try { localStorage.removeItem("janz-cart-count"); } catch (error) {}
showCartCount();
renderMiniCart();

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

document.querySelectorAll(".profile-tag-pick").forEach(function (pick) {
    var search = pick.querySelector(".profile-tag-search");
    var drop = pick.querySelector(".profile-tag-drop");
    var hidden = pick.querySelector('input[name="tags"]');
    var chips = pick.parentElement.querySelector(".profile-tag-chips");
    var items = pick.querySelectorAll(".profile-tag-drop button");
    function selected() {
        return hidden.value ? hidden.value.split("|") : [];
    }
    function writeTags(list) {
        hidden.value = list.join("|");
    }
    function filter() {
        var q = search.value.trim().toLowerCase();
        var taken = selected();
        var visible = 0;
        items.forEach(function (item) {
            var name = item.getAttribute("data-name") || "";
            var hide = taken.indexOf(name) !== -1 || (q !== "" && name.toLowerCase().indexOf(q) === -1);
            item.hidden = hide;
            if (!hide) visible += 1;
        });
        drop.hidden = visible === 0;
        pick.classList.toggle("is-on", visible > 0);
    }
    function openPick() {
        pick.classList.add("is-on");
        filter();
    }
    function closePick() {
        pick.classList.remove("is-on");
        drop.hidden = true;
        search.value = "";
    }
    function addTag(name) {
        var list = selected();
        if (!name || list.indexOf(name) !== -1) return;
        list.push(name);
        writeTags(list);
        var chip = document.createElement("span");
        chip.className = "profile-tag-chip";
        chip.setAttribute("data-name", name);
        chip.appendChild(document.createTextNode(name));
        var remove = document.createElement("button");
        remove.type = "button";
        remove.setAttribute("aria-label", "Remove " + name);
        remove.textContent = "×";
        remove.addEventListener("click", function () {
            chip.remove();
            writeTags(selected().filter(function (item) { return item !== name; }));
        });
        chip.appendChild(remove);
        chips.appendChild(chip);
        closePick();
    }
    search.addEventListener("focus", openPick);
    search.addEventListener("pointerdown", function (event) {
        event.stopPropagation();
        openPick();
    });
    search.addEventListener("input", openPick);
    search.addEventListener("keydown", function (event) {
        if (event.key !== "Enter") return;
        event.preventDefault();
        var match = Array.prototype.filter.call(items, function (item) { return !item.hidden; });
        if (match.length === 1) addTag(match[0].getAttribute("data-name") || "");
    });
    items.forEach(function (item) {
        item.addEventListener("click", function () {
            addTag(item.getAttribute("data-name") || "");
        });
    });
    document.addEventListener("pointerdown", function (event) {
        if (!pick.contains(event.target)) {
            pick.classList.remove("is-on");
            drop.hidden = true;
        }
    });
});

document.querySelectorAll(".details-avatar").forEach(function (box) {
    var field = box.querySelector('input[type="file"]');
    var photo = box.querySelector(".details-avatar-photo");
    var letter = box.querySelector(".details-avatar-letter");
    if (!field || !photo) return;
    field.addEventListener("change", function () {
        var file = field.files && field.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
            photo.src = reader.result;
            photo.hidden = false;
            if (letter) letter.hidden = true;
        };
        reader.readAsDataURL(file);
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

var readingKey = "janz-reading";
var readingEmptyCopy = {
    progress: { title: "Nothing in progress", text: "Open an article and scroll about halfway" },
    read: { title: "Nothing read yet", text: "Finish an article to keep it here" },
    saved: { title: "No bookmarks", text: "Save an article from the journal" }
};

function loadReading() {
    try {
        return JSON.parse(localStorage.getItem(readingKey) || "{}");
    } catch (error) {
        return {};
    }
}

function saveReading(map) {
    localStorage.setItem(readingKey, JSON.stringify(map));
}

function articleMeta(root) {
    return {
        id: root.getAttribute("data-id"),
        title: root.getAttribute("data-title"),
        topic: root.getAttribute("data-topic"),
        date: root.getAttribute("data-date"),
        lead: root.getAttribute("data-lead"),
        image: root.getAttribute("data-image"),
        href: root.getAttribute("data-href") || "article.html",
        likes: root.getAttribute("data-likes") || "0",
        comments: root.getAttribute("data-comments") || "0",
        views: root.getAttribute("data-views") || "0",
        mins: root.getAttribute("data-mins") || "0'"
    };
}

function rememberArticle(root, patch) {
    var id = root.getAttribute("data-id");
    if (!id) return;
    var map = loadReading();
    var cur = map[id] || articleMeta(root);
    if (patch.status === "progress" && cur.status === "read") {
        delete patch.status;
    }
    Object.keys(patch).forEach(function (key) {
        cur[key] = patch[key];
    });
    map[id] = cur;
    saveReading(map);
}

var articleRoot = document.getElementById("article");
if (articleRoot && articleRoot.getAttribute("data-id")) {
    var bookmarkBtn = articleRoot.querySelector(".article-bookmark");
    var storedArticle = loadReading()[articleRoot.getAttribute("data-id")];
    if (bookmarkBtn && storedArticle && storedArticle.bookmarked) {
        bookmarkBtn.classList.add("is-on");
    }

    function pageProgress() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        if (max <= 80) return 0;
        return Math.min(1, window.scrollY / max);
    }

    function trackArticle() {
        var progress = pageProgress();
        if (progress >= 0.9) {
            rememberArticle(articleRoot, { status: "read", progress: progress });
        } else if (progress >= 0.4) {
            rememberArticle(articleRoot, { status: "progress", progress: progress });
        }
    }

    window.addEventListener("scroll", trackArticle, { passive: true });

    rememberArticle(articleRoot, { seenAt: Date.now() });

    if (bookmarkBtn) {
        bookmarkBtn.addEventListener("click", function () {
            var id = articleRoot.getAttribute("data-id");
            var on = !(loadReading()[id] && loadReading()[id].bookmarked);
            bookmarkBtn.classList.toggle("is-on", on);
            rememberArticle(articleRoot, { bookmarked: on });
        });
    }
}

var readingBoard = document.querySelector(".reading-board");
if (readingBoard) {
    var readingTabs = readingBoard.querySelectorAll("[data-read]");
    var readingList = readingBoard.querySelector(".reading-list");
    var readingEmpty = readingBoard.querySelector(".reading-empty");
    var readingFilter = "progress";

    function readingItems() {
        var map = loadReading();
        return Object.keys(map).map(function (id) {
            return map[id];
        });
    }

    function renderReading() {
        var items = readingItems();
        var counts = { progress: 0, read: 0, saved: 0 };
        items.forEach(function (item) {
            if (item.status === "read") counts.read += 1;
            else if (item.status === "progress") counts.progress += 1;
            if (item.bookmarked) counts.saved += 1;
        });
        readingTabs.forEach(function (tab) {
            var key = tab.getAttribute("data-read");
            tab.classList.toggle("is-on", key === readingFilter);
            var count = tab.querySelector("span");
            if (count) count.textContent = counts[key] || 0;
        });
        var shown = items.filter(function (item) {
            if (readingFilter === "saved") return item.bookmarked;
            return item.status === readingFilter;
        });
        readingList.innerHTML = "";
        shown.forEach(function (item) {
            var card = document.createElement("a");
            card.className = "journal-card";
            card.href = item.href || "article.html";
            card.innerHTML =
                '<img src="' + (item.image || "images/aroma-kit.png") + '" alt="" />' +
                '<div class="body">' +
                    '<div class="meta">' + (item.topic || "") + "<br>" + (item.date || "") + "</div>" +
                    "<h3>" + (item.title || "Article") + "</h3>" +
                    "<p>" + (item.lead || "") + "</p>" +
                    '<div class="journal-stats">' +
                        '<span><svg viewBox="0 0 24 24"><path d="M8 11v9H5.2A1.2 1.2 0 0 1 4 18.8v-6.6A1.2 1.2 0 0 1 5.2 11H8zm0 0l3.2-6.1A2.2 2.2 0 0 1 13.2 4h.3A2.5 2.5 0 0 1 16 6.5V11h3.7a1.8 1.8 0 0 1 1.8 2.1l-1.2 6.2A1.8 1.8 0 0 1 18.5 21H8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' + (item.likes || "0") + "</span>" +
                        '<span><svg viewBox="0 0 24 24"><path d="M5 6.5h14v9.2H9.2L5 19.2V6.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' + (item.comments || "0") + "</span>" +
                        '<span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>' + (item.views || "0") + "</span>" +
                        '<span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 8v4.2l2.6 1.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' + (item.mins || "0'") + "</span>" +
                    "</div>" +
                "</div>";
            readingList.appendChild(card);
        });
        readingBoard.classList.toggle("is-empty", shown.length === 0);
        if (readingEmpty) {
            var copy = readingEmptyCopy[readingFilter] || readingEmptyCopy.progress;
            var title = readingEmpty.querySelector("h2");
            var text = readingEmpty.querySelector("p");
            if (title) title.textContent = copy.title;
            if (text) text.textContent = copy.text;
        }
    }

    readingTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            readingFilter = tab.getAttribute("data-read");
            renderReading();
        });
    });
    renderReading();
}


function bindVotes(box) {
    var like = box.querySelector(":scope > .feed-like");
    var dislike = box.querySelector(":scope > .feed-dislike");
    var score = box.querySelector(":scope > .feed-score");
    if (!like || !dislike || !score) return;
    var baseScore = parseInt(score.textContent, 10) || 0;

    function setVote(likeOn, dislikeOn) {
        like.classList.toggle("is-on", likeOn);
        like.setAttribute("aria-pressed", likeOn ? "true" : "false");
        dislike.classList.toggle("is-on", dislikeOn);
        dislike.setAttribute("aria-pressed", dislikeOn ? "true" : "false");
        score.textContent = baseScore + (likeOn ? 1 : 0);
    }

    like.addEventListener("click", function () {
        setVote(!like.classList.contains("is-on"), false);
    });
    dislike.addEventListener("click", function () {
        setVote(false, !dislike.classList.contains("is-on"));
    });
}

function bindNote(note, card) {
    var actions = note.querySelector(":scope > .feed-note-actions");
    if (actions) bindVotes(actions);

    var reply = actions ? actions.querySelector(".feed-reply") : null;
    var input = card.querySelector(".feed-comment input[type='text']");
    if (reply && input) {
        reply.addEventListener("click", function () {
            var name = note.querySelector(".feed-name a").textContent.trim();
            input.value = "@" + name + ", ";
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        });
    }

    var toggle = note.querySelector(":scope > .feed-replies-toggle");
    var replies = note.querySelector(":scope > .feed-replies");
    if (toggle && replies) {
        toggle.addEventListener("click", function () {
            var open = replies.hidden;
            replies.hidden = !open;
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }
}

function escapeHtml(text) {
    var box = document.createElement("div");
    box.textContent = text;
    return box.innerHTML;
}

var shareOverlay = null;
var toastBox = null;
var toastTimer = null;

function postLink(card, note) {
    var link = location.href.split(/[?#]/)[0] + "?post=" + card.getAttribute("data-post-id");
    if (note) link += "&comment=" + note.getAttribute("data-comment-id");
    return link;
}

function openShare(link) {
    if (!shareOverlay) return;
    var field = shareOverlay.querySelector(".share-link");
    field.value = link;
    var text = encodeURIComponent(link);
    shareOverlay.querySelector("[data-share='telegram']").href = "https://t.me/share/url?url=" + text;
    shareOverlay.querySelector("[data-share='whatsapp']").href = "https://wa.me/?text=" + text;
    shareOverlay.querySelector("[data-share='facebook']").href = "https://www.facebook.com/sharer/sharer.php?u=" + text;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(link).catch(function () {});
    }
    shareOverlay.classList.add("is-on");
}

function closeShare() {
    if (shareOverlay) shareOverlay.classList.remove("is-on");
}

function showToast(text) {
    if (!toastBox) return;
    toastBox.querySelector(".toast-text").textContent = text;
    toastBox.classList.remove("is-on");
    void toastBox.offsetWidth;
    toastBox.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 4000);
}

function hideToast() {
    if (toastBox) toastBox.classList.remove("is-on");
}

function closeMenus(except) {
    document.querySelectorAll(".feed-menu").forEach(function (menu) {
        if (menu !== except) menu.hidden = true;
    });
}

toastBox = document.createElement("div");
toastBox.className = "toast";
toastBox.setAttribute("role", "status");
toastBox.innerHTML =
    '<div class="toast-check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 12.4l4 4L18 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
    '<p class="toast-text"></p>' +
    '<div class="toast-bar"></div>' +
    '<button type="button" class="toast-close" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>';
document.body.appendChild(toastBox);
toastBox.querySelector(".toast-close").addEventListener("click", function () {
    clearTimeout(toastTimer);
    hideToast();
});

if (document.querySelector(".feed-card")) {
    shareOverlay = document.createElement("div");
    shareOverlay.className = "share-overlay";
    shareOverlay.innerHTML =
        '<div class="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-title">' +
            '<svg class="share-icon" viewBox="0 0 48 48" aria-hidden="true"><path d="M17 6h25v25H17z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M11 13H6v29h29v-5" fill="none" stroke="currentColor" stroke-width="3"/></svg>' +
            '<h2 id="share-title">Link copied<br />to clipboard</h2>' +
            '<input class="share-link" type="text" readonly aria-label="Post link" />' +
            "<p>Share on social networks</p>" +
            '<div class="share-socials">' +
                '<a data-share="telegram" href="#" target="_blank" rel="noopener" aria-label="Telegram"><svg viewBox="0 0 24 24"><path d="M20.6 4.2L3.4 10.9c-.9.3-.9 1.6 0 1.9l4.2 1.4 1.6 5c.2.7 1.1.9 1.6.4l2.4-2.3 4.4 3.2c.6.4 1.4.1 1.6-.6l2.9-14.2c.2-.9-.7-1.7-1.5-1.5zM9.2 13.9l8.1-5.2-6.5 6.4-.3 3-1.3-4.2z" fill="currentColor"/></svg></a>' +
                '<a data-share="whatsapp" href="#" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.9L3.5 20.5l4.2-1.1A8.5 8.5 0 1 0 12 3.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.3 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.4.7-.5.4-1.2.6-1.8.5-2.9-.6-5.2-2.9-5.8-5.8-.1-.6.1-1.3.4-1.9z" fill="currentColor"/></svg></a>' +
                '<a data-share="facebook" href="#" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M13.4 20.5v-7h2.4l.4-2.8h-2.8V8.9c0-.8.2-1.4 1.4-1.4h1.5V5c-.3 0-1.1-.1-2.2-.1-2.2 0-3.6 1.3-3.6 3.7v2.1H8.1v2.8h2.4v7z" fill="currentColor"/></svg></a>' +
            "</div>" +
        "</div>";
    document.body.appendChild(shareOverlay);

    shareOverlay.addEventListener("click", function (event) {
        if (event.target === shareOverlay) closeShare();
    });
    shareOverlay.querySelector(".share-link").addEventListener("focus", function (event) {
        event.target.select();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeShare();
            closeMenus(null);
        }
    });

    document.addEventListener("click", function (event) {
        var more = event.target.closest(".feed-more");
        if (!more) {
            if (!event.target.closest(".feed-menu")) closeMenus(null);
            return;
        }

        var head = more.parentElement;
        var menu = head.querySelector(".feed-menu");
        if (!menu) {
            var card = more.closest(".feed-card");
            var note = more.closest(".feed-note");
            menu = document.createElement("div");
            menu.className = "feed-menu";
            menu.hidden = true;
            menu.innerHTML =
                '<button type="button" data-menu="block">Block</button>' +
                '<button type="button" data-menu="share">Share</button>';
            head.appendChild(menu);

            menu.querySelector("[data-menu='block']").addEventListener("click", function () {
                menu.hidden = true;
                showToast("You blocked the user");
            });
            menu.querySelector("[data-menu='share']").addEventListener("click", function () {
                menu.hidden = true;
                openShare(postLink(card, note));
            });
        }

        closeMenus(menu);
        menu.hidden = !menu.hidden;
    });
}

document.querySelectorAll(".feed-card").forEach(function (card) {
    var photos = card.querySelector("[data-feed-photos]");
    if (photos) {
        var frame = photos.querySelector(".feed-frame");
        var track = photos.querySelector(".feed-track");
        var dots = photos.querySelectorAll(".feed-dots button");
        var count = track.children.length;
        var index = 0;
        var startX = null;
        var deltaX = 0;

        function showPhoto(next) {
            index = Math.max(0, Math.min(count - 1, next));
            track.style.transform = "translateX(" + (-index * 100) + "%)";
            dots.forEach(function (dot, n) {
                dot.classList.toggle("is-on", n === index);
            });
        }

        dots.forEach(function (dot, n) {
            dot.addEventListener("click", function () {
                showPhoto(n);
            });
        });

        if (count > 1) {
            frame.addEventListener("pointerdown", function (event) {
                startX = event.clientX;
                deltaX = 0;
                frame.classList.add("is-dragging");
                frame.setPointerCapture(event.pointerId);
            });

            frame.addEventListener("pointermove", function (event) {
                if (startX === null) return;
                deltaX = event.clientX - startX;
                var shift = -index * frame.clientWidth + deltaX;
                track.style.transform = "translateX(" + shift + "px)";
            });

            function endDrag() {
                if (startX === null) return;
                frame.classList.remove("is-dragging");
                if (Math.abs(deltaX) > frame.clientWidth / 5) {
                    showPhoto(index + (deltaX < 0 ? 1 : -1));
                } else {
                    showPhoto(index);
                }
                startX = null;
            }

            frame.addEventListener("pointerup", endDrag);
            frame.addEventListener("pointercancel", endDrag);
        } else {
            frame.style.cursor = "default";
        }
    }

    var postActions = card.querySelector(".feed-actions");
    if (postActions) bindVotes(postActions);

    var save = card.querySelector(".feed-save");
    if (save) {
        save.addEventListener("click", function () {
            var on = !save.classList.contains("is-on");
            save.classList.toggle("is-on", on);
            save.setAttribute("aria-pressed", on ? "true" : "false");
        });
    }

    var follow = card.querySelector(".feed-follow");
    if (follow) {
        follow.addEventListener("click", function () {
            var on = !follow.classList.contains("is-on");
            follow.classList.toggle("is-on", on);
            follow.setAttribute("aria-pressed", on ? "true" : "false");
            follow.textContent = on ? "Following" : "Follow";
        });
    }

    var share = card.querySelector(".feed-share");
    if (share) {
        share.addEventListener("click", function () {
            openShare(postLink(card, null));
        });
    }

    var thread = card.querySelector(".feed-thread");
    var commentsBtn = card.querySelector(".feed-comments");
    var commentsCount = commentsBtn ? commentsBtn.querySelector("span") : null;

    function setThread(open) {
        if (!thread || !commentsBtn) return;
        thread.hidden = !open;
        commentsBtn.classList.toggle("is-on", open);
        commentsBtn.setAttribute("aria-expanded", open ? "true" : "false");
    }

    if (thread && commentsBtn) {
        commentsBtn.addEventListener("click", function () {
            setThread(thread.hidden);
        });
        thread.querySelectorAll(".feed-note").forEach(function (note) {
            bindNote(note, card);
        });
    }

    var comment = card.querySelector(".feed-comment");
    if (comment) {
        var text = comment.querySelector("input[type='text']");
        var file = comment.querySelector("input[type='file']");
        var photoBtn = comment.querySelector(".feed-comment-photo");

        if (file && photoBtn) {
            file.addEventListener("change", function () {
                photoBtn.classList.toggle("is-on", file.files.length > 0);
            });
        }

        comment.addEventListener("submit", function (event) {
            event.preventDefault();
            var value = text.value.trim();
            var hasPhoto = file && file.files.length > 0;
            if (!value && !hasPhoto) {
                text.focus();
                return;
            }

            if (thread) {
                var today = new Date();
                var date = ("0" + today.getDate()).slice(-2) + "." + ("0" + (today.getMonth() + 1)).slice(-2) + "." + today.getFullYear();
                var template = thread.querySelector(".feed-note");
                var note = document.createElement("div");
                note.className = "feed-note";
                note.innerHTML =
                    '<div class="feed-note-head">' +
                        '<div class="feed-note-avatar">Y</div>' +
                        '<div class="feed-who"><div class="feed-name"><a href="account.html">You</a></div><div class="feed-role">Coffee lover</div></div>' +
                        '<time class="feed-date">' + date + "</time>" +
                    "</div>" +
                    '<p class="feed-note-text">' + (value ? escapeHtml(value) : "Photo") + "</p>" +
                    '<div class="feed-note-actions">' +
                        (template ? template.querySelector(".feed-like").outerHTML : '<button type="button" class="feed-like">+</button>') +
                        '<span class="feed-score">0</span>' +
                        (template ? template.querySelector(".feed-dislike").outerHTML : '<button type="button" class="feed-dislike">-</button>') +
                        '<button type="button" class="feed-reply">Reply</button>' +
                    "</div>";
                note.querySelectorAll("[aria-pressed]").forEach(function (item) {
                    item.classList.remove("is-on");
                    item.setAttribute("aria-pressed", "false");
                });
                var empty = thread.querySelector(".feed-thread-empty");
                thread.insertBefore(note, empty);
                if (empty) empty.hidden = true;
                bindNote(note, card);
                setThread(true);
            }

            if (commentsCount) commentsCount.textContent = (parseInt(commentsCount.textContent, 10) || 0) + 1;
            comment.reset();
            if (photoBtn) photoBtn.classList.remove("is-on");
        });
    }
});

var blacklistPane = document.querySelector(".cabinet-pane[data-pane='blacklist']");
var unblockOverlay = document.querySelector(".unblock-overlay");

if (blacklistPane && unblockOverlay) {
    var blacklistBoard = blacklistPane.querySelector(".blacklist-board");
    var blacklistSearch = blacklistPane.querySelector(".blacklist-search input");
    var blacklistNone = blacklistPane.querySelector(".blacklist-none");
    var blacklistEmpty = blacklistPane.querySelector(".blacklist-empty");
    var unblockTarget = null;

    function syncBlacklist() {
        var items = blacklistPane.querySelectorAll(".blacklist-item");
        var query = blacklistSearch.value.trim().toLowerCase();
        var shown = 0;
        items.forEach(function (item) {
            var match = item.textContent.toLowerCase().indexOf(query) !== -1;
            item.hidden = !match;
            if (match) shown++;
        });
        var hasUsers = items.length > 0;
        blacklistBoard.hidden = !hasUsers;
        blacklistEmpty.hidden = hasUsers;
        blacklistPane.classList.toggle("is-filled", hasUsers);
        blacklistNone.hidden = !hasUsers || shown > 0;
    }

    function closeUnblock() {
        unblockOverlay.classList.remove("is-on");
        unblockTarget = null;
    }

    blacklistSearch.addEventListener("input", syncBlacklist);

    blacklistPane.addEventListener("click", function (event) {
        var remove = event.target.closest(".blacklist-remove");
        if (!remove) return;
        unblockTarget = remove.closest(".blacklist-item");
        var name = unblockTarget.querySelector(".blacklist-name strong").textContent;
        unblockOverlay.querySelector(".unblock-avatar").textContent = unblockTarget.querySelector(".blacklist-avatar").textContent;
        unblockOverlay.querySelector(".unblock-name").textContent = name;
        unblockOverlay.querySelector(".unblock-role").textContent = unblockTarget.querySelector(".blacklist-who p").textContent;
        unblockOverlay.classList.add("is-on");
    });

    unblockOverlay.querySelector(".unblock-yes").addEventListener("click", function () {
        if (unblockTarget) unblockTarget.remove();
        closeUnblock();
        syncBlacklist();
    });

    unblockOverlay.querySelector(".unblock-no").addEventListener("click", closeUnblock);

    unblockOverlay.addEventListener("click", function (event) {
        if (event.target === unblockOverlay) closeUnblock();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeUnblock();
    });

    syncBlacklist();
}


var journalGrid = document.querySelector(".journal-grid");

if (journalGrid && journalGrid.querySelector(".article-card")) {
    var journalCards = Array.prototype.slice.call(journalGrid.querySelectorAll(".article-card"));
    var journalNone = journalGrid.querySelector(".journal-none");
    var journalCount = document.querySelector(".journal-count");
    var journalSort = document.querySelector(".journal-toolbar select");
    var journalRecent = document.querySelector(".journal-recent");
    var journalRecentRow = journalRecent ? journalRecent.querySelector(".journal-recent-row") : null;
    var journalTopic = "";
    var journalTag = "";

    function cardTopics(card) {
        return (card.getAttribute("data-topic") || "").split(",").map(function (item) {
            return item.trim();
        });
    }

    function cardTags(card) {
        return (card.getAttribute("data-tags") || "").split(",").map(function (item) {
            return item.trim();
        });
    }

    document.querySelectorAll(".journal-topics a[data-topic]").forEach(function (link) {
        var topic = link.getAttribute("data-topic");
        var count = link.querySelector("span");
        if (!topic || !count) return;
        count.textContent = journalCards.filter(function (card) {
            return cardTopics(card).indexOf(topic) !== -1;
        }).length;
    });

    function sortValue(card, mode) {
        if (mode === "Most read") return parseInt(card.getAttribute("data-views"), 10) || 0;
        if (mode === "Most popular") return parseInt(card.getAttribute("data-likes"), 10) || 0;
        return card.getAttribute("data-sort") || "";
    }

    function renderJournal() {
        var mode = journalSort ? journalSort.value : "Newest first";
        var sorted = journalCards.slice().sort(function (a, b) {
            var x = sortValue(a, mode);
            var y = sortValue(b, mode);
            if (x === y) return 0;
            var asc = mode === "Oldest first";
            return (x > y ? 1 : -1) * (asc ? 1 : -1);
        });

        var shown = 0;
        sorted.forEach(function (card) {
            var match = (!journalTopic || cardTopics(card).indexOf(journalTopic) !== -1) &&
                        (!journalTag || cardTags(card).indexOf(journalTag) !== -1);
            card.hidden = !match;
            if (match) shown++;
            journalGrid.insertBefore(card, journalNone);
        });

        if (journalNone) journalNone.hidden = shown > 0;
        if (journalCount) journalCount.textContent = shown + (shown === 1 ? " article" : " articles");
    }

    document.querySelectorAll(".journal-topics a[data-topic]").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            journalTopic = link.getAttribute("data-topic");
            document.querySelectorAll(".journal-topics a[data-topic]").forEach(function (item) {
                item.classList.toggle("is-on", item === link);
            });
            renderJournal();
        });
    });

    document.querySelectorAll(".journal-tags a[data-tag]").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            var tag = link.getAttribute("data-tag");
            journalTag = journalTag === tag ? "" : tag;
            document.querySelectorAll(".journal-tags a[data-tag]").forEach(function (item) {
                item.classList.toggle("is-on", !!journalTag && item.getAttribute("data-tag") === journalTag);
            });
            renderJournal();
        });
    });

    if (journalSort) journalSort.addEventListener("change", renderJournal);

    function syncArticle(card) {
        var item = loadReading()[card.getAttribute("data-id")] || {};
        var like = card.querySelector(".article-like");
        var save = card.querySelector(".article-save");
        var bar = card.querySelector(".article-progress i");
        var base = parseInt(card.getAttribute("data-likes"), 10) || 0;

        if (like) {
            like.classList.toggle("is-on", !!item.liked);
            like.setAttribute("aria-pressed", item.liked ? "true" : "false");
            like.querySelector("span").textContent = base + (item.liked ? 1 : 0);
        }
        if (save) {
            save.classList.toggle("is-on", !!item.bookmarked);
            save.setAttribute("aria-pressed", item.bookmarked ? "true" : "false");
        }
        if (bar) {
            var progress = item.status === "read" ? 1 : (item.progress || 0);
            bar.style.width = Math.round(progress * 100) + "%";
            card.classList.toggle("is-started", progress > 0);
        }
    }

    function syncAll() {
        document.querySelectorAll(".article-card, .journal-hero[data-id]").forEach(syncArticle);
    }

    function bindArticle(card) {
        var like = card.querySelector(".article-like");
        var save = card.querySelector(".article-save");
        if (like) {
            like.addEventListener("click", function () {
                var item = loadReading()[card.getAttribute("data-id")] || {};
                rememberArticle(card, { liked: !item.liked });
                syncAll();
            });
        }
        if (save) {
            save.addEventListener("click", function () {
                var item = loadReading()[card.getAttribute("data-id")] || {};
                rememberArticle(card, { bookmarked: !item.bookmarked });
                syncAll();
            });
        }
        card.querySelectorAll("a[href^='article.html']").forEach(function (link) {
            link.addEventListener("click", function () {
                rememberArticle(card, { seenAt: Date.now() });
            });
        });
    }

    function renderRecent() {
        if (!journalRecent || !journalRecentRow) return;
        var map = loadReading();
        var seen = Object.keys(map).map(function (id) {
            return map[id];
        }).filter(function (item) {
            return item.seenAt;
        }).sort(function (a, b) {
            return b.seenAt - a.seenAt;
        }).slice(0, 6);

        journalRecentRow.innerHTML = "";
        seen.forEach(function (item) {
            var source = document.querySelector(".article-card[data-id='" + item.id + "'], .journal-hero[data-id='" + item.id + "']");
            var card;
            if (source && source.classList.contains("article-card")) {
                card = source.cloneNode(true);
                card.hidden = false;
            } else {
                card = document.createElement("div");
                card.className = "article-card";
                ["id", "title", "topic", "date", "lead", "image", "href", "likes", "comments", "views", "mins"].forEach(function (key) {
                    if (item[key]) card.setAttribute("data-" + key, item[key]);
                });
                var stats = source ? source.querySelector(".article-stats").outerHTML : "";
                card.innerHTML =
                    '<a class="article-card-photo" href="' + (item.href || "article.html") + '"><img src="' + (item.image || "images/aroma-kit.png") + '" alt="" /><span class="article-progress"><i></i></span></a>' +
                    '<div class="article-meta">' + escapeHtml(item.topic || "") + "<br />" + escapeHtml(item.date || "") + "</div>" +
                    '<h3><a href="' + (item.href || "article.html") + '">' + escapeHtml(item.title || "Article") + "</a></h3>" +
                    "<p>" + escapeHtml(item.lead || "") + "</p>" + stats;
            }
            journalRecentRow.appendChild(card);
            bindArticle(card);
        });
        journalRecent.hidden = seen.length === 0;
        syncAll();
    }

    document.querySelectorAll(".article-card, .journal-hero[data-id]").forEach(bindArticle);
    renderJournal();
    renderRecent();

    window.addEventListener("pageshow", renderRecent);
}

(function () {
    var box = document.querySelector(".notify");
    if (!box) return;
    var items = box.querySelectorAll(".notify-item");
    var count = box.querySelector(".notify-count");
    var allTab = box.querySelector('.notify-tabs [data-kind="all"] span');
    var empty = box.querySelector(".notify-empty");
    var state = {};
    try { state = JSON.parse(localStorage.getItem("janz-notify") || "{}"); } catch (e) { state = {}; }

    function save() {
        try { localStorage.setItem("janz-notify", JSON.stringify(state)); } catch (e) { }
    }

    function refresh() {
        var fresh = 0;
        var visible = 0;
        items.forEach(function (item) {
            var key = item.getAttribute("href") + item.querySelector("time").getAttribute("datetime");
            item.hidden = item.hidden || !!state.cleared;
            if (state.read && state.read[key]) item.classList.remove("is-new");
            if (!item.hidden) visible += 1;
            if (!state.cleared && item.classList.contains("is-new")) fresh += 1;
        });
        count.textContent = fresh;
        count.hidden = fresh === 0;
        if (allTab) allTab.textContent = fresh || "";
        box.querySelector(".notify-btn").setAttribute("aria-label", fresh ? "Notifications, " + fresh + " new" : "Notifications");
        empty.hidden = visible > 0;
    }

    box.querySelectorAll(".notify-tabs button").forEach(function (button) {
        button.addEventListener("click", function () {
            var kind = button.getAttribute("data-kind");
            box.querySelectorAll(".notify-tabs button").forEach(function (other) {
                other.classList.toggle("is-on", other === button);
            });
            items.forEach(function (item) {
                item.hidden = !!state.cleared || (kind !== "all" && item.getAttribute("data-kind") !== kind);
            });
            refresh();
        });
    });

    items.forEach(function (item) {
        item.addEventListener("click", function () {
            state.read = state.read || {};
            state.read[item.getAttribute("href") + item.querySelector("time").getAttribute("datetime")] = true;
            save();
        });
    });

    box.querySelector(".notify-clear").addEventListener("click", function () {
        state.cleared = true;
        save();
        refresh();
    });

    refresh();
})();

(function () {
    var lists = {
        wishlist: { key: "janz-wishlist", add: "Add to wishlist", remove: "Remove from wishlist", added: "Added to wishlist", removed: "Removed from wishlist" },
        compare: { key: "janz-compare", add: "Compare", remove: "Remove from compare", added: "Added to compare", removed: "Removed from compare" }
    };

    function read(list) {
        try { return JSON.parse(localStorage.getItem(list.key) || "[]"); } catch (e) { return []; }
    }

    function write(list, items) {
        try { localStorage.setItem(list.key, JSON.stringify(items)); } catch (e) { }
    }

    function productName(button) {
        var card = button.closest("article, .product");
        var title = card && card.querySelector("h3");
        if (!title) title = document.querySelector("main h1, h1");
        return title ? title.textContent.trim() : "";
    }

    function headerLink(name) {
        return document.querySelectorAll('.header-actions a[aria-label^="' + (name === "wishlist" ? "Wishlist" : "Compare") + '"]');
    }

    function showCount(name, bump) {
        var count = read(lists[name]).length;
        headerLink(name).forEach(function (link) {
            var badge = link.querySelector(".icon-count");
            if (!badge) {
                badge = document.createElement("span");
                badge.className = "icon-count";
                link.classList.add("has-count");
                link.appendChild(badge);
            }
            badge.textContent = count;
            badge.hidden = count === 0;
            link.setAttribute("aria-label", (name === "wishlist" ? "Wishlist" : "Compare") + (count ? ", " + count : ""));
            if (bump) {
                badge.classList.remove("is-bump");
                void badge.offsetWidth;
                badge.classList.add("is-bump");
            }
        });
    }

    function markButtons(name) {
        var list = lists[name];
        var items = read(list);
        document.querySelectorAll(".product-actions button").forEach(function (button) {
            if (button.dataset.list !== name) return;
            var on = items.indexOf(productName(button)) !== -1;
            button.classList.toggle("is-on", on);
            button.setAttribute("aria-label", on ? list.remove : list.add);
            button.setAttribute("aria-pressed", on ? "true" : "false");
        });
    }

    document.querySelectorAll(".product-actions button").forEach(function (button) {
        var label = button.getAttribute("aria-label");
        if (label === lists.wishlist.add) button.dataset.list = "wishlist";
        else if (label === lists.compare.add) button.dataset.list = "compare";
        else if (label === "Product details") {
            button.addEventListener("click", function () {
                var card = button.closest("article, .product");
                var link = card && card.querySelector(".product-link");
                window.location.href = link ? link.getAttribute("href") : "product.html";
            });
            return;
        } else return;

        button.addEventListener("click", function () {
            var name = button.dataset.list;
            var list = lists[name];
            var items = read(list);
            var product = productName(button);
            var index = items.indexOf(product);
            if (index === -1) items.push(product);
            else items.splice(index, 1);
            write(list, items);
            markButtons(name);
            showCount(name, index === -1);
            if (typeof showToast === "function") showToast(index === -1 ? list.added : list.removed);
        });
    });

    ["wishlist", "compare"].forEach(function (name) {
        markButtons(name);
        showCount(name, false);
    });

    window.refreshCompareCount = function () {
        markButtons("compare");
        showCount("compare", true);
    };
})();

(function () {
    var table = document.querySelector(".compare-table");
    if (!table) return;

    var products = [
        {
            "name": "Floral",
            "link": "product.html",
            "photo": "images/floral.png",
            "process": "Blend",
            "acidity": 72,
            "density": 38,
            "taste": "A light coffee with notes of <span class=\"note note-flowers\">flowers</span>, <span class=\"note note-berries\">dark berries</span> and <span class=\"note note-citrus\">citrus</span>",
            "price": 29.9,
            "oldPrice": 32.5,
            "rating": "4.6",
            "reviews": "687",
            "roast": "Espresso",
            "variety": "Bourbon, Catuai",
            "altitude": "1200–1600 m",
            "caffeine": "1.21%",
            "qScore": "83"
        },
        {
            "name": "Guatemala Santiago",
            "link": "#",
            "photo": "images/guatemala.png",
            "process": "Washed",
            "acidity": 48,
            "density": 64,
            "taste": "A sweet coffee with notes of <span class=\"note note-orange\">orange</span>, <span class=\"note note-fruit\">dried fruit</span> and <span class=\"note note-chocolate\">milk chocolate</span>",
            "price": 27.5,
            "oldPrice": 29.9,
            "rating": "4.6",
            "reviews": "1041",
            "roast": "Filter",
            "variety": "Caturra, Bourbon",
            "altitude": "1500–1800 m",
            "caffeine": "1.08%",
            "qScore": "84"
        },
        {
            "name": "Indonesia Sumatra Strawberry Karo",
            "link": "#",
            "photo": "images/guatemala.png",
            "process": "Infused",
            "acidity": 84,
            "density": 58,
            "taste": "A bright coffee with notes of <span class=\"note note-strawberry\">strawberry</span>, <span class=\"note note-cherry\">cherry</span>, <span class=\"note note-caramel\">cream caramel</span> and <span class=\"note note-chocolate\">milk chocolate</span>",
            "price": 24.9,
            "oldPrice": 29.7,
            "rating": "5",
            "reviews": "67",
            "roast": "Filter",
            "variety": "Ateng, Tim Tim",
            "altitude": "1400–1600 m",
            "caffeine": "1.15%",
            "qScore": "85"
        },
        {
            "name": "Costa Rica Reposado",
            "link": "#",
            "photo": "images/floral.png",
            "process": "Natural",
            "acidity": 52,
            "density": 70,
            "taste": "A bright coffee with notes of <span class=\"note note-tangerine\">tangerine</span>, <span class=\"note note-mango\">mango</span>, <span class=\"note note-apricot\">apricot</span> and <span class=\"note note-lemon\">lemon drops</span>",
            "price": 24.2,
            "oldPrice": 28.5,
            "rating": "0",
            "reviews": "6",
            "roast": "Espresso",
            "variety": "Catuai",
            "altitude": "1500–1700 m",
            "caffeine": "1.12%",
            "qScore": "86"
        },
        {
            "name": "Costa Rica Vista Al Santo",
            "link": "#",
            "photo": "images/guatemala.png",
            "process": "Natural",
            "acidity": 72,
            "density": 50,
            "taste": "A bright coffee with notes of <span class=\"note note-passion\">passion fruit</span>, <span class=\"note note-peach\">peach</span>, <span class=\"note note-raspberry\">raspberry</span> and <span class=\"note note-dark-chocolate\">dark chocolate</span>",
            "price": 24.9,
            "oldPrice": 29.5,
            "rating": "0",
            "reviews": "2",
            "roast": "Filter",
            "variety": "Villa Sarchi",
            "altitude": "1600–1800 m",
            "caffeine": "1.05%",
            "qScore": "87"
        },
        {
            "name": "Indonesia Sumatra Karo Funky",
            "link": "#",
            "photo": "images/floral.png",
            "process": "Natural funky",
            "acidity": 66,
            "density": 72,
            "taste": "A bright coffee with notes of <span class=\"note note-pineapple\">pineapple</span>, <span class=\"note note-passion\">passion fruit</span>, <span class=\"note note-vermouth\">berry vermouth</span> and <span class=\"note note-dark-chocolate\">dark chocolate</span>",
            "price": 24.7,
            "oldPrice": 29.0,
            "rating": "0",
            "reviews": "4",
            "roast": "Espresso",
            "variety": "Ateng, Gayo 1",
            "altitude": "1400–1700 m",
            "caffeine": "1.18%",
            "qScore": "86"
        },
        {
            "name": "Candy",
            "link": "#",
            "photo": "images/candy.png",
            "process": "Blend",
            "acidity": 26,
            "density": 88,
            "taste": "A dense coffee with notes of <span class=\"note note-dark-caramel\">dark caramel</span>, <span class=\"note note-candied\">candied fruit</span> and <span class=\"note note-spices\">spices</span>",
            "price": 33.2,
            "oldPrice": 0,
            "rating": "4.7",
            "reviews": "3454",
            "roast": "Espresso",
            "variety": "-",
            "altitude": "-",
            "caffeine": "1.19%",
            "qScore": "-"
        },
        {
            "name": "Ethiopia Yirgacheffe",
            "link": "#",
            "photo": "images/floral.png",
            "process": "Natural",
            "acidity": 50,
            "density": 54,
            "taste": "A sweet coffee with notes of <span class=\"note note-berries\">dark berries</span>, <span class=\"note note-citrus\">citrus</span> and <span class=\"note note-chocolate\">milk chocolate</span>",
            "price": 31.2,
            "oldPrice": 0,
            "rating": "4.7",
            "reviews": "6073",
            "roast": "Espresso",
            "variety": "Heirloom",
            "altitude": "1900–2200 m",
            "caffeine": "1.02%",
            "qScore": "85"
        },
        {
            "name": "Brazil Cerrado",
            "link": "#",
            "photo": "images/floral.png",
            "process": "Natural",
            "acidity": 34,
            "density": 70,
            "taste": "A dense coffee with notes of <span class=\"note note-nuts\">roasted nuts</span>, <span class=\"note note-chocolate\">chocolate</span> and <span class=\"note note-caramel\">caramel</span>",
            "price": 28.8,
            "oldPrice": 0,
            "rating": "4.7",
            "reviews": "6715",
            "roast": "Espresso",
            "variety": "Mundo Novo, Catuai",
            "altitude": "900–1100 m",
            "caffeine": "1.30%",
            "qScore": "82"
        },
        {
            "name": "Colombia Magdalena",
            "link": "#",
            "photo": "images/guatemala.png",
            "process": "Washed",
            "acidity": 80,
            "density": 56,
            "taste": "A juicy coffee with notes of <span class=\"note note-apple\">red apple</span>, <span class=\"note note-grapes\">dark grapes</span> and <span class=\"note note-cocoa\">cocoa</span>",
            "price": 33.2,
            "oldPrice": 0,
            "rating": "4.6",
            "reviews": "2031",
            "roast": "Filter",
            "variety": "Castillo, Caturra",
            "altitude": "1600–1900 m",
            "caffeine": "1.10%",
            "qScore": "84"
        },
        {
            "name": "Brazil Iguassu",
            "link": "#",
            "photo": "images/guatemala.png",
            "process": "Natural",
            "acidity": 42,
            "density": 50,
            "taste": "A sweet coffee with notes of <span class=\"note note-peanut\">peanut</span>, <span class=\"note note-cocoa\">cocoa powder</span> and <span class=\"note note-lemon\">lemon zest</span>",
            "price": 29.9,
            "oldPrice": 0,
            "rating": "4.6",
            "reviews": "2856",
            "roast": "Filter",
            "variety": "Yellow Catuai",
            "altitude": "1000–1200 m",
            "caffeine": "1.26%",
            "qScore": "83"
        },
        {
            "name": "Batch Brew",
            "link": "#",
            "photo": "images/guatemala.png",
            "process": "Blend",
            "acidity": 62,
            "density": 60,
            "taste": "A sweet <span class=\"note note-fruity\">fruity</span> coffee made for batch brew",
            "price": 33.9,
            "oldPrice": 0,
            "rating": "4.5",
            "reviews": "2463",
            "roast": "Filter",
            "variety": "-",
            "altitude": "-",
            "caffeine": "1.14%",
            "qScore": "-"
        },
        {
            "name": "Nutty",
            "link": "#",
            "photo": "images/candy.png",
            "process": "Blend",
            "acidity": 30,
            "density": 82,
            "taste": "A dense coffee with notes of <span class=\"note note-nuts\">roasted nuts</span>, <span class=\"note note-caramel\">cookies</span> and <span class=\"note note-chocolate\">nougat</span>",
            "price": 28.8,
            "oldPrice": 0,
            "rating": "4.7",
            "reviews": "5512",
            "roast": "Espresso",
            "variety": "-",
            "altitude": "-",
            "caffeine": "1.24%",
            "qScore": "-"
        },
        {
            "name": "Brownie",
            "link": "#",
            "photo": "images/candy.png",
            "process": "Blend",
            "acidity": 16,
            "density": 90,
            "taste": "A dense coffee with notes of <span class=\"note note-dark-chocolate\">dark chocolate</span>, <span class=\"note note-fruit\">raisins</span> and <span class=\"note note-nuts\">nut paste</span>",
            "price": 32.0,
            "oldPrice": 0,
            "rating": "4.7",
            "reviews": "1175",
            "roast": "Espresso",
            "variety": "-",
            "altitude": "-",
            "caffeine": "1.28%",
            "qScore": "-"
        },
        {
            "name": "Fruity",
            "link": "#",
            "photo": "images/floral.png",
            "process": "Blend",
            "acidity": 46,
            "density": 58,
            "taste": "A juicy coffee with notes of <span class=\"note note-orange\">orange</span>, <span class=\"note note-chocolate\">milk chocolate</span> and <span class=\"note note-fruit\">dried fruit</span>",
            "price": 33.2,
            "oldPrice": 0,
            "rating": "4.6",
            "reviews": "511",
            "roast": "Espresso",
            "variety": "-",
            "altitude": "-",
            "caffeine": "1.16%",
            "qScore": "-"
        },
        {
            "name": "Rwanda Kagano",
            "link": "#",
            "photo": "images/floral.png",
            "process": "Microlot",
            "acidity": 60,
            "density": 52,
            "taste": "A sweet coffee with notes of <span class=\"note note-peach\">nectarine</span>, <span class=\"note note-cherry\">bird cherry</span>, <span class=\"note note-lemon\">yellow apple</span> and <span class=\"note note-berries\">prune</span>",
            "price": 36.0,
            "oldPrice": 0,
            "rating": "4.5",
            "reviews": "157",
            "roast": "Espresso",
            "variety": "Red Bourbon",
            "altitude": "1700–1900 m",
            "caffeine": "1.04%",
            "qScore": "86"
        },
        {
            "name": "Batch Brew Lowcaf",
            "link": "#",
            "photo": "images/floral.png",
            "process": "50% caffeine, ethyl acetate + funky",
            "acidity": 70,
            "density": 44,
            "taste": "A bright coffee with notes of <span class=\"note note-peach\">peach</span>, <span class=\"note note-fruit\">plum</span>, <span class=\"note note-berries\">dark berries</span> and <span class=\"note note-caramel\">caramel</span>",
            "price": 42.8,
            "oldPrice": 0,
            "rating": "4.1",
            "reviews": "137",
            "roast": "Omni",
            "variety": "-",
            "altitude": "-",
            "caffeine": "0.61%",
            "qScore": "-"
        }
    ];

    var compareKey = "janz-compare";
    var diffBox = document.querySelector(".compare-diff input");
    var modal = document.querySelector(".compare-modal");
    var pick = modal.querySelector(".compare-pick");
    var search = modal.querySelector(".compare-search input");
    var pickEmpty = modal.querySelector(".compare-pick-empty");

    var rows = [
        { label: "Acidity", key: "acidity", bar: true },
        { label: "Density", key: "density", bar: true },
        { label: "Taste", key: "taste", html: true },
        { label: "Processing", key: "process" },
        { label: "Roast", key: "roast" },
        { label: "Variety", key: "variety" },
        { label: "Altitude", key: "altitude" },
        { label: "Caffeine", key: "caffeine" },
        { label: "Q-grader score", key: "qScore" }
    ];

    var trashIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13M10.5 11v5.5M13.5 11v5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var bagIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 8h15v11.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8M9.5 13l2 2 3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var starIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" /></svg>';
    var talkIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5z" /></svg>';
    var plusIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

    function readList() {
        try {
            var list = JSON.parse(localStorage.getItem(compareKey) || "[]");
            return Array.isArray(list) ? list : [];
        } catch (error) {
            return [];
        }
    }

    function writeList(list) {
        try { localStorage.setItem(compareKey, JSON.stringify(list)); } catch (error) {}
        if (window.refreshCompareCount) window.refreshCompareCount();
    }

    function findProduct(name) {
        return products.filter(function (item) { return item.name === name; })[0];
    }

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function money(value) {
        return "₼" + value.toFixed(2);
    }

    function plusTile() {
        var add = el("button", "compare-add");
        add.type = "button";
        add.setAttribute("aria-label", "Add products to compare");
        add.innerHTML = plusIcon;
        add.addEventListener("click", openModal);
        return add;
    }

    function render() {
        var chosen = readList().map(findProduct).filter(Boolean);
        table.innerHTML = "";
        table.style.setProperty("--compare-cols", chosen.length + 1);
        table.classList.toggle("is-empty", !chosen.length);
        diffBox.disabled = chosen.length < 2;

        var head = el("div", "compare-row compare-head");
        head.appendChild(el("div", "compare-label"));
        chosen.forEach(function (item) {
            var card = el("div", "compare-card");
            var top = el("div", "compare-card-top");
            var name = el("a", "compare-name", item.name);
            name.href = item.link;
            top.appendChild(name);
            var remove = el("button", "compare-remove");
            remove.type = "button";
            remove.setAttribute("aria-label", "Remove " + item.name + " from compare");
            remove.innerHTML = trashIcon;
            remove.addEventListener("click", function () {
                writeList(readList().filter(function (name) { return name !== item.name; }));
                render();
                showToast("Removed from compare");
            });
            top.appendChild(remove);
            card.appendChild(top);

            var photo = el("a", "compare-photo");
            photo.href = item.link;
            var img = el("img");
            img.src = item.photo;
            img.alt = item.name;
            photo.appendChild(img);
            card.appendChild(photo);

            var buy = el("button", "compare-buy");
            buy.type = "button";
            buy.setAttribute("aria-label", "Add " + item.name + " to cart");
            buy.innerHTML = (item.oldPrice ? "<s>" + money(item.oldPrice) + "</s>" : "") + "<strong>" + money(item.price) + "</strong>" + bagIcon;
            buy.addEventListener("click", function () {
                addToCart({ name: item.name, link: item.link, photo: item.photo, price: item.price, oldPrice: item.oldPrice,
                    weights: [{ label: "250 g", off: "" }, { label: "1000 g", off: "" }], weight: 0,
                    grinds: ["Whole beans"], grind: "Whole beans", qty: 1 });
                showCartCount(true);
                renderMiniCart();
                showToast("Added to cart");
            });
            card.appendChild(buy);
            head.appendChild(card);
        });
        var addCell = el("div", "compare-add-cell");
        addCell.appendChild(plusTile());
        head.appendChild(addCell);
        table.appendChild(head);

        if (!chosen.length) return;

        var rate = el("div", "compare-row compare-rating");
        rate.appendChild(el("div", "compare-label"));
        chosen.forEach(function (item) {
            var cell = el("div", "compare-cell");
            cell.innerHTML = '<span>' + starIcon + item.rating + '</span><span>' + talkIcon + item.reviews + '</span>';
            rate.appendChild(cell);
        });
        rate.appendChild(el("div"));
        table.appendChild(rate);

        rows.forEach(function (rowInfo) {
            var row = el("div", "compare-row");
            var values = chosen.map(function (item) { return String(item[rowInfo.key]); });
            row.dataset.same = values.every(function (value) { return value === values[0]; }) ? "true" : "false";
            row.appendChild(el("div", "compare-label", rowInfo.label));
            chosen.forEach(function (item) {
                var cell = el("div", "compare-cell");
                if (rowInfo.bar) {
                    var bar = el("i", "compare-bar");
                    var fill = el("b");
                    fill.style.width = item[rowInfo.key] + "%";
                    bar.appendChild(fill);
                    bar.setAttribute("aria-label", rowInfo.label + " " + item[rowInfo.key] + "%");
                    cell.appendChild(bar);
                } else if (rowInfo.html) {
                    cell.classList.add("compare-taste");
                    cell.innerHTML = item[rowInfo.key];
                } else {
                    cell.textContent = item[rowInfo.key];
                }
                row.appendChild(cell);
            });
            row.appendChild(el("div"));
            table.appendChild(row);
        });
        applyDiff();
    }

    function applyDiff() {
        var only = diffBox.checked && !diffBox.disabled;
        table.querySelectorAll(".compare-row[data-same]").forEach(function (row) {
            row.hidden = only && row.dataset.same === "true";
        });
    }

    diffBox.addEventListener("change", applyDiff);

    function fillPick() {
        var chosen = readList();
        pick.innerHTML = "";
        products.forEach(function (item) {
            var label = el("label", "compare-pick-item");
            label.dataset.name = item.name.toLowerCase();
            var box = el("input");
            box.type = "checkbox";
            box.value = item.name;
            box.checked = chosen.indexOf(item.name) !== -1;
            label.appendChild(box);
            var img = el("img");
            img.src = item.photo;
            img.alt = "";
            label.appendChild(img);
            label.appendChild(el("span", "", item.name));
            pick.appendChild(label);
        });
    }

    function filterPick() {
        var text = search.value.trim().toLowerCase();
        var shown = 0;
        pick.querySelectorAll(".compare-pick-item").forEach(function (item) {
            item.hidden = text !== "" && item.dataset.name.indexOf(text) === -1;
            if (!item.hidden) shown += 1;
        });
        pickEmpty.hidden = shown > 0;
    }

    var lastFocus = null;

    function openModal() {
        lastFocus = document.activeElement;
        fillPick();
        search.value = "";
        filterPick();
        modal.hidden = false;
        document.body.classList.add("is-locked");
        search.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove("is-locked");
        if (lastFocus) lastFocus.focus();
    }

    search.addEventListener("input", filterPick);
    modal.querySelector(".compare-modal-close").addEventListener("click", closeModal);
    modal.addEventListener("click", function (event) {
        if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) closeModal();
    });

    modal.querySelector(".compare-confirm").addEventListener("click", function () {
        var old = readList();
        var picked = [];
        pick.querySelectorAll("input:checked").forEach(function (box) { picked.push(box.value); });
        var list = old.filter(function (name) { return picked.indexOf(name) !== -1; });
        picked.forEach(function (name) { if (list.indexOf(name) === -1) list.push(name); });
        writeList(list);
        closeModal();
        render();
    });

    render();
})();

(function () {
    var form = document.getElementById("checkout");
    if (!form) return;

    var emptyBlock = document.querySelector(".cart-empty");
    var doneBlock = document.querySelector(".co-done");
    var lines = form.querySelector(".co-lines");
    var isDone = false;
    var likeBlocks = document.querySelectorAll("#cart > .cart-like, #cart > .card-grid");
    var codes = { promo: null, gift: null };

    var promoCodes = { JANZ10: 10, COFFEE15: 15 };
    var giftCards = { "GIFT-2026": 20 };

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function dayFrom(days) {
        var date = new Date();
        date.setDate(date.getDate() + days);
        return date.getDate() + " " + months[date.getMonth()];
    }

    var trashIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13M10.5 11v5.5M13.5 11v5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function renderLines(items) {
        lines.innerHTML = "";
        items.forEach(function (item, index) {
            var row = el("div", "co-line-item");

            var photo = el("a", "co-photo");
            photo.href = item.link || "product.html";
            if (item.photo) {
                var img = el("img");
                img.src = item.photo;
                img.alt = "";
                photo.appendChild(img);
            }
            row.appendChild(photo);

            var info = el("div", "co-info");
            var name = el("a", "co-name", item.name);
            name.href = item.link || "product.html";
            info.appendChild(name);
            var options = el("div", "mini-cart-options");
            (item.weights || []).forEach(function (weight, weightIndex) {
                var pill = el("button", "mini-cart-weight" + (weightIndex === item.weight ? " is-on" : ""), weight.label);
                pill.type = "button";
                if (weight.off) pill.appendChild(el("small", "", weight.off));
                pill.addEventListener("click", function () { changeLine(index, { weight: weightIndex }); });
                options.appendChild(pill);
            });
            if (item.grinds && item.grinds.length) {
                var select = el("select", "mini-cart-grind");
                select.setAttribute("aria-label", "Grind");
                item.grinds.forEach(function (grind) {
                    var option = el("option", "", grind);
                    option.selected = grind === item.grind;
                    select.appendChild(option);
                });
                select.addEventListener("change", function () { changeLine(index, { grind: select.value }); });
                options.appendChild(select);
            }
            info.appendChild(options);
            row.appendChild(info);

            var qty = el("div", "mini-cart-qty");
            var minus = el("button", "", "−");
            minus.type = "button";
            minus.setAttribute("aria-label", "Less " + item.name);
            minus.disabled = item.qty <= 1;
            minus.addEventListener("click", function () { changeLine(index, { qty: item.qty - 1 }); });
            var plus = el("button", "", "+");
            plus.type = "button";
            plus.setAttribute("aria-label", "More " + item.name);
            plus.addEventListener("click", function () { changeLine(index, { qty: item.qty + 1 }); });
            qty.appendChild(minus);
            qty.appendChild(el("span", "", String(item.qty)));
            qty.appendChild(plus);
            row.appendChild(qty);

            var price = el("div", "mini-cart-price");
            if (item.oldPrice) price.appendChild(el("s", "", money(item.oldPrice * item.qty)));
            price.appendChild(el("strong", "", money(item.price * item.qty)));
            row.appendChild(price);

            var remove = el("button", "mini-cart-remove");
            remove.type = "button";
            remove.setAttribute("aria-label", "Remove " + item.name);
            remove.innerHTML = trashIcon;
            remove.addEventListener("click", function () { changeLine(index, null); });
            row.appendChild(remove);

            lines.appendChild(row);
        });
    }

    function renderGift(items) {
        var packs = items.reduce(function (sum, item) {
            var weight = item.weights && item.weights[item.weight];
            return sum + (weight && weight.label === "250 g" ? item.qty : 0);
        }, 0);
        var gifts = Math.floor(packs / 6);
        var left = 6 - (packs % 6);
        var text = "Add " + left + " more " + (left === 1 ? "pack" : "packs") + " of 250 g coffee to get a gift";
        if (gifts) text = "You get " + gifts + (gifts === 1 ? " gift" : " gifts") + ". " + text.replace("a gift", "one more");
        form.querySelector(".co-gift-text").textContent = text;
        form.querySelector(".co-gift").classList.toggle("is-won", gifts > 0);
    }

    function selectedWay() {
        return form.querySelector("input[name=delivery]:checked");
    }

    function deliveryPrice(subtotal) {
        var way = selectedWay();
        if (!way) return 0;
        if (way.value === "courier") return subtotal >= 50 ? 0 : 4;
        return parseFloat(way.getAttribute("data-price")) || 0;
    }

    function renderTotals(items) {
        var full = 0;
        var discount = 0;
        items.forEach(function (item) {
            full += (item.oldPrice || item.price) * item.qty;
            if (item.oldPrice) discount += (item.oldPrice - item.price) * item.qty;
        });
        var subtotal = full - discount;
        var promo = codes.promo ? Math.round(subtotal * codes.promo.percent) / 100 : 0;
        var delivery = deliveryPrice(subtotal);
        var beforeGift = subtotal - promo + delivery;
        var gift = codes.gift ? Math.min(codes.gift.amount, beforeGift) : 0;
        var pay = beforeGift - gift;

        function put(key, text) {
            form.querySelectorAll('[data-sum="' + key + '"]').forEach(function (node) { node.textContent = text; });
        }

        put("items", money(full));
        put("discount", "−" + money(discount));
        form.querySelector(".co-row-discount").hidden = discount === 0;
        put("promo", "−" + money(promo + gift));
        form.querySelector(".co-row-promo").hidden = promo + gift === 0;
        form.querySelector(".co-row-promo dt").textContent = codes.promo && codes.gift ? "Promo code and certificate" : codes.gift ? "Gift certificate" : "Promo code";
        put("delivery", delivery ? money(delivery) : "free");
        put("pay", money(pay));
        var payWith = form.querySelector("input[name=pay]:checked");
        put("paywith", payWith ? "Payment: " + payWith.value.toLowerCase() : "");

        form.querySelectorAll(".co-way-price[data-free-over]").forEach(function (node) {
            node.textContent = subtotal >= 50 ? "Free" : money(4);
        });
    }

    function renderDates() {
        var way = selectedWay();
        var days = way ? parseInt(way.getAttribute("data-days"), 10) : 1;
        form.querySelector('[data-date="roast"]').textContent = dayFrom(1);
        form.querySelector('[data-date="ship"]').textContent = dayFrom(2);
        form.querySelector('[data-date="deliver"]').textContent = days === 0 ? "Today" : dayFrom(2) + " – " + dayFrom(2 + days);
        form.querySelectorAll(".co-way-date[data-days]").forEach(function (node) {
            var wayDays = parseInt(node.getAttribute("data-days"), 10);
            node.textContent = dayFrom(2) + (wayDays > 1 ? " – " + dayFrom(2 + wayDays) : "");
        });
    }

    function render() {
        var items = readCart();
        var count = items.reduce(function (sum, item) { return sum + item.qty; }, 0);

        doneBlock.hidden = !isDone;
        form.hidden = isDone || !items.length;
        emptyBlock.hidden = isDone || items.length > 0;
        likeBlocks.forEach(function (block) { block.hidden = emptyBlock.hidden; });
        if (form.hidden) return;

        form.querySelector(".co-count").textContent = count;
        renderLines(items);
        renderGift(items);
        renderTotals(items);
        renderDates();
    }

    document.addEventListener("janz-cart-change", render);

    form.querySelector(".co-clear").addEventListener("click", function () {
        writeCart([]);
        showCartCount(false);
        renderMiniCart();
        showToast("The cart is cleared");
    });

    form.querySelectorAll("[data-toggle]").forEach(function (box) {
        box.addEventListener("change", function () {
            var part = form.querySelector('[data-part="' + box.getAttribute("data-toggle") + '"]');
            part.hidden = !box.checked;
            part.querySelectorAll("input").forEach(function (input) { input.required = box.checked; });
        });
    });

    var addressForm = form.querySelector(".co-address-form");
    form.querySelector(".co-address-new").addEventListener("click", function () {
        addressForm.hidden = !addressForm.hidden;
        if (!addressForm.hidden) addressForm.querySelector("input[name=street]").focus();
    });

    form.querySelector(".co-address-save").addEventListener("click", function () {
        var city = addressForm.querySelector("input[name=city]").value.trim();
        var street = addressForm.querySelector("input[name=street]").value.trim();
        if (!street) {
            addressForm.querySelector("input[name=street]").focus();
            return;
        }
        var text = (city ? city + ", " : "") + street;
        var card = el("label", "co-address");
        var radio = el("input");
        radio.type = "radio";
        radio.name = "address";
        radio.value = text;
        radio.checked = true;
        card.appendChild(radio);
        card.appendChild(el("span", "", text));
        form.querySelector(".co-addresses").appendChild(card);
        addressForm.querySelector("input[name=street]").value = "";
        addressForm.hidden = true;
        showToast("Address is added");
    });

    form.querySelectorAll(".co-tabs button").forEach(function (tab) {
        tab.addEventListener("click", function () {
            var way = tab.getAttribute("data-way");
            form.querySelectorAll(".co-tabs button").forEach(function (other) {
                other.classList.toggle("is-on", other === tab);
                other.setAttribute("aria-selected", other === tab ? "true" : "false");
            });
            form.querySelectorAll(".co-ways").forEach(function (list) {
                list.hidden = list.getAttribute("data-way") !== way;
            });
            var first = form.querySelector('.co-ways[data-way="' + way + '"] input');
            if (first && !form.querySelector('.co-ways[data-way="' + way + '"] input:checked')) first.checked = true;
            render();
        });
    });

    form.addEventListener("change", function (event) {
        if (event.target.name === "delivery" || event.target.name === "pay") render();
        if (event.target.name === "repeat") form.querySelector(".co-repeat-box").hidden = !event.target.checked;
    });

    form.querySelectorAll(".co-code-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            var kind = button.getAttribute("data-code");
            var input = form.querySelector('input[name="' + kind + '"]');
            var note = form.querySelector('[data-note="' + kind + '"]');
            var code = input.value.trim().toUpperCase();
            note.hidden = false;
            note.classList.remove("is-ok");
            if (!code) {
                codes[kind] = null;
                note.textContent = "Write a code first";
            } else if (kind === "promo" && promoCodes[code]) {
                codes.promo = { code: code, percent: promoCodes[code] };
                note.textContent = code + ": −" + promoCodes[code] + "% is applied";
                note.classList.add("is-ok");
            } else if (kind === "gift" && giftCards[code]) {
                codes.gift = { code: code, amount: giftCards[code] };
                note.textContent = code + ": −" + money(giftCards[code]) + " is applied";
                note.classList.add("is-ok");
            } else {
                codes[kind] = null;
                note.textContent = "This code is not valid";
            }
            render();
        });
    });

    function check(input) {
        var field = input.closest(".co-field");
        var value = input.value.trim();
        var ok = !input.required || value !== "";
        if (ok && value && input.name === "phone") ok = value.replace(/\D/g, "").length === 9;
        if (ok && value && input.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (field) field.classList.toggle("is-error", !ok);
        return ok;
    }

    form.querySelectorAll(".co-field input").forEach(function (input) {
        input.addEventListener("blur", function () {
            if (input.value) check(input);
        });
        input.addEventListener("input", function () {
            var field = input.closest(".co-field");
            if (field && field.classList.contains("is-error")) check(input);
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var firstBad = null;
        form.querySelectorAll(".co-field input").forEach(function (input) {
            if (!check(input) && !firstBad) firstBad = input;
        });
        var agree = form.querySelector("input[name=agree]");
        form.querySelector(".co-agree-error").classList.toggle("is-shown", !agree.checked);
        if (firstBad) {
            firstBad.focus();
            showToast("Check the recipient details");
            return;
        }
        if (!agree.checked) {
            agree.focus();
            return;
        }

        doneBlock.querySelector(".co-done-number").textContent = "#" + (1000 + Math.floor(Math.random() * 9000));
        doneBlock.querySelector(".co-done-email").textContent = form.querySelector("input[name=email]").value.trim();
        isDone = true;
        writeCart([]);
        showCartCount(false);
        renderMiniCart();
        window.scrollTo(0, 0);
        showToast("The order is placed");
    });

    render();
})();

(function () {
    var page = document.getElementById("user-profile");
    if (!page) return;

    var colorCount = 9;
    var svgNs = "http://www.w3.org/2000/svg";

    page.querySelectorAll(".up-pref").forEach(function (pref) {
        var items = pref.querySelectorAll("li");
        var svg = pref.querySelector(".up-donut");
        var total = 0;
        items.forEach(function (item) { total += parseFloat(item.getAttribute("data-value")) || 0; });
        var radius = 15.915;
        var offset = 25;

        var wrap = document.createElement("div");
        wrap.className = "up-donut-wrap";
        svg.parentNode.insertBefore(wrap, svg);
        wrap.appendChild(svg);
        var tip = document.createElement("div");
        tip.className = "up-tip";
        tip.hidden = true;
        wrap.appendChild(tip);

        function showPart(index, event) {
            var item = items[index];
            var rings = svg.querySelectorAll("circle");
            rings.forEach(function (ring, ringIndex) { ring.classList.toggle("is-on", ringIndex === index); });
            items.forEach(function (other, otherIndex) { other.classList.toggle("is-on", otherIndex === index); });
            tip.textContent = item.firstChild.textContent.trim() + " ";
            tip.appendChild(item.querySelector("b").cloneNode(true));
            tip.hidden = false;
            var box = wrap.getBoundingClientRect();
            var x = event && event.clientX ? event.clientX - box.left : box.width / 2;
            var y = event && event.clientY ? event.clientY - box.top : box.height / 2;
            tip.style.left = x + "px";
            tip.style.top = y + "px";
        }

        function hidePart() {
            tip.hidden = true;
            svg.querySelectorAll("circle").forEach(function (ring) { ring.classList.remove("is-on"); });
            items.forEach(function (item) { item.classList.remove("is-on"); });
        }

        wrap.addEventListener("mouseleave", hidePart);
        items.forEach(function (item, index) {
            var value = parseFloat(item.getAttribute("data-value")) || 0;
            var share = total ? value / total * 100 : 0;
            var color = "var(--up-c" + (index % colorCount) + ")";

            var mark = document.createElement("b");
            mark.textContent = Math.round(share) + "%";
            item.appendChild(document.createTextNode(" "));
            item.appendChild(mark);
            item.style.setProperty("--dot", color);

            var ring = document.createElementNS(svgNs, "circle");
            ring.setAttribute("cx", "21");
            ring.setAttribute("cy", "21");
            ring.setAttribute("r", String(radius));
            ring.setAttribute("fill", "none");
            ring.style.stroke = color;
            ring.setAttribute("stroke-width", "4.5");
            ring.setAttribute("stroke-dasharray", Math.max(share - 1, 0.5) + " " + (100 - Math.max(share - 1, 0.5)));
            ring.setAttribute("stroke-dashoffset", String(offset));
            svg.appendChild(ring);
            offset -= share;

            ring.addEventListener("mousemove", function (event) { showPart(index, event); });
            item.addEventListener("mouseenter", function () { showPart(index, null); });
            item.addEventListener("mouseleave", hidePart);
        });
    });

    page.querySelectorAll(".up-tabs button").forEach(function (tab) {
        tab.addEventListener("click", function () {
            var name = tab.getAttribute("data-pref");
            page.querySelectorAll(".up-tabs button").forEach(function (other) {
                other.classList.toggle("is-on", other === tab);
                other.setAttribute("aria-selected", other === tab ? "true" : "false");
            });
            page.querySelectorAll(".up-pref").forEach(function (pref) {
                pref.hidden = pref.getAttribute("data-pref") !== name;
            });
        });
    });

    var follow = page.querySelector(".up-follow");
    var followers = page.querySelector("[data-followers]");
    var postFollows = page.querySelectorAll(".feed-follow");

    function setFollow(on) {
        follow.classList.toggle("is-on", on);
        follow.setAttribute("aria-pressed", on ? "true" : "false");
        follow.textContent = on ? "Following" : "Follow";
        postFollows.forEach(function (button) {
            button.classList.toggle("is-on", on);
            button.setAttribute("aria-pressed", on ? "true" : "false");
            button.textContent = on ? "Following" : "Follow";
        });
    }

    follow.addEventListener("click", function () {
        var on = !follow.classList.contains("is-on");
        followers.textContent = String((parseInt(followers.textContent, 10) || 0) + (on ? 1 : -1));
        setFollow(on);
    });

    postFollows.forEach(function (button) {
        button.addEventListener("click", function () {
            var on = button.classList.contains("is-on");
            if (on !== follow.classList.contains("is-on")) {
                followers.textContent = String((parseInt(followers.textContent, 10) || 0) + (on ? 1 : -1));
                setFollow(on);
            }
        });
    });

    page.querySelector(".up-share").addEventListener("click", function () {
        if (typeof openShare === "function") openShare(window.location.href);
    });
})();
