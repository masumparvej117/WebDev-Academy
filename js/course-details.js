
"use strict";

/* =========================
   1. LOGIN PROTECTION
========================= */
const currentUser = localStorage.getItem("webAcademyCurrentUser");

// Login protection চালু করতে Uncomment করো
// if (!currentUser) {
//   window.location.replace("auth.html");
// }

/* =========================
   2. GET COURSE ID
========================= */
const params = new URLSearchParams(window.location.search);
const courseId = (params.get("id") || "").toLowerCase();

/* =========================
   3. LOAD COURSES
========================= */
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

/* =========================
   4. COURSE IMAGES
========================= */
const courseImages = {
  html: {
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85",
    caption: "HTML - Build Web Structure"
  },
  css: {
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=1000&q=85",
    caption: "CSS - Design Beautiful Websites"
  },
  javascript: {
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=85",
    caption: "JavaScript - Interactive Websites"
  },
  bootstrap: {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85",
    caption: "Bootstrap - Responsive Design"
  },
  tailwind: {
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=85",
    caption: "Tailwind CSS - Modern Styling"
  },
  react: {
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1000&q=85",
    caption: "React - Frontend Development"
  },
  node: {
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1000&q=85",
    caption: "Node.js - Backend Development"
  },
  php: {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85",
    caption: "PHP & MySQL - Backend Development"
  }
};

/* =========================
   5. DOM ELEMENTS
========================= */
const lessonList = document.getElementById("lessonList");
const noLessons = document.getElementById("noLessons");

/* =========================
   6. ESCAPE HTML
========================= */
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

/* =========================
   7. COURSE IMAGE
========================= */
function updateCourseImage(courseData) {
  const image = document.getElementById("courseImage");
  const caption = document.getElementById("courseImageCaption");

  if (!image || !courseData) return;

  const selectedImage = courseImages[courseData.id] || {
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&q=85",
    caption: "Learn • Practice • Build"
  };

  image.src = selectedImage.image;
  image.alt = courseData.title || "Web Development Course";

  if (caption) {
    caption.textContent = selectedImage.caption;
  }

  image.onerror = () => {
    image.onerror = null;
    image.src = "https://placehold.co/900x600/312e81/ffffff?text=Web+Academy+BD";
  };
}

/* =========================
   8. PROGRESS STORAGE
========================= */
function getProgressData() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("webAcademyLessonProgress") || "{}"
    );

    return saved && typeof saved === "object" ? saved : {};
  } catch (error) {
    return {};
  }
}

function getCompletedLessons() {
  const progress = getProgressData();
  const saved = progress[courseId];

  return Array.isArray(saved) ? saved : [];
}

/* =========================
   9. UPDATE PROGRESS
========================= */
function updateProgress() {
  const completed = getCompletedLessons();
  const total = Array.isArray(course?.lessons)
    ? course.lessons.length
    : 0;

  const completedIds = new Set(completed.map(String));

  const completedCount = course
    ? course.lessons.filter((lesson, index) =>
        completedIds.has(String(lesson.id ?? index))
      ).length
    : 0;

  const percent = total
    ? Math.round((completedCount / total) * 100)
    : 0;

  const progressText = document.getElementById("progressText");
  const progressBar = document.getElementById("progressBar");
  const completedText = document.getElementById("completedText");

  if (progressText) progressText.textContent = percent + "%";
  if (progressBar) progressBar.style.width = percent + "%";

  if (completedText) {
    completedText.textContent =
      `${completedCount} of ${total} lessons completed`;
  }
}

/* =========================
   10. RENDER LESSONS
========================= */
function renderLessons() {
  if (!course || !lessonList) return;

  const lessons = Array.isArray(course.lessons)
    ? course.lessons
    : [];

  const completed = new Set(
    getCompletedLessons().map(String)
  );

  lessonList.innerHTML = "";

  lessons.forEach((lesson, index) => {
    const lessonId = String(lesson.id ?? index);
    const isCompleted = completed.has(lessonId);

    const card = document.createElement("div");

    card.className =
      "lesson-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg transition";

    card.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div class="flex items-start gap-4">

          <div class="w-11 h-11 shrink-0 rounded-xl ${
            isCompleted
              ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
              : "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
          } flex items-center justify-center font-bold">

            ${
              isCompleted
                ? '<i data-lucide="check" class="w-5 h-5"></i>'
                : index + 1
            }

          </div>

          <div>
            <h3 class="font-bold text-lg">
              ${escapeHTML(lesson.title || `Lesson ${index + 1}`)}
            </h3>

            <div class="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">

              <span class="flex items-center gap-1">
                <i data-lucide="clock" class="w-4 h-4"></i>
                ${escapeHTML(lesson.duration || "20 মিনিট")}
              </span>

              <span class="${
                isCompleted ? "text-green-600 font-semibold" : ""
              }">
                ${isCompleted ? "Completed" : "Not Started"}
              </span>

            </div>
          </div>

        </div>

        <button
          type="button"
          class="lesson-open-btn px-5 py-2.5 rounded-xl ${
            isCompleted
              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          } font-bold text-sm"
          data-lesson-id="${escapeHTML(lessonId)}">

          ${isCompleted ? "Review Lesson" : "Start Lesson"}

        </button>

      </div>
    `;

    lessonList.appendChild(card);
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/* =========================
   11. INITIALIZE COURSE
========================= */
function initializeCourse() {
  if (!course) return;

  document.title = course.title + " | Web Academy BD";

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  const lessons = Array.isArray(course.lessons)
    ? course.lessons
    : [];

  setText("breadcrumbTitle", course.title);
  setText("courseTitle", course.title);
  setText("courseSubtitle", course.subtitle || "");
  setText("courseDescription", course.description || "");
  setText("courseLevel", course.level || "Beginner");
  setText("courseLessonCount", lessons.length + " Lessons");
  setText("totalLessonsBadge", lessons.length + " Lessons");

  setText(
    "courseType",
    course.type === "premium" ? "PREMIUM COURSE" : "FREE COURSE"
  );

  updateCourseImage(course);

  if (course.type === "premium") {
    if (noLessons) {
      noLessons.classList.remove("hidden");

      const heading = noLessons.querySelector("h3");
      const paragraph = noLessons.querySelector("p");

      if (heading) heading.textContent = "Premium Course";
      if (paragraph) {
        paragraph.textContent =
          "এই Premium Course-টি এখনো চালু হয়নি।";
      }
    }

    lessonList?.classList.add("hidden");
    updateProgress();
    return;
  }

  if (lessons.length === 0) {
    noLessons?.classList.remove("hidden");
    lessonList?.classList.add("hidden");
    updateProgress();
    return;
  }

  noLessons?.classList.add("hidden");
  lessonList?.classList.remove("hidden");

  renderLessons();
  updateProgress();
}

/* =========================
   12. LESSON NAVIGATION
========================= */
lessonList?.addEventListener("click", event => {
  const button = event.target.closest(".lesson-open-btn");

  if (!button || !course) return;

  const lessonId = button.dataset.lessonId;

  if (!lessonId) {
    alert("Lesson ID পাওয়া যায়নি!");
    return;
  }

  const lessonExists = course.lessons.some(
    (lesson, index) =>
      String(lesson.id ?? index) === String(lessonId)
  );

  if (!lessonExists) {
    alert("এই Lesson পাওয়া যায়নি!");
    return;
  }

  window.location.href =
    `lesson.html?course=${encodeURIComponent(courseId)}&lesson=${encodeURIComponent(lessonId)}`;
});

/* =========================
   13. COURSE NOT FOUND
========================= */
if (!course) {
  document.title = "Course Not Found | Web Academy BD";

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  setText("courseTitle", "Course Not Found");
  setText("courseSubtitle", "কোর্সটি পাওয়া যায়নি।");
  setText(
    "courseDescription",
    "কোর্সটি দেখতে আবার Courses পেজে যাও।"
  );

  if (lessonList) {
    lessonList.innerHTML = `
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <a href="courses.html" class="text-indigo-600 font-bold">
          ← Back to Courses
        </a>
      </div>
    `;
  }
} else {
  initializeCourse();
}

/* =========================
   14. THEME
========================= */
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

  if (window.lucide) window.lucide.createIcons();
}

document.getElementById("themeToggle")?.addEventListener(
  "click",
  toggleTheme
);

/* =========================
   15. LOGOUT
========================= */
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  if (confirm("তুমি কি Logout করতে চাও?")) {
    localStorage.removeItem("webAcademyCurrentUser");
    window.location.href = "auth.html";
  }
});

/* =========================
   16. INITIALIZE
========================= */
applyTheme();

if (window.lucide) {
  window.lucide.createIcons();
}
