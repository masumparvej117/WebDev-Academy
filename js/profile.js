
// ==========================================
// WEB ACADEMY BD - PROFILE SYSTEM
// ==========================================

"use strict";

// ==========================================
// DOM ELEMENTS
// ==========================================

const profileForm = document.getElementById("profileForm");
const formMessage = document.getElementById("formMessage");

const fullName = document.getElementById("fullName");
const username = document.getElementById("username");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const gender = document.getElementById("gender");

const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

const profileImage = document.getElementById("profileImage");
const imageUpload = document.getElementById("imageUpload");

const headerName = document.getElementById("headerName");
const headerEmail = document.getElementById("headerEmail");

const removeImageBtn = document.getElementById("removeImageBtn");
const themeToggle = document.getElementById("themeToggle");
const logoutBtn = document.getElementById("logoutBtn");

const DEFAULT_IMAGE =
    "https://placehold.co/120x120/ffffff/4f46e5?text=User";

let currentUser = null;
let profilePhoto = "";

// ==========================================
// STORAGE HELPERS
// ==========================================

function readJSON(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
}

function getUsers() {
    const users = readJSON("webAcademyUsers", []);
    return Array.isArray(users) ? users : [];
}

function saveUsers(users) {
    localStorage.setItem("webAcademyUsers", JSON.stringify(users));
}

function saveCurrentUser(user) {
    localStorage.setItem(
        "webAcademyCurrentUser",
        JSON.stringify(user)
    );
}

// ==========================================
// MESSAGE SYSTEM
// ==========================================

function showMessage(message, type = "success") {
    if (!formMessage) return;

    formMessage.textContent = message;

    formMessage.className =
        type === "success"
            ? "text-sm font-semibold text-green-600"
            : "text-sm font-semibold text-red-600";
}

// ==========================================
// GET CURRENT USER
// ==========================================

function loadCurrentUser() {
    const sessionData = localStorage.getItem(
        "webAcademyCurrentUser"
    );

    if (!sessionData) {
        window.location.replace("auth.html");
        return false;
    }

    try {
        const parsed = JSON.parse(sessionData);

        if (parsed && typeof parsed === "object") {
            currentUser = parsed;
        } else {
            const users = getUsers();

            currentUser = users.find(user =>
                user.username === sessionData ||
                user.email === sessionData
            ) || null;
        }
    } catch {
        const users = getUsers();

        currentUser = users.find(user =>
            user.username === sessionData ||
            user.email === sessionData
        ) || null;
    }

    if (!currentUser) {
        showMessage(
            "User information পাওয়া যায়নি। আবার Login করো।",
            "error"
        );

        localStorage.removeItem("webAcademyCurrentUser");

        setTimeout(() => {
            window.location.replace("auth.html");
        }, 1500);

        return false;
    }

    return true;
}

// ==========================================
// UPDATE PROFILE HEADER
// ==========================================

function updateProfileHeader() {
    const name =
        fullName.value.trim() ||
        currentUser?.name ||
        currentUser?.username ||
        "Student";

    if (headerName) {
        headerName.textContent = name;
    }

    if (headerEmail) {
        headerEmail.textContent =
            email.value.trim() || "Email not provided";
    }

    if (profileImage) {
        profileImage.src = profilePhoto || DEFAULT_IMAGE;
    }
}

// ==========================================
// LOAD PROFILE
// ==========================================

function loadProfile() {
    if (!currentUser) return;

    fullName.value =
        currentUser.name || currentUser.fullName || "";

    username.value = currentUser.username || "";
    email.value = currentUser.email || "";
    phone.value = currentUser.phone || "";
    dob.value = currentUser.dob || "";
    gender.value = currentUser.gender || "";

    profilePhoto = currentUser.profileImage || "";

    updateProfileHeader();
}

fullName.addEventListener("input", updateProfileHeader);
email.addEventListener("input", updateProfileHeader);

// ==========================================
// PROFILE IMAGE UPLOAD
// ==========================================

imageUpload.addEventListener("change", event => {
    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
        showMessage(
            "শুধু JPG, PNG অথবা WEBP ছবি ব্যবহার করো।",
            "error"
        );

        imageUpload.value = "";
        return;
    }

    if (file.size > 1024 * 1024) {
        showMessage(
            "ছবির সাইজ ১ MB-এর বেশি হতে পারবে না।",
            "error"
        );

        imageUpload.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        profilePhoto = reader.result;

        profileImage.src = profilePhoto;

        showMessage(
            "ছবি নির্বাচন করা হয়েছে। Save Changes চাপলে সংরক্ষিত হবে।",
            "success"
        );
    };

    reader.onerror = () => {
        showMessage(
            "ছবি পড়া যায়নি। আবার চেষ্টা করো।",
            "error"
        );
    };

    reader.readAsDataURL(file);
});

// ==========================================
// REMOVE PROFILE IMAGE
// ==========================================

removeImageBtn.addEventListener("click", () => {
    profilePhoto = "";

    profileImage.src = DEFAULT_IMAGE;
    imageUpload.value = "";

    showMessage(
        "ছবি সরানো হয়েছে। Save Changes চাপলে পরিবর্তন কার্যকর হবে।",
        "success"
    );
});

// ==========================================
// DUPLICATE USERNAME & EMAIL CHECK
// ==========================================

function isDuplicate(users, newUsername, newEmail) {
    return users.some(user => {
        const sameAccount =
            (
                currentUser.id &&
                user.id &&
                String(user.id) === String(currentUser.id)
            ) ||
            (
                user.username === currentUser.username &&
                user.email === currentUser.email
            );

        if (sameAccount) return false;

        const existingUsername =
            String(user.username || "").toLowerCase();

        const existingEmail =
            String(user.email || "").toLowerCase();

        return (
            existingUsername === newUsername.toLowerCase() ||
            existingEmail === newEmail.toLowerCase()
        );
    });
}

// ==========================================
// SAVE PROFILE
// ==========================================

profileForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!currentUser) {
        showMessage("আগে Login করো।", "error");
        return;
    }

    const nameValue = fullName.value.trim();
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim().toLowerCase();
    const phoneValue = phone.value.trim();

    const dobValue = dob.value;
    const genderValue = gender.value;

    const passwordValue = newPassword.value;
    const confirmValue = confirmPassword.value;

    // Required fields
    if (!nameValue || !usernameValue || !emailValue) {
        showMessage(
            "Full Name, Username ও Email অবশ্যই দিতে হবে।",
            "error"
        );
        return;
    }

    // Username validation
    if (!/^[A-Za-z0-9_]{3,30}$/.test(usernameValue)) {
        showMessage(
            "Username ৩-৩০ অক্ষরের হতে হবে। শুধু English letter, number ও underscore ব্যবহার করো।",
            "error"
        );
        return;
    }

    // Email validation
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailValue)) {
        showMessage(
            "সঠিক Email Address দাও।",
            "error"
        );
        return;
    }

    // Password validation
    if (passwordValue || confirmValue) {
        if (passwordValue.length < 6) {
            showMessage(
                "নতুন Password কমপক্ষে ৬ অক্ষরের হতে হবে।",
                "error"
            );
            return;
        }

        if (passwordValue !== confirmValue) {
            showMessage(
                "দুটি Password মিলছে না।",
                "error"
            );
            return;
        }
    }

    // Date validation
    if (dobValue) {
        const selectedDate = new Date(
            dobValue + "T00:00:00"
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            showMessage(
                "জন্মতারিখ ভবিষ্যতের হতে পারে না।",
                "error"
            );
            return;
        }
    }

    const users = getUsers();

    // Duplicate check
    if (isDuplicate(users, usernameValue, emailValue)) {
        showMessage(
            "এই Username অথবা Email অন্য অ্যাকাউন্টে ব্যবহৃত হচ্ছে।",
            "error"
        );
        return;
    }

    // Updated user
    const updatedUser = {
        ...currentUser,
        name: nameValue,
        username: usernameValue,
        email: emailValue,
        phone: phoneValue,
        dob: dobValue,
        gender: genderValue,
        profileImage: profilePhoto
    };

    // Change password only when provided
    if (passwordValue) {
        updatedUser.password = passwordValue;
    }

    // Find existing account
    const userIndex = users.findIndex(user => {
        if (currentUser.id && user.id) {
            return String(user.id) === String(currentUser.id);
        }

        return (
            user.username === currentUser.username &&
            user.email === currentUser.email
        );
    });

    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            ...updatedUser
        };
    } else {
        users.push(updatedUser);
    }

    try {
        saveUsers(users);
        saveCurrentUser(updatedUser);

        currentUser = updatedUser;

        newPassword.value = "";
        confirmPassword.value = "";

        updateProfileHeader();

        showMessage(
            "✓ তোমার Profile সফলভাবে আপডেট হয়েছে!",
            "success"
        );

    } catch (error) {
        console.error("Profile save error:", error);

        showMessage(
            "তথ্য সংরক্ষণ করা যায়নি। ছবির সাইজ কমিয়ে আবার চেষ্টা করো।",
            "error"
        );
    }
});

// ==========================================
// THEME SYSTEM
// ==========================================

function applyTheme() {
    const theme =
        localStorage.getItem("webAcademyTheme") || "light";

    document.documentElement.classList.toggle(
        "dark",
        theme === "dark"
    );

    if (window.lucide) {
        lucide.createIcons();
    }
}

themeToggle.addEventListener("click", () => {
    const isDark =
        document.documentElement.classList.contains("dark");

    localStorage.setItem(
        "webAcademyTheme",
        isDark ? "light" : "dark"
    );

    applyTheme();
});

// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener("click", () => {
    if (confirm("তুমি কি Logout করতে চাও?")) {
        localStorage.removeItem("webAcademyCurrentUser");

        window.location.replace("auth.html");
    }
});

// ==========================================
// INITIALIZE PROFILE SYSTEM
// ==========================================

if (loadCurrentUser()) {
    loadProfile();
}

applyTheme();

// ==========================================
// END PROFILE SYSTEM
// ==========================================
