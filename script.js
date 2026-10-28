/* ============================================================
   Elaine & Sandra — Neuropsicopedagogia Clínica

    Menu móvel, galeria com lightbox, preparação de contato com
    envio manual pelo canal disponível e cabeçalho fixo.
   ============================================================ */

'use strict';
document.documentElement.classList.add('js');

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

function definirMenu(aberto) {
    nav.classList.toggle('active', aberto);
    btnMobile.setAttribute('aria-expanded', String(aberto));
    btnMobile.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

if (btnMobile && nav) {
    btnMobile.addEventListener('click', function () {
        definirMenu(!nav.classList.contains('active'));
    });

    // Fecha o menu ao escolher uma seção
    document.querySelectorAll('#menu a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (nav.classList.contains('active')) {
                definirMenu(false);
                const destino = document.querySelector(link.getAttribute('href'));
                if (destino) {
                    destino.setAttribute('tabindex', '-1');
                    destino.focus({ preventScroll: true });
                }
            }
        });
    });

    // Fecha ao pressionar Esc, para quem navega por teclado
    document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' && nav.classList.contains('active')) {
            definirMenu(false);
            btnMobile.focus();
        }
    });

    // Fecha se a janela voltar para o formato de computador
    window.addEventListener('resize', function () {
        if (window.innerWidth > 860 && nav.classList.contains('active')) {
            definirMenu(false);
        }
    });
    document.addEventListener('click', function (ev) {
        if (!nav.contains(ev.target)) definirMenu(false);
    });
    nav.addEventListener('focusout', function () {
        requestAnimationFrame(function () {
            if (!nav.contains(document.activeElement)) definirMenu(false);
        });
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
    let overflowAnterior = '';
    const fundo = Array.from(document.body.children).filter(function (el) {
        return el !== lightbox && !['SCRIPT', 'SVG'].includes(el.tagName);
    });
    let estadosFundo = [];

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
        legenda.textContent = d.alt + ' · ' + (atual + 1) + ' de ' + itens.length;
    }

    function abrir(indice) {
        focoAnterior = document.activeElement;
        mostrar(indice);
        lightbox.hidden = false;
        overflowAnterior = document.body.style.overflow;
        estadosFundo = fundo.map(function (el) { return el.inert; });
        fundo.forEach(function (el) { el.inert = true; });
        document.body.style.overflow = 'hidden';
        fechar.focus();
    }

    function esconder() {
        lightbox.hidden = true;
        document.body.style.overflow = overflowAnterior;
        fundo.forEach(function (el, i) { el.inert = estadosFundo[i]; });
        imagem.removeAttribute('src');
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
        if (ev.key === 'Tab') {
            const botoes = [fechar, anterior, proxima];
            const i = botoes.indexOf(document.activeElement);
            if (ev.shiftKey && i <= 0) { ev.preventDefault(); proxima.focus(); }
            else if (!ev.shiftKey && (i === botoes.length - 1 || i < 0)) { ev.preventDefault(); fechar.focus(); }
        }
        if (['Escape', 'ArrowLeft', 'ArrowRight'].includes(ev.key)) ev.preventDefault();
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
    const pronta = document.getElementById('mensagem-pronta');
    const textoPronto = document.getElementById('texto-pronto');
    const copiar = document.getElementById('copiar-mensagem');
    const canal = document.getElementById('enviar-canal');
    const status = document.getElementById('envio-status');

    function marcar(campo, ruim) {
        campo.classList.toggle('invalido', ruim);
        campo.setAttribute('aria-invalid', ruim ? 'true' : 'false');
        if (ruim) campo.setAttribute('aria-describedby', 'form-erro');
        else campo.removeAttribute('aria-describedby');
    }

    function avisar(texto, campo) {
        erro.className = 'form-erro';
        erro.textContent = texto;
        erro.hidden = false;
        if (campo) {
            campo.focus();
        }
    }

    function limparAviso() {
        erro.hidden = true;
        erro.textContent = '';
        [nome, tel, mail, msg].forEach(function (c) { marcar(c, false); });
    }

    form.addEventListener('input', function (ev) {
        if (![nome, tel, mail, msg].includes(ev.target)) return;
        if (ev.target.classList) marcar(ev.target, false);
        if (!erro.hidden && erro.className === 'form-erro') erro.hidden = true;
        pronta.hidden = true;
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
            avisar('Escreva uma mensagem com pelo menos 15 caracteres, sem informações de saúde detalhadas.', msg);
            return false;
        }

        const e = mail.value.trim();
        const telefone = tel.value.replace(/\D/g, '');
        if (tel.value.trim() && (telefone.length < 10 || telefone.length > 15)) {
            marcar(tel, true);
            avisar('Confira o telefone, incluindo o DDD, ou deixe esse campo em branco.', tel);
            return false;
        }
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

    // O texto sempre fica visível. Nenhuma ação confirma envio ou apaga campos.
    copiar.addEventListener('click', async function () {
        try {
            await navigator.clipboard.writeText(textoPronto.value);
            status.textContent = 'Texto copiado. Abra o canal, cole na conversa e confirme o envio por lá. Nada foi enviado pelo site.';
        } catch (e) {
            textoPronto.focus();
            textoPronto.select();
            status.textContent = 'A cópia automática não está disponível. O texto foi selecionado: copie manualmente e cole no canal de contato.';
        }
    });

    form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!validar()) return;

        textoPronto.value = montarMensagem();
        const zap = linkWhats(CONFIG.whatsapp, textoPronto.value);
        canal.href = zap || (CONFIG.email ? 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Contato pelo site') + '&body=' + encodeURIComponent(textoPronto.value) : linkInstagram());
        canal.textContent = zap ? 'Abrir WhatsApp ↗' : CONFIG.email ? 'Abrir e-mail ↗' : 'Abrir Instagram ↗';
        status.textContent = zap || CONFIG.email ? 'Nada foi enviado. Abra o canal e confirme o envio no aplicativo.' : 'Nada foi enviado. Copie o texto e cole na conversa do Instagram.';
        pronta.hidden = false;
        textoPronto.focus();
    });
})();

/* ------------------------------------------------------------- RODAPÉ */
(function () {
    const ano = document.getElementById('ano');
    if (ano) ano.textContent = new Date().getFullYear();
})();
