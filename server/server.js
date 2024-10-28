const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const documentsDir = path.join(__dirname, 'documents');
if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir);
}

app.post('/save', (req, res) => {
    const { name, content } = req.body;
    const filePath = path.join(documentsDir, name);
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).send('Ошибка при сохранении документа');
        }
        res.send('Документ сохранен');
    });
});

app.get('/documents', (req, res) => {
    fs.readdir(documentsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Ошибка при чтении документов');
        }
        res.json(files);
    });
});

app.get('/document/:name', (req, res) => {
    const { name } = req.params;
    const filePath = path.join(documentsDir, name);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('Документ не найден');
        }
        res.send(data);
    });
});

app.delete('/document/:name', (req, res) => {
    const { name } = req.params;
    const filePath = path.join(documentsDir, name);
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(404).send('Документ не найден');
        }
        res.send('Документ удален');
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});