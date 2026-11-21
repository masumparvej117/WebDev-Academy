
// ==========================================
// WEB ACADEMY BD - LIVE CODE PLAYGROUND
// ==========================================

// Login Protection
if (!localStorage.getItem("webAcademyCurrentUser")) {
    window.location.replace("auth.html");
}

// DOM Elements
const htmlEditor = document.getElementById("htmlEditor");
const cssEditor = document.getElementById("cssEditor");
const jsEditor = document.getElementById("jsEditor");

const editors = {
    html: htmlEditor,
    css: cssEditor,
    js: jsEditor
};

const previewFrame = document.getElementById("previewFrame");
const runBtn = document.getElementById("runBtn");
const resetBtn = document.getElementById("resetBtn");
const refreshBtn = document.getElementById("refreshBtn");
const copyBtn = document.getElementById("copyBtn");

const editorTitle = document.getElementById("editorTitle");
const editorLanguage = document.getElementById("editorLanguage");
const lineCount = document.getElementById("lineCount");
const previewStatus = document.getElementById("previewStatus");

let activeEditor = "html";

// ==========================================
// Default Starter Code
// ==========================================

const starterCode = {
    html: `<div class="container">
    <h1>Welcome to Web Academy BD!</h1>

    <p>এটি তোমার প্রথম Live Code Playground.</p>

    <button id="helloBtn">Click Me</button>
    <p id="message"></p>
</div>`,

    css: `* {
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background: #f1f5f9;
    padding: 30px;
}

.container {
    max-width: 600px;
    margin: 40px auto;
    padding: 30px;
    text-align: center;
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 20px #0001;
}

h1 {
    color: #4f46e5;
}

button {
    background: #4f46e5;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 8px;
    cursor: pointer;
}

button:hover {
    background: #3730a3;
}`,

    js: `const button = document.getElementById("helloBtn");

button.addEventListener("click", function() {
    document.getElementById("message").textContent =
        "অভিনন্দন! তোমার JavaScript কাজ করছে!";
});`
};

// ==========================================
// Load Saved Code
// ==========================================

const STORAGE_KEY = "webAcademyPlaygroundCode";

function loadCode() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "null"
        );

        htmlEditor.value = saved?.html ?? starterCode.html;
        cssEditor.value = saved?.css ?? starterCode.css;
        jsEditor.value = saved?.js ?? starterCode.js;

    } catch {
        htmlEditor.value = starterCode.html;
        cssEditor.value = starterCode.css;
        jsEditor.value = starterCode.js;
    }

    updateLineCount();
}

function saveCode() {
    const code = {
        html: htmlEditor.value,
        css: cssEditor.value,
        js: jsEditor.value
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(code));
}

function resetCode() {
    const confirmed = confirm(
        "তোমার বর্তমান কোড মুছে Starter Code ফিরিয়ে আনবে?"
    );

    if (!confirmed) return;

    htmlEditor.value = starterCode.html;
    cssEditor.value = starterCode.css;
    jsEditor.value = starterCode.js;

    saveCode();
    updateLineCount();
    runCode();
}

// ==========================================
// Editor Tab Switching
// ==========================================

const tabButtons = document.querySelectorAll(".editor-tab");

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        const tab = button.dataset.tab;

        if (!editors[tab]) return;

        activeEditor = tab;

        Object.entries(editors).forEach(([key, editor]) => {
            editor.classList.toggle("hidden", key !== tab);
        });

        tabButtons.forEach(tabButton => {
            const active = tabButton.dataset.tab === tab;

            tabButton.classList.toggle(
                "ring-2",
                active
            );

            tabButton.classList.toggle(
                "ring-indigo-500",
                active
            );

            tabButton.classList.toggle(
                "font-semibold",
                active
            );
        });

        const names = {
            html: "HTML Editor",
            css: "CSS Editor",
            js: "JavaScript Editor"
        };

        editorTitle.textContent = names[tab];
        editorLanguage.textContent = tab.toUpperCase();

        updateLineCount();
    });
});

// ==========================================
// Line Counter
// ==========================================

function updateLineCount() {
    const editor = editors[activeEditor];

    const totalLines = editor.value.split("\n").length;

    lineCount.textContent =
        `${totalLines} ${totalLines === 1 ? "line" : "lines"}`;
}

// ==========================================
// Code Editor Events
// ==========================================

Object.values(editors).forEach(editor => {

    editor.addEventListener("input", () => {
        saveCode();
        updateLineCount();

        previewStatus.textContent = "Code changed";
    });

    // Tab key support
    editor.addEventListener("keydown", event => {
        if (event.key === "Tab") {
            event.preventDefault();

            const start = editor.selectionStart;
            const end = editor.selectionEnd;

            editor.setRangeText(
                "    ",
                start,
                end,
                "end"
            );

            saveCode();
            updateLineCount();
        }

        // Ctrl + Enter to run
        if (event.ctrlKey && event.key === "Enter") {
            event.preventDefault();
            runCode();
        }
    });
});

// ==========================================
// Live Preview
// ==========================================

function safeScript(code) {
    // Prevent HTML parser from closing the injected script tag.
    return JSON.stringify(code).replace(/</g, "\\u003c");
}

function runCode() {
    const html = htmlEditor.value;
    const css = cssEditor.value;
    const javascript = jsEditor.value;

    const safeCSS = css.replace(/<\/style/gi, "<\\/style");

    const safeJS = safeScript(javascript);

    const previewDocument = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
        ${safeCSS}
    </style>
</head>

<body>

    ${html}

    <script>
        const userCode = ${safeJS};

        window.addEventListener("DOMContentLoaded", function() {
            try {
                const runUserCode = new Function(userCode);
                runUserCode();
            } catch (error) {
                parent.postMessage({
                    type: "playground-error",
                    message: error.message
                }, "*");
            }
        });

        window.addEventListener("error", function(event) {
            parent.postMessage({
                type: "playground-error",
                message: event.message
            }, "*");
        });
    <\/script>

</body>
</html>`;

    previewFrame.srcdoc = previewDocument;

    saveCode();

    previewStatus.textContent = "Preview updated";
}

// ==========================================
// Preview Error Messages
// ==========================================

window.addEventListener("message", event => {
    if (event.source !== previewFrame.contentWindow) return;

    if (event.data?.type === "playground-error") {
        previewStatus.textContent =
            "Error: " + event.data.message;
    }
});

// ==========================================
// Run / Refresh Buttons
// ==========================================

runBtn.addEventListener("click", runCode);
refreshBtn.addEventListener("click", runCode);

// ==========================================
// Copy Current Editor Code
// ==========================================

copyBtn.addEventListener("click", async () => {
    const editor = editors[activeEditor];

    try {
        await navigator.clipboard.writeText(editor.value);

        copyBtn.textContent = "✓ Copied!";

        setTimeout(() => {
            copyBtn.textContent = "Copy";
        }, 1500);

    } catch {
        alert("Code copy করা যায়নি।");
    }
});

// ==========================================
// Reset Button
// ==========================================

resetBtn.addEventListener("click", resetCode);

// ==========================================
// Dark / Light Theme
// ==========================================

const themeToggle = document.getElementById("themeToggle");

function applyTheme() {
    const theme = localStorage.getItem("webAcademyTheme");

    document.documentElement.classList.toggle(
        "dark",
        theme === "dark"
    );

    if (window.lucide) {
        lucide.createIcons();
    }
}

themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");

    localStorage.setItem(
        "webAcademyTheme",
        isDark ? "light" : "dark"
    );

    applyTheme();
});

// ==========================================
// Logout
// ==========================================

document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm("তুমি কি Logout করতে চাও?")) {
        localStorage.removeItem("webAcademyCurrentUser");
        window.location.replace("auth.html");
    }
});

// ==========================================
// Initialize
// ==========================================

loadCode();
applyTheme();
runCode();

if (window.lucide) {
    lucide.createIcons();
}
