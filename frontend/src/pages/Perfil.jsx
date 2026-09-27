import React from 'react';
import { Button } from '../ds.js';
import { Foto, BotaoSec, Vazio } from '../components/comuns.jsx';
import { PostCard } from '../components/Post.jsx';
import { irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { ativos, pessoas, visivelPara } from '../data/catalogo.js';

// Perfil de impacto: o que a pessoa publicou, quanto foi reaproveitado e por quem foi adaptado.
export function Perfil({ id }) {
  const { pessoa: eu, sair } = useSessao();
  const pessoa = id ? pessoas[id] : eu;

  if (!pessoa) {
    return <Vazio icone="user-x" titulo="Não encontramos esta pessoa" acao={<Button size="sm" onClick={() => irPara('/')}>Voltar ao início</Button>} />;
  }

  const meus = ativos.filter((a) => a.autor.id === pessoa.id && visivelPara(a, eu));
  const papeisAlcancados = new Set();
  meus.forEach((a) => a.papeis.forEach((n, i) => n > 0 && papeisAlcancados.add(i)));
  const adaptaram = meus.flatMap((a) => a.deriv);
  const numeros = [
    { valor: meus.reduce((t, a) => t + a.reusos, 0), rotulo: 'reaproveitamentos' },
    { valor: papeisAlcancados.size, rotulo: 'papéis alcançados' },
    { valor: meus.reduce((t, a) => t + a.adapt, 0), rotulo: 'adaptações' },
  ];
  const souEu = pessoa.id === eu.id;

  return (
    <div className="stack stack-6">
      <section className="perfil-topo">
        <Foto pessoa={pessoa} tamanho={96} />
        <div className="stack stack-2" style={{ flex: '1 1 280px', alignItems: 'flex-start' }}>
          <span className="selo" style={{ background: 'var(--ih-bg)', color: 'var(--ih-ink)', cursor: 'default' }}>
            {pessoa.papel}
          </span>
          <h1 className="titulo-pagina">{pessoa.nome}</h1>
          <span className="texto">
            {pessoa.cargo} · {pessoa.squad}
          </span>
          {souEu && (
            <BotaoSec
              icone="log-out"
              onClick={() => {
                sair();
                irPara('/entrar');
              }}
            >
              Sair
            </BotaoSec>
          )}
        </div>
        <div className="row wrap row-2">
          {numeros.map((n) => (
            <div key={n.rotulo} className="numero">
              <span className="numero-valor">{n.valor}</span>
              <span className="numero-rotulo">{n.rotulo}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="colunas">
        <div className="coluna-principal" style={{ flexBasis: 520, gap: 'var(--space-4)' }}>
          <h2 className="titulo-secao">Publicado por {pessoa.primeiro}</h2>
          {meus.length === 0 ? (
            <p className="texto">Nada publicado ainda. O primeiro ativo aparece aqui depois da aprovação da coordenação.</p>
          ) : (
            <div className="grade anima-escalonada">
              {meus.map((a) => (
                <PostCard key={a.id} ativo={a} />
              ))}
            </div>
          )}
        </div>

        <aside className="coluna-lateral painel">
          <h2 className="titulo-card">Quem adaptou o trabalho de {pessoa.primeiro}</h2>
          {adaptaram.length === 0 && <p className="texto">Ninguém adaptou ainda.</p>}
          {adaptaram.map((d, i) => (
            <button key={i} type="button" className="linha-pessoa" onClick={() => irPara('/perfil/' + d.pessoa.id)}>
              <Foto pessoa={d.pessoa} tamanho={40} />
              <span className="stack stack-1" style={{ minWidth: 0 }}>
                <span className="nome">
                  {d.pessoa.nome} <span className="meta">· {d.pessoa.papel}</span>
                </span>
                <span className="meta">{d.texto}</span>
              </span>
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
}
