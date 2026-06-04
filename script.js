// Obtém o botão do menu e o elemento de navegação do HTML
const btnMobile = document.getElementById('btn-mobile');
const nav = document.getElementById('nav');

function toggleMenu(event) {
    // Se for um evento de toque (touch), previne o comportamento padrão de clique duplo
    if (event.type === 'touchstart') event.preventDefault();

    // Alterna a classe 'active' na nossa tag <nav>
    nav.classList.toggle('active');
    
    // Verifica se o menu foi aberto ou não (retorna true ou false)
    const active = nav.classList.contains('active');
    
    // Altera o atributo de acessibilidade dizendo a leitores de tela se está aberto ou não
    btnMobile.setAttribute('aria-expanded', active);
    
    // Melhora a experiência de acessibilidade mudando o texto de aviso do botão
    if (active) {
        btnMobile.setAttribute('aria-label', 'Fechar Menu');
    } else {
        btnMobile.setAttribute('aria-label', 'Abrir Menu');
    }
}

// Escuta tanto cliques do mouse quanto toques na tela do celular
btnMobile.addEventListener('click', toggleMenu);
btnMobile.addEventListener('touchstart', toggleMenu);

// Fecha o menu automaticamente após o usuário clicar em uma das opções de link
const menuLinks = document.querySelectorAll('#menu a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        btnMobile.setAttribute('aria-expanded', 'false');
        btnMobile.setAttribute('aria-label', 'Abrir Menu');
    });
});


const imagens = document.querySelectorAll(".gallery-grid img");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

const btnClose = document.querySelector(".close");
const btnPrev = document.querySelector(".prev");
const btnNext = document.querySelector(".next");

let indexAtual = 0;

function abrirImagem(index){
    indexAtual = index;
    lightboxImg.src = imagens[index].src;
    lightbox.classList.add("active");
}

imagens.forEach((img, index)=>{
    img.addEventListener("click", ()=>{
        abrirImagem(index);
    });
});

btnClose.addEventListener("click", ()=>{
    lightbox.classList.remove("active");
});

btnNext.addEventListener("click", ()=>{
    indexAtual++;

    if(indexAtual >= imagens.length){
        indexAtual = 0;
    }

    abrirImagem(indexAtual);
});

btnPrev.addEventListener("click", ()=>{
    indexAtual--;

    if(indexAtual < 0){
        indexAtual = imagens.length - 1;
    }

    abrirImagem(indexAtual);
});

lightbox.addEventListener("click", (e)=>{
    if(e.target === lightbox){
        lightbox.classList.remove("active");
    }
});
