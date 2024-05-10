const exp = require("constants");
const db = require("../lib/db_access");
const path = require("path");

describe("DbAccess", () => {
  const dbPath = path.join(__dirname + "/../db/db.json");
  const dbAccess = new db.DB_Access(dbPath);

  afterAll(async () => {
    await dbAccess.emptyDB();
  });

  test("addNote, adding 2 notes to an empty db", async () => {
    const data1 = { title: "test1", text: "testing the DB 1" };
    const data2 = { title: "test2", text: "testing the DB 2" };

    await dbAccess.emptyDB();
    await dbAccess.addNote(data1);
    await dbAccess.addNote(data2);

    const results = await dbAccess.readDB();

    expect(results[0].title).toEqual(data1.title);
    expect(results[0].text).toEqual(data1.text);
    expect(results[0].id).toBeDefined();

    expect(results[1].title).toEqual(data2.title);
    expect(results[1].text).toEqual(data2.text);
    expect(results[1].id).toBeDefined();
  });

  test("deleteNote, deleting a note from the db", async () => {
    const data1 = { title: "deleting test1", text: "testing the DB 1" };
    const data2 = { title: "deleting test2", text: "testing the DB 2" };

    await dbAccess.emptyDB();
    await dbAccess.addNote(data1);
    await dbAccess.addNote(data2);

    const results = await dbAccess.readDB();
    const id = results[0].id;

    await dbAccess.deleteNote(id);

    const newResults = await dbAccess.readDB();

    expect(newResults.length).toEqual(1);
    expect(newResults[0].title).toEqual(data2.title);
    expect(newResults[0].text).toEqual(data2.text);
  });
});
