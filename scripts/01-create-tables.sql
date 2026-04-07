-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de metas/hábitos
CREATE TABLE IF NOT EXISTS metas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL, -- 'agua', 'exercicio', 'estudo', 'sono', 'outro'
  meta_diaria INTEGER NOT NULL, -- quantidade diária (ex: 8 copos, 30 minutos)
  unidade VARCHAR(50) NOT NULL, -- 'copos', 'minutos', 'páginas', etc
  ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de progresso diário
CREATE TABLE IF NOT EXISTS progresso (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  meta_id INTEGER NOT NULL REFERENCES metas(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  quantidade_completada INTEGER NOT NULL DEFAULT 0,
  completado BOOLEAN DEFAULT false,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, meta_id, data)
);

-- Tabela do pet virtual
CREATE TABLE IF NOT EXISTS pet (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(100) DEFAULT 'Foguinho',
  nivel INTEGER DEFAULT 1,
  experiencia INTEGER DEFAULT 0,
  energia INTEGER DEFAULT 100,
  felicidade INTEGER DEFAULT 100,
  estagio VARCHAR(50) DEFAULT 'bebe', -- 'bebe', 'crianca', 'adolescente', 'adulto', 'lendario'
  ultima_alimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de amigos
CREATE TABLE IF NOT EXISTS amigos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  amigo_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pendente', -- 'pendente', 'aceito', 'recusado'
  data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, amigo_id),
  CHECK (usuario_id != amigo_id)
);

-- Tabela de conquistas
CREATE TABLE IF NOT EXISTS conquistas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(100) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  icone VARCHAR(50),
  data_conquista TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_metas_usuario ON metas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_progresso_usuario_data ON progresso(usuario_id, data);
CREATE INDEX IF NOT EXISTS idx_progresso_meta ON progresso(meta_id);
CREATE INDEX IF NOT EXISTS idx_amigos_usuario ON amigos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_conquistas_usuario ON conquistas(usuario_id);
