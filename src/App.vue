<script setup>
import { ref, provide } from "vue";
import { UI_LOCALE_KEY } from "@ciencias/ui";
import Listagem from "./Listagem.vue";
import Detalhe from "./Detalhe.vue";

// O idioma vive no topo, uma vez. Sem isto os componentes ficam em
// português, mesmo com o botão PT/EN a mudar no cabeçalho.
const lang = ref("PT");
provide(UI_LOCALE_KEY, lang);

// Sem router: o Inertia trocaria a página por nós, aqui basta uma variável.
const pagina = ref("listagem");
const escolhida = ref(null);

function abrir(publicacao) {
  escolhida.value = publicacao;
  pagina.value = "detalhe";
  window.scrollTo({ top: 0 });
}
</script>

<template>
  <Listagem
    v-if="pagina === 'listagem'"
    v-model:lang="lang"
    @abrir="abrir"
  />
  <Detalhe
    v-else
    v-model:lang="lang"
    :publicacao="escolhida"
    @voltar="pagina = 'listagem'"
  />
</template>
