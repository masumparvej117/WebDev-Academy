
(() => {
"use strict";

/* =====================================
   1. LOGIN PROTECTION
===================================== */
function getCurrentUser() {
    const raw = localStorage.getItem("webAcademyCurrentUser");
    if (!raw) return null;

    try {
        const user = JSON.parse(raw);
        if (user && typeof user === "object") return user;
    } catch (error) {
        try {
            const users = JSON.parse(localStorage.getItem("webAcademyUsers") || "[]");
            if (Array.isArray(users)) {
                return users.find(user =>
                    user.email === raw || user.username === raw
                ) || null;
            }
        } catch (e) {
            console.warn("User data error:", e);
        }
    }
    return null;
}

const currentUser = getCurrentUser();

// Login protection চালু করতে নিচের অংশ Uncomment করো
// if (!currentUser) {
//     window.location.replace("auth.html");
//     return;
// }

/* =====================================
   2. LESSON GENERATOR
===================================== */
function createLessons(courseId, lessons) {
    return lessons.map((item, index) => ({
        id: `${courseId}-${index + 1}`,
        title: item.title,
        duration: item.duration || "20 মিনিট",
        explanation: item.explanation,
        code: item.code,
        output: item.output || "Browser-এ কোডের Output দেখা যাবে।",
        practice: item.practice,
        quiz: {
            question: item.question,
            options: item.options || [],
            answer: item.answer
        }
    }));
}

/* =====================================
   3. DEFAULT COURSES
===================================== */
const defaultCourses = [

{
    id: "html",
    title: "HTML5 Complete Course",
    subtitle: "শূন্য থেকে HTML শেখো",
    category: "frontend",
    level: "Beginner",
    type: "free",
    icon: "code",
    color: "orange",
    description: "HTML দিয়ে ওয়েবসাইটের Structure, Forms, Tables, Semantic HTML এবং SEO শেখো।",
    lessons: createLessons("html", [
        {
            title: "HTML পরিচিতি ও Web কীভাবে কাজ করে",
            explanation: "HTML-এর পূর্ণরূপ HyperText Markup Language। এটি ওয়েবসাইটের কাঠামো তৈরি করে। Browser HTML পড়ে ওয়েবপেজ প্রদর্শন করে।",
            code: "<!DOCTYPE html>\n<html>\n<head>\n<title>My Website</title>\n</head>\n<body>\n<h1>Hello World</h1>\n<p>আমি HTML শিখছি।</p>\n</body>\n</html>",
            practice: "নিজের নাম দিয়ে একটি HTML পেজ তৈরি করো।",
            question: "HTML-এর পূর্ণরূপ কী?",
            options: ["HyperText Markup Language", "HighText Machine Language", "Hyper Tool Language"],
            answer: 0
        },
        {
            title: "HTML Tags, Elements ও Attributes",
            explanation: "Opening Tag ও Closing Tag মিলে Element তৈরি হয়। Attribute element সম্পর্কে অতিরিক্ত তথ্য দেয়।",
            code: "<h1 title='My Title'>Welcome</h1>\n<p class='intro'>Hello</p>\n<img src='photo.jpg' alt='Photo'>",
            practice: "একটি heading, paragraph এবং image তৈরি করো।",
            question: "ছবির বিকল্প বর্ণনা দিতে কোন Attribute ব্যবহৃত হয়?",
            options: ["href", "alt", "target"],
            answer: 1
        },
        {
            title: "Headings, Paragraph ও Text Formatting",
            explanation: "h1 থেকে h6 পর্যন্ত Heading তৈরি হয়। p দিয়ে Paragraph, strong দিয়ে গুরুত্বপূর্ণ লেখা এবং em দিয়ে emphasis বোঝানো হয়।",
            code: "<h1>Main Heading</h1>\n<h2>Sub Heading</h2>\n<p>Hello <strong>World</strong></p>\n<p><em>Learn HTML</em></p>",
            practice: "নিজের পরিচিতি দিয়ে Heading ও Paragraph তৈরি করো।",
            question: "সবচেয়ে গুরুত্বপূর্ণ Heading কোনটি?",
            options: ["h6", "h3", "h1"],
            answer: 2
        },
        {
            title: "Links, Images ও Lists",
            explanation: "a দিয়ে Link, img দিয়ে Image, ul দিয়ে Unordered List এবং ol দিয়ে Ordered List তৈরি হয়।",
            code: "<a href='https://google.com'>Google</a>\n<img src='photo.jpg' alt='Photo'>\n<ul><li>HTML</li><li>CSS</li></ul>",
            practice: "নিজের পছন্দের ওয়েবসাইটের Link ও একটি List তৈরি করো।",
            question: "Hyperlink তৈরিতে কোন Tag ব্যবহার হয়?",
            options: ["img", "a", "link"],
            answer: 1
        },
        {
            title: "HTML Tables",
            explanation: "Table দিয়ে Row ও Column আকারে তথ্য দেখানো হয়। tr দিয়ে Row, th দিয়ে Header এবং td দিয়ে Data Cell তৈরি হয়।",
            code: "<table border='1'>\n<tr><th>Name</th><th>Age</th></tr>\n<tr><td>Masum</td><td>22</td></tr>\n</table>",
            practice: "তিনজন শিক্ষার্থীর তথ্য দিয়ে Table তৈরি করো।",
            question: "Table-এর Row তৈরির Tag কোনটি?",
            options: ["td", "tr", "th"],
            answer: 1
        },
        {
            title: "HTML Forms ও Input Fields",
            explanation: "Form ব্যবহারকারীর কাছ থেকে তথ্য সংগ্রহ করে। Input, Label, Select, Textarea ও Button ব্যবহার করা হয়।",
            code: "<form>\n<label>Name</label>\n<input type='text'>\n<label>Email</label>\n<input type='email'>\n<button>Submit</button>\n</form>",
            practice: "নাম, ইমেইল ও পাসওয়ার্ড দিয়ে Registration Form তৈরি করো।",
            question: "ইমেইলের জন্য কোন Input Type ব্যবহার হয়?",
            options: ["text", "email", "number"],
            answer: 1
        },
        {
            title: "Semantic HTML, SEO ও Project",
            explanation: "header, nav, main, section, article ও footer হলো Semantic HTML Element। এগুলো ওয়েবসাইটের Structure পরিষ্কার করে।",
            code: "<header><h1>My Website</h1></header>\n<nav>Home | About</nav>\n<main>\n<section><h2>About Me</h2></section>\n</main>\n<footer>Copyright 2026</footer>",
            practice: "Header, Navigation, About এবং Footer দিয়ে Portfolio তৈরি করো।",
            question: "প্রধান Content বোঝাতে কোন Element ব্যবহৃত হয়?",
            options: ["main", "footer", "aside"],
            answer: 0
        }
    ])
},

{
    id: "css",
    title: "CSS3 Complete Course",
    subtitle: "ওয়েবসাইটকে সুন্দর করে সাজাও",
    category: "frontend",
    level: "Beginner",
    type: "free",
    icon: "palette",
    color: "blue",
    description: "CSS দিয়ে Color, Layout, Flexbox, Grid, Animation ও Responsive Design শেখো।",
    lessons: createLessons("css", [
        {
            title: "CSS পরিচিতি ও Syntax",
            explanation: "CSS-এর পূর্ণরূপ Cascading Style Sheets। HTML Element-এর Design নিয়ন্ত্রণ করতে CSS ব্যবহার হয়।",
            code: "h1 {\n color: blue;\n font-size: 32px;\n}\np { color: gray; }",
            practice: "Heading-এর Color Red এবং Size 40px করো।",
            question: "CSS-এর পূর্ণরূপ কী?",
            options: ["Creative Style System", "Cascading Style Sheets", "Computer Style Sheet"],
            answer: 1
        },
        {
            title: "Selectors, Colors ও Background",
            explanation: "Selector দিয়ে HTML Element নির্বাচন করা হয়। Class Selector-এর আগে Dot এবং ID Selector-এর আগে Hash ব্যবহার হয়।",
            code: "h1 { color: red; }\n.title { background: yellow; }\n#header { color: white; }",
            practice: "একটি Card তৈরি করে তার Background পরিবর্তন করো।",
            question: "Class Selector-এর আগে কোন চিহ্ন থাকে?",
            options: ["#", ".", "*"],
            answer: 1
        },
        {
            title: "Box Model, Margin ও Padding",
            explanation: "CSS Box Model-এর অংশ Content, Padding, Border এবং Margin।",
            code: ".card {\n width: 300px;\n padding: 20px;\n border: 2px solid black;\n margin: 15px;\n}",
            practice: "একটি Card তৈরি করে Margin ও Padding ব্যবহার করো।",
            question: "Element-এর বাইরের Space কোনটি?",
            options: ["Padding", "Margin", "Content"],
            answer: 1
        },
        {
            title: "Typography ও CSS Units",
            explanation: "font-family, font-size, font-weight, line-height ও text-align দিয়ে Text Design করা হয়।",
            code: "p {\n font-family: Arial;\n font-size: 18px;\n line-height: 1.6;\n text-align: center;\n}",
            practice: "Paragraph-এর Font ও Alignment পরিবর্তন করো।",
            question: "Root Font Size-এর ভিত্তিতে কোন Unit কাজ করে?",
            options: ["rem", "px", "vh"],
            answer: 0
        },
        {
            title: "Flexbox Layout",
            explanation: "Flexbox দিয়ে একদিকে Item সাজানো যায়। justify-content ও align-items দিয়ে Alignment নিয়ন্ত্রণ করা হয়।",
            code: ".container {\n display: flex;\n justify-content: center;\n align-items: center;\n gap: 20px;\n}",
            practice: "Flexbox দিয়ে Navigation Bar তৈরি করো।",
            question: "Flexbox চালু করতে কোন Property লাগে?",
            options: ["position: flex", "display: flex", "flex: display"],
            answer: 1
        },
        {
            title: "CSS Grid ও Position",
            explanation: "CSS Grid দিয়ে Row ও Column ভিত্তিক Layout তৈরি হয়। Position-এর বিভিন্ন Value রয়েছে।",
            code: ".grid {\n display: grid;\n grid-template-columns: repeat(3, 1fr);\n gap: 20px;\n}\n.sticky { position: sticky; top: 0; }",
            practice: "Grid দিয়ে তিন কলামের Gallery তৈরি করো।",
            question: "Grid চালু করতে কোন Property লাগে?",
            options: ["display: grid", "grid: true", "position: grid"],
            answer: 0
        },
        {
            title: "Responsive Design, Animation ও Project",
            explanation: "Media Query দিয়ে বিভিন্ন Screen Size অনুযায়ী Design পরিবর্তন করা যায়। Transition ও Keyframes দিয়ে Animation তৈরি হয়।",
            code: "@media (max-width: 600px) {\n .container { grid-template-columns: 1fr; }\n}\n.button { transition: .3s; }\n.button:hover { transform: scale(1.05); }",
            practice: "Mobile ও Desktop Responsive Portfolio তৈরি করো।",
            question: "Responsive Design তৈরিতে কোনটি ব্যবহৃত হয়?",
            options: ["Media Query", "Alert", "Console"],
            answer: 0
        }
    ])
},

{
    id: "javascript",
    title: "JavaScript Complete Course",
    subtitle: "ওয়েবসাইটে Interactive Feature তৈরি করো",
    category: "frontend",
    level: "Beginner",
    type: "free",
    icon: "file-code",
    color: "yellow",
    description: "JavaScript দিয়ে Programming, DOM, Events, Functions এবং Project শেখো।",
    lessons: createLessons("javascript", [
        {
            title: "JavaScript পরিচিতি",
            explanation: "JavaScript একটি Programming Language। এটি ওয়েবসাইটে Dynamic ও Interactive Feature তৈরি করে।",
            code: "console.log('Hello JavaScript');\nalert('Welcome!');",
            practice: "Console-এ নিজের নাম Print করো।",
            question: "JavaScript কী?",
            options: ["Programming Language", "Database", "Operating System"],
            answer: 0
        },
        {
            title: "Variables ও Data Types",
            explanation: "let, const এবং var দিয়ে Variable তৈরি হয়। String, Number, Boolean, Null ও Undefined হলো Data Type।",
            code: "let name = 'Masum';\nconst age = 22;\nlet isStudent = true;\nconsole.log(name, age, isStudent);",
            practice: "নিজের নাম, বয়স ও শিক্ষার্থী হওয়ার তথ্য Variable-এ রাখো।",
            question: "পরিবর্তন করা যাবে না এমন Variable তৈরিতে কী ব্যবহার হয়?",
            options: ["let", "const", "var"],
            answer: 1
        },
        {
            title: "Operators ও Conditions",
            explanation: "Arithmetic, Comparison ও Logical Operator দিয়ে হিসাব এবং Condition পরীক্ষা করা হয়।",
            code: "let age = 20;\nif (age >= 18) {\n console.log('Adult');\n} else {\n console.log('Minor');\n}",
            practice: "বয়স অনুযায়ী Adult অথবা Minor দেখাও।",
            question: "সমান এবং একই Data Type পরীক্ষা করে কোন Operator?",
            options: ["=", "===", "!="],
            answer: 1
        },
        {
            title: "Loops ও Arrays",
            explanation: "Loop দিয়ে একই কাজ বারবার করা হয়। Array-তে একাধিক Value রাখা যায়।",
            code: "let fruits = ['Apple', 'Mango', 'Banana'];\nfor (let fruit of fruits) {\n console.log(fruit);\n}",
            practice: "পাঁচটি ফলের Array তৈরি করে Loop চালাও।",
            question: "Array-এর প্রথম Index কত?",
            options: ["0", "1", "-1"],
            answer: 0
        },
        {
            title: "Functions",
            explanation: "Function হলো পুনরায় ব্যবহারযোগ্য Code Block। Parameter ও Return ব্যবহার করা যায়।",
            code: "function add(a, b) {\n return a + b;\n}\nconsole.log(add(10, 20));",
            practice: "দুটি সংখ্যার যোগফল বের করার Function তৈরি করো।",
            question: "Function থেকে Value ফেরত দিতে কোন Keyword লাগে?",
            options: ["break", "return", "continue"],
            answer: 1
        },
        {
            title: "DOM ও Events",
            explanation: "DOM দিয়ে JavaScript থেকে HTML Element নির্বাচন ও পরিবর্তন করা যায়। Event দিয়ে Click বা Input-এর মতো Action নিয়ন্ত্রণ করা হয়।",
            code: "<h1 id='title'>Hello</h1>\n<button id='btn'>Click</button>\n<script>\ndocument.getElementById('btn').onclick = function() {\n document.getElementById('title').textContent = 'Welcome!';\n};\n</script>",
            practice: "Button Click করলে Heading পরিবর্তন করো।",
            question: "ID দিয়ে Element নির্বাচন করতে কোন Method?",
            options: ["queryAll()", "getElementById()", "getClass()"],
            answer: 1
        },
        {
            title: "ES6, LocalStorage ও Project",
            explanation: "ES6-এ Arrow Function, Template Literal, Destructuring ও অন্যান্য Feature এসেছে। LocalStorage Browser-এ Data সংরক্ষণ করে।",
            code: "const user = { name: 'Masum' };\nlocalStorage.setItem('user', JSON.stringify(user));\nconst saved = JSON.parse(localStorage.getItem('user'));\nconsole.log(saved.name);",
            practice: "JavaScript দিয়ে একটি To-Do App তৈরি করো।",
            question: "Browser-এ Data সংরক্ষণ করতে কোনটি ব্যবহার করা যায়?",
            options: ["LocalStorage", "Console", "Alert"],
            answer: 0
        }
    ])
},

{
    id: "bootstrap",
    title: "Bootstrap 5 Complete Course",
    subtitle: "দ্রুত Responsive Website তৈরি করো",
    category: "frontend",
    level: "Beginner",
    type: "free",
    icon: "layout",
    color: "purple",
    description: "Bootstrap Grid, Components, Utilities, Navbar, Cards ও Responsive Design শেখো।",
    lessons: createLessons("bootstrap", [
        {
            title: "Bootstrap পরিচিতি ও Setup",
            explanation: "Bootstrap একটি জনপ্রিয় CSS Framework। এটি Ready-made Component ও Responsive Grid দেয়।",
            code: "<link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet'>\n<button class='btn btn-primary'>Click Me</button>",
            practice: "Bootstrap CDN ব্যবহার করে একটি Button তৈরি করো।",
            question: "Bootstrap কী?",
            options: ["CSS Framework", "Database", "Programming Language"],
            answer: 0
        },
        {
            title: "Containers ও Grid System",
            explanation: "Bootstrap Grid 12 Column ভিত্তিক। Container, Row ও Column দিয়ে Layout তৈরি হয়।",
            code: "<div class='container'>\n <div class='row'>\n  <div class='col-md-6'>Left</div>\n  <div class='col-md-6'>Right</div>\n </div>\n</div>",
            practice: "দুই কলামের Layout তৈরি করো।",
            question: "Bootstrap Grid-এ মোট কয়টি Column?",
            options: ["10", "12", "16"],
            answer: 1
        },
        {
            title: "Typography ও Colors",
            explanation: "Bootstrap-এ Heading, Text, Color এবং Background-এর Utility Class রয়েছে।",
            code: "<h1 class='text-primary'>Hello</h1>\n<p class='text-muted'>Description</p>\n<div class='bg-dark text-white p-3'>Dark Box</div>",
            practice: "বিভিন্ন Text ও Background Color ব্যবহার করো।",
            question: "Primary Text Color-এর Class কোনটি?",
            options: ["text-primary", "color-primary", "primary-text"],
            answer: 0
        },
        {
            title: "Buttons, Alerts ও Badges",
            explanation: "Bootstrap Button, Alert ও Badge দিয়ে Interactive UI তৈরি করা যায়।",
            code: "<button class='btn btn-success'>Save</button>\n<div class='alert alert-warning'>Warning!</div>\n<span class='badge bg-danger'>New</span>",
            practice: "একটি Success Button ও Warning Alert তৈরি করো।",
            question: "Success Button-এর Class কোনটি?",
            options: ["btn-success", "button-green", "success-btn"],
            answer: 0
        },
        {
            title: "Navbar ও Cards",
            explanation: "Navbar দিয়ে Navigation এবং Card দিয়ে Content সাজানো যায়।",
            code: "<nav class='navbar bg-dark navbar-dark p-3'>\n <a class='navbar-brand' href='#'>My Site</a>\n</nav>\n<div class='card p-3 mt-3'>My Card</div>",
            practice: "Navbar এবং Profile Card তৈরি করো।",
            question: "Bootstrap Card-এর Class কোনটি?",
            options: ["panel", "card", "box"],
            answer: 1
        },
        {
            title: "Forms ও Modals",
            explanation: "Bootstrap Form দিয়ে Input এবং Modal দিয়ে Popup Interface তৈরি হয়।",
            code: "<form>\n <input class='form-control' placeholder='Your Name'>\n <button class='btn btn-primary mt-2'>Submit</button>\n</form>",
            practice: "Bootstrap দিয়ে Login Form তৈরি করো।",
            question: "Bootstrap Input-এর Class কোনটি?",
            options: ["form-control", "input-box", "form-input"],
            answer: 0
        },
        {
            title: "Responsive Design ও Project",
            explanation: "Bootstrap-এর Breakpoint এবং Responsive Utility দিয়ে বিভিন্ন Screen-এ Layout মানিয়ে নেওয়া যায়।",
            code: "<div class='container'>\n <div class='row g-3'>\n  <div class='col-12 col-md-6 col-lg-4'>Card 1</div>\n  <div class='col-12 col-md-6 col-lg-4'>Card 2</div>\n  <div class='col-12 col-md-6 col-lg-4'>Card 3</div>\n </div>\n</div>",
            practice: "Bootstrap দিয়ে Responsive Landing Page তৈরি করো।",
            question: "Large Screen-এর জন্য কোন Prefix ব্যবহার হয়?",
            options: ["sm", "md", "lg"],
            answer: 2
        }
    ])
},

{
    id: "tailwind",
    title: "Tailwind CSS Complete Course",
    subtitle: "Utility Class দিয়ে Modern Design",
    category: "frontend",
    level: "Beginner",
    type: "free",
    icon: "wind",
    color: "cyan",
    description: "Tailwind CSS দিয়ে Modern UI, Responsive Layout, Flexbox, Grid ও Animation শেখো।",
    lessons: createLessons("tailwind", [
        {
            title: "Tailwind CSS পরিচিতি ও Setup",
            explanation: "Tailwind CSS একটি Utility-first CSS Framework। HTML-এর Class দিয়ে সরাসরি Design করা যায়।",
            code: "<script src='https://cdn.tailwindcss.com'></script>\n<h1 class='text-3xl font-bold text-blue-600'>Hello Tailwind</h1>",
            practice: "Tailwind CDN ব্যবহার করে একটি Heading তৈরি করো।",
            question: "Tailwind CSS কোন ধরনের Framework?",
            options: ["Utility-first", "Backend", "Database"],
            answer: 0
        },
        {
            title: "Colors, Typography ও Spacing",
            explanation: "Tailwind-এ Text, Background, Font, Margin ও Padding-এর Utility Class রয়েছে।",
            code: "<div class='bg-blue-600 text-white p-6 m-4 rounded-xl'>\n <h1 class='text-2xl font-bold'>Welcome</h1>\n</div>",
            practice: "Color, Font এবং Spacing দিয়ে একটি Card তৈরি করো।",
            question: "Padding-এর Utility Prefix কোনটি?",
            options: ["m-", "p-", "g-"],
            answer: 1
        },
        {
            title: "Flexbox ও Alignment",
            explanation: "Flexbox Utility দিয়ে Element-গুলোকে Row বা Column আকারে সাজানো যায়।",
            code: "<div class='flex items-center justify-between gap-4'>\n <div>Logo</div>\n <div>Menu</div>\n</div>",
            practice: "Flexbox দিয়ে একটি Navbar তৈরি করো।",
            question: "Flex চালু করার Class কোনটি?",
            options: ["flex", "display-flex", "d-flexbox"],
            answer: 0
        },
        {
            title: "Grid Layout",
            explanation: "Grid Utility দিয়ে Row ও Column ভিত্তিক Layout তৈরি হয়।",
            code: "<div class='grid grid-cols-3 gap-4'>\n <div class='bg-blue-100 p-5'>1</div>\n <div class='bg-blue-100 p-5'>2</div>\n <div class='bg-blue-100 p-5'>3</div>\n</div>",
            practice: "তিন কলামের Gallery তৈরি করো।",
            question: "তিন কলামের Grid Class কোনটি?",
            options: ["grid-3", "grid-cols-3", "cols-3"],
            answer: 1
        },
        {
            title: "Borders, Shadows ও Effects",
            explanation: "Border, Rounded, Shadow, Opacity এবং Hover Utility দিয়ে সুন্দর UI তৈরি করা যায়।",
            code: "<div class='rounded-2xl border p-6 shadow-lg hover:shadow-2xl transition'>\n Modern Card\n</div>",
            practice: "Shadow এবং Hover Effect দিয়ে একটি Card তৈরি করো।",
            question: "Rounded Corner-এর Utility কোনটি?",
            options: ["rounded", "corner", "radius"],
            answer: 0
        },
        {
            title: "Responsive Design ও Dark Mode",
            explanation: "sm, md, lg এবং xl Prefix দিয়ে Responsive Design করা যায়। Dark Mode-এ dark: Prefix ব্যবহার হয়।",
            code: "<div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>\n <div class='bg-white dark:bg-slate-900 p-5'>Card</div>\n</div>",
            practice: "Responsive Grid এবং Dark Mode তৈরি করো।",
            question: "Medium Breakpoint-এর Prefix কোনটি?",
            options: ["sm:", "md:", "lg:"],
            answer: 1
        },
        {
            title: "Components ও Final Project",
            explanation: "Utility Class ব্যবহার করে Navbar, Hero, Card, Button এবং Footer তৈরি করা যায়।",
            code: "<section class='min-h-screen bg-slate-950 text-white p-10'>\n <h1 class='text-4xl font-bold'>Build Your Future</h1>\n <p class='mt-4 text-slate-300'>Learn Tailwind CSS</p>\n <button class='mt-6 bg-indigo-600 px-6 py-3 rounded-xl'>Get Started</button>\n</section>",
            practice: "Tailwind CSS দিয়ে একটি সম্পূর্ণ Landing Page তৈরি করো।",
            question: "Hover State-এর Prefix কোনটি?",
            options: ["active:", "hover:", "focus:"],
            answer: 1
        }
    ])
},

/* =====================================
   PREMIUM COURSES
===================================== */
{
    id: "react",
    title: "React.js Complete Course",
    subtitle: "Coming Soon",
    category: "frontend",
    level: "Advanced",
    type: "premium",
    icon: "atom",
    color: "cyan",
    description: "React Components, Hooks, State Management ও Modern Frontend Development।",
    lessons: []
},
{
    id: "node",
    title: "Node.js & Express Course",
    subtitle: "Coming Soon",
    category: "backend",
    level: "Advanced",
    type: "premium",
    icon: "server",
    color: "green",
    description: "Node.js, Express, REST API, Authentication এবং Backend Development।",
    lessons: []
},
{
    id: "php",
    title: "PHP & MySQL Complete Course",
    subtitle: "Coming Soon",
    category: "backend",
    level: "Intermediate",
    type: "premium",
    icon: "database",
    color: "purple",
    description: "PHP, MySQL, CRUD, Login System এবং Dynamic Website Development।",
    lessons: []
}
];

/* =====================================
   4. LOAD & MERGE LOCALSTORAGE COURSES
===================================== */
let savedCourses = [];

try {
    const stored = JSON.parse(localStorage.getItem("webAcademyCourses") || "[]");

    if (Array.isArray(stored)) {
        savedCourses = stored.filter(course =>
            course && typeof course === "object"
        );
    }
} catch (error) {
    console.warn("Saved courses load করা যায়নি:", error);
}

const savedById = new Map(
    savedCourses.map(course => [String(course.id || ""), course])
);

const mergedDefaults = defaultCourses.map(defaultCourse => {
    const saved = savedById.get(String(defaultCourse.id));

    if (!saved) return { ...defaultCourse };

    return {
        ...defaultCourse,
        ...saved,
        id: defaultCourse.id,
        type: defaultCourse.type,
        lessons:
            Array.isArray(saved.lessons) && saved.lessons.length
                ? saved.lessons
                : defaultCourse.lessons
    };
});

const defaultIds = new Set(defaultCourses.map(course => String(course.id)));

const customCourses = savedCourses.filter(course =>
    !defaultIds.has(String(course.id || ""))
);

const courses = [...mergedDefaults, ...customCourses].map(course => ({
    ...course,
    lessons: Array.isArray(course.lessons) ? course.lessons : []
}));

try {
    localStorage.setItem("webAcademyCourses", JSON.stringify(courses));
} catch (error) {
    console.error("Course save failed:", error);
}

/* =====================================
   5. COURSE IMAGES
===================================== */
const courseImages = {
    html: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900",
    css: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=900",
    javascript: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900",
    bootstrap: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900",
    tailwind: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900",
    react: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900",
    node: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=900",
    php: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900"
};

function getCourseImage(course) {
    if (course.image && /^https?:\/\//i.test(course.image)) {
        return course.image;
    }

    return courseImages[course.id] ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900";
}

/* =====================================
   6. HTML ESCAPE
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
   7. DOM ELEMENTS
===================================== */
const grid = document.getElementById("courseGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("courseSearch");
const categoryFilter = document.getElementById("categoryFilter");

let activeFilter = "all";

/* =====================================
   8. COURSE COLORS
===================================== */
const colorClasses = {
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
    cyan: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400",
    green: "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400"
};

/* =====================================
   9. UPDATE COURSE COUNTS
===================================== */
function updateCourseCounts() {
    const total = courses.length;
    const free = courses.filter(course => course.type === "free").length;
    const premium = courses.filter(course => course.type === "premium").length;
    const lessons = courses.reduce(
        (sum, course) => sum + course.lessons.length, 0
    );

    const totalCoursesEl = document.getElementById("totalCourses");
    const freeCoursesEl = document.getElementById("freeCourses");
    const premiumCoursesEl = document.getElementById("premiumCourses");
    const totalLessonsEl = document.getElementById("totalLessons");

    if (totalCoursesEl) totalCoursesEl.textContent = total;
    if (freeCoursesEl) freeCoursesEl.textContent = free;
    if (premiumCoursesEl) premiumCoursesEl.textContent = premium;
    if (totalLessonsEl) totalLessonsEl.textContent = lessons;

    // পুরোনো ID থাকলেও কাজ করবে
    const oldFree = document.getElementById("freeCount");
    const oldLessons = document.getElementById("lessonCount");

    if (oldFree) oldFree.textContent = free;
    if (oldLessons) oldLessons.textContent = lessons;
}

/* =====================================
   10. RENDER COURSES
===================================== */
function renderCourses() {
    if (!grid) {
        console.error('courses.html-এ id="courseGrid" পাওয়া যায়নি।');
        return;
    }

    const search = (searchInput?.value || "").toLowerCase().trim();

    const filtered = courses.filter(course => {
        const searchableText = [
            course.title,
            course.subtitle,
            course.description,
            course.category,
            course.level
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(search);

        const matchesFilter =
            activeFilter === "all" ||
            course.type === activeFilter ||
            course.category === activeFilter;

        return matchesSearch && matchesFilter;
    });

    grid.innerHTML = "";

    filtered.forEach(course => {
        const isPremium = course.type === "premium";
        const lessonCount = course.lessons.length;
        const iconColor =
            colorClasses[course.color] || "bg-indigo-100 text-indigo-600";

        const card = document.createElement("article");

        card.className =
            "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition duration-300";

        card.innerHTML = `
            <div class="relative h-44 overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img
                    src="${escapeHTML(getCourseImage(course))}"
                    alt="${escapeHTML(course.title)}"
                    class="w-full h-full object-cover"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900';"
                >

                <span class="absolute top-3 right-3 text-xs font-bold px-3 py-1.5 rounded-full ${
                    isPremium
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                }">
                    ${isPremium ? "PREMIUM" : "FREE"}
                </span>
            </div>

            <div class="p-6">
                <div class="flex items-center justify-between">
                    <div class="w-12 h-12 rounded-2xl ${iconColor} flex items-center justify-center">
                        <i data-lucide="${escapeHTML(course.icon || "code")}" class="w-6 h-6"></i>
                    </div>

                    <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        ${escapeHTML(course.category || "Web Development")}
                    </span>
                </div>

                <h3 class="text-xl font-bold mt-5">
                    ${escapeHTML(course.title)}
                </h3>

                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    ${escapeHTML(course.subtitle || "")}
                </p>

                <p class="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-6">
                    ${escapeHTML(course.description || "")}
                </p>

                <div class="flex flex-wrap gap-3 mt-5 text-xs text-slate-500 dark:text-slate-400">
                    <span class="flex items-center gap-1">
                        <i data-lucide="book-open" class="w-4 h-4"></i>
                        ${lessonCount ? lessonCount + " Lessons" : "Coming Soon"}
                    </span>

                    <span class="flex items-center gap-1">
                        <i data-lucide="signal" class="w-4 h-4"></i>
                        ${escapeHTML(course.level || "Beginner")}
                    </span>
                </div>
            </div>

            <div class="px-6 pb-6 space-y-2">
                <button
                    type="button"
                    class="w-full py-3 rounded-xl font-bold ${
                        isPremium
                            ? "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }"
                    ${isPremium ? "disabled" : ""}
                    data-course-id="${escapeHTML(course.id)}"
                >
                    ${isPremium ? "Coming Soon" : "Start Learning"}
                </button>

                ${
                    !isPremium && lessonCount > 0
                        ? `
                        <a
                            href="book.html?course=${encodeURIComponent(course.id)}"
                            class="block w-full text-center py-3 rounded-xl font-bold border border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:text-indigo-400 transition"
                        >
                            <i data-lucide="book-open" class="inline w-4 h-4 mr-1"></i>
                            বই পড়ুন / PDF
                        </a>
                        `
                        : ""
                }
            </div>
        `;

        grid.appendChild(card);
    });

    if (emptyState) {
        emptyState.classList.toggle("hidden", filtered.length > 0);
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

/* =====================================
   11. SEARCH & FILTER
===================================== */
if (searchInput) {
    searchInput.addEventListener("input", renderCourses);
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
        activeFilter = categoryFilter.value;
        renderCourses();
    });
}

/* পুরোনো Filter Button থাকলেও কাজ করবে */
function setFilter(filter) {
    activeFilter = filter;

    if (categoryFilter) {
        categoryFilter.value = filter;
    }

    document.querySelectorAll(".filter-btn").forEach(button => {
        const selected = button.dataset.filter === filter;

        button.className = selected
            ? "filter-btn px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold"
            : "filter-btn px-5 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700";
    });

    renderCourses();
}

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        setFilter(button.dataset.filter);
    });
});

/* =====================================
   12. OPEN COURSE
===================================== */
if (grid) {
    grid.addEventListener("click", event => {
        const button = event.target.closest("[data-course-id]");

        if (!button) return;

        const course = courses.find(
            item => String(item.id) === button.dataset.courseId
        );

        if (!course) return;

        if (course.type === "premium") {
            alert("এই Premium Course-টি শিগগিরই যুক্ত করা হবে।");
            return;
        }

        window.location.href =
            `course-details.html?id=${encodeURIComponent(course.id)}`;
    });
}

/* =====================================
   13. THEME
===================================== */
function applyTheme() {
    const theme = localStorage.getItem("webAcademyTheme");

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

    if (window.lucide) window.lucide.createIcons();
}

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
}

/* =====================================
   14. LOGOUT
===================================== */
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        if (confirm("তুমি কি Logout করতে চাও?")) {
            localStorage.removeItem("webAcademyCurrentUser");
            window.location.href = "auth.html";
        }
    });
}

/* =====================================
   15. INITIALIZE
===================================== */
applyTheme();
updateCourseCounts();
renderCourses();

})();
