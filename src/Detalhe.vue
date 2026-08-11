<script setup>
import { ref, computed } from "vue";
import {
  CAppHeader,
  CAppFooter,
  CStickyTocIndex,
  CBackLink,
  CCard,
  CField,
  CStatusPill,
} from "@ciencias/ui";

import { variantePorEstado } from "./dados.js";

const props = defineProps({ publicacao: { type: Object, required: true } });
const emit = defineEmits(["voltar"]);

const lang = defineModel("lang", { type: String, default: "PT" });

// Fora do template: as chavetas do BibTeX baralham o parser do Vue.
const bibtex = computed(() => {
  const p = props.publicacao;
  return [
    `@article{biblius${p.id},`,
    `  title  = {${p.titulo}},`,
    `  author = {${p.autores}},`,
    `  year   = {${p.ano}},`,
    `  doi    = {${p.doi}},`,
    `}`,
  ].join("\n");
});


// Cada id tem de existir num CCard abaixo.
const seccoes = [
  { id: "info", label: "Informação" },
  { id: "contrib", label: "Contribuidores" },
  { id: "refs", label: "Referências" },
];
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-50">
    <CAppHeader app-name="Biblius" v-model:lang="lang" />

    <main class="flex flex-1 flex-col">
      <div class="w-full px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-start">
          <CStickyTocIndex :sections="seccoes" :top-offset="24">
            <template #before>
              <CBackLink href="#" @click.prevent="emit('voltar')" />
            </template>
          </CStickyTocIndex>

          <div class="min-w-0 flex-1 space-y-6 lg:pb-12">
            <CCard id="info" :title="publicacao.titulo">
              <CStatusPill :label="publicacao.estado" :variant="variantePorEstado[publicacao.estado]" />

              <div class="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <CField label="Tipo de documento" :value="publicacao.tipo" />
                <CField label="Ano" :value="String(publicacao.ano)" />
                <CField label="Autores" :value="publicacao.autores" />
                <CField label="Data de embargo" />
              </div>
            </CCard>

            <CCard id="contrib" title="Contribuidores">
              <div class="divide-y divide-gray-100 rounded-lg border border-gray-100">
                <div
                  v-for="nome in publicacao.autores.split(', ')"
                  :key="nome"
                  class="flex items-center justify-between px-4 py-2.5 text-sm"
                >
                  <span class="font-medium text-gray-800">{{ nome }}</span>
                  <span class="text-gray-400">Autor</span>
                </div>
              </div>
            </CCard>

            <CCard id="refs" title="Referências">
              <CField label="DOI">
                <a :href="`https://doi.org/${publicacao.doi}`" class="text-brand-600 hover:underline">
                  {{ publicacao.doi }}
                </a>
              </CField>

              <pre class="mt-4 overflow-x-auto rounded-lg bg-gray-50 p-4 font-mono text-xs text-gray-600">{{ bibtex }}</pre>
            </CCard>
          </div>
        </div>
      </div>
    </main>

    <CAppFooter app-name="Biblius" />
  </div>
</template>
