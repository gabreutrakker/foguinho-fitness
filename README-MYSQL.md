# Foguinho Fitness - Configuração MySQL

## Pré-requisitos

1. **MySQL instalado** (versão 5.7 ou superior)
2. **Node.js** (versão 18 ou superior)

## Configuração do Banco de Dados

### 1. Criar o banco de dados

Abra o MySQL e execute:

\`\`\`sql
CREATE DATABASE foguinho_fitness;
\`\`\`

### 2. Executar o script de criação de tabelas

\`\`\`bash
mysql -u root -p foguinho_fitness < scripts/01-create-tables-mysql.sql
\`\`\`

Ou copie e cole o conteúdo do arquivo `scripts/01-create-tables-mysql.sql` no MySQL Workbench ou outro cliente MySQL.

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

\`\`\`env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=sua_senha_aqui
MYSQL_DATABASE=foguinho_fitness
\`\`\`

## Instalação e Execução

\`\`\`bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
\`\`\`

Acesse `http://localhost:3000`

## Estrutura do Banco de Dados

- **usuarios** - Dados de login e perfil
- **metas** - Metas/hábitos criados pelos usuários
- **progresso** - Progresso diário de cada meta
- **pet** - Pet virtual de cada usuário
- **amigos** - Sistema de amizades
- **conquistas** - Badges e conquistas desbloqueadas

## Funcionalidades

- Sistema de autenticação com hash de senha (bcrypt)
- CRUD completo de metas
- Rastreamento de progresso diário
- Pet virtual que evolui com XP
- Sistema de amigos
- Conquistas automáticas
