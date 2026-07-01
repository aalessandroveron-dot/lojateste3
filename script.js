// ==========================================================================
// 1. MAPEANDO OS ELEMENTOS DO HTML
// ==========================================================================
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const menuOverlay = document.getElementById('menu-overlay'); // NOVO: Mapeado fundo escuro

const carrossel = document.querySelector('.carrossel-container');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.products-grid a');

// ==========================================================================
// 2. MODIFICADO: LÓGICA DO MENU LATERAL (Fechar ao Clicar Fora)
// ==========================================================================
function abrirMenu() {
    sidebar.classList.add('active');
    menuOverlay.classList.add('active'); // Acende a máscara escura de fundo
}

function fecharMenu() {
    sidebar.classList.remove('active');
    menuOverlay.classList.remove('active'); // Apaga a máscara escura de fundo
    
    // Reseta as gavetas internas para começarem fechadas na próxima abertura
    document.querySelectorAll('.submenu').forEach(sub => {
        sub.classList.remove('open');
        sub.style.maxHeight = null;
    });
    document.querySelectorAll('.has-submenu').forEach(item => item.classList.remove('aberto'));
}

if (menuBtn && sidebar && menuOverlay) {
    menuBtn.addEventListener('click', abrirMenu);
    closeBtn.addEventListener('click', fecharMenu);
    
    // NOVO: Se o usuário der um toque livre em qualquer parte escura fora do menu, fecha tudo!
    menuOverlay.addEventListener('click', fecharMenu);
}

// ==========================================================================
// 3. SANFONA MULTI-NÍVEL DINÂMICA
// ==========================================================================
const toggleButtons = document.querySelectorAll('.toggle-btn');

toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const itemPai = btn.parentElement;
        const submenuFilho = itemPai.querySelector('.submenu');
        
        if (submenuFilho.classList.contains('open')) {
            submenuFilho.classList.remove('open');
            submenuFilho.style.maxHeight = null;
            itemPai.classList.remove('aberto');
            
            submenuFilho.querySelectorAll('.submenu').forEach(sub => {
                sub.classList.remove('open');
                sub.style.maxHeight = null;
            });
            submenuFilho.querySelectorAll('.has-submenu').forEach(item => item.classList.remove('aberto'));
        } else {
            submenuFilho.classList.add('open');
            submenuFilho.style.maxHeight = submenuFilho.scrollHeight + "px";
            itemPai.classList.add('aberto');
        }
        
        recalcularAlturasMenusAcima(itemPai);
    });
});

function recalcularAlturasMenusAcima(elemento) {
    let paiAcima = elemento.parentElement.closest('.submenu');
    while (paiAcima) {
        let alturaTotal = 0;
        paiAcima.querySelectorAll(':scope > li').forEach(li => {
            alturaTotal += li.offsetHeight;
            const subDoLi = li.querySelector('.submenu.open');
            if (subDoLi) {
                alturaTotal += subDoLi.scrollHeight;
            }
        });
        paiAcima.style.maxHeight = alturaTotal + "px";
        paiAcima = paiAcima.parentElement.closest('.submenu');
    }
}

// ==========================================================================
// 4. CARROSSEL AUTOMÁTICO E MANUAL (Fade + 6s)
// ==========================================================================
let slideAtual = 0;
let temporizador;

function mostrarSlide(index) {
    if (slides.length === 0) return;
    slides[slideAtual].classList.remove('active');
    slideAtual = (index + slides.length) % slides.length;
    slides[slideAtual].classList.add('active');
    reiniciarTemporizador();
}

function iniciarTemporizador() {
    temporizador = setInterval(() => mostrarSlide(slideAtual + 1), 6000);
}

function reiniciarTemporizador() {
    clearInterval(temporizador);
    iniciarTemporizador();
}

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => mostrarSlide(slideAtual + 1));
    prevBtn.addEventListener('click', () => mostrarSlide(slideAtual - 1));
}

iniciarTemporizador();

// ==========================================================================
// 5. LÓGICA DA BARRA DE PESQUISA
// ==========================================================================
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const termoBusca = e.target.value.toLowerCase();
        
        if (termoBusca.length > 0) {
            carrossel.style.display = "none";
        } else {
            carrossel.style.display = "block";
        }
        
        cards.forEach(card => {
            const tituloTenis = card.querySelector('.product-title').textContent.toLowerCase();
            if (tituloTenis.includes(termoBusca)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}

// ==========================================================================
// 6. LÓGICA DOS FILTROS POR CATEGORIA
// ==========================================================================
filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const marcaSelecionada = btn.getAttribute('data-filter');
        fecharMenu(); // Usa a função unificada que desliga a máscara também
        
        if (marcaSelecionada !== 'todos') {
            carrossel.style.display = "none";
        } else {
            carrossel.style.display = "block";
        }
        
        cards.forEach(card => {
            const marcaDoCard = card.getAttribute('data-marca');
            
            if (marcaSelecionada === 'todos' || marcaDoCard === marcaSelecionada) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});
