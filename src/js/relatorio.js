//estoque/src/js/relatorio.js

document.addEventListener('DOMContentLoaded', () => {
    const reportData = JSON.parse(localStorage.getItem('reportData'));
    const reportList = document.getElementById('report-list');
    let grandTotal = 0;

    reportData.forEach(product => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.productId}</td>
            <td>${product.productName}</td>
            <td>${product.quantity}</td>
            <td>R$${parseFloat(product.price).toFixed(2)}</td>
            <td>R$${parseFloat(product.totalPrice).toFixed(2)}</td>
            <td>${product.discount}%</td>
            <td>${product.lowStock}</td>
        `;

        reportList.appendChild(row);
        grandTotal += parseFloat(product.totalPrice);
    });

    document.getElementById('grand-total').textContent = `Valor Total do Estoque: R$${grandTotal.toFixed(2)}`;
});

document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = './inventario.html'; // Redireciona para a página principal
});

document.getElementById('pdf-button').addEventListener('click', () => {
    const element = document.getElementById('report-content');

    const opt = {
        margin: 0.5,
        filename: 'inventory_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1 }, // Mantém uma boa resolução
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }, // Usa o formato retrato
        pagebreak: { mode: ['css', 'legacy'] } // Permite quebra de página conforme o CSS
    };

    html2pdf().set(opt).from(element).save();
});
