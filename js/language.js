
/* ========================================
   WEB ACADEMY BD - LANGUAGE SYSTEM
======================================== */

const translations = {

    en: {
        home: "Home",
        courses: "Courses",
        playground: "Playground",
        pricing: "Pricing",
        login: "Login",
        signup: "Get Started",
        heroTitle: "Learn Web Development From Zero",
        heroText: "Learn HTML, CSS, JavaScript and modern web technologies step by step.",
        exploreCourses: "Explore Courses",
        freeCourses: "Free Courses",
        premiumCourses: "Premium Courses",
        comingSoon: "Coming Soon",
        learnMore: "Learn More"
    },

    bn: {
        home: "হোম",
        courses: "কোর্সসমূহ",
        playground: "কোড এডিটর",
        pricing: "মূল্য তালিকা",
        login: "লগইন",
        signup: "শুরু করো",
        heroTitle: "শূন্য থেকে ওয়েব ডেভেলপমেন্ট শেখো",
        heroText: "HTML, CSS, JavaScript এবং আধুনিক ওয়েব প্রযুক্তি ধাপে ধাপে শেখো।",
        exploreCourses: "কোর্স দেখো",
        freeCourses: "ফ্রি কোর্স",
        premiumCourses: "প্রিমিয়াম কোর্স",
        comingSoon: "শীঘ্রই আসছে",
        learnMore: "বিস্তারিত দেখো"
    }

};


/* ========================================
   CHANGE LANGUAGE
======================================== */

function changeLanguage(lang) {

    if (!translations[lang]) return;

    document.documentElement.lang = lang;

    // Translate all elements
    document.querySelectorAll("[data-i18n]").forEach(element => {

        const key = element.getAttribute("data-i18n");

        if (Object.prototype.hasOwnProperty.call(
            translations[lang],
            key
        )) {
            element.textContent = translations[lang][key];
        }

    });

    // Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {

        const key = element.getAttribute("data-i18n-placeholder");

        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }

    });

    // Save selected language
    localStorage.setItem("language", lang);
    localStorage.setItem("webAcademyLanguage", lang);

    // Update language buttons
   document.querySelectorAll("[data-language]").forEach(button => {
    const active = button.dataset.language === lang;

    button.classList.toggle("bg-blue-600", active);
    button.classList.toggle("text-white", active);
    button.classList.toggle("font-bold", active);
});


}


/* ========================================
   MAKE FUNCTION GLOBAL
======================================== */

window.changeLanguage = changeLanguage;


/* ========================================
   LOAD SAVED LANGUAGE
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    const savedLanguage =
        localStorage.getItem("webAcademyLanguage") ||
        localStorage.getItem("language") ||
        "bn";

    changeLanguage(savedLanguage);

});
