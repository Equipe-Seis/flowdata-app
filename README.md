# 🌐 Projeto Frontend com Nuxt 3 e Vuetify

Projeto frontend utilizando **Nuxt 3**, com:

- ⚙️ Frontend em Vue 3 (Composition API)
- 🎨 UI com Vuetify 3
- 📦 Gerenciador de pacotes: `npm`

---

## 🚀 Tecnologias utilizadas

- [Nuxt 3](https://nuxt.com)
- [Vuetify 3](https://next.vuetifyjs.com/)
- [Vercel (Deploy)](https://vercel.com)

---

## 📁 Estrutura do projeto

```bash
.
├── app.vue               # Componente raiz
├── pages/                # Rotas da aplicação (SSR/SPA)
├── composables/          # Funções reutilizáveis (useXYZ)
├── plugins/              # Plugins Nuxt (ex: Vuetify)
├── nuxt.config.ts        # Configuração principal do Nuxt
├── README.md             # Documentação do projeto
```

## 📁 Como rodar o projeto localmente

```bash
1. Clone o repositório
git clone https://github.com/sua-organizacao/nome-do-repositorio.git
cd nome-do-repositorio

2. Instale as dependências
npm install

3. Rode o projeto em modo desenvolvimento
npm run dev

http://localhost:3000
```

## 🐳 Rodando em docker
```bash
docker compose up -d --build
```

## 📦 Integrações externas
- API própria (separada). Configure `API_BASE_URL` no ambiente para apontar para a API.
- ViaCEP, ReceitaWS e IBGE são chamadas diretamente nos formulários quando aplicável.
