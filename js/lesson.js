
(() => {
"use strict";

/* =====================================
   1. GET COURSE & LESSON
===================================== */
const params = new URLSearchParams(window.location.search);

const courseId = (params.get("course") || "html").toLowerCase();
const requestedLessonId = params.get("lesson") || "";

let courses = [];

try {
    courses = JSON.parse(
        localStorage.getItem("webAcademyCourses") || "[]"
    );

    if (!Array.isArray(courses)) courses = [];
} catch (error) {
    console.error("Course loading error:", error);
}

const course = courses.find(
    item => String(item.id).toLowerCase() === courseId
);

if (!course || !Array.isArray(course.lessons) || !course.lessons.length) {
    document.body.innerHTML = `
        <div class="min-h-screen flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-950">
            <div class="max-w-md w-full text-center bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl">
                <h1 class="text-2xl font-bold mb-3">Course Not Found</h1>
                <p class="text-slate-500 mb-6">
                    এই কোর্সে এখনো কোনো Lesson পাওয়া যায়নি।
                </p>
                <a href="courses.html"
                   class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">
                    Back to Courses
                </a>
            </div>
        </div>
    `;
    return;
}

/* =====================================
   2. LESSON INDEX
===================================== */
const lessons = course.lessons;

let lessonIndex = lessons.findIndex((lesson, index) => {
    return String(lesson.id ?? index) === String(requestedLessonId);
});

if (lessonIndex < 0) {
    const numericIndex = Number(requestedLessonId);

    lessonIndex =
        requestedLessonId !== "" &&
        Number.isInteger(numericIndex) &&
        numericIndex >= 0 &&
        numericIndex < lessons.length
            ? numericIndex
            : 0;
}

/* =====================================
   3. DOM ELEMENTS
===================================== */
const $ = id => document.getElementById(id);

const lessonTitle = $("lessonTitle");
const lessonContent = $("lessonContent");
const lessonSidebar = $("lessonSidebar");

const previousBtn = $("previousLesson");
const nextBtn = $("nextLesson");
const completeBtn = $("completeLesson");

const progressBar = $("progressBar");
const progressText = $("progressText");
const completedText = $("completedText");

/* =====================================
   4. HTML ESCAPE
===================================== */
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

/* =====================================
   5. PROGRESS STORAGE
===================================== */
function getProgressData() {
    try {
        const data = JSON.parse(
            localStorage.getItem("webAcademyLessonProgress") || "{}"
        );

        return data && typeof data === "object" ? data : {};
    } catch (error) {
        return {};
    }
}

function getCompletedLessons() {
    const data = getProgressData();
    const saved = data[courseId];

    return Array.isArray(saved) ? saved.map(String) : [];
}

function isCompleted(index) {
    const lesson = lessons[index];
    const id = String(lesson.id ?? index);

    return getCompletedLessons().includes(id);
}

function saveProgress(index) {
    const data = getProgressData();

    if (!Array.isArray(data[courseId])) {
        data[courseId] = [];
    }

    const lesson = lessons[index];
    const id = String(lesson.id ?? index);

    if (!data[courseId].map(String).includes(id)) {
        data[courseId].push(id);
    }

    try {
        localStorage.setItem(
            "webAcademyLessonProgress",
            JSON.stringify(data)
        );
    } catch (error) {
        alert("Progress Save করা যায়নি!");
        console.error(error);
        return false;
    }

    return true;
}

/* =====================================
   6. PROGRESS UPDATE
===================================== */
function updateProgress() {
    const completed = new Set(getCompletedLessons());

    const count = lessons.filter((lesson, index) => {
        return completed.has(String(lesson.id ?? index));
    }).length;

    const percent = Math.round((count / lessons.length) * 100);

    if (progressBar) {
        progressBar.style.width = percent + "%";
    }

    if (progressText) {
        progressText.textContent = percent + "%";
    }

    if (completedText) {
        completedText.textContent =
            `${count} of ${lessons.length} lessons completed`;
    }

    if (completeBtn) {
        completeBtn.disabled = isCompleted(lessonIndex);

        completeBtn.textContent = isCompleted(lessonIndex)
            ? "✓ Completed"
            : "Mark as Complete";
    }
}

/* =====================================
   7. CODE BLOCK
===================================== */
function createCodeBlock(code) {
    if (!code) return "";

    return `
        <div class="my-6 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
            <div class="flex items-center justify-between px-4 py-3 bg-slate-900 text-slate-300 text-sm">
                <span>Example Code</span>
                <button
                    type="button"
                    class="copy-code-btn text-indigo-400 hover:text-white"
                >
                    Copy Code
                </button>
            </div>

            <pre class="p-5 overflow-x-auto text-sm text-green-300 leading-7"><code>${escapeHTML(code)}</code></pre>
        </div>
    `;
}

/* =====================================
   8. RENDER LESSON CONTENT
===================================== */
function renderLesson(index) {
    if (index < 0 || index >= lessons.length) return;

    lessonIndex = index;

    const lesson = lessons[index];
    const title = lesson.title || `Lesson ${index + 1}`;

    document.title = title + " | Web Academy BD";

    if (lessonTitle) {
        lessonTitle.textContent = title;
    }

    if (lessonContent) {
        lessonContent.innerHTML = `
            <div class="mb-6">
                <span class="text-sm font-semibold text-indigo-600">
                    ${escapeHTML(course.title)}
                </span>

                <h1 class="text-3xl font-bold mt-3 mb-4">
                    ${escapeHTML(title)}
                </h1>

                <div class="flex flex-wrap gap-3 text-sm text-slate-500">
                    <span>Lesson ${index + 1} of ${lessons.length}</span>
                    <span>•</span>
                    <span>${escapeHTML(lesson.duration || "20 মিনিট")}</span>
                </div>
            </div>

            <div class="prose prose-slate dark:prose-invert max-w-none">
                <h2 class="text-xl font-bold mb-3">Lesson Explanation</h2>

                <p class="leading-8 text-slate-600 dark:text-slate-300">
                    ${escapeHTML(lesson.explanation || "এই Lesson-এর বিস্তারিত আলোচনা শিগগিরই যুক্ত করা হবে।")}
                </p>

                <h2 class="text-xl font-bold mt-8 mb-3">Code Example</h2>

                ${createCodeBlock(lesson.code)}

                <h2 class="text-xl font-bold mt-8 mb-3">Practice Task</h2>

                <div class="p-5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30">
                    <p class="leading-7">
                        ${escapeHTML(lesson.practice || "এই Lesson-এর বিষয়গুলো নিজে অনুশীলন করো।")}
                    </p>
                </div>

                <h2 class="text-xl font-bold mt-8 mb-4">Quick Quiz</h2>

                ${renderQuiz(lesson.quiz)}
            </div>
        `;
    }

    renderSidebar();
    updateProgress();
    updateNavigation();

    const url = new URL(window.location.href);

    url.searchParams.set("course", courseId);
    url.searchParams.set("lesson", String(lesson.id ?? index));

    window.history.replaceState({}, "", url);

    if (window.lucide) {
        window.lucide.createIcons();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =====================================
   9. RENDER QUIZ
===================================== */
function renderQuiz(quiz) {
    if (!quiz || !quiz.question) {
        return `
            <p class="text-slate-500">
                এই Lesson-এর Quiz এখনো যুক্ত করা হয়নি।
            </p>
        `;
    }

    const options = Array.isArray(quiz.options)
        ? quiz.options
        : [];

    return `
        <div class="quiz-container p-5 rounded-xl border border-slate-200 dark:border-slate-700"
             data-answer="${Number(quiz.answer)}">

            <h3 class="font-bold mb-4">
                ${escapeHTML(quiz.question)}
            </h3>

            <div class="space-y-3">
                ${options.map((option, index) => `
                    <button
                        type="button"
                        class="quiz-option w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition"
                        data-option="${index}">
                        ${escapeHTML(option)}
                    </button>
                `).join("")}
            </div>

            <p class="quiz-result mt-4 text-sm font-semibold" aria-live="polite"></p>
        </div>
    `;
}

/* =====================================
   10. QUIZ & COPY EVENTS
===================================== */
lessonContent?.addEventListener("click", event => {
    const option = event.target.closest(".quiz-option");

    if (option) {
        const container = option.closest(".quiz-container");

        if (!container || container.dataset.answered === "true") {
            return;
        }

        const answer = Number(container.dataset.answer);
        const selected = Number(option.dataset.option);
        const result = container.querySelector(".quiz-result");

        container.dataset.answered = "true";

        if (selected === answer) {
            option.classList.add(
                "bg-green-100",
                "border-green-500",
                "text-green-700"
            );

            result.textContent = "সঠিক উত্তর! খুব ভালো হয়েছে।";
            result.className = "quiz-result mt-4 text-sm font-semibold text-green-600";
        } else {
            option.classList.add(
                "bg-red-100",
                "border-red-500",
                "text-red-700"
            );

            result.textContent = "ভুল উত্তর! আবার Lesson-টি পড়ার চেষ্টা করো।";
            result.className = "quiz-result mt-4 text-sm font-semibold text-red-600";

            const correctOption = container.querySelector(
                `[data-option="${answer}"]`
            );

            correctOption?.classList.add(
                "bg-green-100",
                "border-green-500",
                "text-green-700"
            );
        }

        return;
    }

    const copyButton = event.target.closest(".copy-code-btn");

    if (copyButton) {
        const code = copyButton
            .closest(".my-6")
            ?.querySelector("pre code")
            ?.textContent;

        if (code && navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(code)
                .then(() => {
                    copyButton.textContent = "Copied!";

                    setTimeout(() => {
                        copyButton.textContent = "Copy Code";
                    }, 1500);
                })
                .catch(() => alert("Code Copy করা যায়নি।"));
        } else {
            alert("এই Browser-এ Copy সুবিধা পাওয়া যাচ্ছে না।");
        }
    }
});

/* =====================================
   11. SIDEBAR
===================================== */
function renderSidebar() {
    if (!lessonSidebar) return;

    lessonSidebar.innerHTML = lessons.map((lesson, index) => {
        const completed = isCompleted(index);
        const active = index === lessonIndex;

        return `
            <button
                type="button"
                class="sidebar-lesson w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${
                    active
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }"
                data-lesson-index="${index}">

                <span class="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-sm font-bold ${
                    active
                        ? "bg-white/20"
                        : completed
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-200 dark:bg-slate-700"
                }">
                    ${completed ? "✓" : index + 1}
                </span>

                <span class="text-sm font-semibold">
                    ${escapeHTML(lesson.title)}
                </span>
            </button>
        `;
    }).join("");
}

lessonSidebar?.addEventListener("click", event => {
    const button = event.target.closest(".sidebar-lesson");

    if (!button) return;

    const index = Number(button.dataset.lessonIndex);

    if (Number.isInteger(index)) {
        renderLesson(index);
    }
});

/* =====================================
   12. NAVIGATION
===================================== */
function updateNavigation() {
    if (previousBtn) {
        previousBtn.disabled = lessonIndex === 0;
        previousBtn.classList.toggle("opacity-50", lessonIndex === 0);
    }

    if (nextBtn) {
        nextBtn.disabled = lessonIndex === lessons.length - 1;

        nextBtn.classList.toggle(
            "opacity-50",
            lessonIndex === lessons.length - 1
        );
    }
}

previousBtn?.addEventListener("click", () => {
    if (lessonIndex > 0) {
        renderLesson(lessonIndex - 1);
    }
});

nextBtn?.addEventListener("click", () => {
    if (lessonIndex < lessons.length - 1) {
        renderLesson(lessonIndex + 1);
    }
});

/* =====================================
   13. COMPLETE LESSON
===================================== */
completeBtn?.addEventListener("click", () => {
    if (isCompleted(lessonIndex)) return;

    if (!saveProgress(lessonIndex)) return;

    updateProgress();
    renderSidebar();

    // একই কোর্সের পরবর্তী Lesson
    if (lessonIndex < lessons.length - 1) {
        alert("অভিনন্দন! Lesson Complete হয়েছে।");
        renderLesson(lessonIndex + 1);
        return;
    }

    // কোর্সের সব Lesson শেষ
    const nextCourse = checkCourseCompletion();

    if (nextCourse) {
        alert(
            `অভিনন্দন! ${course.title} কোর্স সম্পন্ন হয়েছে।\n\nএবার ${nextCourse.title} কোর্স শুরু হচ্ছে!`
        );

        window.location.href =
            `lesson.html?course=${encodeURIComponent(nextCourse.id)}&lesson=${encodeURIComponent(nextCourse.lessons[0].id ?? 0)}`;

    } else {
        alert("অভিনন্দন! তুমি সব উপলব্ধ কোর্স সম্পন্ন করেছো!");

        window.location.href =
            `certificate.html?course=${encodeURIComponent(courseId)}`;
    }
});

/* =====================================
   14. COURSE COMPLETION
===================================== */
function checkCourseCompletion() {
    const allCompleted = lessons.every((lesson, index) => {
        return isCompleted(index);
    });

    if (!allCompleted) return null;

    const student = getCurrentUser();

    let certificates = {};

    try {
        certificates = JSON.parse(
            localStorage.getItem("webAcademyCertificates") || "{}"
        );

        if (!certificates || typeof certificates !== "object") {
            certificates = {};
        }
    } catch (error) {
        certificates = {};
    }

    const userKey =
        student?.email ||
        student?.username ||
        "guest";

    if (!certificates[userKey]) {
        certificates[userKey] = {};
    }

    if (!certificates[userKey][courseId]) {
        certificates[userKey][courseId] = {
            courseId,
            courseName: course.title,
            studentName:
                student?.name ||
                student?.username ||
                "Student",
            completedAt: new Date().toISOString(),
            certificateId:
                "WABD-" +
                Date.now().toString(36).toUpperCase()
        };

        try {
            localStorage.setItem(
                "webAcademyCertificates",
                JSON.stringify(certificates)
            );
        } catch (error) {
            console.error("Certificate save error:", error);
        }
    }

    // পরবর্তী Lesson-সহ কোর্স খোঁজা
    const currentCourseIndex = courses.findIndex(
        item => String(item.id).toLowerCase() === courseId
    );

    for (let i = currentCourseIndex + 1; i < courses.length; i++) {
        const nextCourse = courses[i];

        if (
            nextCourse &&
            Array.isArray(nextCourse.lessons) &&
            nextCourse.lessons.length > 0
        ) {
            return nextCourse;
        }
    }

    return null;
}

/* =====================================
   15. CURRENT USER
===================================== */
function getCurrentUser() {
    const raw = localStorage.getItem("webAcademyCurrentUser");

    if (!raw) return null;

    try {
        const user = JSON.parse(raw);

        if (user && typeof user === "object") {
            return user;
        }

        if (typeof user === "string") {
            return { username: user };
        }
    } catch (error) {
        return { username: raw };
    }

    return null;
}

/* =====================================
   16. THEME
===================================== */
function applyTheme() {
    const theme =
        localStorage.getItem("webAcademyTheme") ||
        localStorage.getItem("theme");

    document.documentElement.classList.toggle(
        "dark",
        theme === "dark"
    );
}

function toggleTheme() {
    const isDark =
        document.documentElement.classList.toggle("dark");

    localStorage.setItem(
        "webAcademyTheme",
        isDark ? "dark" : "light"
    );

    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );
}

$("themeToggle")?.addEventListener("click", toggleTheme);

/* =====================================
   17. LOGOUT
===================================== */
$("logoutBtn")?.addEventListener("click", () => {
    if (confirm("তুমি কি Logout করতে চাও?")) {
        localStorage.removeItem("webAcademyCurrentUser");
        window.location.href = "auth.html";
    }
});

/* =====================================
   18. INITIALIZE
===================================== */
applyTheme();
renderLesson(lessonIndex);

})();
