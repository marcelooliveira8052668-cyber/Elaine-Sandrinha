/* ============================================================
   Elaine & Sandra — Neuropsicopedagogia Clínica

   Menu móvel, galeria com lightbox, formulário de contato que
   entrega a mensagem pelo canal disponível e cabeçalho fixo.
   ============================================================ */

'use strict';

/* -------------------------------------------------------------
   CONFIGURAÇÃO — é aqui que o cliente mexe.
   Deixe "whatsapp" vazio ("") e o botão desaparece sozinho.
   Formato: só números, com DDI 55. Ex.: "5511999999999"
   ------------------------------------------------------------- */
const CONFIG = {
    whatsapp: '',            // número de WhatsApp da clínica
    email:    '',            // e-mail de contato
    instagram: 'https://www.instagram.com/rnconectividade'
};

/* ------------------------------------------------------------- CABEÇALHO */
const header = document.querySelector('header');

function atualizarCabecalho() {
    if (!header) return;
    header.classList.toggle('fixo', window.scrollY > 12);
}

window.addEventListener('scroll', atualizarCabecalho, { passive: true });
atualizarCabecalho();

/* ------------------------------------------------------------- MENU MÓVEL */
const btnMobile = document.getElementById('btn-mobile');
const nav = document.getElementById('nav');

function alternarMenu(evento) {
    // No celular o toque dispara "touchstart" e depois "click";
    // sem prevenir, o menu abriria e fecharia na mesma hora.
    if (evento && evento.type === 'touchstart') evento.preventDefault();

    nav.classList.toggle('active');
    const aberto = nav.classList.contains('active');

    btnMobile.setAttribute('aria-expanded', String(aberto));
    btnMobile.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

if (btnMobile && nav) {
    btnMobile.addEventListener('click', alternarMenu);
    btnMobile.addEventListener('touchstart', alternarMenu, { passive: false });

    // Fecha o menu ao escolher uma seção
    document.querySelectorAll('#menu a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                btnMobile.setAttribute('aria-expanded', 'false');
                btnMobile.setAttribute('aria-label', 'Abrir menu');
            }
        });
    });

    // Fecha ao pressionar Esc, para quem navega por teclado
    document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' && nav.classList.contains('active')) {
            nav.classList.remove('active');
            btnMobile.setAttribute('aria-expanded', 'false');
            btnMobile.focus();
        }
    });

    // Fecha se a janela voltar para o formato de computador
    window.addEventListener('resize', function () {
        if (window.innerWidth > 860 && nav.classList.contains('active')) {
            nav.classList.remove('active');
            btnMobile.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ------------------------------------------------------------- LIGHTBOX */
(function () {
    const lightbox = document.getElementById('lightbox');
    const imagem = document.getElementById('lightbox-img');
    const legenda = document.getElementById('lightbox-legenda');
    if (!lightbox || !imagem || !legenda) return;

    const fechar = lightbox.querySelector('.lightbox-fechar');
    const anterior = lightbox.querySelector('.lightbox-anterior');
    const proxima = lightbox.querySelector('.lightbox-proxima');

    // Toda a coleção visível: as fotos da galeria e os conteúdos.
    const itens = Array.prototype.slice.call(
        document.querySelectorAll('.galeria figure')
    );
    if (!itens.length) return;

    let atual = 0;
    let focoAnterior = null;

    function fonte(figura) {
        const img = figura.querySelector('img');
        return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt') || ''
        };
    }

    function mostrar(indice) {
        atual = (indice + itens.length) % itens.length;
        const d = fonte(itens[atual]);
        imagem.src = d.src;
        imagem.alt = d.alt;
        legenda.textContent = d.alt;
    }

    function abrir(indice) {
        focoAnterior = document.activeElement;
        mostrar(indice);
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        fechar.focus();
    }

    function esconder() {
        lightbox.hidden = true;
        document.body.style.overflow = '';
        imagem.src = '';
        if (focoAnterior && focoAnterior.focus) focoAnterior.focus();
    }

    itens.forEach(function (figura, i) {
        figura.addEventListener('click', function () { abrir(i); });

        // O <figure> é role="button": precisa responder a Enter e Espaço.
        figura.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                abrir(i);
            }
        });
    });

    fechar.addEventListener('click', esconder);
    anterior.addEventListener('click', function () { mostrar(atual - 1); });
    proxima.addEventListener('click', function () { mostrar(atual + 1); });

    // Clique fora da imagem também fecha
    lightbox.addEventListener('click', function (ev) {
        if (ev.target === lightbox) esconder();
    });

    document.addEventListener('keydown', function (ev) {
        if (lightbox.hidden) return;
        if (ev.key === 'Escape') esconder();
        if (ev.key === 'ArrowLeft') mostrar(atual - 1);
        if (ev.key === 'ArrowRight') mostrar(atual + 1);
    });
})();

/* ------------------------------------------------------------- NAVEGAÇÃO */
// Marca no menu a seção que está na tela, para o visitante saber onde está.
(function () {
    const alvos = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('#menu a[href^="#"]');
    if (!alvos.length || !('IntersectionObserver' in window)) return;

    const mapa = {};
    links.forEach(function (a) { mapa[a.getAttribute('href')] = a; });

    const observer = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (!entrada.isIntersecting) return;
            links.forEach(function (a) { a.removeAttribute('aria-current'); });
            const alvo = mapa['#' + entrada.target.id];
            if (alvo) alvo.setAttribute('aria-current', 'true');
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    alvos.forEach(function (s) { observer.observe(s); });
})();

/* ------------------------------------------------------------- CANAIS */
function linkInstagram() {
    return (CONFIG.instagram || '').trim();
}

function linkWhats(numero, texto) {
    const digitos = String(numero || '').replace(/\D/g, '');
    if (!digitos) return '';
    return 'https://wa.me/' + digitos +
        (texto ? '?text=' + encodeURIComponent(texto) : '');
}

// Se o cliente já cadastrou um WhatsApp, o canal aparece sozinho.
(function () {
    const bloco = document.getElementById('canal-whatsapp');
    const link = document.getElementById('link-whatsapp');
    if (bloco && link && CONFIG.whatsapp) {
        link.href = linkWhats(CONFIG.whatsapp, 'Olá! Vim pelo site.');
        bloco.hidden = false;
    }

    const insta = document.getElementById('link-instagram');
    if (insta && linkInstagram()) insta.href = linkInstagram();
})();

/* ------------------------------------------------------------- FORMULÁRIO */
(function () {
    const form = document.getElementById('form-contato');
    if (!form) return;

    const erro = document.getElementById('form-erro');
    const nome = document.getElementById('nome');
    const tel = document.getElementById('telefone');
    const mail = document.getElementById('email');
    const msg = document.getElementById('mensagem');
    const botao = document.getElementById('btn-enviar');

    function marcar(campo, ruim) {
        campo.classList.toggle('invalido', ruim);
        campo.setAttribute('aria-invalid', ruim ? 'true' : 'false');
    }

    function avisar(texto, campo) {
        erro.className = 'form-erro';
        erro.textContent = texto;
        erro.hidden = false;
        if (campo) {
            campo.focus();
            campo.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }

    function limparAviso() {
        erro.hidden = true;
        erro.textContent = '';
        [nome, tel, mail, msg].forEach(function (c) { marcar(c, false); });
    }

    form.addEventListener('input', function (ev) {
        if (ev.target.classList) marcar(ev.target, false);
        if (!erro.hidden && erro.className === 'form-erro') erro.hidden = true;
    });

    function validar() {
        limparAviso();

        const n = nome.value.trim();
        if (n.length < 2) {
            marcar(nome, true);
            avisar('Por favor, escreva seu nome para sabermos com quem falamos.', nome);
            return false;
        }

        const m = msg.value.trim();
        if (m.length < 15) {
            marcar(msg, true);
            avisar('Conte um pouco mais (pelo menos umas duas linhas) para podermos ajudar melhor.', msg);
            return false;
        }

        const e = mail.value.trim();
        if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) {
            marcar(mail, true);
            avisar('O e-mail parece incompleto. Confira, ou deixe em branco.', mail);
            return false;
        }

        return true;
    }

    function montarMensagem() {
        const linhas = [
            'Olá! Vim pelo site da Elaine & Sandra.',
            '',
            '*Nome:* ' + nome.value.trim()
        ];

        if (tel.value.trim()) linhas.push('*Telefone:* ' + tel.value.trim());
        if (mail.value.trim()) linhas.push('*E-mail:* ' + mail.value.trim());

        linhas.push('', '*Mensagem:*', msg.value.trim());

        return linhas.join('\n');
    }

    /* --- entrega a mensagem pelo canal disponível ------------------ */
    async function entregar(texto) {

        // 1) WhatsApp, quando houver número cadastrado
        const zap = linkWhats(CONFIG.whatsapp, texto);
        if (zap) {
            window.open(zap, '_blank', 'noopener');
            return 'Abrimos o WhatsApp com sua mensagem pronta. Só tocar em enviar.';
        }

        // 2) Sem WhatsApp: copia para a área de transferência
        let copiado = false;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(texto);
                copiado = true;
            }
        } catch (e) { /* navegador antigo — cai no recurso abaixo */ }

        if (!copiado) {
            const caixa = document.createElement('textarea');
            caixa.value = texto;
            caixa.setAttribute('readonly', '');
            caixa.style.position = 'fixed';
            caixa.style.opacity = '0';
            document.body.appendChild(caixa);
            caixa.select();
            try { copiado = document.execCommand('copy'); } catch (e) { copiado = false; }
            document.body.removeChild(caixa);
        }

        if (copiado && linkInstagram()) {
            window.open(linkInstagram(), '_blank', 'noopener');
            return 'Sua mensagem foi copiada e abrimos o Instagram. Cole-a na conversa e pronto.';
        }

        if (copiado) {
            return 'Sua mensagem foi copiada. Basta colar onde preferir.';
        }

        return 'Não foi possível copiar automaticamente. Seu texto está abaixo — copie e envie.';
    }

    form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!validar()) return;

        const texto = montarMensagem();
        const antes = botao.textContent;
        botao.disabled = true;
        botao.textContent = 'Preparando…';

        entregar(texto).then(function (aviso) {
            botao.disabled = false;
            botao.textContent = antes;

            erro.className = 'form-erro form-ok';
            erro.textContent = aviso;
            erro.hidden = false;

            form.reset();

            window.setTimeout(function () {
                erro.hidden = true;
                erro.className = 'form-erro';
            }, 14000);
        });
    });
})();

/* ------------------------------------------------------------- RODAPÉ */
(function () {
    const ano = document.getElementById('ano');
    if (ano) ano.textContent = new Date().getFullYear();
})();
