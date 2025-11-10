const lista = document.getElementById('lista');
const filtro = document.getElementById('filtro');
const orden = document.getElementById('orden');
let items = [];


const initialData = {
    categorias: [
        {
            nombre: "Electrónica",
            subcategorias: [
                {
                    nombre: "Portátiles",
                    items: [
                        { titulo: "Ceviche", precio: 1250000, etiquetas: ["Alimentos", "Mariscos"] },
                        { titulo: "Chifrijo", precio: 1800000, etiquetas: ["Alimentos", "Cultural"] }
                    ]
                },
                {
                    nombre: "Accesorios",
                    items: [
                        { titulo: "Gallo pinto", precio: 15000, etiquetas: ["Alimentos"] },
                        { titulo: "Tamales", precio: 45000, etiquetas: ["Alimentos", "Navideño"] }
                    ]
                }
            ]
        },
        {
            nombre: "Hogar",
            subcategorias: [
                {
                    nombre: "Cocina",
                    items: [
                        { titulo: "Pilon", precio: 85000, etiquetas: ["Madera"] },
                        { titulo: "Vasija", precio: 150000, etiquetas: ["Ceramica"] }
                    ]
                }
            ]
        }
    ]
};



async function cargar() {
    
    try {
    
        const data = initialData;

        
        items = data.categorias.flatMap(c =>
            c.subcategorias.flatMap(s => s.items)
        );
        
        
        render();
    } catch (error) {
        
        console.error("No se pudieron procesar los datos:", error);
        lista.innerHTML = `<p>Error al procesar los productos. Por favor, revise la estructura de datos.</p>`;
    }
}

function render() {
    const q = filtro.value?.toLowerCase() || '';
    
    const sorted = [...items].sort((a, b) =>
        orden.value === 'az'
            ? a.titulo.localeCompare(b.titulo)
            : b.titulo.localeCompare(a.titulo)
    );

    const filtrados = sorted.filter(it => it.titulo.toLowerCase().includes(q));
    
    lista.innerHTML = '';
    
    if (filtrados.length === 0) {
        lista.innerHTML = `<p>No se encontraron productos.</p>`;
        return;
    }

    filtrados.forEach((it, index) => {
        
        const precioFormateado = new Intl.NumberFormat('es-CR', { 
            style: 'currency', 
            currency: 'CRC' 
        }).format(it.precio);
        
        const li = document.createElement('div');
        li.className = 'item-card';
        li.tabIndex = 0;
        
        li.innerHTML = `
            <h3>${it.titulo}</h3>
            <p class="price">${precioFormateado}</p>
            <div class="tags">
                ${it.etiquetas.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;

        li.style.animationDelay = `${index * 50}ms`;
        li.classList.add('fade-in');

        li.addEventListener('click', () => {
            document.querySelectorAll('.item-card').forEach(card => card.classList.remove('resaltado'));
            li.classList.add('resaltado');
        });

        lista.appendChild(li);
    });
}


filtro.addEventListener('input', render);
orden.addEventListener('change', render);


const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    obs.observe(section);
});


cargar();