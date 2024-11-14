// Apply formatting (Bold, Italic, Underline)
function formatText(command) {
    document.execCommand(command, false, null);
}

// Align text (Left, Center, Right)
function alignText(alignment) {
    document.execCommand(`justify${alignment}`, false, null);
}

// Insert List (Ordered or Unordered)
function insertList(type) {
    if (type === "unordered") {
        document.execCommand("insertUnorderedList", false, null);
    } else if (type === "ordered") {
        document.execCommand("insertOrderedList", false, null);
    }
}

// Update Font Style
document.getElementById("font-select").addEventListener("change", (e) => {
    document.execCommand("fontName", false, e.target.value);
});

// Update Font Size
document.getElementById("font-size").addEventListener("change", (e) => {
    document.execCommand("fontSize", false, e.target.value);
});
// File Menu Functions
function fileMenu() {
    const action = prompt(
        "File Menu:\n1. Save (Type 'save')\n2. Open (Type 'open')\n3. Export as PDF (Type 'pdf')",
        "save"
    );

    if (action === "save") {
        saveDocument();
    } else if (action === "open") {
        alert("Open file functionality is under development.");
    } else if (action === "pdf") {
        exportAsPDF();
    }
}

function saveDocument() {
    const content = document.getElementById("document-area").innerHTML;
    const blob = new Blob([content], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "document.html";
    a.click();
}

function exportAsPDF() {
    alert("PDF export functionality is under development.");
}

// Home Menu Functions
function homeMenu() {
    const action = prompt(
        "Home Menu:\n1. Clear Formatting (Type 'clear')\n2. Apply Default Styles (Type 'default')",
        "clear"
    );

    if (action === "clear") {
        document.execCommand("removeFormat", false, null);
    } else if (action === "default") {
        const docArea = document.getElementById("document-area");
        docArea.style = ""; // Reset styles
    }
}

// Insert Menu Functions
function insertMenu() {
    const action = prompt(
        "Insert Menu:\n1. Add Image (Type 'image')\n2. Add Table (Type 'table')\n3. Add Date/Time (Type 'datetime')",
        "image"
    );

    if (action === "image") {
        const url = prompt("Enter the image URL:");
        if (url) {
            document.execCommand("insertImage", false, url);
        }
    } else if (action === "table") {
        insertTable();
    } else if (action === "datetime") {
        const dateTime = new Date().toLocaleString();
        document.execCommand("insertText", false, dateTime);
    }
}

function insertTable() {
    const rows = parseInt(prompt("Enter the number of rows:", "2"));
    const cols = parseInt(prompt("Enter the number of columns:", "2"));

    if (rows > 0 && cols > 0) {
        let table = "<table border='1' style='width:100%; border-collapse: collapse;'>";

        for (let i = 0; i < rows; i++) {
            table += "<tr>";
            for (let j = 0; j < cols; j++) {
                table += "<td>&nbsp;</td>";
            }
            table += "</tr>";
        }
        table += "</table>";
        document.execCommand("insertHTML", false, table);
    } else {
        alert("Invalid input for rows or columns.");
    }
}

// Layout Menu Functions (Kept as-is)
function layoutMenu() {
    const action = prompt(
        "Layout Menu:\n1. Increase Line Height (Type 'increase')\n2. Decrease Line Height (Type 'decrease')",
        "increase"
    );
    const docArea = document.getElementById("document-area");
    const currentHeight = parseFloat(getComputedStyle(docArea).lineHeight);

    if (action === "increase") {
        docArea.style.lineHeight = currentHeight + 0.2 + "em";
    } else if (action === "decrease") {
        docArea.style.lineHeight = currentHeight - 0.2 + "em";
    }
}

// Toolbar Functions (Existing Functionality)
function formatText(command) {
    document.execCommand(command, false, null);
}

function alignText(alignment) {
    document.execCommand(`justify${alignment}`, false, null);
}

function insertList(type) {
    const command = type === "unordered" ? "insertUnorderedList" : "insertOrderedList";
    document.execCommand(command, false, null);
}

document.getElementById("font-select").addEventListener("change", (e) => {
    document.execCommand("fontName", false, e.target.value);
});

document.getElementById("font-size").addEventListener("input", (e) => {
    const size = e.target.value;
    document.execCommand("fontSize", false, "7");
    const fontElements = document.getElementsByTagName("font");
    for (let font of fontElements) {
        if (font.size === "7") {
            font.removeAttribute("size");
            font.style.fontSize = `${size}px`;
        }
    }
});







// Global variable to store version history
const versionHistory = [];
let previousContent = ""; // To store the content before changes

// Record a new version when content changes
const documentArea = document.getElementById("document-area");
documentArea.addEventListener("input", () => {
    const user = "User123"; // Replace with dynamic user info if available
    const timestamp = new Date().toLocaleString();
    const currentContent = documentArea.innerHTML;

    // Compare content to determine what changed
    const diff = getChanges(previousContent, currentContent);
    previousContent = currentContent; // Update the previous content

    // Add to version history
    versionHistory.push({ user, timestamp, diff, content: currentContent });

    console.log("Version recorded:", { user, timestamp, diff });
});

// Scroll to Top of Version History
function scrollToTop() {
    const modalContent = document.querySelector(".modal-content");
    modalContent.scrollTo({ top: 0, behavior: "smooth" });
}

// Open Version History Modal
function openVersionHistory() {
    const modal = document.getElementById("version-history-modal");
    const list = document.getElementById("version-history-list");
    list.innerHTML = ""; // Clear previous list

    if (versionHistory.length === 0) {
        list.innerHTML = "<li>No changes recorded yet.</li>";
    } else {
        versionHistory.forEach((version, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <strong>Version ${index + 1}</strong><br>
                <em>${version.timestamp}</em> - <strong>${version.user}</strong><br>
                <strong>Changes:</strong> ${version.diff || "No changes detected"}<br>
            `;
            list.appendChild(listItem);
        });
    }

    modal.classList.remove("hidden");
}

// Close Version History Modal
function closeVersionHistory() {
    const modal = document.getElementById("version-history-modal");
    modal.classList.add("hidden");
}


// Function to determine changes between old and new content
function getChanges(oldContent, newContent) {
    if (oldContent === newContent) return null;

    // Detect added or removed content
    const added = newContent.replace(oldContent, "").trim();
    const removed = oldContent.replace(newContent, "").trim();

    let changes = "";
    if (added) changes += `<span style="color: green;">+ Added: "${added}"</span><br>`;
    if (removed) changes += `<span style="color: red;">- Removed: "${removed}"</span><br>`;

    return changes || "Content structure changed";
}
