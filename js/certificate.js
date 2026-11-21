
/* ==========================================
   WEB ACADEMY BD - CERTIFICATE SYSTEM
   File: js/certificate.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ======================================
    // STORAGE KEYS
    // ======================================

    const SESSION_KEY = "webAcademyCurrentUser";
    const USERS_KEY = "webAcademyUsers";
    const COURSES_KEY = "webAcademyCourses";

    // lesson.js-এর সঙ্গে একই Progress Key
    const PROGRESS_KEY = "webAcademyLessonProgress";

    const CERTIFICATES_KEY = "webAcademyCertificates";
    const THEME_KEY = "webAcademyTheme";

    // ======================================
    // DOM ELEMENTS
    // ======================================

    const el = {
        certificateList: document.getElementById("certificateList"),
        emptyState: document.getElementById("emptyState"),
        completedCount: document.getElementById("completedCount"),

        studentName: document.getElementById("studentName"),
        studentEmail: document.getElementById("studentEmail"),

        previewSection: document.getElementById("certificatePreviewSection"),

        certStudentName: document.getElementById("certStudentName"),
        certCourseName: document.getElementById("certCourseName"),
        certDate: document.getElementById("certDate"),
        certId: document.getElementById("certId"),

        printButton: document.getElementById("printCertificate"),
        closeButton: document.getElementById("closeCertificate"),
        themeToggle: document.getElementById("themeToggle")
    };

    // ======================================
    // SAFE STORAGE
    // ======================================

    function readStorage(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);

            if (value === null) return fallback;

            return JSON.parse(value);
        } catch {
            return fallback;
        }
    }

    function saveStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // ======================================
    // HTML ESCAPE
    // ======================================

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    // ======================================
    // CURRENT USER
    // ======================================

    function getCurrentUser() {
        const session = localStorage.getItem(SESSION_KEY);

        // if (!session) {
        //     alert("Certificate দেখতে আগে Login করো।");
        //     location.href = "auth.html";
        //     return null;
        // }

        // JSON অথবা Plain Text Session
        try {
            const parsed = JSON.parse(session);

            if (parsed && typeof parsed === "object") {
                return parsed;
            }

            if (typeof parsed === "string" && parsed.trim()) {
                return findUser(parsed) || {
                    username: parsed
                };
            }
        } catch {
            const user = findUser(session);

            if (user) return user;

            return {
                username: session
            };
        }

        return null;
    }

    function findUser(value) {
        const users = readStorage(USERS_KEY, []);

        if (!Array.isArray(users)) return null;

        return users.find(user =>
            user.username === value ||
            user.email === value
        ) || null;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) return;

    // ======================================
    // COURSE DATA
    // ======================================

    const defaultCourses = [
        {
            id: "html",
            title: "HTML Fundamentals",
            subtitle: "Learn HTML from beginner to advanced.",
            type: "free",
            lessons: [
                { id: 0, title: "HTML Introduction" },
                { id: 1, title: "HTML Structure" },
                { id: 2, title: "HTML Headings" },
                { id: 3, title: "HTML Paragraphs" },
                { id: 4, title: "HTML Links" },
                { id: 5, title: "HTML Images" },
                { id: 6, title: "HTML Lists" }
            ]
        }
    ];

    function getCourses() {
        const stored = readStorage(COURSES_KEY, []);

        if (!Array.isArray(stored) || stored.length === 0) {
            return defaultCourses;
        }

        // HTML কোর্সে lesson.js-এর ৭টি Lesson-এর সঙ্গে মিল
        return stored.map(course => {
            if (
                course.id === "html" &&
                (!Array.isArray(course.lessons) || course.lessons.length === 0)
            ) {
                return defaultCourses[0];
            }

            return course;
        });
    }

    // ======================================
    // PROGRESS
    // ======================================

    function getProgress() {
        const progress = readStorage(PROGRESS_KEY, {});

        return progress && typeof progress === "object"
            ? progress
            : {};
    }

    function isCourseCompleted(course, progress) {
        if (!course || !Array.isArray(course.lessons)) {
            return false;
        }

        if (course.lessons.length === 0) return false;

        const completed = progress[course.id];

        if (!Array.isArray(completed)) return false;

        const completedSet = new Set(
            completed.map(Number)
        );

        return course.lessons.every((lesson, index) => {
            const lessonId = lesson.id ?? index;

            return completedSet.has(Number(lessonId));
        });
    }

    // ======================================
    // USER CERTIFICATE STORAGE
    // ======================================

    function getUserKey() {
        return String(
            currentUser.email ||
            currentUser.username ||
            currentUser.name ||
            currentUser.fullName ||
            "student"
        ).trim().toLowerCase();
    }

    function getStudentName() {
        return (
            currentUser.fullName ||
            currentUser.name ||
            currentUser.username ||
            currentUser.email ||
            "Web Academy Student"
        );
    }

    function generateCertificateId() {
        return "WABD-" +
            Date.now().toString(36).toUpperCase() +
            "-" +
            Math.random().toString(36).substring(2, 7).toUpperCase();
    }

    function getCertificates() {
        const data = readStorage(CERTIFICATES_KEY, {});

        return data && typeof data === "object" ? data : {};
    }

    function getOrCreateCertificate(course) {
        const certificates = getCertificates();
        const userKey = getUserKey();

        if (!certificates[userKey]) {
            certificates[userKey] = {};
        }

        if (!certificates[userKey][course.id]) {
            certificates[userKey][course.id] = {
                id: generateCertificateId(),
                courseId: course.id,
                courseName: course.title,
                studentName: getStudentName(),
                completionDate: new Date().toISOString()
            };

            saveStorage(CERTIFICATES_KEY, certificates);
        }

        return certificates[userKey][course.id];
    }

    // ======================================
    // STUDENT INFORMATION
    // ======================================

    function renderStudent() {
        if (el.studentName) {
            el.studentName.textContent = getStudentName();
        }

        if (el.studentEmail) {
            el.studentEmail.textContent = currentUser.email || "";
        }
    }

    // ======================================
    // LOAD CERTIFICATES
    // ======================================

    function loadCertificates() {
        if (!el.certificateList || !el.emptyState) return;

        const courses = getCourses();
        const progress = getProgress();

        const availableCourses = courses.filter(course =>
            course.type !== "premium" &&
            Array.isArray(course.lessons) &&
            course.lessons.length > 0
        );

        const completedCourses = availableCourses.filter(course =>
            isCourseCompleted(course, progress)
        );

        if (el.completedCount) {
            el.completedCount.textContent = completedCourses.length;
        }

        if (completedCourses.length === 0) {
            el.certificateList.innerHTML = "";
            el.emptyState.classList.remove("hidden");

            if (window.lucide) lucide.createIcons();

            return;
        }

        el.emptyState.classList.add("hidden");

        el.certificateList.innerHTML = completedCourses.map(course => {
            const certificate = getOrCreateCertificate(course);

            const date = new Date(
                certificate.completionDate
            ).toLocaleDateString("en-GB");

            return `
                <article class="certificate-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">

                    <div class="flex justify-between items-start gap-3 mb-5">

                        <div class="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                            <i data-lucide="award" class="w-7 h-7"></i>
                        </div>

                        <span class="px-3 py-1 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-bold">
                            Completed
                        </span>

                    </div>

                    <h3 class="text-xl font-bold mb-2">
                        ${escapeHTML(course.title)}
                    </h3>

                    <p class="text-sm text-slate-500 mb-4">
                        ${escapeHTML(course.subtitle || course.description || "Course completed successfully.")}
                    </p>

                    <div class="text-xs text-slate-500 space-y-2 mb-6">

                        <p>
                            Certificate ID:
                            <span class="font-semibold text-slate-700 dark:text-slate-300">
                                ${escapeHTML(certificate.id)}
                            </span>
                        </p>

                        <p>Completed: ${escapeHTML(date)}</p>

                    </div>

                    <button
                        type="button"
                        data-course-id="${escapeHTML(course.id)}"
                        class="view-certificate w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">

                        <i data-lucide="eye" class="w-4 h-4"></i>
                        View Certificate

                    </button>

                </article>
            `;
        }).join("");

        if (window.lucide) lucide.createIcons();
    }

    // ======================================
    // SHOW CERTIFICATE
    // ======================================

    function showCertificate(courseId) {
        const courses = getCourses();
        const progress = getProgress();

        const course = courses.find(item =>
            String(item.id) === String(courseId)
        );

        if (!course || !isCourseCompleted(course, progress)) {
            alert("এই কোর্সের সব Lesson এখনো Complete হয়নি।");
            return;
        }

        const certificate = getOrCreateCertificate(course);

        if (el.certStudentName) {
            el.certStudentName.textContent = certificate.studentName;
        }

        if (el.certCourseName) {
            el.certCourseName.textContent = certificate.courseName;
        }

        if (el.certDate) {
            el.certDate.textContent = new Date(
                certificate.completionDate
            ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
        }

        if (el.certId) {
            el.certId.textContent = certificate.id;
        }

        if (el.previewSection) {
            el.previewSection.classList.remove("hidden");

            el.previewSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        if (window.lucide) lucide.createIcons();
    }

    // ======================================
    // CERTIFICATE CARD CLICK
    // ======================================

    el.certificateList?.addEventListener("click", event => {
        const button = event.target.closest(".view-certificate");

        if (!button) return;

        showCertificate(button.dataset.courseId);
    });

    // ======================================
    // URL COURSE AUTO PREVIEW
    // ======================================

    function openCertificateFromURL() {
        const params = new URLSearchParams(location.search);
        const courseId = params.get("course");

        if (!courseId) return;

        const progress = getProgress();
        const course = getCourses().find(item =>
            String(item.id) === String(courseId)
        );

        if (course && isCourseCompleted(course, progress)) {
            showCertificate(course.id);
        }
    }

    // ======================================
    // PRINT / SAVE PDF
    // ======================================

    el.printButton?.addEventListener("click", () => {
        if (
            !el.previewSection ||
            el.previewSection.classList.contains("hidden")
        ) {
            alert("আগে একটি Certificate নির্বাচন করো।");
            return;
        }

        window.print();
    });

    // ======================================
    // CLOSE PREVIEW
    // ======================================

    el.closeButton?.addEventListener("click", () => {
        el.previewSection?.classList.add("hidden");
    });

    // ======================================
    // THEME
    // ======================================

    function applyTheme() {
        const theme =
            localStorage.getItem(THEME_KEY) ||
            localStorage.getItem("theme") ||
            "light";

        document.documentElement.classList.toggle(
            "dark",
            theme === "dark"
        );

        if (window.lucide) lucide.createIcons();
    }

    el.themeToggle?.addEventListener("click", () => {
        const isDark = document.documentElement.classList.contains("dark");

        const theme = isDark ? "light" : "dark";

        localStorage.setItem(THEME_KEY, theme);
        localStorage.setItem("theme", theme);

        applyTheme();
    });

    // ======================================
    // INITIALIZE
    // ======================================

    renderStudent();
    applyTheme();
    loadCertificates();
    openCertificateFromURL();

    // Browser-এ ফিরে এলে Progress Refresh
    window.addEventListener("pageshow", () => {
        loadCertificates();
    });

});
