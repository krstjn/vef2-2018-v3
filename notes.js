/* todo sækja pakka sem vantar  */
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

/**
 * Create a note asynchronously.
 *
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function create({ title, text, datetime } = {}) {
  /* todo útfæra */
  const query = 'INSERT INTO notes(datetime, title, text) VALUES ($1, $2, $3)';
  const values = [new Date(datetime), title, text];
  const client = new Client({ connectionString });
  await client.connect();
  const results = await client.query(query, values);
  await client.end();
  console.info(results.row);
  return results.rows;
}

/**
 * Read all notes.
 *
 * @returns {Promise} Promise representing an array of all note objects
 */
async function readAll() {
  /* todo útfæra */
  const query = 'SELECT * FROM notes';

  const client = new Client({ connectionString });
  await client.connect();
  const results = await client.query(query);
  await client.end();
  return results.rows;
}

/**
 * Read a single note.
 *
 * @param {number} id - Id of note
 *
 * @returns {Promise} Promise representing the note object or null if not found
 */
async function readOne(id) {
  /* todo útfæra */
  const query = 'Select * from notes WHERE id = $1';
  const values = [id];
  const client = new Client({ connectionString });
  await client.connect();
  const results = await client.query(query, values);
  await client.end();
  return results.rows[0];
}

/**
 * Update a note asynchronously.
 *
 * @param {number} id - Id of note to update
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function update(id, { title, text, datetime } = {}) {
  const query = 'UPDATE notes title = $1, text = $2, datetime = $3 WHERE id = $4';
  const values = [title, text, datetime, id];

  const client = new Client({ connectionString });
  await client.connect();
  const results = await client.query(query, values);
  await client.end();
  return results.rows;
}

/**
 * Delete a note asynchronously.
 *
 * @param {number} id - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the note
 */
async function del(id) {
  const query = 'DELETE FROm notes WHERE id = $1';
  const values = [id];

  const client = new Client({ connectionString });
  await client.connect();
  const results = await client.query(query, values);
  await client.end();
  return results.rows;
}

module.exports = {
  create,
  readAll,
  readOne,
  update,
  del,
};
