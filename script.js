document.addEventListener("DOMContentLoaded", function () {
    const orderForm = document.getElementById("order-form");
    const quantityInput = document.getElementById("quantity");
    const quantityError = document.getElementById("quantity-error");
    const optionField = document.getElementById("option-field");
    const optionSelect = document.getElementById("option");
    const propertyField = document.getElementById("property-field");
    const propertyCheckbox = document.getElementById("property");
    const resultText = document.getElementById("result-text");

    const galleryTrack = document.getElementById("gallery-track");
    const gallerySlides = Array.from(
        galleryTrack.querySelectorAll(".gallery-slide")
    );
    const previousButton = document.getElementById("gallery-prev");
    const nextButton = document.getElementById("gallery-next");
    const pager = document.getElementById("gallery-pager");

    const quantityPattern = /^[1-9]\d*$/;

    let currentPage = 0;
    let slidesPerPage = getSlidesPerPage();
    let pageCount = getPageCount();

    /* Логика калькулятора */

    function getSelectedProduct() {
        return orderForm.querySelector("input[name='product']:checked");
    }

    function getPrice(element) {
        return parseInt(element.getAttribute("data-price"), 10);
    }

    function showError(message) {
        quantityError.textContent = message;
        quantityError.hidden = false;
        quantityInput.setAttribute("aria-invalid", "true");
        resultText.textContent = "Стоимость: —";
    }

    function clearError() {
        quantityError.textContent = "";
        quantityError.hidden = true;
        quantityInput.removeAttribute("aria-invalid");
    }

    function updateFieldsVisibility(productType) {
        optionField.hidden = productType !== "notebook";
        propertyField.hidden = productType !== "folder";

        if (productType !== "folder") {
            propertyCheckbox.checked = false;
        }
    }

    function calculate() {
        const product = getSelectedProduct();
        const quantityValue = quantityInput.value.trim();
        let unitPrice = getPrice(product);
        let quantity = 0;
        let total = 0;

        updateFieldsVisibility(product.value);

        if (!quantityPattern.test(quantityValue)) {
            showError("Ошибка: введите целое положительное число.");
            return;
        }

        quantity = parseInt(quantityValue, 10);

        if (!Number.isSafeInteger(quantity)) {
            showError("Ошибка: введённое количество слишком велико.");
            return;
        }

        if (product.value === "notebook") {
            unitPrice += getPrice(
                optionSelect.options[optionSelect.selectedIndex]
            );
        }

        if (product.value === "folder" && propertyCheckbox.checked) {
            unitPrice += getPrice(propertyCheckbox);
        }

        total = unitPrice * quantity;

        if (!Number.isSafeInteger(total)) {
            showError("Ошибка: стоимость заказа слишком велика.");
            return;
        }

        clearError();

        resultText.textContent = "Стоимость: " +
            unitPrice.toLocaleString("ru-RU") + " ₽ × " +
            quantity.toLocaleString("ru-RU") + " = " +
            total.toLocaleString("ru-RU") + " ₽";
    }

    /* Логика галереи */

    function getSlidesPerPage() {
        return window.matchMedia("(max-width: 767px)").matches ? 1 : 3;
    }

    function getPageCount() {
        return Math.ceil(gallerySlides.length / slidesPerPage);
    }

    function updateGallery() {
        const firstSlide = gallerySlides[0];
        const trackStyles = window.getComputedStyle(galleryTrack);
        const gap = parseFloat(trackStyles.columnGap) || 0;
        const slideWidth = firstSlide.getBoundingClientRect().width;
        const offset = currentPage * slidesPerPage * (slideWidth + gap);

        galleryTrack.style.transform = "translateX(-" + offset + "px)";
        pager.textContent = "Страница " + (currentPage + 1) +
            " из " + pageCount;

        previousButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage >= pageCount - 1;
    }

    function changePage(direction) {
        const newPage = currentPage + direction;

        if (newPage < 0 || newPage >= pageCount) {
            return;
        }

        currentPage = newPage;
        updateGallery();
    }

    /* Обработчики событий калькулятора */

    orderForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    quantityInput.addEventListener("input", calculate);
    optionSelect.addEventListener("change", calculate);
    propertyCheckbox.addEventListener("change", calculate);

    orderForm.querySelectorAll("input[name='product']").forEach(
        function (radio) {
            radio.addEventListener("change", calculate);
        }
    );

    /* Обработчики событий галереи */

    previousButton.addEventListener("click", function () {
        changePage(-1);
    });

    nextButton.addEventListener("click", function () {
        changePage(1);
    });

    window.addEventListener("resize", function () {
        const newSlidesPerPage = getSlidesPerPage();

        if (newSlidesPerPage !== slidesPerPage) {
            slidesPerPage = newSlidesPerPage;
            pageCount = getPageCount();
            currentPage = 0;
        }

        updateGallery();
    });

    window.addEventListener("load", updateGallery);

    gallerySlides.forEach(function (slide) {
        const image = slide.querySelector("img");
        image.addEventListener("load", updateGallery);
    });

    /* Форма обратной связи */

    // Вставьте сюда адрес вашей формы (formcarry.com или slapform.com)
    const FORM_ENDPOINT = "https://formcarry.com/s/YmktN9Pfrkk";
    const STORAGE_KEY = "feedbackFormData";
    const MODAL_HASH = "#feedback";

    const feedbackModal = document.getElementById("feedback-modal");
    const feedbackForm = document.getElementById("feedback-form");
    const feedbackOpen = document.getElementById("feedback-open");
    const feedbackClose = document.getElementById("feedback-close");
    const feedbackSubmit = document.getElementById("feedback-submit");
    const feedbackStatus = document.getElementById("feedback-status");
    const nameInput = document.getElementById("fb-name");
    const emailInput = document.getElementById("fb-email");
    const phoneInput = document.getElementById("fb-phone");
    const organizationInput = document.getElementById("fb-organization");
    const messageInput = document.getElementById("fb-message");
    const consentInput = document.getElementById("fb-consent");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const namePattern = /^[A-Za-zА-Яа-яЁё-]{2,}(?:\s+[A-Za-zА-Яа-яЁё-]{2,}){2}$/;
    const phonePattern = /^(?:\+7|8)\d{10}$/;

    let lastFocusedElement = null;

    function getFormData() {
        return {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            organization: organizationInput.value.trim(),
            message: messageInput.value.trim(),
            consent: consentInput.checked
        };
    }

    function saveFormData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                organization: organizationInput.value,
                message: messageInput.value,
                consent: consentInput.checked
            }));
        } catch (ignore) {
            // LocalStorage недоступен — форма продолжает работать без сохранения
        }
    }

    function restoreFormData() {
        let saved = null;

        try {
            saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        } catch (ignore) {
            saved = null;
        }

        if (!saved || typeof saved !== "object") {
            return;
        }

        nameInput.value = saved.name || "";
        emailInput.value = saved.email || "";
        phoneInput.value = saved.phone || "";
        organizationInput.value = saved.organization || "";
        messageInput.value = saved.message || "";
        consentInput.checked = saved.consent === true;
    }

    function clearFormData() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (ignore) {
            // нечего очищать
        }
    }

    function showStatus(message, type) {
        feedbackStatus.textContent = message;
        feedbackStatus.className = "form-status form-status-" + type;
        feedbackStatus.hidden = false;
    }

    function hideStatus() {
        feedbackStatus.textContent = "";
        feedbackStatus.hidden = true;
    }

    function clearInvalidMarks() {
        [nameInput, emailInput, phoneInput, organizationInput, messageInput, consentInput].forEach(
            function (field) {
                field.removeAttribute("aria-invalid");
            }
        );
    }

    function validateFeedback() {
        const data = getFormData();

        if (!namePattern.test(data.name)) {
            return {
                field: nameInput,
                message: "Введите ФИО полностью: фамилию, имя и отчество (три слова)."
            };
        }

        if (!emailPattern.test(data.email)) {
            return {field: emailInput, message: "Введите корректный email."};
        }

        if (!phonePattern.test(data.phone.replace(/[\s()\-]/g, ""))) {
            return {
                field: phoneInput,
                message: "Телефон должен начинаться с +7 или 8 и содержать 11 цифр."
            };
        }

        if (data.organization === "") {
            return {
                field: organizationInput,
                message: "Введите название организации."
            };
        }

        if (!data.consent) {
            return {
                field: consentInput,
                message: "Необходимо согласие с политикой обработки персональных данных."
            };
        }

        return null;
    }

    /* Показ и скрытие попапа */

    function showModal() {
        if (!feedbackModal.hidden) {
            return;
        }

        lastFocusedElement = document.activeElement;
        hideStatus();
        clearInvalidMarks();
        feedbackModal.hidden = false;
        document.body.classList.add("modal-open");
        nameInput.focus();
    }

    function hideModal() {
        if (feedbackModal.hidden) {
            return;
        }

        feedbackModal.hidden = true;
        document.body.classList.remove("modal-open");

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    function openFeedback() {
        if (!feedbackModal.hidden) {
            return;
        }

        history.pushState({feedbackModal: true}, "", MODAL_HASH);
        showModal();
    }

    function closeFeedback() {
        if (history.state && history.state.feedbackModal) {
            // popstate сам скроет попап
            history.back();
            return;
        }

        hideModal();

        if (window.location.hash === MODAL_HASH) {
            history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search
            );
        }
    }

    /* Отправка формы */

    async function sendFeedback(event) {
        event.preventDefault();
        hideStatus();
        clearInvalidMarks();

        const problem = validateFeedback();

        if (problem) {
            problem.field.setAttribute("aria-invalid", "true");
            showStatus(problem.message, "error");
            problem.field.focus();
            return;
        }

        feedbackSubmit.disabled = true;
        feedbackSubmit.textContent = "Отправка...";

        try {
            const response = await fetch(FORM_ENDPOINT, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(getFormData())
            });
            let answer = {};

            try {
                answer = await response.json();
            } catch (ignore) {
                answer = {};
            }

            if (response.ok && answer.status !== "error") {
                clearFormData();
                feedbackForm.reset();
                showStatus("Спасибо! Ваше сообщение успешно отправлено.", "success");
            } else {
                showStatus(
                    "Не удалось отправить сообщение: " +
                            (answer.message || "ошибка сервера (" + response.status + ")"),
                    "error"
                );
            }
        } catch (ignore) {
            showStatus(
                "Ошибка сети. Проверьте подключение и попробуйте ещё раз.",
                "error"
            );
        } finally {
            feedbackSubmit.disabled = false;
            feedbackSubmit.textContent = "Отправить";
        }
    }

    /* Обработчики событий формы обратной связи */

    feedbackOpen.addEventListener("click", openFeedback);
    feedbackClose.addEventListener("click", closeFeedback);
    feedbackForm.addEventListener("submit", sendFeedback);

    feedbackForm.addEventListener("input", function (event) {
        event.target.removeAttribute("aria-invalid");
        saveFormData();
    });

    feedbackForm.addEventListener("change", saveFormData);

    feedbackModal.addEventListener("click", function (event) {
        if (event.target === feedbackModal) {
            closeFeedback();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !feedbackModal.hidden) {
            closeFeedback();
        }
    });

    window.addEventListener("popstate", function () {
        if (window.location.hash === MODAL_HASH) {
            showModal();
        } else {
            hideModal();
        }
    });

    /* Первоначальная настройка */

    calculate();
    updateGallery();
    restoreFormData();

    if (window.location.hash === MODAL_HASH) {
        showModal();
    }
});