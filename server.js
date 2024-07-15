const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const words = [
  { word: 'javascript', hint: 'A popular programming language' },
  { word: 'react', hint: 'A JavaScript library for building user interfaces' },
  { word: 'node', hint: 'JavaScript runtime built on Chrome\'s V8 engine' },
  // Add more words and hints as needed
];

app.get('/word', (req, res) => {
  const randomIndex = Math.floor(Math.random() * words.length);
  res.json(words[randomIndex]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
