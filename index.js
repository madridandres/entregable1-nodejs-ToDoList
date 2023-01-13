const express = require('express');
const path = require('path');
const fs = require('fs/promises')

const app = express();

app.use(express.json());

const jsonPath = path.resolve('./file/todoList.json');


app.get('/tasks', async (req, res) => {
    const jsonFile = await fs.readFile(jsonPath, 'utf8');
    res.send(jsonFile);
});

app.post('/tasks', async (req, res) => {
    const task = req.body;
    const todoListArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const lastIndex = todoListArray.length -1;
    const newId = todoListArray[lastIndex].id + 1;
    todoListArray.push({...task, id: newId});
    await fs.writeFile(jsonPath, JSON.stringify(todoListArray));
    res.send('Tarea creada satisfactoriamente')
});

app.put('/tasks', async (req, res) => {
    const todoListArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const { status, id} = req.body;
    const taskIndex = todoListArray.findIndex(task => task.id === id);
    if (taskIndex >= 0) {
        todoListArray[taskIndex].status = status;
        await fs.writeFile(jsonPath, JSON.stringify(todoListArray));
        res.send('Status de tarea actualizado');
    }else{
        res.send('No existe una tarea con ese Id');
    }
});

app.delete('/tasks', async (req, res) => {
    const todoListArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const {id} = req.body;
    const taskIndex = todoListArray.findIndex(task => task.id === id);
    if (taskIndex >= 0) {
        todoListArray.splice(taskIndex, 1);
        await fs.writeFile(jsonPath, JSON.stringify(todoListArray));
        res.send('Tarea eliminada satisfactoriamente')
    } else {
        res.send('No existe una tarea con ese Id')
    }
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});