// Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" }
];

// 1. searchNotes(word)
function searchNotes(word) {
  return notes.filter(note =>
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}

// 2. longestNote()
function longestNote() {
  if (notes.length === 0) return null;

  let longest = notes[0];

  for (let note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }

  return longest;
}

// 3. countByCategory()
function countByCategory() {
  const counts = {};

  for (let note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }

  return counts;
}

// 4. getSummary()
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;

  return `${total} notes: ${counts.personal || 0} personal, ${
    counts.work || 0
  } work, ${counts.study || 0} study`;
}

// 5. isDuplicate(text)
function isDuplicate(text) {
  const cleanedText = text.trim().toLowerCase();

  return notes.some(
    note => note.text.trim().toLowerCase() === cleanedText
  );
}

// 6. addNote(text, category)
function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];

  if (text.length < 1 || text.length > 200) {
    console.log("Invalid text length.");
    return false;
  }

  if (isDuplicate(text)) {
    console.log("Duplicate note.");
    return false;
  }

  if (!validCategories.includes(category)) {
    console.log("Invalid category.");
    return false;
  }

  const newNote = {
    id: notes.length + 1,
    text,
    category
  };

  notes.push(newNote);
  return true;
}

// =========================
// TESTS
// =========================

// searchNotes
console.log(searchNotes("day"));
// Expected: [{ id: 2, text: "Finish the Day 3 assignment", category: "study" }]

console.log(searchNotes("python"));
// Expected: []

// longestNote
console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

// countByCategory
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

// getSummary
console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study"

// isDuplicate
console.log(isDuplicate("Buy milk and bread"));
// Expected: true

console.log(isDuplicate("Learn Python"));
// Expected: false

// addNote
console.log(addNote("Prepare presentation", "work"));
// Expected: true

console.log(addNote("Buy milk and bread", "personal"));
// Expected: false (duplicate)

console.log(addNote("New note", "health"));
// Expected: false (invalid category)

// Check updated notes
console.log(notes);
// Expected: 6 notes including "Prepare presentation"