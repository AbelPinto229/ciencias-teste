<script setup>
import { ref, reactive, computed } from "vue";
import {
  CAppHeader,
  CAppFooter,
  CSearchBar,
  CAdvancedSearch,
  CFilterToggle,
  CFilterPanel,
  CFilterGroup,
  CSortControl,
  CPerPageSelect,
  CPagination,
  CSelectExportToolbar,
  CExportModal,
  CStatusPill,
  CEmptyState,
} from "@ciencias/ui";

import { publicacoes, tipos, estados, camposPesquisa, variantePorEstado } from "./dados.js";

const emit = defineEmits(["abrir"]);

// O idioma é do App.vue, que o partilha com a biblioteca.
const lang = defineModel("lang", { type: String, default: "PT" });
const user = ref(null);

const query = ref("");
const avancada = ref(false);
const criterios = ref([]);

// A variável que liga o botão à gaveta — as duas peças dos filtros.
const filtrosAbertos = ref(false);
const filtros = reactive({ tipos: [], estados: [] });

const sort = ref("ano");
const direction = ref("desc");
const perPage = ref(20);
const pagina = ref(1);

const selectMode = ref(false);
const selecionados = ref(new Set());
const exportarAberto = ref(false);

const filtradas = computed(() => {
  const termo = query.value.trim().toLowerCase();

  return publicacoes
    .filter((p) => {
      if (termo && !`${p.titulo} ${p.autores}`.toLowerCase().includes(termo)) return false;
      if (filtros.tipos.length && !filtros.tipos.includes(p.tipo)) return false;
      if (filtros.estados.length && !filtros.estados.includes(p.estado)) return false;
      return true;
    })
    .sort((a, b) => {
      const campo = sort.value;
      const cmp = campo === "ano" ? a.ano - b.ano : String(a[campo]).localeCompare(String(b[campo]));
      return direction.value === "asc" ? cmp : -cmp;
    });
});

const ultimaPagina = computed(() => Math.max(1, Math.ceil(filtradas.value.length / perPage.value)));
const visiveis = computed(() =>
  filtradas.value.slice((pagina.value - 1) * perPage.value, pagina.value * perPage.value)
);

const todosSelecionados = computed(
  () => visiveis.value.length > 0 && visiveis.value.every((p) => selecionados.value.has(p.id))
);

function alternarSelecao(id) {
  const s = new Set(selecionados.value);
  s.has(id) ? s.delete(id) : s.add(id);
  selecionados.value = s;
}

function alternarTodos() {
  selecionados.value = todosSelecionados.value
    ? new Set()
    : new Set(visiveis.value.map((p) => p.id));
}

const escolhidas = computed(() => publicacoes.filter((p) => selecionados.value.has(p.id)));

function apa(p) {
  return `${p.autores} (${p.ano}). ${p.titulo}. https://doi.org/${p.doi}`;
}

function bibtex(p) {
  return [
    `@article{biblius${p.id},`,
    `  title  = {${p.titulo}},`,
    `  author = {${p.autores}},`,
    `  year   = {${p.ano}},`,
    `  doi    = {${p.doi}},`,
    "}",
  ].join("\n");
}

function endnote(p) {
  return [`%0 Journal Article`, `%T ${p.titulo}`, `%A ${p.autores}`, `%D ${p.ano}`, `%R ${p.doi}`].join("\n");
}

function csv(lista) {
  const linhas = [["titulo", "autores", "ano", "tipo", "doi"].join(",")];
  for (const p of lista) {
    linhas.push([p.titulo, p.autores, p.ano, p.tipo, p.doi].map((c) => `"${c}"`).join(","));
  }
  return linhas.join("\n");
}

const GERADORES = {
  CSV: { extensao: "csv", gerar: (lista) => csv(lista) },
  APA: { extensao: "txt", gerar: (lista) => lista.map(apa).join("\n\n") },
  BibTeX: { extensao: "bib", gerar: (lista) => lista.map(bibtex).join("\n\n") },
  EndNote: { extensao: "enw", gerar: (lista) => lista.map(endnote).join("\n\n") },
};

function exportar(formato) {
  const { extensao, gerar } = GERADORES[formato];
  const blob = new Blob([gerar(escolhidas.value)], { type: "text/plain;charset=utf-8" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `publicacoes.${extensao}`;
  link.click();
  URL.revokeObjectURL(url);

  exportarAberto.value = false;
}

function limparFiltros() {
  filtros.tipos = [];
  filtros.estados = [];
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-50">
    <CAppHeader app-name="Biblius" v-model:lang="lang" :user="user" @login="user = { name: 'Abel Pinto' }" @logout="user = null">
      <template #nav>
        <a href="#" class="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600">
          Estatísticas
        </a>
        <a href="#" class="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600">
          Ajuda
        </a>
      </template>
    </CAppHeader>

    <main class="flex flex-1 flex-col">
      <div class="w-full px-4 py-8 sm:px-6 lg:px-10 xl:px-16">
        <!-- a pesquisa fica fora do cabeçalho, por cima do conteúdo -->
        <CSearchBar v-model="query" @search="pagina = 1">
          <template #extra>
            <button
              type="button"
              :aria-expanded="avancada"
              class="flex shrink-0 items-center gap-1 text-sm font-medium text-gray-600 hover:text-brand-600"
              @click="avancada = !avancada"
            >
              Pesquisa Avançada
              <svg
                class="h-3.5 w-3.5 transition-transform"
                :class="avancada ? 'rotate-180' : ''"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </template>
        </CSearchBar>
      </div>

      <CAdvancedSearch
        v-if="avancada"
        v-model="criterios"
        :fields="camposPesquisa"
        @apply="avancada = false"
      />

      <div class="w-full px-4 pb-10 sm:px-6 lg:px-10 xl:px-16">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
          <CFilterPanel
            :open="filtrosAbertos"
            clearable
            @close="filtrosAbertos = false"
            @apply="filtrosAbertos = false; pagina = 1"
            @clear="limparFiltros"
          >
            <CFilterGroup label="Tipo">
              <label v-for="t in tipos" :key="t" class="flex items-center gap-2 py-0.5 text-sm text-gray-700">
                <input v-model="filtros.tipos" type="checkbox" :value="t" class="h-4 w-4 rounded border-gray-300 text-brand-600" />
                {{ t }}
              </label>
            </CFilterGroup>

            <CFilterGroup label="Estado">
              <label v-for="e in estados" :key="e" class="flex items-center gap-2 py-0.5 text-sm text-gray-700">
                <input v-model="filtros.estados" type="checkbox" :value="e" class="h-4 w-4 rounded border-gray-300 text-brand-600" />
                {{ e }}
              </label>
            </CFilterGroup>
          </CFilterPanel>

          <div class="min-w-0 flex-1">
            <CSelectExportToolbar
              v-model:select-mode="selectMode"
              :selected-count="selecionados.size"
              :all-selected="todosSelecionados"
              @toggle-all="alternarTodos"
              @export="exportarAberto = true"
            />

            <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div class="flex items-center gap-2">
                <CFilterToggle v-model="filtrosAbertos" />
                <CSortControl
                  v-model="sort"
                  v-model:direction="direction"
                  :options="[
                    { value: 'ano', label: 'Ano' },
                    { value: 'titulo', label: 'Título' },
                    { value: 'tipo', label: 'Tipo' },
                  ]"
                />
                <CPerPageSelect v-model="perPage" :options="[5, 10, 20]" label="Publicações:" />
              </div>

              <!-- paginação em cima, à direita -->
              <CPagination :current="pagina" :last="ultimaPagina" @change="pagina = $event" />
            </div>

            <CEmptyState v-if="!visiveis.length" title="Não foram encontradas publicações." />

            <div v-else class="space-y-3">
              <article
                v-for="p in visiveis"
                :key="p.id"
                class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-brand-300"
              >
                <input
                  v-if="selectMode"
                  type="checkbox"
                  :checked="selecionados.has(p.id)"
                  class="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-brand-600"
                  @change="alternarSelecao(p.id)"
                />

                <div class="min-w-0 flex-1">
                  <a
                    href="#"
                    class="text-base font-bold text-brand-700 hover:underline"
                    @click.prevent="emit('abrir', p)"
                  >
                    {{ p.titulo }}
                  </a>
                  <p class="mt-1 text-sm text-gray-500">{{ p.autores }}</p>
                  <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span>{{ p.ano }}</span>
                    <span>·</span>
                    <span>{{ p.tipo }}</span>
                    <span>·</span>
                    <span>{{ p.doi }}</span>
                  </div>
                </div>

                <CStatusPill :label="p.estado" :variant="variantePorEstado[p.estado]" />
              </article>
            </div>

            <!-- e outra vez em baixo, alinhada à direita -->
            <div class="mt-6 flex justify-end">
              <CPagination :current="pagina" :last="ultimaPagina" @change="pagina = $event" />
            </div>
          </div>
        </div>
      </div>
    </main>

    <CExportModal
      :open="exportarAberto"
      :count="selecionados.size"
      @close="exportarAberto = false"
      @select="exportar"
    />

    <CAppFooter app-name="Biblius">
      <template #links>
        <a href="#" class="font-medium text-white/80 hover:text-white">FAQ</a>
        <a href="#" class="font-medium text-white/80 hover:text-white">Estatísticas</a>
      </template>
    </CAppFooter>
  </div>
</template>
