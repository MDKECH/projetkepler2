const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Permet d'accéder aux images/CSS s'il y en a

const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// --- LES ROUTES DE NAVIGATION ---

// Accueil (quand on arrive sur le lien principal)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Page Echostar
app.get('/echostar', (req, res) => res.sendFile(path.join(__dirname, 'echostar.html')));

// Page Nebius
app.get('/nebius', (req, res) => res.sendFile(path.join(__dirname, 'nebius.html')));


// --- LES ROUTES API (Commentaires) ---
app.get('/comments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) { res.status(500).json(err); }
});

app.post('/comments', async (req, res) => {
    try {
        const { pseudo, content } = req.body;
        await pool.query('INSERT INTO comments (pseudo, content) VALUES ($1, $2)', [pseudo, content]);
        res.json({ status: 'ok' });
    } catch (err) { res.status(500).json(err); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Permet d'accéder aux images/CSS s'il y en a

const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// --- LES ROUTES DE NAVIGATION ---

// Accueil (quand on arrive sur le lien principal)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Page Echostar
app.get('/echostar', (req, res) => res.sendFile(path.join(__dirname, 'echostar.html')));

// Page Nebius
app.get('/nebius', (req, res) => res.sendFile(path.join(__dirname, 'nebius.html')));


// --- LES ROUTES API (Commentaires) ---
app.get('/comments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) { res.status(500).json(err); }
});

app.post('/comments', async (req, res) => {
    try {
        const { pseudo, content } = req.body;
        await pool.query('INSERT INTO comments (pseudo, content) VALUES ($1, $2)', [pseudo, content]);
        res.json({ status: 'ok' });
    } catch (err) { res.status(500).json(err); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
