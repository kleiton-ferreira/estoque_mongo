//estoque/src/js/relatorio.js


document.addEventListener('DOMContentLoaded', () => {   // Adiciona um evento que será acionado quando o conteúdo da página estiver completamente carregado
    const reportData = JSON.parse(localStorage.getItem('reportData'));  // Recupera os dados do relatório do localStorage e os analisa como um objeto JavaScript
    const reportList = document.getElementById('report-list');  // Obtém a referência à tabela onde os dados do relatório serão exibidos
    
    let grandTotal = 0;   // Inicia uma variável para calcular o total do estoque

    reportData.forEach(product => {  // Itera sobre cada produto nos dados do relatório
        const row = document.createElement('tr');  // Cria uma nova linha na tabela para cada produto

        // Preenche a linha com os dados do produto
        row.innerHTML = `
            <td>${product.productId}</td>           
            <td>${product.productName}</td>         
            <td>${product.quantity}</td>            
            <td>R$${parseFloat(product.price).toFixed(2)}</td>    
            <td>R$${parseFloat(product.totalPrice).toFixed(2)}</td> 
            <td>${product.discount}%</td>          
            <td>${product.lowStock}</td>            
        `;
        
        reportList.appendChild(row); // Adiciona a linha à tabela do relatório
        grandTotal += parseFloat(product.totalPrice); // Acumula o preço total dos produtos para calcular o total
    });

    // Atualiza o elemento que exibe o total do estoque com o valor acumulado
    document.getElementById('grand-total').textContent = `Valor Total do Estoque: R$${grandTotal.toFixed(2)}`;
});


document.getElementById('back-button').addEventListener('click', () => {   // Adiciona um evento de clique ao botão de voltar
    window.location.href = './inventario.html';   // Redireciona o usuário para a página do inventário
});


document.getElementById('pdf-button').addEventListener('click', () => {   // Adiciona um evento de clique ao botão para gerar PDF
    const element = document.getElementById('report-content');    // Obtém o elemento que contém o conteúdo do relatório

    // Configura as opções para a geração do PDF
    const opt = {
        margin: 0.5,                                          // Define a margem do PDF
        filename: 'inventory_report.pdf',                     // Nome do arquivo PDF a ser gerado
        image: { type: 'jpeg', quality: 1 },              // Tipo e qualidade da imagem no PDF
        html2canvas: { scale: 1 },                            // Mantém uma boa resolução ao converter o conteúdo em imagem
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }, // Define unidades, formato e orientação do PDF
        pagebreak: { mode: ['css'] }               // Permite quebra de página conforme o CSS
    };

    // Gera o PDF a partir do elemento especificado e o salva
    html2pdf().set(opt).from(element).save();
});
