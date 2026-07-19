async function loadAlerts() {
    try {
        const response = await fetch('/api/medicines');
        const medicines = await response.json();

        const today = new Date();
        const soon = new Date();
        soon.setDate(today.getDate() + 30);

        const expired = medicines.filter(m => new Date(m.expiryDate) < today);
        const expiring = medicines.filter(m => {
            const d = new Date(m.expiryDate);
            return d >= today && d <= soon;
        });

        renderTable('expiredTableBody', expired, 'status-expired');
        renderTable('expiringTableBody', expiring, 'status-warning');
    } catch (error) {
        console.error('Error loading alerts:', error);
    }
}

function renderTable(tbodyId, list, className) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">None found.</td></tr>';
        return;
    }

    list.forEach(med => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${med.name}</td>
            <td>${med.batchNumber}</td>
            <td>${med.quantity}</td>
            <td class="${className}">${new Date(med.expiryDate).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    });
}

loadAlerts();
async function sendAlertEmail() {
    const email = document.getElementById('alertEmailInput').value;
    if (!email) {
        alert('Please enter an email address.');
        return;
    }

    try {
        const response = await fetch(`/api/alerts/send-expiry-email?toEmail=${encodeURIComponent(email)}`, { method: 'POST' });
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        alert('Failed to send email. Please try again.');
        console.error(error);
    }
}