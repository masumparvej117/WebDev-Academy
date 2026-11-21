
// ==========================================
// WEB ACADEMY BD - ADMIN PANEL
// ==========================================

// ==========================================
// ADMIN CONFIGURATION
// ==========================================

// এখানে তোমার Registered Email বসাবে।
const ADMIN_EMAILS = [
    "your-admin-email@example.com"
];

// LocalStorage Keys
const KEYS = {
    session: "webAcademyCurrentUser",
    users: "webAcademyUsers",
    courses: "webAcademyCourses",
    progress: "webAcademyProgress",
    certificates: "webAcademyCertificates",
    theme: "webAcademyTheme"
};

// ==========================================
// DOM ELEMENTS
// ==========================================

const $ = id => document.getElementById(id);

const sidebar = $("sidebar");
const sidebarOverlay = $("sidebarOverlay");

const sections = {
    overview: $("overviewSection"),
    courses: $("coursesSection"),
    students: $("studentsSection"),
    settings: $("settingsSection")
};

const pageTitles = {
    overview: "Dashboard Overview",
    courses: "Manage Courses",
    students: "Student Management",
    settings: "Admin Settings"
};

// ==========================================
// STORAGE HELPERS
// ==========================================

function getData(key, fallback = []) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
    const users = getData(KEYS.users, []);
    return Array.isArray(users) ? users : [];
}

function getCourses() {
    const courses = getData(KEYS.courses, []);
    return Array.isArray(courses) ? courses : [];
}

// ==========================================
// HTML ESCAPE
// ==========================================

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
// ADMIN AUTHENTICATION
// ==========================================

function getSessionUser() {
    const session = localStorage.getItem(KEYS.session);

    if (!session) return null;

    try {
        const user = JSON.parse(session);

        if (user && typeof user === "object") {
            return user;
        }
    } catch {
        const users = getUsers();

        return users.find(user =>
            user.email === session ||
            user.username === session
        ) || null;
    }

    return null;
}

function checkAdminAccess() {
    const user = getSessionUser();

    if (!user) {
        alert("প্রথমে Login করো।");
        window.location.href = "auth.html";
        return null;
    }

    const email = String(user.email || "").trim().toLowerCase();

    const isAdmin = ADMIN_EMAILS.some(adminEmail =>
        adminEmail.trim().toLowerCase() === email
    );

    if (!isAdmin) {
        alert("তোমার Admin Access নেই।");
        window.location.href = "dashboard.html";
        return null;
    }

    return user;
}

const adminUser = checkAdminAccess();

if (adminUser) {
    initializeAdmin();
}

// ==========================================
// INITIALIZE
// ==========================================

function initializeAdmin() {
    $("adminEmail").textContent = adminUser.email || "Admin";

    $("currentDate").textContent =
        new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    setupNavigation();
    setupMobileMenu();
    setupTheme();
    setupCourseManagement();
    setupStudentManagement();
    setupSettings();

    refreshDashboard();

    if (window.lucide) {
        lucide.createIcons();
    }
}

// ==========================================
// ALERT MESSAGE
// ==========================================

function showAlert(message, type = "success") {
    const alertBox = $("adminAlert");

    alertBox.textContent = message;
    alertBox.classList.remove("hidden");

    alertBox.className =
        "mb-6 p-4 rounded-xl text-sm " +
        (type === "error"
            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
            : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300");

    setTimeout(() => {
        alertBox.classList.add("hidden");
    }, 4000);
}

// ==========================================
// NAVIGATION
// ==========================================

function openSection(sectionName) {
    if (!sections[sectionName]) return;

    Object.entries(sections).forEach(([name, section]) => {
        section.classList.toggle("hidden", name !== sectionName);
    });

    document.querySelectorAll(".nav-link").forEach(button => {
        const active = button.dataset.section === sectionName;

        button.classList.toggle("bg-indigo-600", active);
        button.classList.toggle("text-white", active);
        button.classList.toggle("hover:bg-slate-800", !active);
    });

    $("pageTitle").textContent = pageTitles[sectionName];

    closeMobileMenu();

    if (sectionName === "overview") {
        refreshDashboard();
    }

    if (sectionName === "courses") {
        renderCourses();
    }

    if (sectionName === "students") {
        renderStudents();
    }
}

function setupNavigation() {
    document.querySelectorAll("[data-section]").forEach(button => {
        button.addEventListener("click", () => {
            openSection(button.dataset.section);
        });
    });

    $("quickAddCourse").addEventListener("click", () => {
        openSection("courses");
        openCourseForm();
    });

    $("addCourseBtn").addEventListener("click", openCourseForm);

    $("quickStudents").addEventListener("click", () => {
        openSection("students");
    });
}

// ==========================================
// MOBILE SIDEBAR
// ==========================================

function openMobileMenu() {
    sidebar.classList.remove("-translate-x-full");
    sidebarOverlay.classList.remove("hidden");
}

function closeMobileMenu() {
    sidebar.classList.add("-translate-x-full");
    sidebarOverlay.classList.add("hidden");
}

function setupMobileMenu() {
    $("mobileMenuBtn").addEventListener("click", openMobileMenu);
    sidebarOverlay.addEventListener("click", closeMobileMenu);
}

// ==========================================
// THEME
// ==========================================

function applyTheme() {
    const theme = localStorage.getItem(KEYS.theme);

    document.documentElement.classList.toggle(
        "dark",
        theme === "dark"
    );

    if (window.lucide) {
        lucide.createIcons();
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");

    localStorage.setItem(
        KEYS.theme,
        isDark ? "light" : "dark"
    );

    applyTheme();
}

function setupTheme() {
    $("themeToggle").addEventListener("click", toggleTheme);
    $("themeToggleDesktop").addEventListener("click", toggleTheme);

    applyTheme();
}

// ==========================================
// DASHBOARD STATISTICS
// ==========================================

function refreshDashboard() {
    const users = getUsers();
    const courses = getCourses();

    const free = courses.filter(course =>
        course.type !== "premium"
    );

    const premium = courses.filter(course =>
        course.type === "premium"
    );

    $("totalStudents").textContent = users.length;
    $("totalCourses").textContent = courses.length;
    $("freeCourses").textContent = free.length;
    $("premiumCourses").textContent = premium.length;

    renderRecentCourses();
}

function renderRecentCourses() {
    const courses = getCourses();
    const recent = courses.slice(-5).reverse();

    $("recentCourses").innerHTML = recent.map(course => `
        <tr class="border-t border-slate-100 dark:border-slate-800">
            <td class="p-4 font-semibold">${escapeHTML(course.title)}</td>
            <td class="p-4">${course.type === "premium" ? "Premium" : "Free"}</td>
            <td class="p-4">${Array.isArray(course.lessons) ? course.lessons.length : 0}</td>
            <td class="p-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold ${
                    course.type === "premium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                }">
                    ${course.type === "premium" ? "Coming Soon" : "Available"}
                </span>
            </td>
        </tr>
    `).join("");

    if (window.lucide) lucide.createIcons();
}

// ==========================================
// COURSE MANAGEMENT
// ==========================================

function setupCourseManagement() {
    $("courseSearch").addEventListener("input", renderCourses);

    $("closeCourseForm").addEventListener("click", closeCourseForm);
    $("cancelCourseForm").addEventListener("click", closeCourseForm);

    $("courseForm").addEventListener("submit", saveCourse);
}

function createCourseId(title) {
    const base = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "new-course";

    let id = base;
    let count = 1;

    const courses = getCourses();
    const editingId = $("editCourseId").value;

    while (courses.some(course =>
        course.id === id && course.id !== editingId
    )) {
        id = `${base}-${count++}`;
    }

    return id;
}

function renderCourses() {
    const courses = getCourses();

    const search = $("courseSearch").value
        .trim()
        .toLowerCase();

    const filtered = courses.filter(course =>
        [
            course.title,
            course.category,
            course.subtitle,
            course.type
        ].some(value =>
            String(value || "").toLowerCase().includes(search)
        )
    );

    $("noCourses").classList.toggle("hidden", filtered.length > 0);

    $("courseTable").innerHTML = filtered.map(course => `
        <tr class="border-t border-slate-100 dark:border-slate-800">

            <td class="p-4">
                <div class="font-bold">${escapeHTML(course.title)}</div>
                <div class="text-xs text-slate-500 mt-1">${escapeHTML(course.id)}</div>
            </td>

            <td class="p-4">${escapeHTML(course.category || "General")}</td>

            <td class="p-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold ${
                    course.type === "premium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                }">
                    ${course.type === "premium" ? "Premium" : "Free"}
                </span>
            </td>

            <td class="p-4">
                ${Array.isArray(course.lessons) ? course.lessons.length : 0}
            </td>

            <td class="p-4">
                <div class="flex items-center gap-2">

                    <button
                        data-edit-course="${escapeHTML(course.id)}"
                        class="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 hover:opacity-70"
                        title="Edit Course">
                        <i data-lucide="pencil" class="w-4 h-4"></i>
                    </button>

                    <button
                        data-delete-course="${escapeHTML(course.id)}"
                        class="p-2 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 hover:opacity-70"
                        title="Delete Course">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>

                </div>
            </td>
        </tr>
    `).join("");

    document.querySelectorAll("[data-edit-course]").forEach(button => {
        button.addEventListener("click", () => {
            editCourse(button.dataset.editCourse);
        });
    });

    document.querySelectorAll("[data-delete-course]").forEach(button => {
        button.addEventListener("click", () => {
            deleteCourse(button.dataset.deleteCourse);
        });
    });

    if (window.lucide) lucide.createIcons();
}

// ==========================================
// OPEN COURSE FORM
// ==========================================

function openCourseForm() {
    $("courseForm").reset();
    $("editCourseId").value = "";
    $("courseFormTitle").textContent = "Add New Course";

    $("courseLessons").value = "[]";

    $("courseFormPanel").classList.remove("hidden");

    $("courseFormPanel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ==========================================
// CLOSE COURSE FORM
// ==========================================

function closeCourseForm() {
    $("courseFormPanel").classList.add("hidden");
    $("courseForm").reset();
    $("editCourseId").value = "";
}

// ==========================================
// EDIT COURSE
// ==========================================

function editCourse(courseId) {
    const course = getCourses().find(item =>
        String(item.id) === String(courseId)
    );

    if (!course) return;

    $("editCourseId").value = course.id;
    $("courseTitle").value = course.title || "";
    $("courseSubtitle").value = course.subtitle || "";
    $("courseCategory").value = course.category || "";
    $("courseLevel").value = course.level || "Beginner";
    $("courseType").value = course.type || "free";
    $("courseDuration").value = course.duration || "";
    $("courseImage").value = course.image || "";
    $("courseDescription").value = course.description || "";

    $("courseLessons").value = JSON.stringify(
        course.lessons || [],
        null,
        2
    );

    $("courseFormTitle").textContent = "Edit Course";

    $("courseFormPanel").classList.remove("hidden");

    $("courseFormPanel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ==========================================
// SAVE COURSE
// ==========================================

function saveCourse(event) {
    event.preventDefault();

    const title = $("courseTitle").value.trim();
    const editingId = $("editCourseId").value;

    let lessons = [];

    try {
        lessons = JSON.parse(
            $("courseLessons").value.trim() || "[]"
        );

        if (!Array.isArray(lessons)) {
            throw new Error("Lessons must be an array.");
        }

        const lessonIds = new Set();

        for (const lesson of lessons) {
            if (!lesson || typeof lesson !== "object") {
                throw new Error("প্রতিটি Lesson অবশ্যই Object হতে হবে।");
            }

            if (!lesson.id || !lesson.title) {
                throw new Error("প্রতিটি Lesson-এ id ও title দিতে হবে।");
            }

            if (lessonIds.has(String(lesson.id))) {
                throw new Error("একই Course-এ Lesson ID একাধিকবার দেওয়া যাবে না।");
            }

            lessonIds.add(String(lesson.id));
        }

    } catch (error) {
        showAlert("Lessons JSON ভুল: " + error.message, "error");
        return;
    }

    const courses = getCourses();

    const existingCourse = courses.find(course =>
        course.id === editingId
    );

    const course = {
        id: editingId || createCourseId(title),
        title,
        subtitle: $("courseSubtitle").value.trim(),
        category: $("courseCategory").value.trim(),
        level: $("courseLevel").value,
        type: $("courseType").value,
        duration: $("courseDuration").value.trim(),
        image: $("courseImage").value.trim(),
        description: $("courseDescription").value.trim(),
        lessons,
        ...(existingCourse?.createdAt
            ? { createdAt: existingCourse.createdAt }
            : { createdAt: new Date().toISOString() })
    };

    if (existingCourse) {
        const index = courses.findIndex(item =>
            item.id === editingId
        );

        courses[index] = {
            ...existingCourse,
            ...course
        };
    } else {
        courses.push(course);
    }

    try {
        saveData(KEYS.courses, courses);
    } catch {
        showAlert("Storage পূর্ণ বা Save করা যায়নি।", "error");
        return;
    }

    closeCourseForm();
    renderCourses();
    refreshDashboard();

    showAlert(
        existingCourse
            ? "Course সফলভাবে Update হয়েছে।"
            : "নতুন Course সফলভাবে Add হয়েছে।"
    );
}

// ==========================================
// DELETE COURSE
// ==========================================

function deleteCourse(courseId) {
    const courses = getCourses();

    const course = courses.find(item =>
        String(item.id) === String(courseId)
    );

    if (!course) return;

    const confirmed = confirm(
        `"${course.title}" Course Delete করতে চাও?\n\nএই কাজটি Undo করা যাবে না।`
    );

    if (!confirmed) return;

    const updatedCourses = courses.filter(item =>
        String(item.id) !== String(courseId)
    );

    const progress = getData(KEYS.progress, {});

    delete progress[courseId];

    try {
        saveData(KEYS.courses, updatedCourses);
        saveData(KEYS.progress, progress);

        // Remove related certificates
        const certificates = getData(KEYS.certificates, {});

        Object.keys(certificates).forEach(userKey => {
            if (certificates[userKey]) {
                delete certificates[userKey][courseId];
            }
        });

        saveData(KEYS.certificates, certificates);

    } catch {
        showAlert("Course Delete করা যায়নি।", "error");
        return;
    }

    renderCourses();
    refreshDashboard();

    showAlert("Course Delete হয়েছে।");
}

// ==========================================
// STUDENT MANAGEMENT
// ==========================================

function setupStudentManagement() {
    $("studentSearch").addEventListener("input", renderStudents);
}

function renderStudents() {
    const users = getUsers();

    const search = $("studentSearch").value
        .trim()
        .toLowerCase();

    const filtered = users.filter(user => {
        const searchable = [
            user.name,
            user.username,
            user.email,
            user.phone
        ].join(" ").toLowerCase();

        return searchable.includes(search);
    });

    $("noStudents").classList.toggle("hidden", filtered.length > 0);

    $("studentTable").innerHTML = filtered.map((user, index) => {
        const identity = user.email || user.username || "";

        return `
            <tr class="border-t border-slate-100 dark:border-slate-800">

                <td class="p-4">
                    <div class="font-bold">${escapeHTML(user.name || user.username || "Student")}</div>
                    <div class="text-xs text-slate-500 mt-1">@${escapeHTML(user.username || "user")}</div>
                </td>

                <td class="p-4">${escapeHTML(user.email || "-")}</td>

                <td class="p-4">${escapeHTML(user.phone || "-")}</td>

                <td class="p-4">${escapeHTML(user.gender || "-")}</td>

                <td class="p-4">
                    <button
                        data-delete-student="${index}"
                        class="p-2 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 hover:opacity-70"
                        title="Delete Student">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </td>

            </tr>
        `;
    }).join("");

    document.querySelectorAll("[data-delete-student]").forEach(button => {
        button.addEventListener("click", () => {
            deleteStudent(Number(button.dataset.deleteStudent));
        });
    });

    if (window.lucide) lucide.createIcons();
}

// ==========================================
// DELETE STUDENT
// ==========================================

function deleteStudent(index) {
    const users = getUsers();
    const student = users[index];

    if (!student) return;

    const currentEmail = String(adminUser.email || "").toLowerCase();
    const studentEmail = String(student.email || "").toLowerCase();

    if (currentEmail && currentEmail === studentEmail) {
        showAlert("নিজের Admin Account Delete করা যাবে না।", "error");
        return;
    }

    const confirmed = confirm(
        `${student.name || student.username} - এই Student Account Delete করতে চাও?`
    );

    if (!confirmed) return;

    users.splice(index, 1);

    saveData(KEYS.users, users);

    renderStudents();
    refreshDashboard();

    showAlert("Student Account Delete হয়েছে।");
}

// ==========================================
// DATA BACKUP / RESTORE
// ==========================================

function setupSettings() {
    $("exportData").addEventListener("click", exportBackup);
    $("importData").addEventListener("change", importBackup);
}

function exportBackup() {
    const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        users: getData(KEYS.users, []),
        courses: getData(KEYS.courses, []),
        progress: getData(KEYS.progress, {}),
        certificates: getData(KEYS.certificates, {})
    };

    const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "web-academy-backup.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    showAlert("Backup Download হয়েছে। ফাইলটি নিরাপদে রাখো।");
}

async function importBackup(event) {
    const file = event.target.files[0];

    if (!file) return;

    try {
        if (file.size > 10 * 1024 * 1024) {
            throw new Error("Backup ফাইল 10 MB-এর বেশি হতে পারবে না।");
        }

        const text = await file.text();
        const backup = JSON.parse(text);

        if (
            !backup ||
            !Array.isArray(backup.users) ||
            !Array.isArray(backup.courses) ||
            !backup.progress ||
            typeof backup.progress !== "object" ||
            !backup.certificates ||
            typeof backup.certificates !== "object"
        ) {
            throw new Error("Backup ফাইলের Format সঠিক নয়।");
        }

        const confirmed = confirm(
            "বর্তমান Users, Courses ও Progress Backup-এর ডেটা দিয়ে Replace হবে। Continue করবে?"
        );

        if (!confirmed) {
            event.target.value = "";
            return;
        }

        saveData(KEYS.users, backup.users);
        saveData(KEYS.courses, backup.courses);
        saveData(KEYS.progress, backup.progress);
        saveData(KEYS.certificates, backup.certificates);

        showAlert("Backup Restore হয়েছে।");

        refreshDashboard();
        renderCourses();
        renderStudents();

    } catch (error) {
        showAlert("Import Failed: " + error.message, "error");
    }

    event.target.value = "";
}

// ==========================================
// LOGOUT
// ==========================================

$("logoutBtn").addEventListener("click", () => {
    const confirmed = confirm("Admin Panel থেকে Logout করবে?");

    if (!confirmed) return;

    localStorage.removeItem(KEYS.session);
    window.location.href = "auth.html";
});

// ==========================================
// PAGE START
// ==========================================

window.addEventListener("storage", event => {
    if (
        event.key === KEYS.users ||
        event.key === KEYS.courses
    ) {
        refreshDashboard();
    }
});
