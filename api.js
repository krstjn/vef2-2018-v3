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
  if (title.length === 0) {
    errors.push({
      field: 'title',
      error: 'Title must be a non-empty string',
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
  console.info(json);
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
    res.status('400').json(errors);
  }

  const note = {
    title: xss(title),
    text: xss(text),
    datetime: xss(datetime),
  };

  const json = await create(note);
  if (json !== undefined) {
    res.status('201').json(json);
  }
  res.status('404').json(json);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const json = await readOne(id);
  console.info(json);
  if (json !== undefined) {
    res.status('200').json({ error: 'Note not found' });
  }
  res.status('404').json({ error: 'Note not found' });
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
    res.status('404').json({ error: 'Note not found' });
  }

  const errors = validate({ title, text, datetime });

  if (errors.length > 0) {
    res.status('400').json(errors);
  }

  const note = {
    title: xss(title),
    text: xss(text),
    datetime: xss(datetime),
  };

  update(id, note);
  res.status('201').send();
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const item = readOne(id);

  if (item) {
    del(id);
    res.status('204').end();
  }
  res.status('404').json({ error: 'Note not found' });
});

module.exports = router;
