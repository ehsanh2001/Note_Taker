const router = require("express").Router();
const uuid = require("uuid");
const db = require("../lib/db_access");
const path = require("path");

function createDBAccess() {
  const dbPath = path.join(__dirname + "/../db/db.json");
  return new db.DB_Access(dbPath);
}

// The following is a route that will be used to add a note to the db
router.post("/", async (req, res) => {
  const dbAccess = createDBAccess();

  const note = {
    title: req.body.title,
    text: req.body.text,
    id: uuid.v4(),
  };

  try {
    await dbAccess.addNote(note);
    res.status(201).json(note);
  } catch (err) {
    res.status(500).send("Error adding note to database");
  }
});

// The following is a route that will be used to send all notes from the db to the front end
router.get("/", async (req, res) => {
  const dbAccess = createDBAccess();

  try {
    const notes = await dbAccess.readDB();
    res.json(notes);
  } catch (err) {
    res.status(500).send("Error reading notes from database");
  }
});

// The following is a route that will be used to delete a note from the db
router.delete("/:id", async (req, res) => {
  const dbAccess = createDBAccess();

  try {
    await dbAccess.deleteNote(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Error deleting note from database");
  }
});

module.exports = router;
