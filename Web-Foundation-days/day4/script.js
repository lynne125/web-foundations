const textarea = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

function updateCounts() {
    const text = textarea.value;

    const chars = text.length;

    const words = text.trim() === ""
        ? 0
        : text.trim().split(/\s+/).length;

    charCount.textContent = `${chars} / 200 characters`;
    wordCount.textContent = `${words} words`;

    charCount.classList.remove("warning", "over");

    if (chars > 180) {
        charCount.classList.add("warning");
    }

    if (chars > 200) {
        charCount.classList.remove("warning");
        charCount.classList.add("over");
    }
}

textarea.addEventListener("input", () => {
    updateCounts();
    localStorage.setItem("draft", textarea.value);
});

window.addEventListener("load", () => {
    const savedDraft = localStorage.getItem("draft");

    if (savedDraft) {
        textarea.value = savedDraft;
    }

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "Light mode";
    }

    updateCounts();
});

clearBtn.addEventListener("click", () => {
    textarea.value = "";
    localStorage.removeItem("draft");

    charCount.classList.remove("warning", "over");

    updateCounts();
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "Light mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "Dark mode";
        localStorage.setItem("theme", "light");
    }
});

textarea.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        textarea.value = "";
        localStorage.removeItem("draft");
        updateCounts();
    }
});