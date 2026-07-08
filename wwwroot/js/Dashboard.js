async function loadMedicines() {
    try {
        const response = await fetch('/api/medicines');
        const medicines = await response.json();

        document.getElementById('totalItems').textContent = medicines.length;

        const today = new Date();
        const soon = new Date();
        soon.setDate(today.getDate() + 30);

        let expiringSoon = 0;
        let expired = 0;

        const tbody = document.getElementById('medicinesTableBody');
        tbody.innerHTML = '';

        if (medicines.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No medicines found. Add some from the Inventory page.</td></tr>';
        }

        medicines.forEach(med => {
            const expiryDate = new Date(med.expiryDate);
            let statusClass = 'status-ok';
            let statusText = 'Good';

            if (expiryDate < today) {
                statusClass = 'status-expired';
                statusText = 'Expired';
                expired++;
            } else if (expiryDate <= soon) {
                statusClass = 'status-warning';
                statusText = 'Expiring Soon';
                expiringSoon++;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${med.name}</td>
                <td>${med.batchNumber}</td>
                <td>${med.quantity}</td>
                <td>${expiryDate.toLocaleDateString()}</td>
                <td class="${statusClass}">${statusText}</td>
            `;
            tbody.appendChild(row);
        });

        document.getElementById('expiringSoon').textContent = expiringSoon;
        document.getElementById('expiredItems').textContent = expired;
        document.getElementById('totalValue').textContent = '$' + (medicines.length * 10);
    } catch (error) {
        console.error('Error loading medicines:', error);
        document.getElementById('medicinesTableBody').innerHTML = '<tr><td colspan="5">Failed to load medicines.</td></tr>';
    }
}

function updateDateTime() {
    const now = new Date();
    document.querySelector('.datetime').textContent = now.toLocaleString();
}

loadMedicines();
updateDateTime();
setInterval(updateDateTime, 1000);