const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

let contacts = [
  { id: 1, name: "Juan", lastName: "Pérez", phone: "555-0101", city: "Madrid", address: "Calle Principal 123", gender: "masculino" },
  { id: 2, name: "María", lastName: "García", phone: "555-0102", city: "Barcelona", address: "Avenida Central 456", gender: "femenino" },
  { id: 3, name: "Carlos", lastName: "López", phone: "555-0103", city: "Valencia", address: "Paseo del Mar 789", gender: "masculino" },
  { id: 4, name: "Ana", lastName: "Martínez", phone: "555-0104", city: "Sevilla", address: "Plaza Mayor 321", gender: "femenino" }
];

let nextId = 5;

app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

app.post('/api/contacts', (req, res) => {
  const { name, lastName, phone, city, address, gender } = req.body;

  if (!name || !lastName || !phone || !city || !address || !gender) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const newContact = { id: nextId++, name, lastName, phone, city, address, gender };
  contacts.push(newContact);
  res.status(201).json(newContact);
});

app.put('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { name, lastName, phone, city, address, gender } = req.body;

  const contact = contacts.find(c => c.id === parseInt(id));

  if (!contact) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }

  if (!name || !lastName || !phone || !city || !address || !gender) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  contact.name = name;
  contact.lastName = lastName;
  contact.phone = phone;
  contact.city = city;
  contact.address = address;
  contact.gender = gender;

  res.json(contact);
});

app.delete('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const index = contacts.findIndex(c => c.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }

  const deletedContact = contacts.splice(index, 1);
  res.json(deletedContact[0]);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
