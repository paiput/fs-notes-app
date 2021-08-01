const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

const url = `mongodb+srv://fullstack:${password}@cluster0.mas2j.mongodb.net/note-app?retryWrites=true&w=majority`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);
// const requestLogger = (req, res, next) => {
//   console.log('Method:', req.method);
//   console.log('Path:', req.path);
//   console.log('Body:', req.body);
//   console.log('---');
//   next();
// };

// app.use(requestLogger);

app.get('/', (req, res) => {
  res.send('<h1>Hello World again</h1>');
});

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes);
  });
});

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find(note => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(note => note.id))
    : 0;
  return maxId + 1;
};

app.post('/api/notes', (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing'
    });
  };

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId()
  };

  notes.concat(note);

  res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter(note => note.id !== id);

  res.status(202).end();
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});