const express = require('express');
const xss = require('xss');

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

/* todo útfæra api */
router.get('/', async (req, res) => {
  const json = await readAll();
  console.info(json);
  res.send(json);
});

router.post('/', (req, res) => {
  const {
    title = '',
    text = '',
    datetime = '',
  } = req.body;

  const note = {
    title: xss(title),
    text: xss(text),
    datetime: xss(datetime),
  };
  create(note);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.info(id);
  const json = await readOne(id);
  console.info(json);
  res.send(json);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    title = '',
    text = '',
    datetime = '',
  } = req.body;

  const note = {
    title: xss(title),
    text: xss(text),
    datetime: xss(datetime),
  };
  update(id, note);
});

router.delete('/:id', (req, res) => {
  const id = req.params;

  del(id);
});

module.exports = router;
