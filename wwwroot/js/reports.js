async function loadReports() {
    try {
        const response = await fetch('/api/medicines');
        const medicines = await response.json();

        const today = new Date();
        const soon = new Date();
        soon.setDate(today.getDate() + 30);

        let good = 0, expiring = 0, expired = 0;

        medicines.forEach(med => {
            const d = new Date(med.expiryDate);
            if (d < today) expired++;
            else if (d <= soon) expiring++;
            else good++;
        });

        document.getElementById('repTotal').textContent = medicines.length;
        document.getElementById('repGood').textContent = good;
        document.getElementById('repExpiring').textContent = expiring;
        document.getElementById('repExpired').textContent = expired;

        const lowStock = medicines.filter(m => m.quantity < 20);
        const tbody = document.getElementById('lowStockTableBody');
        tbody.innerHTML = '';

        if (lowStock.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No low stock items.</td></tr>';
            return;
        }

        lowStock.forEach(med => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${med.name}</td>
                <td>${med.batchNumber}</td>
                <td>${med.quantity}</td>
                <td>${new Date(med.expiryDate).toLocaleDateString()}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

loadReports();