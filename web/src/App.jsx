import React from 'react';
import { SessaoProvider, useSessao } from './sessao.jsx';
import { useRota, casar, irPara } from './router.jsx';
import { AppShell } from './components/AppShell.jsx';
import { Entrar } from './pages/Entrar.jsx';
import { Catalogo } from './pages/Catalogo.jsx';
import { Ativo } from './pages/Ativo.jsx';
import { Publicar } from './pages/Publicar.jsx';
import { Aprovacoes } from './pages/Aprovacoes.jsx';
import { Sugestao } from './pages/Sugestao.jsx';
import { Vazio } from './components/comuns.jsx';
import { Button } from './ds.js';

function Rotas({ rota }) {
  const { ehCoordenador } = useSessao();

  const ativo = casar('/ativo/:id', rota);
  if (ativo) return <Ativo id={ativo.id} />;
  if (rota === '/') return <Catalogo />;
  if (rota === '/publicar') return <Publicar />;
  if (rota === '/sugestao') return <Sugestao />;
  if (rota === '/aprovacoes') {
    if (!ehCoordenador) {
      return (
        <div className="container-narrow page">
          <Vazio
            icone="lock"
            titulo="Esta fila é da coordenação"
            acao={<Button onClick={() => irPara('/')}>Voltar ao catálogo</Button>}
          >
            Troque para o perfil Coordenação no topo da tela para ver os ativos que esperam aprovação.
          </Vazio>
        </div>
      );
    }
    return <Aprovacoes />;
  }

  return (
    <div className="container-narrow page">
      <Vazio
        icone="compass"
        titulo="Não encontramos esta página"
        acao={<Button onClick={() => irPara('/')}>Ir para o catálogo</Button>}
      >
        O endereço {rota} não existe no Itaú House.
      </Vazio>
    </div>
  );
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
