import React from 'react';
import { SessaoProvider, useSessao } from './sessao.jsx';
import { useRota, casar, irPara } from './router.jsx';
import { AppShell } from './components/AppShell.jsx';
import { Entrar } from './pages/Entrar.jsx';
import { Feed } from './pages/Feed.jsx';
import { Ativo } from './pages/Ativo.jsx';
import { Publicar } from './pages/Publicar.jsx';
import { Aprovacoes } from './pages/Aprovacoes.jsx';
import { Dados } from './pages/Dados.jsx';
import { Pedidos } from './pages/Pedidos.jsx';
import { Perfil } from './pages/Perfil.jsx';
import { Vazio } from './components/comuns.jsx';
import { Button } from './ds.js';

function Rotas({ rota }) {
  const { ehCoordenador } = useSessao();

  if (rota === '/') return <Feed />;
  const ativo = casar('/ativo/:id', rota);
  if (ativo) return <Ativo key={ativo.id} id={ativo.id} />;
  if (rota === '/pedidos') return <Pedidos />;
  if (rota === '/perfil') return <Perfil />;
  const perfil = casar('/perfil/:id', rota);
  if (perfil) return <Perfil key={perfil.id} id={perfil.id} />;
  if (rota === '/publicar') return <Publicar />;

  // Área da coordenação (RF-24): fila e dados só para Cord+.
  if (rota.startsWith('/coord')) {
    if (!ehCoordenador) {
      return <Vazio icone="lock" titulo="Esta área é da coordenação" acao={<Button size="sm" onClick={() => irPara('/')}>Voltar ao início</Button>} />;
    }
    if (rota === '/coord/fila') return <Aprovacoes />;
    if (rota === '/coord/dados') return <Dados />;
    const dados = casar('/coord/dados/:id', rota);
    if (dados) return <Dados id={dados.id} />;
  }

  return <Vazio icone="compass" titulo="Não encontramos esta página" acao={<Button size="sm" onClick={() => irPara('/')}>Ir para o início</Button>} />;
}

function Raiz() {
  const rota = useRota();
  const { entrou } = useSessao();

  if (!entrou || rota === '/entrar') return <Entrar />;

  return (
    <AppShell rota={rota}>
      <Rotas rota={rota} />
    </AppShell>
  );
}

export function App() {
  return (
    <SessaoProvider>
      <Raiz />
    </SessaoProvider>
  );
}
