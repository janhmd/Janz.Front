// Müqayisə səhifəsi: məhsullar yan-yana, "+" ilə pəncərədən seçilir
// Hələlik nümunə məlumatlarla işləyir; MVC-də məhsullar və istifadəçinin siyahısı API-dən gələcək
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

        // 1-ci sətir: kartlar və "+"
        var head = el("div", "compare-row compare-head");
        head.appendChild(el("div", "compare-label"));
        chosen.forEach(function (item) {
            var card = el("article", "compare-card");
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
                // site.js-dəki səbət funksiyaları: header sayğacı və hover paneli yenilənir
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

        // Reytinq
        var rate = el("div", "compare-row compare-rating");
        rate.appendChild(el("div", "compare-label"));
        chosen.forEach(function (item) {
            var cell = el("div", "compare-cell");
            cell.innerHTML = '<span>' + starIcon + item.rating + '</span><span>' + talkIcon + item.reviews + '</span>';
            rate.appendChild(cell);
        });
        rate.appendChild(el("div"));
        table.appendChild(rate);

        // Xüsusiyyətlər
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

    // "Yalnız fərqlər": hamısında eyni olan sətirlər gizlənir
    function applyDiff() {
        var only = diffBox.checked && !diffBox.disabled;
        table.querySelectorAll(".compare-row[data-same]").forEach(function (row) {
            row.hidden = only && row.dataset.same === "true";
        });
    }

    diffBox.addEventListener("change", applyDiff);

    // Pəncərə: axtarış və seçim
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
        // Seçilənlər əvvəlki sıra ilə qalır, yenilər sona əlavə olunur
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
