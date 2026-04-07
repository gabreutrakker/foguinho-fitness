-- Dados de exemplo para demonstração
-- Usuário de teste
INSERT INTO usuarios (nome, email, senha) 
VALUES ('Usuário Demo', 'demo@foguinho.com', '$2a$10$example_hashed_password')
ON CONFLICT (email) DO NOTHING;

-- Metas padrão sugeridas
INSERT INTO metas (usuario_id, titulo, descricao, tipo, meta_diaria, unidade) 
SELECT 
  u.id,
  'Beber Água',
  'Manter-se hidratado durante o dia',
  'agua',
  8,
  'copos'
FROM usuarios u WHERE u.email = 'demo@foguinho.com'
ON CONFLICT DO NOTHING;

INSERT INTO metas (usuario_id, titulo, descricao, tipo, meta_diaria, unidade) 
SELECT 
  u.id,
  'Exercício Físico',
  'Praticar atividade física diariamente',
  'exercicio',
  30,
  'minutos'
FROM usuarios u WHERE u.email = 'demo@foguinho.com'
ON CONFLICT DO NOTHING;

INSERT INTO metas (usuario_id, titulo, descricao, tipo, meta_diaria, unidade) 
SELECT 
  u.id,
  'Estudar',
  'Dedicar tempo aos estudos',
  'estudo',
  60,
  'minutos'
FROM usuarios u WHERE u.email = 'demo@foguinho.com'
ON CONFLICT DO NOTHING;

-- Criar pet para o usuário demo
INSERT INTO pet (usuario_id, nome, nivel, experiencia, energia, felicidade, estagio)
SELECT 
  u.id,
  'Foguinho',
  1,
  0,
  100,
  100,
  'bebe'
FROM usuarios u WHERE u.email = 'demo@foguinho.com'
ON CONFLICT (usuario_id) DO NOTHING;
