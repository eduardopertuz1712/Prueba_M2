document.addEventListener('DOMContentLoaded', function() {
    const methods = document.querySelectorAll('.method');
    const modal = document.querySelector('.payment-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modalTitle');
    const methodNameSpan = document.getElementById('methodName');
    
    methods.forEach(method => {
        method.addEventListener('click', function() {
            const methodType = this.getAttribute('data-method');
            const methodTitle = this.querySelector('h3').textContent;
            
            // Ocultar todos los QR y secciones de información
            document.querySelectorAll('.qr-container, .payment-info').forEach(element => {
                element.style.display = 'none';
            });
            
            // Mostrar el QR correspondiente
            document.getElementById(`${methodType}-qr`).style.display = 'block';
            
            // Mostrar la información correspondiente
            document.getElementById(`${methodType}-info`).style.display = 'block';
            
            // Actualizar título del modal
            methodNameSpan.textContent = methodTitle;
            
            // Mostrar modal
            modal.style.display = 'flex';
        });
    });
    
    // Cerrar modal cuando se hace clic en la X
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Cerrar modal cuando se hace clic fuera del contenido
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
});