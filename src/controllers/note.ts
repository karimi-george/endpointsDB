import { v4 as uuidv4 } from "uuid";
import mssql, { VarChar, Text, DateTime } from "mssql";
import { NotesConfig } from "../Config/config";
import express, { Request, Response } from "express";

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

class Notes {
  constructor(
    public id: string,
    public title: string,
    public content: string,
    public createdAt: Date
  ) {}
}

const dotenv = require("dotenv");
dotenv.config();

// creating a new note
async function creatingaNote(req: Request, res: Response) {
  try {
    // Extract note data from the request body
    const { title, content } = req.body;

    const id = uuidv4();
    const createdAt = new Date();

    await mssql.connect(NotesConfig);
    const pool = await mssql.connect();

    const query =
      "INSERT INTO myNotesTable (Id, Title, Content, CreatedAt) " +
      "VALUES (@id, @title, @content, @createdAt)";

    await pool
      .request()
      .input("id", VarChar, id)
      .input("title", VarChar, title)
      .input("content", Text, content)
      .input("createdAt", DateTime, createdAt)
      .query(query);

    mssql.close();
    console.log("New note created successfully.");
    res.status(201).json({ message: "New note created successfully." });
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

// to pull all notes from the database
async function gettingallnotes(req: Request, res: Response) {
  try {
    await mssql.connect(NotesConfig);
    const pool = await mssql.connect();
    const result = await pool.request().query("SELECT * FROM myNotesTable");
    mssql.close();

    console.log("Notes:", result.recordset);

    // Send the notes as JSON response
    res.status(200).json(result.recordset);
  } catch (err) {
    // console.error(err.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Function to get a single note by its ID
async function noteGettingById(req: Request, res: Response) {
  try {
    const id = req.params.id;

    await mssql.connect(NotesConfig);
    const pool = await mssql.connect();

    const query = "SELECT * FROM myNotesTable WHERE ID = @id";
    const result = await pool
      .request()
      .input("id", VarChar, id)
      .query(query);

    mssql.close();

    // Check if a note with the specified ID was found
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Note not found." });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Function to update a note by its ID
async function noteUpdatingByID(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const updatedNote = req.body;
    await mssql.connect(NotesConfig);
    const pool = await mssql.connect();
    const createdAt = new Date();

    const query = `
    UPDATE myNotesTable
    SET Title = @title, 
    Content = @content, 
    CreatedAt = @createdAt
    WHERE ID = @id`;

    await pool
      .request()
      .input("id", VarChar, id)
      .input("title", VarChar, updatedNote.title)
      .input("content", Text, updatedNote.content)
      .input("createdAt", DateTime, createdAt)
      .query(query);

    mssql.close();
    console.log("Successfully updated note.");
    console.log(updatedNote);

    // Send a success response to the client
    res.status(200).json({ message: "Successfully updated note." });
  } catch (err {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Function to delete a note by its ID
async function noteDeletingById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    console.log("delete note", id);
    await mssql.connect(NotesConfig);
    const pool = await mssql.connect();

    const query = `DELETE FROM myNotesTable WHERE ID = @id`;
    await pool.request().input("id", VarChar, id).query(query);

    mssql.close();
    console.log(`Successfully deleted note. ${id}`);

    // Send a success response to the client
    res.status(200).json({ message: `Successfully deleted note. ${id}` });
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = {
  Notes,
  creatingaNote,
  gettingallnotes,
  noteGettingById,
  noteUpdatingByID,
  noteDeletingById,
};
