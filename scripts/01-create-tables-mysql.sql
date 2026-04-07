-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de metas/hábitos
CREATE TABLE IF NOT EXISTS metas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL,
  meta_diaria INT NOT NULL,
  unidade VARCHAR(50) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de progresso diário
CREATE TABLE IF NOT EXISTS progresso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  meta_id INT NOT NULL,
  data DATE NOT NULL,
  quantidade_completada INT NOT NULL DEFAULT 0,
  completado BOOLEAN DEFAULT false,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_progress (usuario_id, meta_id, data),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (meta_id) REFERENCES metas(id) ON DELETE CASCADE
);

-- Tabela do pet virtual
CREATE TABLE IF NOT EXISTS pet (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT UNIQUE NOT NULL,
  nome VARCHAR(100) DEFAULT 'Foguinho',
  nivel INT DEFAULT 1,
  experiencia INT DEFAULT 0,
  energia INT DEFAULT 100,
  felicidade INT DEFAULT 100,
  estagio VARCHAR(50) DEFAULT 'bebe',
  ultima_alimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de amigos
CREATE TABLE IF NOT EXISTS amigos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  amigo_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente',
  data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_friendship (usuario_id, amigo_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (amigo_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CHECK (usuario_id != amigo_id)
);

-- Tabela de conquistas
CREATE TABLE IF NOT EXISTS conquistas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  icone VARCHAR(50),
  data_conquista TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX idx_metas_usuario ON metas(usuario_id);
CREATE INDEX idx_progresso_usuario_data ON progresso(usuario_id, data);
CREATE INDEX idx_progresso_meta ON progresso(meta_id);
CREATE INDEX idx_amigos_usuario ON amigos(usuario_id);
CREATE INDEX idx_conquistas_usuario ON conquistas(usuario_id);
