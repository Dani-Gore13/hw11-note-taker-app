const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "Develop", "public")));

// API routes
app.get("/api/notes", (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: "Title and text are required" });
  }

  const newNote = {
    id: uuidv4(),
    title,
    text,
  };

  const notes = readNotes();
  notes.push(newNote);
  writeNotes(notes);

  res.status(201).json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  const notes = readNotes();
  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  notes.splice(index, 1);
  writeNotes(notes);

  res.sendStatus(204);
});

// HTML routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Develop", "public", "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "Develop", "public", "notes.html"));
});

// Read notes from JSON file
function readNotes() {
  const data = fs.readFileSync(
    path.join(__dirname, "Develop", "db", "db.json"),
    "utf8"
  );
  return JSON.parse(data);
}

// Write notes to JSON file
function writeNotes(notes) {
  fs.writeFileSync(
    path.join(__dirname, "Develop", "db", "db.json"),
    JSON.stringify(notes)
  );
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
