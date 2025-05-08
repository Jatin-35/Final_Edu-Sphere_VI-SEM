const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
const corsOptions = {
  origin: "*", // Allow all origins (for testing)
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/notes_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// File Schema
const fileSchema = new mongoose.Schema({
  subject: String,
  filename: String,
  path: String,
});

const File = mongoose.model('File', fileSchema);

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
app.post('/upload', upload.single('file'), async (req, res) => {
  const { subject } = req.body;
  const file = new File({
    subject,
    filename: req.file.filename,
    path: req.file.path,
  });
  await file.save();
  res.status(201).send('File uploaded successfully');
});

app.get('/files/:subject', async (req, res) => {
  const { subject } = req.params;
  const files = await File.find({ subject });
  res.status(200).json(files);
});

app.get('/download/:id', async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) {
    return res.status(404).send('File not found');
  }
  res.download(file.path);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});