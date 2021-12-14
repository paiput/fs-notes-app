const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (request, response, next) => {
  try {
    const notes = await Note.find({});
    response.json(notes);
  } catch(error) {
    next(error);
  }
});

notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id);
    if (note) {
      response.json(note);
    } else {
      response.status(404).end();
    }
  } catch(error) {
    next(error);
  }
});

notesRouter.post('/', async (request, response, next) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  });

  try {
    const savedNote = await note.save();
    response.status(201).json(savedNote);
  } catch(error) {
    next(error);
  }
});

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote);
    })
    .catch(error => next(error));
});

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch(error) {
    next(error);
  }
});

module.exports = notesRouter;