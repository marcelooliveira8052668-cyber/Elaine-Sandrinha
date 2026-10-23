# Elaine & Sandra — Neuropsicopedagogia Clínica

Site institucional para as neuropsicopedagogas clínicas **Elaine Romanha Pavechi**
e **Sandra Nobre**, com atendimento presencial em **Osasco / SP**.

Site estático, sem banco de dados e sem servidor: abre em qualquer hospedagem
(GitHub Pages, Hostinger, hospedagem comprada) copiando os arquivos como estão.

---

## O que o site tem

| Seção | Conteúdo |
|---|---|
| Cabeçalho fixo | Logo, navegação com destaque da seção atual e botão **Agendar** |
| Início | Título, resumo, dois botões, diferenciais e foto das duas profissionais |
| Quem somos | Apresentação, diferenciais do atendimento e convite para falar |
| Serviços | 4 áreas de atuação em cartões coloridos |
| Como funciona | As 4 etapas, do primeiro contato até o relatório |
| Avaliação | O serviço principal detalhado em 4 cartões + caixa do **RAN** |
| Nosso trabalho | Galeria de fotos do consultório, com visualizador em tela cheia |
| Conteúdos | Os infográficos já publicados, no mesmo visualizador |
| Dúvidas | 6 perguntas frequentes em acordeão |
| Contato | Formulário, mapa de Osasco e link do Instagram |

## Acessibilidade e detalhes de acabamento

- Pular para o conteúdo, foco visível, `aria-expanded`/`aria-current` corretos
- Menu móvel abre/fecha com clique, toque, **Esc** e fecha ao trocar de largura
- Visualizador com **←**, **→**, **Esc**, clique fora, foco devolvido ao fechar
- `prefers-reduced-motion`, folha de impressão e `lang="pt-BR"`
- Metadados SEO, Open Graph e **JSON-LD** `ProfessionalService` (aparece no Google)

---

## Como rodar

Abra o `index.html` no navegador. Para testar com um endereço local:

```bash
npx serve .
# ou
python -m http.server 8000
```

---

## O que o cliente vai querer mudar (é rápido)

### 1. WhatsApp da clínica — `script.js`, no topo

```js
const CONFIG = {
    whatsapp: '',      // ← número: "5511999999999" (só dígitos, com DDI)
    email:    '',
    instagram: 'https://www.instagram.com/rnconectividade'
};
```

Com `whatsapp` preenchido:

- aparece o cartão **WhatsApp** no painel de contato;
- o formulário passa a abrir a conversa já com a mensagem escrita.

Com `whatsapp` vazio (situação atual): o cartão do WhatsApp fica escondido e o
formulário **copia a mensagem** e abre o **Instagram** da clínica, que já é o
canal real de contato.

### 2. Endereço exato — `index.html`, seção `#contato`

Hoje o mapa está no ponto central de **Osasco**, com o texto
"Ponto aproximado da cidade". Troque `bbox` e `marker` do `<iframe>` pelas
coordenadas do consultório:

```
marker=-23.5325%2C-46.7917
bbox=-46.8450%2C-23.5620%2C-46.7450%2C-23.5000
```

Ache as coordenadas abrindo o OpenStreetMap com o botão direito no endereço.

### 3. Registros profissionais (CRP, endereço, telefone)

Não havia esses dados disponíveis no material original, então não foram
inventados. Se quiser exibir, estão os lugares certos:

- telefone/e-mail: cartões do painel de contato;
- registro: bloco "Quem somos", na lista de diferenciais.

> **Nada foi inventado**: nomes, textos, serviços, fotos e o Instagram são os do
> material original. As únicas alterações foram de organização e acabamento.

---

## Estrutura

```
index.html      9 seções, JSON-LD, metadados, lightbox
style.css       variáveis de design, grid, responsivo, impressão
script.js       CONFIG, menu, lightbox, formulário, menu de seção
foto.jpg        logo
sandra e elaine.jpg   foto principal (herói)
foto1..foto9.jpg      fotos do consultório e infográficos
```

## Sobre as imagens

As fotos e infográficos são da própria clínica, recebidas no material original,
e são usadas como estão. Não há imagens de terceiros nem bibliotecas de
terceiros: fontes são Google Fonts (Playfair Display e Poppins).
