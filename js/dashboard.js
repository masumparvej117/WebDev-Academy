
// ==========================================
// WEB ACADEMY BD - STUDENT DASHBOARD
// ==========================================

// Login Protection
const sessionData = localStorage.getItem("webAcademyCurrentUser");

// Login protection চালু করতে নিচের দুই লাইন uncomment করো
if (!sessionData) {
    window.location.replace("auth.html");
}

// ==========================================
// DOM ELEMENTS
// ==========================================

const welcomeName = document.getElementById("welcomeName");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileUsername = document.getElementById("profileUsername");
const userAvatar = document.getElementById("userAvatar");

const totalCourses = document.getElementById("totalCourses");
const totalLessons = document.getElementById("totalLessons");
const completedLessons = document.getElementById("completedLessons");
const overallProgress = document.getElementById("overallProgress");

const courseProgressList = document.getElementById("courseProgressList");
const continueLearningList = document.getElementById("continueLearningList");

const themeToggle = document.getElementById("themeToggle");
const logoutBtn = document.getElementById("logoutBtn");

// ==========================================
// COURSE IMAGES
// ==========================================

const courseImages = {
    html: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=900&auto=format&fit=crop&q=85",
    css: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=900&auto=format&fit=crop&q=85",
    javascript: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=85",
    bootstrap: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&auto=format&fit=crop&q=85",
    tailwind: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=85",
    react: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&auto=format&fit=crop&q=85",
    node: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=900&auto=format&fit=crop&q=85",
    php: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900&auto=format&fit=crop&q=85",
    default: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=85"
};

function getCourseImage(course) {
    const text = [
        course.id,
        course.title,
        course.name,
        course.subtitle
    ].filter(Boolean).join(" ").toLowerCase();

    if (text.includes("javascript") || text.includes("java script")) {
        return courseImages.javascript;
    }

    if (text.includes("tailwind")) return courseImages.tailwind;
    if (text.includes("bootstrap")) return courseImages.bootstrap;
    if (text.includes("react")) return courseImages.react;
    if (text.includes("node")) return courseImages.node;

    if (text.includes("php") || text.includes("mysql")) {
        return courseImages.php;
    }

    if (text.includes("html")) return courseImages.html;
    if (text.includes("css")) return courseImages.css;

    return courseImages.default;
}

// ==========================================
// SAFE DATA HELPERS
// ==========================================

function readJSON(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// ==========================================
// CURRENT USER
// ==========================================

function getCurrentUser() {
    let user = null;

    try {
        user = JSON.parse(sessionData);
    } catch {
        user = null;
    }

    if (!user || typeof user !== "object") {
        const users = readJSON("webAcademyUsers", []);

        user = users.find(item =>
            item.username === sessionData ||
            item.email === sessionData
        ) || {
            name: sessionData || "Student",
            username: sessionData || "student",
            email: ""
        };
    }

    return user;
}

function renderUserProfile() {
    const user = getCurrentUser();

    const name = user.name || user.fullName || user.username || "Student";
    const email = user.email || "Email not provided";
    const username = user.username || "student";

    welcomeName.textContent = name;
    profileName.textContent = name;
    profileEmail.textContent = email;
    profileUsername.textContent = "@" + username;

    userAvatar.textContent = name.trim().charAt(0).toUpperCase() || "S";
}

// ==========================================
// COURSES AND PROGRESS
// ==========================================

function getCourses() {
    const courses = readJSON("webAcademyCourses", []);
    return Array.isArray(courses) ? courses : [];
}

function getProgress() {
    const progress = readJSON("webAcademyProgress", {});
    return progress && typeof progress === "object" ? progress : {};
}

function getAvailableCourses(courses) {
    return courses.filter(course =>
        course.type !== "premium" &&
        Array.isArray(course.lessons) &&
        course.lessons.length > 0
    );
}

function getCourseStats(course, progress) {
    const lessons = Array.isArray(course.lessons)
        ? course.lessons
        : [];

    const completed = Array.isArray(progress[course.id])
        ? progress[course.id]
        : [];

    const completedCount = lessons.filter(lesson =>
        completed.includes(lesson.id)
    ).length;

    const percentage = lessons.length
        ? Math.round((completedCount / lessons.length) * 100)
        : 0;

    return {
        total: lessons.length,
        completed: completedCount,
        percentage
    };
}

// ==========================================
// DASHBOARD STATISTICS
// ==========================================

function renderStatistics(courses, progress) {
    const availableCourses = getAvailableCourses(courses);

    let lessonsCount = 0;
    let completedCount = 0;

    availableCourses.forEach(course => {
        const stats = getCourseStats(course, progress);

        lessonsCount += stats.total;
        completedCount += stats.completed;
    });

    const percentage = lessonsCount
        ? Math.round((completedCount / lessonsCount) * 100)
        : 0;

    totalCourses.textContent = availableCourses.length;
    totalLessons.textContent = lessonsCount;
    completedLessons.textContent = completedCount;
    overallProgress.textContent = percentage + "%";
}

// ==========================================
// COURSE PROGRESS LIST
// ==========================================

function renderCourseProgress(courses, progress) {
    const availableCourses = getAvailableCourses(courses);

    if (!availableCourses.length) {
        courseProgressList.innerHTML = `
            <p class="text-slate-500 text-sm">
                এখনো কোনো Free Course পাওয়া যায়নি।
                <a href="courses.html" class="text-indigo-600 font-semibold">
                    Courses দেখো
                </a>
            </p>
        `;
        return;
    }

    courseProgressList.innerHTML = availableCourses.map(course => {
        const stats = getCourseStats(course, progress);

        return `
            <div class="group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all duration-300">
                <div class="flex flex-wrap justify-between gap-2 mb-2">
                    <h3 class="font-semibold group-hover:text-indigo-600 transition">
                        ${escapeHTML(course.title || course.name || "Untitled Course")}
                    </h3>

                    <span class="text-sm text-slate-500">
                        ${stats.completed}/${stats.total} Lessons · ${stats.percentage}%
                    </span>
                </div>

                <div class="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                        class="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-700"
                        style="width:${stats.percentage}%">
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// ==========================================
// CONTINUE LEARNING CARDS
// ==========================================

function renderContinueLearning(courses, progress) {
    const availableCourses = getAvailableCourses(courses);

    if (!availableCourses.length) {
        continueLearningList.innerHTML = `
            <div class="md:col-span-2 xl:col-span-3 text-center py-8">
                <div class="text-5xl mb-4">📚</div>
                <p class="text-slate-500 mb-4">
                    শেখা শুরু করতে প্রথমে একটি কোর্স বেছে নাও।
                </p>
                <a href="courses.html"
                   class="inline-block px-5 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
                    Explore Courses
                </a>
            </div>
        `;
        return;
    }

    // Incomplete courses first
    const sortedCourses = [...availableCourses].sort((a, b) => {
        const aStats = getCourseStats(a, progress);
        const bStats = getCourseStats(b, progress);

        return Number(aStats.percentage === 100) -
               Number(bStats.percentage === 100);
    });

    continueLearningList.innerHTML = sortedCourses.map(course => {
        const stats = getCourseStats(course, progress);

        const completedIds = Array.isArray(progress[course.id])
            ? progress[course.id]
            : [];

        const nextLesson = course.lessons.find(lesson =>
            !completedIds.includes(lesson.id)
        );

        const targetLesson = nextLesson || course.lessons[0];

        const buttonText = stats.percentage === 100
            ? "Review Course"
            : stats.completed > 0
                ? "Continue Learning"
                : "Start Learning";

        const description = course.subtitle ||
            course.description ||
            "এই কোর্সটি থেকে নতুন দক্ষতা অর্জন করো।";

        const image = getCourseImage(course);

        const courseTitle = escapeHTML(course.title || course.name || "Untitled Course");

        return `
            <article class="group overflow-hidden border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">

                <!-- COURSE IMAGE -->
                <div class="relative h-44 overflow-hidden image-zoom">
                    <img
                        src="${image}"
                        alt="${courseTitle}"
                        class="w-full h-full object-cover"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='${courseImages.default}'">

                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>

                    <span class="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full bg-green-500 text-white shadow">
                        Free Course
                    </span>

                    <h3 class="absolute bottom-3 left-4 right-4 text-white font-bold text-xl drop-shadow">
                        ${courseTitle}
                    </h3>
                </div>

                <div class="p-5">
                    <p class="text-sm text-slate-500 dark:text-slate-400 leading-6 mb-4 line-clamp-2">
                        ${escapeHTML(description)}
                    </p>

                    <div class="flex justify-between text-xs text-slate-500 mb-2">
                        <span>${stats.completed}/${stats.total} Lessons</span>
                        <span class="font-bold text-indigo-600">${stats.percentage}%</span>
                    </div>

                    <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-5">
                        <div class="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700"
                             style="width:${stats.percentage}%"></div>
                    </div>

                    <a href="lesson.html?course=${encodeURIComponent(course.id)}&lesson=${encodeURIComponent(targetLesson.id)}"
                       class="group/btn flex items-center justify-center gap-2 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95">
                        ${buttonText}
                        <i data-lucide="arrow-right" class="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-2"></i>
                    </a>
                </div>
            </article>
        `;
    }).join("");

    if (window.lucide) {
        lucide.createIcons();
    }
}

// ==========================================
// THEME
// ==========================================

function applyTheme() {
    const theme = localStorage.getItem("webAcademyTheme") ||
                  localStorage.getItem("theme") ||
                  "light";

    document.documentElement.classList.toggle("dark", theme === "dark");

    if (themeToggle) {
        themeToggle.innerHTML = theme === "dark"
            ? '<i data-lucide="sun"></i>'
            : '<i data-lucide="moon"></i>';
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isDark = document.documentElement.classList.contains("dark");
        const newTheme = isDark ? "light" : "dark";

        localStorage.setItem("webAcademyTheme", newTheme);
        localStorage.setItem("theme", newTheme);

        applyTheme();
    });
}

// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        if (confirm("তুমি কি Logout করতে চাও?")) {
            localStorage.removeItem("webAcademyCurrentUser");
            window.location.replace("auth.html");
        }
    });
}

// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

function initializeDashboard() {
    const courses = getCourses();
    const progress = getProgress();

    renderUserProfile();
    renderStatistics(courses, progress);
    renderCourseProgress(courses, progress);
    renderContinueLearning(courses, progress);

    if (window.lucide) {
        lucide.createIcons();
    }
}

applyTheme();
initializeDashboard();
