// Mostrar/Ocultar carrito
const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});

// Variables para productos
const rowProduct = document.querySelector('.row-product');
const productsList = document.querySelector('.container-items');

let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');

const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

// Agregar productos al carrito
productsList.addEventListener('click', e => {
    if (e.target.classList.contains('btn-add-cart')) {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h2').textContent,
            price: product.querySelector('p').textContent,
        };

        const exists = allProducts.some(item => item.title === infoProduct.title);

        if (exists) {
            allProducts = allProducts.map(item => {
                if (item.title === infoProduct.title) {
                    item.quantity++;
                }
                return item;
            });
        } else {
            allProducts = [...allProducts, infoProduct];
        }

        showHTML();
    }
});

// Eliminar productos del carrito
rowProduct.addEventListener('click', e => {
    if (e.target.classList.contains('icon-close')) {
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent;

        allProducts = allProducts.filter(item => item.title !== title);

        showHTML();
    }
});

// Mostrar productos en el carrito
const showHTML = () => {
    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }

    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(item => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${item.quantity}</span>
                <p class="titulo-producto-carrito">${item.title}</p>
                <span class="precio-producto-carrito">${item.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

        rowProduct.append(containerProduct);

        total += item.quantity * parseFloat(item.price.slice(1));
        totalOfProducts += item.quantity;
    });

    valorTotal.innerText = `$${total.toFixed(2)}`;
    countProducts.innerText = totalOfProducts;
};

// Slider de imágenes
let current = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
}

function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
}

// Iniciar slider al cargar
showSlide(current);
setInterval(nextSlide, 5000);

// Funcionalidad de pago
document.addEventListener('DOMContentLoaded', function() {
    const amountInput = document.getElementById('amount');
    const paymentContainer = document.getElementById('payment-container');
    
    // Verificar si existen los elementos de pago antes de inicializar
    if (amountInput && paymentContainer) {
        // Configuración de MercadoPago (reemplaza con tu public key)
        if (typeof MercadoPago !== 'undefined') {
            const mp = new MercadoPago('TU_PUBLIC_KEY', {
                locale: 'es-CO'
            });
        }
        
        // Configuración de PayPal (si está disponible)
        if (typeof paypal !== 'undefined') {
            paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'paypal'
                }
            });
        }
        
        // Manejar clic en los métodos de pago
        document.querySelectorAll('.select-btn').forEach(button => {
            button.addEventListener('click', function() {
                const methodId = this.closest('.method').id;
                const amount = parseFloat(amountInput.value);
                
                if (isNaN(amount) || amount <= 0) {
                    alert('Por favor ingresa un monto válido');
                    return;
                }
                
                paymentContainer.innerHTML = '<p>Procesando pago...</p>';
                
                switch(methodId) {
                    case 'mercadopago':
                        initMercadoPago(amount);
                        break;
                    case 'paypal':
                        initPayPal(amount);
                        break;
                    case 'nequi':
                        initNequi(amount);
                        break;
                    case 'bancolombia':
                        initBancolombia(amount);
                        break;
                    default:
                        paymentContainer.innerHTML = '<p>Método de pago no disponible</p>';
                }
            });
        });
        
        // Inicializar MercadoPago
        function initMercadoPago(amount) {
            if (typeof mp !== 'undefined') {
                mp.checkout({
                    preference: {
                        id: 'TU_PREFERENCE_ID' // Debes generar esto en tu backend
                    },
                    render: {
                        container: '#payment-container',
                        label: 'Pagar con MercadoPago'
                    }
                });
            } else {
                paymentContainer.innerHTML = '<p>MercadoPago no está disponible</p>';
            }
        }
        
        // Inicializar PayPal
        function initPayPal(amount) {
            if (typeof paypal !== 'undefined') {
                paypal.Buttons({
                    createOrder: function(data, actions) {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: amount.toString()
                                }
                            }]
                        });
                    },
                    onApprove: function(data, actions) {
                        return actions.order.capture().then(function(details) {
                            paymentContainer.innerHTML = `
                                <div class="success-message">
                                    <h3>¡Pago completado!</h3>
                                    <p>ID de transacción: ${details.id}</p>
                                    <p>Monto: $${amount}</p>
                                </div>
                            `;
                        });
                    }
                }).render('#payment-container');
            } else {
                paymentContainer.innerHTML = '<p>PayPal no está disponible</p>';
            }
        }
        
        // Inicializar Nequi (simulación)
        function initNequi(amount) {
            paymentContainer.innerHTML = `
                <div class="nequi-payment">
                    <h3>Pago con Nequi</h3>
                    <p>Monto a pagar: $${amount}</p>
                    <p>Envía el pago al número 3101234567</p>
                    <p>Referencia: PAGO${Math.floor(Math.random() * 10000)}</p>
                    <button id="confirm-nequi" class="select-btn">Confirmar Pago</button>
                </div>
            `;
            
            document.getElementById('confirm-nequi').addEventListener('click', function() {
                paymentContainer.innerHTML = `
                    <div class="success-message">
                        <h3>¡Pago con Nequi completado!</h3>
                        <p>Monto: $${amount}</p>
                        <p>Gracias por tu pago.</p>
                    </div>
                `;
            });
        }
        
        // Inicializar Bancolombia (simulación)
        function initBancolombia(amount) {
            paymentContainer.innerHTML = `
                <div class="bancolombia-payment">
                    <h3>Pago con Bancolombia</h3>
                    <p>Monto a pagar: $${amount}</p>
                    <p>Número de cuenta: 123456789</p>
                    <p>Referencia: PAGO${Math.floor(Math.random() * 10000)}</p>
                    <button id="confirm-bancolombia" class="select-btn">Confirmar Pago</button>
                </div>
            `;
            
            document.getElementById('confirm-bancolombia').addEventListener('click', function() {
                paymentContainer.innerHTML = `
                    <div class="success-message">
                        <h3>¡Pago con Bancolombia completado!</h3>
                        <p>Monto: $${amount}</p>
                        <p>Gracias por tu pago.</p>
                    </div>
                `;
            });
        }
    }
});