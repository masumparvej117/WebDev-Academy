
// ========================================
// WEB ACADEMY BD - MAIN JAVASCRIPT
// ========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const root = document.documentElement;

    // ========================================
    // 1. LUCIDE ICONS
    // ========================================

    function refreshIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    refreshIcons();


    // ========================================
    // 2. MOBILE MENU
    // ========================================

    const menuBtn =
        document.getElementById("menuBtn") ||
        document.getElementById("menu-btn");

    const mobileMenu =
        document.getElementById("mobileMenu") ||
        document.getElementById("mobile-menu");

    if (menuBtn && mobileMenu) {

        menuBtn.addEventListener("click", () => {

            const isOpening =
                mobileMenu.classList.contains("hidden");

            mobileMenu.classList.toggle("hidden");

            menuBtn.setAttribute(
                "aria-expanded",
                String(isOpening)
            );

            menuBtn.setAttribute(
                "aria-label",
                isOpening ? "Close menu" : "Open menu"
            );

            if (menuBtn.id === "menuBtn") {
                menuBtn.innerHTML = isOpening
                    ? '<i data-lucide="x"></i>'
                    : '<i data-lucide="menu"></i>';

                refreshIcons();
            }

        });

        // Menu link click করলে menu বন্ধ হবে
        mobileMenu.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.classList.add("hidden");

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

                if (menuBtn.id === "menuBtn") {
                    menuBtn.innerHTML =
                        '<i data-lucide="menu"></i>';

                    refreshIcons();
                }

            });

        });

        // Desktop screen এ menu reset
        window.addEventListener("resize", () => {

            if (window.innerWidth >= 1024) {

                mobileMenu.classList.add("hidden");

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });

    }


    // ========================================
    // 3. DARK / LIGHT MODE
    // ========================================

    const themeBtn =
        document.getElementById("themeBtn") ||
        document.getElementById("theme-toggle") ||
        document.getElementById("themeToggle");

    function getSavedTheme() {

        return (
            localStorage.getItem("webAcademyTheme") ||
            localStorage.getItem("theme") ||
            "light"
        );

    }

    function updateThemeIcon() {

        if (!themeBtn) return;

        const isDark =
            root.classList.contains("dark");

        themeBtn.innerHTML = isDark
            ? '<i data-lucide="sun"></i>'
            : '<i data-lucide="moon"></i>';

        themeBtn.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );

        refreshIcons();

    }

    function applyTheme(theme) {

        const selectedTheme =
            theme === "dark" ? "dark" : "light";

        root.classList.toggle(
            "dark",
            selectedTheme === "dark"
        );

        localStorage.setItem(
            "webAcademyTheme",
            selectedTheme
        );

        localStorage.setItem(
            "theme",
            selectedTheme
        );

        updateThemeIcon();

    }

    applyTheme(getSavedTheme());

    if (themeBtn) {

        themeBtn.addEventListener("click", () => {

            const isDark =
                root.classList.contains("dark");

            applyTheme(isDark ? "light" : "dark");

        });

    }

    // অন্য পেজের Theme পরিবর্তনের সঙ্গে sync
    window.addEventListener("storage", event => {

        if (
            event.key === "webAcademyTheme" ||
            event.key === "theme"
        ) {

            applyTheme(
                event.newValue || "light"
            );

        }

    });


    // ========================================
    // 4. SMOOTH SCROLL
    // ========================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target =
                document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    // ========================================
    // 5. BACK TO TOP
    // ========================================

    const backToTop =
        document.getElementById("back-to-top") ||
        document.getElementById("backToTop");

    if (backToTop) {

        function updateBackToTop() {

            backToTop.classList.toggle(
                "hidden",
                window.scrollY < 400
            );

        }

        window.addEventListener(
            "scroll",
            updateBackToTop,
            { passive: true }
        );

        updateBackToTop();

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // ========================================
    // 6. SCROLL REVEAL ANIMATION
    // ========================================

    const revealElements =
        document.querySelectorAll(
            ".reveal, .reveal-left, .reveal-right"
        );

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("active");

                            observer.unobserve(entry.target);

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("active");
        });

    }


    // ========================================
    // 7. HEADER SCROLL SHADOW
    // ========================================

    const header =
        document.querySelector("header");

    if (header) {

        window.addEventListener("scroll", () => {

            header.classList.toggle(
                "shadow-lg",
                window.scrollY > 30
            );

        }, { passive: true });

    }


    // ========================================
    // 8. BUTTON CLICK EFFECT
    // ========================================

    document.querySelectorAll("button").forEach(button => {

        button.addEventListener("click", () => {

            button.classList.add("button-clicked");

            setTimeout(() => {
                button.classList.remove("button-clicked");
            }, 180);

        });

    });


    // ========================================
    // 9. IMAGE LOADING EFFECT
    // ========================================

    document.querySelectorAll("img").forEach(img => {

        img.addEventListener("error", () => {

            img.classList.add("image-error");

        });

    });


    // ========================================
    // 10. FINAL ICON REFRESH
    // ========================================

    refreshIcons();

});


// ========================================
// 11. LANGUAGE TRANSLATIONS
// ========================================

const translations = {

    bn: {
        home: "হোম",
        courses: "কোর্সসমূহ",
        about: "আমাদের সম্পর্কে",
        contact: "যোগাযোগ",
        login: "লগইন",
        register: "রেজিস্ট্রেশন",
        heroTitle: "শিখো, দক্ষতা বাড়াও এবং ক্যারিয়ার গড়ো",
        heroText: "বাংলায় সহজভাবে Web Development শেখার সম্পূর্ণ প্ল্যাটফর্ম।",
        exploreCourses: "কোর্স দেখো",
        learnMore: "আরও জানো",
        popularCourses: "জনপ্রিয় কোর্সসমূহ",
        allCourses: "সকল কোর্স",
        free: "ফ্রি",
        premium: "প্রিমিয়াম",
        startLearning: "শেখা শুরু করো",
        viewCourse: "কোর্স দেখো",
        features: "আমাদের সুবিধাসমূহ",
        footerText: "তোমার ওয়েব ডেভেলপমেন্ট শেখার বিশ্বস্ত প্ল্যাটফর্ম।",
        language: "ভাষা"
    },

    en: {
        home: "Home",
        courses: "Courses",
        about: "About Us",
        contact: "Contact",
        login: "Login",
        register: "Register",
        heroTitle: "Learn, Improve Your Skills and Build Your Career",
        heroText: "A complete platform to learn Web Development easily in Bangla.",
        exploreCourses: "Explore Courses",
        learnMore: "Learn More",
        popularCourses: "Popular Courses",
        allCourses: "All Courses",
        free: "Free",
        premium: "Premium",
        startLearning: "Start Learning",
        viewCourse: "View Course",
        features: "Our Features",
        footerText: "Your trusted platform for learning Web Development.",
        language: "Language"
    }

};


// ========================================
// 12. CHANGE LANGUAGE
// ========================================

function changeLanguage(language) {

    if (!translations[language]) return;

    localStorage.setItem(
        "webAcademyLanguage",
        language
    );

    localStorage.setItem(
        "language",
        language
    );

    document.documentElement.lang = language;


    // data-translate
    document.querySelectorAll("[data-translate]").forEach(element => {

        const key =
            element.getAttribute("data-translate");

        const translatedText =
            translations[language][key];

        if (translatedText !== undefined) {

            element.textContent = translatedText;

        }

    });


    // data-bn এবং data-en
    document.querySelectorAll("[data-bn][data-en]").forEach(element => {

        const translatedText =
            element.getAttribute(
                language === "bn" ? "data-bn" : "data-en"
            );

        if (translatedText !== null) {

            element.textContent = translatedText;

        }

    });


    // Placeholder translation
    document.querySelectorAll(
        "[data-placeholder-bn][data-placeholder-en]"
    ).forEach(element => {

        element.placeholder = element.getAttribute(
            language === "bn"
                ? "data-placeholder-bn"
                : "data-placeholder-en"
        );

    });


    // Language button active state
    document.querySelectorAll(
        "[data-language]"
    ).forEach(button => {

        const isActive =
            button.getAttribute("data-language") === language;

        button.classList.toggle(
            "bg-blue-600",
            isActive
        );

        button.classList.toggle(
            "text-white",
            isActive
        );

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );

    });


    // Inline onclick support
    document.querySelectorAll(
        "[onclick*='changeLanguage']"
    ).forEach(button => {

        const onclickValue =
            button.getAttribute("onclick") || "";

        const isActive =
            onclickValue.includes(`'${language}'`) ||
            onclickValue.includes(`"${language}"`);

        button.classList.toggle(
            "bg-blue-600",
            isActive
        );

        button.classList.toggle(
            "text-white",
            isActive
        );

    });

}


// Make function globally available
window.changeLanguage = changeLanguage;


// ========================================
// 13. LANGUAGE BUTTON SUPPORT
// ========================================

document.addEventListener("click", event => {

    const languageButton =
        event.target.closest("[data-language]");

    if (!languageButton) return;

    const language =
        languageButton.getAttribute("data-language");

    changeLanguage(language);

});


// ========================================
// 14. RESTORE SAVED LANGUAGE
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const savedLanguage =
        localStorage.getItem("webAcademyLanguage") ||
        localStorage.getItem("language") ||
        "bn";

    changeLanguage(savedLanguage);

});


// ========================================
// END MAIN JAVASCRIPT
// ========================================
 