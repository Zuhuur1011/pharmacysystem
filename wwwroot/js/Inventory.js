let editingId = null;

async function loadInventory() {
    try {
        const response = await fetch('/api/medicines');
        const medicines = await response.json();
        const tbody = document.getElementById('inventoryTableBody');
        tbody.innerHTML = '';

        if (medicines.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No medicines yet. Click "+ Add Medicine" to start.</td></tr>';
            return;
        }

        medicines.forEach(med => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${med.name}</td>
                <td>${med.batchNumber}</td>
                <td>${med.quantity}</td>
                <td>${new Date(med.expiryDate).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editMedicine(${med.id}, '${med.name}', '${med.batchNumber}', ${med.quantity}, '${med.expiryDate.split('T')[0]}')">✏️ Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteMedicine(${med.id})">🗑️ Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading inventory:', error);
    }
}

function openModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add Medicine';
    document.getElementById('medicineForm').reset();
    document.getElementById('medicineModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('medicineModal').style.display = 'none';
}

function editMedicine(id, name, batchNumber, quantity, expiryDate) {
    editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Medicine';
    document.getElementById('name').value = name;
    document.getElementById('batchNumber').value = batchNumber;
    document.getElementById('quantity').value = quantity;
    document.getElementById('expiryDate').value = expiryDate;
    document.getElementById('medicineModal').style.display = 'flex';
}

async function deleteMedicine(id) {
    if (!confirm('Are you sure you want to delete this medicine?')) return;

    try {
        await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
        loadInventory();
    } catch (error) {
        console.error('Error deleting medicine:', error);
    }
}

document.getElementById('medicineForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const medicine = {
        name: document.getElementById('name').value,
        batchNumber: document.getElementById('batchNumber').value,
        quantity: parseInt(document.getElementById('quantity').value),
        expiryDate: document.getElementById('expiryDate').value
    };

    try {
        if (editingId) {
            medicine.id = editingId;
            await fetch(`/api/medicines/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(medicine)
            });
        } else {
            await fetch('/api/medicines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(medicine)
            });
        }
        closeModal();
        loadInventory();
    } catch (error) {
        console.error('Error saving medicine:', error);
    }
});

loadInventory();