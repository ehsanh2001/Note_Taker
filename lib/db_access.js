const fs = require("fs/promises");
const uuid = require("uuid");

class DbAccess {
  constructor(filePath) {
    this.dbPath = filePath;
  }

  async #writeDB(data) {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify(data));
    } catch (err) {
      console.error(
        `Cannot write to file ${this.dbPath} following error occured\n`,
        err
      );
      throw err;
    }
  }

  async readDB() {
    try {
      const data = await fs.readFile(this.dbPath, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error(
        `Cannot read from file ${this.dbPath} following error occured\n`,
        err
      );
      throw err;
    }
  }

  async addNote(note) {
    try {
      let data = await this.readDB();
      data = data || [];
      const newNote = {
        id: uuid.v4(),
        ...note,
      };
      data.push(newNote);

      await this.#writeDB(data);
    } catch (err) {
      console.error(
        `Cannot add note to file ${this.dbPath} following error occured\n`,
        err
      );
      throw err;
    }
  }

  async deleteNote(id) {
    try {
      let data = await this.readDB();
      data = data || [];
      data = data.filter((note) => note.id !== id);
      await this.#writeDB(data);
    } catch (err) {
      console.error(
        `Cannot delete note from file ${this.dbPath} following error occured\n`,
        err
      );
      throw err;
    }
  }

  async emptyDB() {
    try {
      await this.#writeDB([]);
    } catch (err) {
      console.error(
        `Cannot empty file ${this.dbPath} following error occured\n`,
        err
      );
      throw err;
    }
  }
}

module.exports = { DB_Access: DbAccess };
