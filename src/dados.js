// O que viria do Laravel. Aqui é estático, para a prova ser só da biblioteca.
export const publicacoes = [
  {
    id: 1,
    titulo: "Redes Neuronais Aplicadas à Genómica",
    autores: "Inês Santos Reis, Alexandre Nunes Marques",
    ano: 2026,
    tipo: "Artigo",
    estado: "Publicado",
    doi: "10.1005/biblius.5",
  },
  {
    id: 2,
    titulo: "Modelação de Sistemas Costeiros no Atlântico Norte",
    autores: "Carla Pereira Cabral",
    ano: 2025,
    tipo: "Tese",
    estado: "Publicado",
    doi: "10.1005/biblius.6",
  },
  {
    id: 3,
    titulo: "Métodos Estatísticos para Dados Ambientais",
    autores: "Miguel Ferreira Antunes, Inês Santos Reis",
    ano: 2025,
    tipo: "Livro",
    estado: "Em revisão",
    doi: "10.1005/biblius.7",
  },
  {
    id: 4,
    titulo: "Biodiversidade Urbana em Lisboa: um Estudo Longitudinal",
    autores: "Rita Lopes Craveiro",
    ano: 2024,
    tipo: "Artigo",
    estado: "Publicado",
    doi: "10.1005/biblius.8",
  },
  {
    id: 5,
    titulo: "Algoritmos de Compressão para Imagem Médica",
    autores: "João Nunes Batalha, Carla Pereira Cabral",
    ano: 2024,
    tipo: "Artigo",
    estado: "Retirado",
    doi: "10.1005/biblius.9",
  },
  {
    id: 6,
    titulo: "Química Verde: Solventes Alternativos",
    autores: "Alexandre Nunes Marques",
    ano: 2023,
    tipo: "Tese",
    estado: "Publicado",
    doi: "10.1005/biblius.10",
  },
];

export const tipos = ["Artigo", "Tese", "Livro"];
export const estados = ["Publicado", "Em revisão", "Retirado"];

export const camposPesquisa = [
  { value: "autor", label: "Autor" },
  { value: "titulo", label: "Título" },
  { value: "doi", label: "DOI" },
  { value: "ano", label: "Ano", type: "date" },
];

export const variantePorEstado = {
  Publicado: "success",
  "Em revisão": "warning",
  Retirado: "danger",
};
