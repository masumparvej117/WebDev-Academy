
(function () {
    const currentUser = localStorage.getItem("webAcademyCurrentUser");

    const protectedPages = [
        "courses.html",
        "course-details.html",
        "lesson.html",
        "playground.html"
    ];

    const currentPage = window.location.pathname.split("/").pop();

    if (protectedPages.includes(currentPage) && !currentUser) {
        window.location.replace("auth.html");
    }
})();
