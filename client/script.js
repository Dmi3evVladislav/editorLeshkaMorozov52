document.addEventListener('DOMContentLoaded', () => {
    const mainPage = document.getElementById('main-page');
    const editorPage = document.getElementById('editor-page');
    const createDocumentBtn = document.getElementById('create-document');
    const saveDocumentBtn = document.getElementById('save-document');
    const deleteDocumentBtn = document.getElementById('delete-document');
    const backToMainBtn = document.getElementById('back-to-main');
    const documentContent = document.getElementById('document-content');
    const documentList = document.getElementById('document-list');

    let currentDocumentName = null;

    createDocumentBtn.addEventListener('click', () => {
        mainPage.style.display = 'none';
        editorPage.style.display = 'block';
        documentContent.value = '';
        currentDocumentName = null;
    });

    saveDocumentBtn.addEventListener('click', () => {
        const content = documentContent.value;
        if (content.trim() !== '') {
            const fileName = currentDocumentName || `document_${Date.now()}.txt`;
            fetch('http://localhost:3000/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: fileName, content: content })
            }).then(response => {
                if (response.ok) {
                    alert('Документ сохранен');
                    updateDocumentList();
                } else {
                    alert('Ошибка при сохранении документа');
                }
            });
        }
    });

    deleteDocumentBtn.addEventListener('click', () => {
        if (currentDocumentName) {
            fetch(`http://localhost:3000/document/${currentDocumentName}`, {
                method: 'DELETE'
            }).then(response => {
                if (response.ok) {
                    alert('Документ удален');
                    currentDocumentName = null;
                    documentContent.value = '';
                    updateDocumentList();
                    mainPage.style.display = 'block';
                    editorPage.style.display = 'none';
                } else {
                    alert('Ошибка при удалении документа');
                }
            });
        }
    });

    backToMainBtn.addEventListener('click', () => {
        editorPage.style.display = 'none';
        mainPage.style.display = 'block';
        updateDocumentList();
    });

    function updateDocumentList() {
        fetch('http://localhost:3000/documents')
            .then(response => response.json())
            .then(files => {
                documentList.innerHTML = '';
                files.forEach(file => {
                    const button = document.createElement('button');
                    button.textContent = file;
                    button.addEventListener('click', () => {
                        fetch(`http://localhost:3000/document/${file}`)
                            .then(response => response.text())
                            .then(content => {
                                documentContent.value = content;
                                currentDocumentName = file;
                                mainPage.style.display = 'none';
                                editorPage.style.display = 'block';
                            });
                    });
                    documentList.appendChild(button);
                });
            });
    }

    updateDocumentList();
});