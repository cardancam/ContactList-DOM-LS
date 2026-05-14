const API_URL = 'http://localhost:3000/api/contacts';

function showSpinner() {
    document.getElementById("spinner").classList.remove("hidden");
}

function hideSpinner() {
    document.getElementById("spinner").classList.add("hidden");
}

const formulario = document.getElementById("formulario");
const contactList = document.getElementById("contactList");
const button = document.getElementById("addContactButton");

let contacts = [];
let selectedGender = "";
let editingId = null;

function loadListContact(contactsData) {
    const contactList = document.getElementById("contactList");
    contactList.innerHTML = "";
    contactsData.forEach((contact) => {
        contactList.innerHTML += renderContactHTML(contact);
    });
    hideSpinner();
}

async function loadContacts() {
    try {
        showSpinner();
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        contacts = await response.json();
        loadListContact(contacts);
    } catch (error) {
        console.error("Error cargando contactos:", error);
        hideSpinner();
    }
}

loadContacts();

function handleGenderChange(gender) {
    if (gender === "masculino") {
        if (document.getElementById("genderMale").checked) {
            document.getElementById("genderFemale").checked = false;
            selectedGender = "masculino";
        } else {
            selectedGender = "";
        }
    } else if (gender === "femenino") {
        if (document.getElementById("genderFemale").checked) {
            document.getElementById("genderMale").checked = false;
            selectedGender = "femenino";
        } else {
            selectedGender = "";
        }
    }
}

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();
    const name = formulario.elements["contactName"].value.trim();
    const lastName = formulario.elements["contactLastName"].value.trim();
    const phone = formulario.elements["contactPhone"].value.trim();
    const city = formulario.elements["contactCity"].value.trim();
    const address = formulario.elements["contactAddress"].value.trim();

    const emptyFields = [name, lastName, phone, city, address].some(field => field === "") || selectedGender === "";
    if (emptyFields) {
        alert("Por favor, complete todos los campos.");
    }else {
        showSpinner();

        const contactData= { name, lastName, phone, city, address, gender: selectedGender };

        if (editingId === null) {
            await addContact(contactData);
        } else {
            await updateContact(contactData);
        }
    }
});

async function addContact(contactData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        });
        if (response.ok) {
            const newContact = await response.json();
            contacts.push(newContact);
            loadContacts();
            formulario.reset();
            document.getElementById("genderMale").checked = false;
            document.getElementById("genderFemale").checked = false;
            selectedGender = "";
            button.textContent = "Agregar Contacto";
            editingId = null;
            hideSpinner();
        }
    } catch (error) {
        console.error("Error agregando contacto:", error);
        hideSpinner();
    }
}

async function updateContact(contactData) {
    try {
        const response = await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        });
        if (response.ok) {
            loadContacts();
            formulario.reset();
            document.getElementById("genderMale").checked = false;
            document.getElementById("genderFemale").checked = false;
            selectedGender = "";
            button.textContent = "Agregar Contacto";
            editingId = null;
            hideSpinner();
        }
    } catch (error) {
        console.error("Error actualizando contacto:", error);
        hideSpinner();
    }
}

function loadContactForm(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    button.textContent = "Actualizar Contacto";
    editingId = id;

    const name = document.getElementById("contactName");
    const lastName = document.getElementById("contactLastName");
    const phone = document.getElementById("contactPhone");
    const city = document.getElementById("contactCity");
    const address = document.getElementById("contactAddress");
    const genderMale = document.getElementById("genderMale");
    const genderFemale = document.getElementById("genderFemale");

    name.value = contact.name;
    lastName.value = contact.lastName;
    phone.value = String(contact.phone);
    city.value = contact.city;
    address.value = contact.address;
    if (contact.gender === "masculino") {
        genderMale.checked = true;
        genderFemale.checked = false;
        selectedGender = "masculino";
    } else {
        genderFemale.checked = true;
        genderMale.checked = false;
        selectedGender = "femenino";
    }
}

function checkEmptyInputs(name, lastName, phone, city, address) {
    if (name === "" || lastName === "" || phone === "" || city === "" || address === "") {
        return true;
    }
    return false;
}

function renderContactHTML(contact) {
    const genderEmoji = contact.gender === "masculino" ? "👨" : "👩";
    return `
        <div class="contact-item">
            <div class="contact-info">
                <h3>${genderEmoji} ${contact.name} ${contact.lastName}</h3>
                <p><strong>Ciudad:</strong> ${contact.city}</p>
            </div>
            <div class="contact-actions">
                <button class="btn-edit" onclick="editContact(${contact.id})" title="Editar">✏️</button>
                <button class="btn-delete" onclick="deleteContact(${contact.id})" title="Eliminar">🗑️</button>
            </div>
        </div>
    `;
}

function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
    
    loadContactForm(id);
    window.scrollTo(0, 0);
}

async function deleteContact(id) {
    if (!confirm("¿Deseas eliminar este contacto?")) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            contacts = contacts.filter(c => c.id !== id);
            loadContacts();
        }
    } catch (error) {
        console.error("Error eliminando contacto:", error);
    }
}
