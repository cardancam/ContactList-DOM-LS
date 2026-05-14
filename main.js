let contacts = [];
let editingIndex = -1;
let selectedGender = "";

// Manejar cambio de sexo (checkboxes mutuamente excluyentes)
function handleGenderChange(gender) {
    if (gender === "masculino") {
        document.getElementById("genderMale").checked = !document.getElementById("genderMale").checked;
        if (document.getElementById("genderMale").checked) {
            document.getElementById("genderFemale").checked = false;
            selectedGender = "masculino";
        } else {
            selectedGender = "";
        }
    } else if (gender === "femenino") {
        document.getElementById("genderFemale").checked = !document.getElementById("genderFemale").checked;
        if (document.getElementById("genderFemale").checked) {
            document.getElementById("genderMale").checked = false;
            selectedGender = "femenino";
        } else {
            selectedGender = "";
        }
    }
}

// Mostrar/Ocultar spinner
function showSpinner() {
    document.getElementById("spinner").classList.remove("hidden");
}

function hideSpinner() {
    document.getElementById("spinner").classList.add("hidden");
}

// Cargar contactos desde localStorage al iniciar
function loadContacts() {
    showSpinner();
    setTimeout(() => {
        const saved = localStorage.getItem("contacts");
        contacts = saved ? JSON.parse(saved) : [];
        renderContacts();
        hideSpinner();
    }, 500);
}

// Guardar contactos en localStorage
function saveContacts() {
    showSpinner();
    setTimeout(() => {
        localStorage.setItem("contacts", JSON.stringify(contacts));
        hideSpinner();
    }, 500);
}

// Agregar o actualizar contacto
function addContact() {
    const name = document.getElementById("addContactName").value.trim();
    const lastName = document.getElementById("addContactLastName").value.trim();
    const phone = document.getElementById("addContactPhone").value.trim();
    const city = document.getElementById("addContactCity").value.trim();
    const address = document.getElementById("addContactAddress").value.trim();

    if (!name || !lastName || !phone || !city || !address || !selectedGender) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const contact = { name, lastName, phone, city, address, gender: selectedGender };

    if (editingIndex === -1) {
        // Agregar nuevo contacto
        contacts.push(contact);
    } else {
        // Actualizar contacto existente
        contacts[editingIndex] = contact;
        editingIndex = -1;
        document.getElementById("addContactButton").textContent = "Agregar Contacto";
    }

    saveContacts();
    renderContacts();
    clearFields();
}

// Mostrar contactos en la lista
function renderContacts() {
    showSpinner();
    setTimeout(() => {
        const contactList = document.getElementById("contactList");
        contactList.innerHTML = "";

        contacts.forEach((contact, index) => {
        const contactItem = document.createElement("div");
        contactItem.className = "contact-item";
        const genderEmoji = contact.gender === "masculino" ? "👨" : "👩";
        contactItem.innerHTML = `
            <div class="contact-info">
                <h3>${genderEmoji} ${contact.name} ${contact.lastName}</h3>
                <p><strong>Ciudad:</strong> ${contact.city}</p>
            </div>
            <div class="contact-actions">
                <button class="btn-edit" onclick="editContact(${index})" title="Editar">✏️</button>
                <button class="btn-delete" onclick="deleteContact(${index})" title="Eliminar">🗑️</button>
            </div>
        `;
        contactList.appendChild(contactItem);
    });
    hideSpinner();
    }, 300);
}

// Editar contacto
function editContact(index) {
    const contact = contacts[index];
    document.getElementById("addContactName").value = contact.name;
    document.getElementById("addContactLastName").value = contact.lastName;
    document.getElementById("addContactPhone").value = contact.phone;
    document.getElementById("addContactCity").value = contact.city;
    document.getElementById("addContactAddress").value = contact.address;
    
    selectedGender = contact.gender;
    document.getElementById("genderMale").checked = contact.gender === "masculino";
    document.getElementById("genderFemale").checked = contact.gender === "femenino";
    
    editingIndex = index;
    document.getElementById("addContactButton").textContent = "Actualizar Contacto";
}

// Eliminar contacto
function deleteContact(index) {
    if (confirm("¿Deseas eliminar este contacto?")) {
        contacts.splice(index, 1);
        saveContacts();
        renderContacts();
    }
}

// Limpiar campos
function clearFields() {
    document.getElementById("addContactName").value = "";
    document.getElementById("addContactLastName").value = "";
    document.getElementById("addContactPhone").value = "";
    document.getElementById("addContactCity").value = "";
    document.getElementById("addContactAddress").value = "";
    document.getElementById("genderMale").checked = false;
    document.getElementById("genderFemale").checked = false;
    selectedGender = "";
    editingIndex = -1;
    document.getElementById("addContactButton").textContent = "Agregar Contacto";
}

// Cargar contactos cuando carga la página
window.addEventListener("DOMContentLoaded", loadContacts);