# 🚀 GitHub Project Creator CLI

Uma CLI interativa para criar repositórios privados no GitHub com estrutura padrão e proteção de branch, utilizando **Node.js**, **TypeScript**, e a **GitHub API**.

---

## ✨ Funcionalidades

- ✅ Cria um repositório **privado** no GitHub
- 🌱 Cria automaticamente as branches `main` e `dev`
- 🔒 Protege a branch `main` (sem push direto, requer PR com aprovação)
- 🧠 Terminal interativo com `@clack/prompts`
- 👨‍💻 Arquitetura orientada a objetos (classe centralizada na lógica)

---

## 📁 Estrutura do Projeto

```
github-project-cli/
├── src/
│   ├── GitHubProjectCreator.ts   # Classe principal
│   └── cli.ts                    # CLI com prompts e execução
├── dist/                         # Arquivos compilados (pós build)
├── .gitignore
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [@clack/prompts](https://github.com/natemoo-re/clack)
- [@octokit/rest](https://github.com/octokit/rest.js)
- [ts-node](https://typestrong.org/ts-node/)

---

## ▶️ Como Usar

### 1. Clone o projeto

```bash
git clone https://github.com/seu-usuario/github-project-cli.git
cd github-project-cli
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure seu token do GitHub

Você precisa de um **GitHub Personal Access Token** com permissão `repo`:

```bash
export GITHUB_TOKEN=ghp_suaTokenAqui
```

> 💡 Recomenda-se usar um arquivo `.env` com a lib `dotenv` para maior segurança.

### 4. Execute a CLI

```bash
npx ts-node src/cli.ts
```

---

## 💡 Como Compilar e Usar Globalmente

### Compile o TypeScript

```bash
npx tsc
```

### Linke o comando global

No `package.json`, adicione:

```json
"bin": {
  "create-github-project": "dist/cli.js"
}
```

Então rode:

```bash
npm link
```

Agora você pode chamar a CLI diretamente:

```bash
create-github-project
```

---

## 🔐 Proteção da Branch Main

A `main` é protegida com:

- ❌ Push direto bloqueado
- ✅ Pull request obrigatório
- ✅ 1 aprovação obrigatória
- 🔒 Proteção aplicada também para administradores

## 📃 Licença

Este projeto é open-source, sob a licença MIT.

---

Feito com 💻 por Guilherme Barros.
