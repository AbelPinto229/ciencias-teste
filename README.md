# O Biblius, construído com a biblioteca de componentes

**Isto é o Biblius** — a listagem de publicações e a página de detalhe —
**reconstruído inteiramente com os componentes da
[@ciencias/ui](https://github.com/AbelPinto229/ciencias-ui)**.

Não há aqui um único componente de interface escrito à mão. **Doze vêm da
biblioteca**: o cabeçalho, o rodapé, a barra de pesquisa, a pesquisa avançada, o
botão e a gaveta de filtros, a ordenação, o número de registos por página, a
paginação, a barra de seleção, as etiquetas de estado, o índice lateral e os
cartões da página de detalhe.

Serve dois propósitos:

1. **Mostrar como se usa a biblioteca** — código de uma aplicação a sério, não um
   demo de componentes isolados. Vê-se como as peças encaixam numa página
   inteira. (Para os componentes um a um, com interruptores para experimentar:
   [ciencias-ui.vercel.app](https://ciencias-ui.vercel.app).)
2. **Provar que a biblioteca funciona de fora** — esta aplicação foi criada de
   raiz com `npm create vite`, instalou a biblioteca do GitHub e não copiou
   código nenhum de lado nenhum.

## Correr

```bash
npm install     # precisa de acesso ao repositório privado ciencias-ui
npm run dev     # http://localhost:5173
```

Se o `npm install` falhar no `@ciencias/ui`, é falta de acesso ao repositório —
ver a secção *Dar acesso ao repositório* no README da biblioteca.

## O que há para ver

| Ficheiro | O que mostra |
| --- | --- |
| `src/Listagem.vue` | A página principal. É o ficheiro a ler primeiro |
| `src/Detalhe.vue` | Página de detalhe com índice lateral que acompanha o scroll |
| `src/App.vue` | O idioma partilhado, e a troca de página |
| `src/dados.js` | Dados falsos — o que viria do Laravel |
| `src/style.css` | As três linhas de CSS que ligam o Tailwind à biblioteca |

## Coisas que valem a pena reparar

**O idioma** (`src/App.vue`). Uma linha, no componente mais acima:

```js
provide(UI_LOCALE_KEY, lang);
```

Sem ela os componentes ficam em português mesmo com o seletor PT/EN a mudar.
Carrega no PT/EN e repara que "Ordenar por:", "Filtros", "Anterior/Próximo" e
"Voltar aos resultados" mudam — isso vem todo da biblioteca.

**Os filtros** (`src/Listagem.vue`). São duas peças ligadas por uma variável:

```js
const filtrosAbertos = ref(false);
```

O `CFilterToggle` escreve nela, o `CFilterPanel` lê-a. Mais nada.

**A paginação aparece duas vezes**, em cima e em baixo, com o mesmo estado. E a
caixa de "ir para a página" só aparece quando há mais do que uma página — põe o
"Publicações:" em 5 para a ver.

**O que a biblioteca não faz.** Os cartões de publicação são HTML desta
aplicação, não um componente. Cartões de domínio ficam em cada projeto de
propósito: existem numa só aplicação e generalizá-los produz componentes com
props a mais que ninguém consegue usar.

## Notas

- **Não há router.** Numa aplicação real o Inertia trocaria a página; aqui uma
  variável no `App.vue` chega, e mantém o exemplo focado na biblioteca.
- **Não há backend.** Os dados estão em `src/dados.js`. O `CPagination` encaixa
  no formato do `->paginate()` do Laravel sem camada de adaptação.
- As fontes em `public/fonts/` são exigidas pelo tema da biblioteca.
