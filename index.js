const express = require("express");

const server = express();
const projects = [];
let numRequisitions = 0;

server.use(express.json());

server.use((req, res, next) => {
  numRequisitions++;
  next();

  console.log("Requistion number: " + numRequisitions);
});

function checkIfIdExist(req, res, next) {
  const project = projects.find(x => x.id === req.params.id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projects.push({ id: id, title: title, tasks: [] });

  return res.json(projects);
});

server.put("/projects/:id", checkIfIdExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.find(x => x.id === id).title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkIfIdExist, (req, res) => {
  const { id } = req.params;

  projects.splice(projects.findIndex(x => x.id === id), 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkIfIdExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.find(x => x.id === id).tasks.push(title);

  return res.json(projects.find(x => x.id === id));
});

server.listen(3000);
