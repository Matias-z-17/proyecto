const initialData = {
    categorias: [
        {
            nombre: "Electrónica",
            subcategorias: [
                {
                    nombre: "Portátiles y Desktops",
                    items: [
                        { titulo: "Laptop Ultrabook X1", precio: 1250000, etiquetas: ["Nuevo", "Premium"] },
                        { titulo: "Desktop Workstation P50", precio: 1500000, etiquetas: ["Rendimiento"] }
                    ]
                },
                {
                    nombre: "Accesorios",
                    items: [
                        { titulo: "Mouse Inalámbrico", precio: 15000, etiquetas: ["Básico"] },
                        { titulo: "Teclado Mecánico RGB", precio: 45000, etiquetas: ["Gamer"] }
                    ]
                }
            ]
        },
        {
            nombre: "Hogar y Cocina",
            subcategorias: [
                {
                    nombre: "Electrodomésticos",
                    items: [
                        { titulo: "Licuadora Profesional", precio: 85000, etiquetas: ["Potente"] },
                        { titulo: "Cafetera Expresso", precio: 150000, etiquetas: ["Lujo"] }
                    ]
                },
                {
                    nombre: "Utensilios",
                    items: [
                        { titulo: "Set de Cuchillos Premium", precio: 35000, etiquetas: ["Oferta"] }
                    ]
                }
            ]
        }
    ]
};


async function initTree() {
    
    try {
        const data = initialData;
        const tree = document.getElementById('tree');
        tree.setAttribute('role', 'tree');
        
        data.categorias.forEach(cat => {
           
            const li = makeNode(cat.nombre, 'group');
            const ul = document.createElement('ul');
            ul.setAttribute('role', 'group');
            
            cat.subcategorias.forEach(sub => {
                
                const liSub = makeNode(sub.nombre, 'group');
                const ulItems = document.createElement('ul');
                ulItems.setAttribute('role', 'group');
                
                sub.items.forEach(it => {
                    
                    const precioFormateado = new Intl.NumberFormat('es-CR', { 
                        style: 'currency', 
                        currency: 'CRC' 
                    }).format(it.precio);
                    ulItems.appendChild(makeLeaf(`${it.titulo} (${precioFormateado})`));
                });
                
                liSub.appendChild(ulItems);
                ul.appendChild(liSub);
            });
            
            li.appendChild(ul);
            tree.appendChild(li);
        });
    } catch (error) {
        
        console.error("No se pudo inicializar el árbol:", error);
    }
}

function makeNode(text, role = 'group') {
    const li = document.createElement('li');
    li.setAttribute('role', 'treeitem');
    li.setAttribute('aria-expanded', 'false');
    
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Alternar ${text}`);
    btn.innerHTML = '▶';
    
    const span = document.createElement('span');
    span.textContent = ` ${text}`;
    
    const toggleNode = () => toggle(li, btn);
    
    btn.addEventListener('click', toggleNode);
    btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleNode();
        }
    });
    
    li.prepend(btn, span);
    return li;
}

function makeLeaf(text) {
    const li = document.createElement('li');
    li.setAttribute('role', 'treeitem');
    li.textContent = text;
    return li;
}

function toggle(li, btn) {
    const isExpanded = li.getAttribute('aria-expanded') === 'true';
    li.setAttribute('aria-expanded', String(!isExpanded));
    btn.innerHTML = isExpanded ? '▶' : '▼';
}

initTree();