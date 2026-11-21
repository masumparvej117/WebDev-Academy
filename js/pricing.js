
// ==========================================
// WEB ACADEMY BD - PRICING PAGE
// ==========================================

// DOM Elements
const themeToggle = document.getElementById("themeToggle");
const accountBtn = document.getElementById("accountBtn");

// ==========================================
// Account Button
// ==========================================

function updateAccountButton() {
    const session = localStorage.getItem("webAcademyCurrentUser");

    if (session) {
        accountBtn.textContent = "Dashboard";
        accountBtn.href = "dashboard.html";
    } else {
        accountBtn.textContent = "Login";
        accountBtn.href = "auth.html";
    }
}

// ==========================================
// Theme System
// ==========================================

function applyTheme() {
    const theme = localStorage.getItem("webAcademyTheme");

    document.documentElement.classList.toggle(
        "dark",
        theme === "dark"
    );

    if (window.lucide) {
        lucide.createIcons();
    }
}

themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");

    localStorage.setItem(
        "webAcademyTheme",
        isDark ? "light" : "dark"
    );

    applyTheme();
});

// ==========================================
// FAQ Accordion
// ==========================================

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    question.addEventListener("click", () => {
        const isOpen = !answer.classList.contains("hidden");

        // Close all other FAQs
        faqItems.forEach(otherItem => {
            otherItem.querySelector(".faq-answer").classList.add("hidden");

            const otherIcon = otherItem.querySelector(".faq-icon");

            if (otherIcon) {
                otherIcon.setAttribute("data-lucide", "plus");
            }

            otherItem.querySelector(".faq-question")
                .setAttribute("aria-expanded", "false");
        });

        // Toggle selected FAQ
        if (!isOpen) {
            answer.classList.remove("hidden");
            icon.setAttribute("data-lucide", "minus");
            question.setAttribute("aria-expanded", "true");
        }

        if (window.lucide) {
            lucide.createIcons();
        }
    });

    question.setAttribute("aria-expanded", "false");
});

// ==========================================
// Initialize
// ==========================================

updateAccountButton();
applyTheme();

if (window.lucide) {
    lucide.createIcons();
}
