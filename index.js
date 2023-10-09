const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const dataFile = 'data.json';

app.use(express.json());

function loadData() {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
}

let currentId = 1;

app.post('/items', (req, res) => {
    const newItem = { id: currentId++, ...req.body };
    const data = loadData();
    data.push(newItem);
    saveData(data);
    res.status(201).json(newItem);
});

app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = loadData();
    const item = data.find(item => item.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

app.get('/', (req, res) => {
    const data = loadData();
    res.status(200).json(data);
});

app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedItem = { id, ...req.body };
    const data = loadData();
    const index = data.findIndex(item => item.id === id);

    if (index !== -1) {
        data[index] = updatedItem;
        saveData(data);
        res.json(updatedItem);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = loadData();
    const index = data.findIndex(item => item.id === id);

    if (index !== -1) {
        data.splice(index, 1);
        saveData(data);
        res.status(200).json({ message: 'Item Deleted' });
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
