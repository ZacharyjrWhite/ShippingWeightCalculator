function exportTableToCSV() {
    const table = document.querySelector('.shipping_data');
    if (!table) {
        console.error('No table found to export.');
        return;
    }

    // Get current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0, 10);

    // Prepare the filename
    const fileName = `Shipping_export_${currentDate}.csv`;

    // Extract table rows
    const rows = Array.from(table.rows);

    // Convert rows to CSV
    const csvContent = rows
        .map(row => {
            const cells = Array.from(row.cells);
            return cells.map(cell => `"${cell.innerText.trim()}"`).join(',');
        })
        .join('\n');

    // Create a blob and a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default exportTableToCSV;
