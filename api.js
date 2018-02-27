const express = require('express');
const xss = require('xss');
const moment = require('moment');

const {
  create,
  readAll,
  readOne,
  update,
  del,
} = require('./notes');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function validate({ title, text, datetime } = {}) {
  const errors = [];
  if (title.length === 0 || typeof title !== 'string') {
    errors.push({
      field: 'title',
      error: 'Title must be a string of length 1 to 255 characters',
    });
  }
  if (typeof text !== 'string') {
    errors.push({
      field: 'text',
      error: 'Text must be a string',
    });
  }
  if (!moment(datetime, moment.ISO_8601).isValid()) {
    errors.push({
      field: 'datetime',
      error: 'Datetime must be a ISO 8601 date',
    });
  }
  return errors;
}

/* todo útfæra api */
router.get('/', async (req, res) => {
  const json = await readAll();
  res.send(json);
});

router.post('/', async (req, res) => {
  const {
    title = '',
    text = '',
    datetime = '',
  } = req.body;

  const errors = validate({ title, text, datetime });
  if (errors.length > 0) {
    return res.status('400').json(errors);
  }

  const note = {
    title: xss(title),
    text: xss(text),
    datetime: xss(datetime),
  };

  const json = await create(note);
  if (json) {
    return res.status('201').json(await readOne(json.insertId));
  }
  return res.status('500').json({ error: 'Note not found' });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const json = await readOne(id);
  if (json) {
    return res.status('200').json(json);
  }
  return res.status('404').json({ error: 'Note not found' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    title = '',
    text = '',
    datetime = '',
  } = req.body;

  const isNote = await readOne(id);

  if (isNote === undefined) {
    return res.status('404').json({ error: 'Note not found' });
  }

  const errors = validate({ title, text, datetime });

  if (errors.length > 0) {
    return res.status('400').json(errors);
  }

  const note = {
    title: xss(title),
    text: xss(text),
    datetime: xss(datetime),
  };

  const json = await update(id, note);
  return res.status('201').json(json);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const item = await readOne(id);

  if (item) {
    del(id);
    return res.status('204').end();
  }
  return res.status('404').json({ error: 'Note not found' });
});

module.exports = router;
