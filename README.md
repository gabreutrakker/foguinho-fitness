# Foguinho Fitness 🔥

Aplicativo gamificado de rastreamento de hábitos com pet virtual que evolui conforme você completa suas metas diárias!

## 🚀 Como Usar

### Opção 1: Abrir Diretamente no Navegador (Mais Fácil)

1. Baixe todos os arquivos
2. Mantenha a estrutura de pastas:
   \`\`\`
   foguinho-fitness/
   ├── index.html
   ├── register.html
   ├── home.html
   ├── goals.html
   ├── friends.html
   ├── profile.html
   ├── css/
   │   └── styles.css
   ├── js/
   │   ├── auth.js
   │   ├── login.js
   │   ├── register.js
   │   ├── pet.js
   │   ├── progress.js
   │   ├── home.js
   │   ├── goals.js
   │   ├── friends.js
   │   └── profile.js
   └── scripts/
       ├── 01-create-tables.sql
       └── 02-seed-data.sql
   \`\`\`
3. Abra o arquivo `index.html` no seu navegador
4. Pronto! O app está funcionando com localStorage

### Opção 2: Usar com Visual Studio Code

1. Abra o Visual Studio Code
2. Vá em File > Open Folder e selecione a pasta do projeto
3. Instale a extensão "Live Server" (busque por "Live Server" na aba de extensões)
4. Clique com botão direito no arquivo `index.html`
5. Selecione "Open with Live Server"
6. O navegador abrirá automaticamente

### Opção 3: Usar com MySQL (Avançado)

Os scripts SQL estão na pasta `scripts/` para quando você quiser conectar a um banco de dados real:

1. Configure um servidor MySQL
2. Execute os scripts na ordem:
   - `01-create-tables.sql` (cria as tabelas)
   - `02-seed-data.sql` (dados iniciais)
3. Modifique os arquivos JS para conectar ao banco via API

## 📦 Como Fazer Push para GitHub

### Primeira vez:

1. Crie um repositório no GitHub (https://github.com/new)
2. Abra o terminal na pasta do projeto
3. Execute os comandos:

\`\`\`bash
git init
git add .
git commit -m "Initial commit - Foguinho Fitness"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/foguinho-fitness.git
git push -u origin main
\`\`\`

### Atualizações futuras:

\`\`\`bash
git add .
git commit -m "Descrição das mudanças"
git push
\`\`\`

## 🎮 Funcionalidades

- ✅ Sistema de login e cadastro
- ✅ Pet virtual que evolui com seu progresso
- ✅ CRUD completo de metas diárias
- ✅ Rastreamento de progresso com porcentagem
- ✅ Sistema de amigos e desafios
- ✅ Perfil com estatísticas e conquistas
- ✅ Design responsivo e colorido
- ✅ Animações suaves

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla)
- LocalStorage (para persistência de dados)
- MySQL (scripts incluídos para uso futuro)

## 📱 Compatibilidade

Funciona em todos os navegadores modernos:
- Chrome
- Firefox
- Safari
- Edge

## 🎨 Personalização

Você pode personalizar as cores editando as variáveis CSS no arquivo `css/styles.css`:

\`\`\`css
:root {
    --primary: #ff6b35;
    --secondary: #f7931e;
    --accent: #ff006e;
    /* ... */
}
\`\`\`

## 📝 Licença

Projeto livre para uso pessoal e educacional.
