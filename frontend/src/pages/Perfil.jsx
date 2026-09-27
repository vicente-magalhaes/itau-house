import React from 'react';
import { Button } from '../ds.js';
import { Foto, BotaoSec, Vazio } from '../components/comuns.jsx';
import { PostCard } from '../components/Post.jsx';
import { InstalarNoAgente } from '../components/InstalarNoAgente.jsx';
import { irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { detalharAtivo, listarAtivos, useDaApi } from '../api.js';
import { ativoDetalheDaApi } from '../data/daApi.js';
import { ativos, pessoas, visivelPara } from '../data/catalogo.js';

// Perfil de impacto: o que a pessoa publicou, quanto foi reaproveitado e por quem foi adaptado.
export function Perfil({ id }) {
  const { pessoa: eu, usuarioId, usuarios, carregandoUsuarios, sair } = useSessao();
  const [instalando, setInstalando] = React.useState(false);
  const fecharInstalar = React.useCallback(() => setInstalando(false), []);
  const pessoa = id ? (usuarios ? usuarios.find((p) => p.id === id) : pessoas[id]) : eu;
  const { dados: meus, origem, erro, carregando } = useDaApi(
    `perfil:${usuarioId}:${id || usuarioId}`,
    () => listarAtivos(usuarioId).then((lista) => Promise.all(
      lista.filter((a) => a.autor.id === (id || usuarioId))
        .map((a) => detalharAtivo(usuarioId, a.id).then(ativoDetalheDaApi)),
    )),
    () => ativos.filter((a) => a.autor.id === (id || eu.id) && visivelPara(a, eu)),
  );

  if (id && carregandoUsuarios) return <Vazio icone="loader" titulo="Carregando o perfil" />;
  if (!pessoa) {
    return <Vazio icone="user-x" titulo="Não encontramos esta pessoa" acao={<Button size="sm" onClick={() => irPara('/')}>Voltar ao início</Button>} />;
  }

  const papeisAlcancados = new Set();
  if (origem === 'ficticio') (meus || []).forEach((a) => a.papeis.forEach((n, i) => n > 0 && papeisAlcancados.add(i)));
  const adaptaram = (meus || []).flatMap((a) => a.deriv);
  const numeros = [
    { valor: (meus || []).reduce((t, a) => t + (origem === 'api' ? a.instalacoes : a.reusos), 0), rotulo: 'reaproveitamentos' },
    ...(origem === 'ficticio' ? [{ valor: papeisAlcancados.size, rotulo: 'papéis alcançados' }] : []),
    { valor: (meus || []).reduce((t, a) => t + (origem === 'api' ? a.derivacoes : a.adapt), 0), rotulo: 'adaptações' },
  ];
  const souEu = pessoa.id === eu.id;

  return (
    <div className="stack stack-6">
      <section className="perfil-topo">
        <Foto pessoa={pessoa} tamanho={128} />
        <div className="stack stack-2" style={{ flex: '1 1 280px', alignItems: 'flex-start' }}>
          <span className="selo" style={{ background: 'var(--ih-bg)', color: 'var(--ih-ink)', cursor: 'default' }}>
            {pessoa.papel}
          </span>
          <h1 className="titulo-pagina">{pessoa.nome}</h1>
          <span className="texto">
            {pessoa.cargo} · {pessoa.squad}
          </span>
          {souEu && (
            <div className="row wrap row-2">
              {/* RF-01: o passo a passo para instalar o Itaú House no agente da pessoa. */}
              <Button size="sm" iconLeft="plug" onClick={() => setInstalando(true)}>
                Instale no seu agente
              </Button>
              <BotaoSec
                icone="log-out"
                onClick={() => {
                  sair();
                  irPara('/entrar');
                }}
              >
                Sair
              </BotaoSec>
            </div>
          )}
        </div>
        {!carregando && !erro && <div className="row wrap row-2">
          {numeros.map((n) => (
            <div key={n.rotulo} className="numero">
              <span className="numero-valor">{n.valor}</span>
              <span className="numero-rotulo">{n.rotulo}</span>
            </div>
          ))}
        </div>}
      </section>

      <div className="colunas">
        <div className="coluna-principal" style={{ flexBasis: 520, gap: 'var(--space-4)' }}>
          <h2 className="titulo-secao">Publicado por {pessoa.primeiro}</h2>
          {carregando ? (
            <Vazio icone="loader" titulo="Carregando os ativos" />
          ) : erro ? (
            <Vazio icone="circle-alert" titulo={erro.message} />
          ) : !meus?.length ? (
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
          {!carregando && !erro && adaptaram.length === 0 && <p className="texto">Ninguém adaptou ainda.</p>}
          {adaptaram.map((d, i) => {
            const conteudo = <>
              <Foto pessoa={d.pessoa} tamanho={48} />
              <span className="stack stack-1" style={{ minWidth: 0 }}>
                <span className="nome">
                  {d.pessoa.nome} {d.pessoa.papel && <span className="meta">· {d.pessoa.papel}</span>}
                </span>
                <span className="meta">{d.texto}</span>
              </span>
            </>;
            return d.pessoa.id ? (
              <button key={i} type="button" className="linha-pessoa" onClick={() => irPara('/perfil/' + d.pessoa.id)}>{conteudo}</button>
            ) : (
              <div key={i} className="linha-pessoa">{conteudo}</div>
            );
          })}
        </aside>
      </div>

      {instalando && <InstalarNoAgente pessoa={pessoa} usuarioId={usuarioId} onClose={fecharInstalar} />}
    </div>
  );
}
