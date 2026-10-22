// Sifariş səhifəsi (cart.html): səbətdəki məhsullar, alıcı, çatdırılma, ödəniş və yekun məbləğ
// Hələlik brauzerdəki səbətlə işləyir (site.js: readCart, changeLine); MVC-də Orders/Create-ə göndəriləcək
(function () {
    var form = document.getElementById("checkout");
    if (!form) return;

    var emptyBlock = document.querySelector(".cart-empty");
    var doneBlock = document.querySelector(".co-done");
    var lines = form.querySelector(".co-lines");
    var isDone = false;
    // "You might like" yalnız səbət boş olanda görünür
    var likeBlocks = document.querySelectorAll("#cart > .cart-like, #cart > .card-grid");
    var codes = { promo: null, gift: null };

    // Nümunə kodlar: MVC-də kuponlar API-dən yoxlanacaq (F8)
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

    // Aksiya: hər 6 paket 250 g kofeyə hədiyyə
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

        // Kuryer qiyməti: 50 manatdan yuxarı pulsuz
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

    // Şirkət üçün və başqa alıcı: əlavə sahələr
    form.querySelectorAll("[data-toggle]").forEach(function (box) {
        box.addEventListener("change", function () {
            var part = form.querySelector('[data-part="' + box.getAttribute("data-toggle") + '"]');
            part.hidden = !box.checked;
            part.querySelectorAll("input").forEach(function (input) { input.required = box.checked; });
        });
    });

    // Yeni ünvan
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

    // Kuryer / Məntəqə tabları
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

    // Promo kod və hədiyyə sertifikatı
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

    // Yoxlama və göndərmə
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
