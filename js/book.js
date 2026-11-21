
(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("course");

  const courses = JSON.parse(
    localStorage.getItem("webAcademyCourses") || "[]"
  );

  const course = courses.find(item =>
    String(item.id) === String(courseId)
  );

  const title = document.getElementById("bookTitle");
  const subtitle = document.getElementById("bookSubtitle");
  const meta = document.getElementById("bookMeta");
  const toc = document.getElementById("tableOfContents");
  const content = document.getElementById("bookContent");
  const empty = document.getElementById("emptyMessage");
  const downloadBtn = document.getElementById("downloadBtn");

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  if (!course || course.type === "premium" ||
      !Array.isArray(course.lessons) || !course.lessons.length) {
    document.getElementById("bookCover").classList.add("hidden");
    document.querySelector(".no-print.bg-white")?.classList.add("hidden");
    empty.classList.remove("hidden");
    return;
  }

  title.textContent = course.title;
  subtitle.textContent = course.subtitle || "Complete Course Book";
  meta.textContent =
    `${course.lessons.length} Chapters • Web Academy BD`;

  document.title = `${course.title} Book | Web Academy BD`;

  toc.innerHTML = course.lessons.map((lesson, index) => `
    <a href="#chapter-${index + 1}"
       class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950 transition">
      <span class="font-bold text-indigo-600">
        Chapter ${index + 1}
      </span>
      <span class="block mt-1">
        ${escapeHTML(lesson.title)}
      </span>
    </a>
  `).join("");

  content.innerHTML = course.lessons.map((lesson, index) => `
    <article id="chapter-${index + 1}"
      class="chapter bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-10 shadow-sm">

      <p class="text-indigo-600 font-bold">
        CHAPTER ${index + 1}
      </p>

      <h2 class="text-2xl md:text-3xl font-extrabold mt-3">
        ${escapeHTML(lesson.title)}
      </h2>

      <p class="text-sm text-slate-500 mt-3">
        Duration: ${escapeHTML(lesson.duration || "20 মিনিট")}
      </p>

      <div class="mt-7">
        <h3 class="text-lg font-bold mb-2">বিস্তারিত আলোচনা</h3>
        <p class="leading-8 whitespace-pre-line text-slate-700 dark:text-slate-300">
          ${escapeHTML(lesson.explanation || lesson.description || "এই অধ্যায়ের বিস্তারিত আলোচনা শিগগিরই যুক্ত হবে।")}
        </p>
      </div>

      <div class="mt-7">
        <h3 class="text-lg font-bold mb-3">Code Example</h3>
        <pre><code>${escapeHTML(lesson.code || "// Code example")}</code></pre>
      </div>

      <div class="mt-7">
        <h3 class="text-lg font-bold mb-2">Expected Output</h3>
        <div class="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 whitespace-pre-line">
          ${escapeHTML(lesson.output || "Browser-এ কোডের Output দেখা যাবে।")}
        </div>
      </div>

      <div class="mt-7">
        <h3 class="text-lg font-bold mb-2">Practice Task</h3>
        <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
          ${escapeHTML(lesson.practice || "নিজে অনুশীলন করো।")}
        </div>
      </div>

      ${
        lesson.quiz?.question
          ? `<div class="mt-7">
              <h3 class="text-lg font-bold mb-2">নিজেকে যাচাই করো</h3>
              <p>${escapeHTML(lesson.quiz.question)}</p>
              <ol class="list-decimal ml-6 mt-3 space-y-1">
                ${(lesson.quiz.options || []).map(option =>
                  `<li>${escapeHTML(option)}</li>`
                ).join("")}
              </ol>
            </div>`
          : ""
      }

    </article>
  `).join("");

  downloadBtn.addEventListener("click", () => {
    window.print();
  });

  const themeToggle = document.getElementById("themeToggle");

  function applyTheme() {
    const theme = localStorage.getItem("webAcademyTheme");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }

  themeToggle?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "webAcademyTheme",
      isDark ? "dark" : "light"
    );
  });

  applyTheme();

})();
