import React from 'react';
import { Icon, IconButton, Tag } from '../ds.js';
import { SeloSimulado, Vazio } from '../components/comuns.jsx';
import { irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { ativos, acharAtivo, visivelPara, rotuloTipo, iconeTipo, formatarDataCurta } from '../data/catalogo.js';

// Área só da coordenação: os números que saíram do feed e do post (RF-30, RF-22).

function Kpi({ rotulo, valor }) {
  return (
    <div className="caixa stack stack-2">
      <span className="caption">{rotulo}</span>
      <span className="kpi-valor">{valor.toLocaleString('pt-BR')}</span>
    </div>
  );
}

// Barras horizontais de uma série só: um tom, rótulo direto no fim, detalhe no hover e no foco.
function BarrasPorFrente({ linhas }) {
  const [ativa, setAtiva] = React.useState(null);
  const maior = Math.max(...linhas.map((l) => l.valor), 1);
  return (
    <ul className="stack stack-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {linhas.map((l) => {
        const detalhe = `${l.frente}: ${l.valor} instalações em ${l.ativos} ${l.ativos === 1 ? 'ativo' : 'ativos'}`;
        return (
          <li
            key={l.frente}
            tabIndex={0}
            aria-label={detalhe}
            onMouseEnter={() => setAtiva(l.frente)}
            onMouseLeave={() => setAtiva(null)}
            onFocus={() => setAtiva(l.frente)}
            onBlur={() => setAtiva(null)}
            style={{ position: 'relative', display: 'grid', gridTemplateColumns: '160px minmax(0, 1fr)', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-1) 0', borderRadius: 'var(--radius-xs)' }}
          >
            <span className="small">{l.frente}</span>
            <span className="row row-2">
              <span className="barra" style={{ width: `calc(${(l.valor / maior) * 100}% - 40px)`, height: 16 }} />
              <span className="small strong" style={{ fontVariantNumeric: 'tabular-nums' }}>{l.valor}</span>
            </span>
            {ativa === l.frente && (
              <span
                role="tooltip"
                style={{
                  position: 'absolute',
                  left: 172,
                  bottom: '100%',
                  zIndex: 10,
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-inverse)',
                  color: 'var(--text-inverse)',
                  font: 'var(--fw-regular) var(--fs-caption)/1.35 var(--font-text)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                {detalhe}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Detalhe({ ativo, curtidas, instalacoes }) {
  return (
    <div className="stack stack-5" style={{ maxWidth: 960 }}>
      <div className="row row-3">
        <IconButton icon="arrow-left" label="Voltar aos dados" size={36} variant="subtle" onClick={() => irPara('/coord/dados')} />
        <h1 className="titulo-pagina grow">{ativo.nome}</h1>
        <SeloSimulado ajuda="Todos os números desta área são fictícios, criados para a demonstração.">Números fictícios</SeloSimulado>
        <IconButton icon="external-link" label="Abrir o post" size={36} variant="subtle" onClick={() => irPara('/ativo/' + ativo.id)} />
      </div>

      <div className="kpis">
        <Kpi rotulo="Curtidas" valor={curtidas} />
        <Kpi rotulo="Instalações" valor={instalacoes} />
        <Kpi rotulo="Derivações" valor={ativo.derivacoes} />
        <Kpi rotulo="Squads que usaram" valor={ativo.squadsQueReusaram.length} />
      </div>

      <section className="stack stack-3">
        <h2 className="small strong">Squads que usaram</h2>
        {ativo.squadsQueReusaram.length ? (
          <div className="row row-2 wrap">
            {ativo.squadsQueReusaram.map((s) => (
              <Tag key={s} style={{ height: 28 }}>{s}</Tag>
            ))}
          </div>
        ) : (
          <span className="caption">Nenhuma ainda</span>
        )}
      </section>

      <section className="stack stack-3">
        <h2 className="small strong">Histórico</h2>
        <table className="tabela">
          <thead>
            <tr>
              <th>Data</th>
              <th>O que aconteceu</th>
              <th>Quem</th>
            </tr>
          </thead>
          <tbody>
            {ativo.historico.map((h, i) => (
              <tr key={i}>
                <td style={{ whiteSpace: 'nowrap' }}>{formatarDataCurta(h.data)}</td>
                <td>{h.evento}</td>
                <td className="muted">{h.quem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export function Dados({ id }) {
  const { pessoa, curtidasDe, instalacoesDe } = useSessao();
  const visiveis = ativos.filter((a) => visivelPara(a, pessoa));

  if (id) {
    const ativo = acharAtivo(id);
    if (!ativo) return <Vazio titulo="Ativo não encontrado" />;
    return <Detalhe ativo={ativo} curtidas={curtidasDe(ativo)} instalacoes={instalacoesDe(ativo)} />;
  }

  const soma = (f) => visiveis.reduce((t, a) => t + f(a), 0);
  const porFrente = Object.values(
    visiveis.reduce((acc, a) => {
      const l = acc[a.frente] || { frente: a.frente, valor: 0, ativos: 0 };
      l.valor += instalacoesDe(a);
      l.ativos += 1;
      acc[a.frente] = l;
      return acc;
    }, {}),
  ).sort((a, b) => b.valor - a.valor);
  const linhas = visiveis.slice().sort((a, b) => curtidasDe(b) + instalacoesDe(b) - (curtidasDe(a) + instalacoesDe(a)));

  return (
    <div className="stack stack-6" style={{ maxWidth: 960 }}>
      <div className="row spread">
        <h1 className="titulo-pagina">Dados</h1>
        <SeloSimulado ajuda="Todos os números desta área são fictícios, criados para a demonstração.">Números fictícios</SeloSimulado>
      </div>

      <div className="kpis">
        <Kpi rotulo="Ativos publicados" valor={visiveis.length} />
        <Kpi rotulo="Curtidas" valor={soma(curtidasDe)} />
        <Kpi rotulo="Instalações" valor={soma(instalacoesDe)} />
        <Kpi rotulo="Derivações" valor={soma((a) => a.derivacoes)} />
      </div>

      <section className="stack stack-4">
        <h2 className="small strong">Instalações por frente</h2>
        <BarrasPorFrente linhas={porFrente} />
      </section>

      <section className="stack stack-3">
        <h2 className="small strong">Por ativo</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="tabela">
            <thead>
              <tr>
                <th>Ativo</th>
                <th>Squad</th>
                <th className="num">Curtidas</th>
                <th className="num">Instalações</th>
                <th className="num">Derivações</th>
                <th className="num">Squads</th>
                <th>Atualizado</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((a) => (
                <tr key={a.id} onClick={() => irPara('/coord/dados/' + a.id)} style={{ cursor: 'pointer' }}>
                  <td>
                    <a href={'#/coord/dados/' + a.id} className="link-reset row row-2 strong" onClick={(e) => e.stopPropagation()}>
                      <Icon name={iconeTipo(a.tipo)} size={16} label={rotuloTipo(a.tipo)} />
                      {a.nome}
                    </a>
                  </td>
                  <td className="muted">{a.squad}</td>
                  <td className="num">{curtidasDe(a)}</td>
                  <td className="num">{instalacoesDe(a)}</td>
                  <td className="num">{a.derivacoes}</td>
                  <td className="num">{a.squadsQueReusaram.length}</td>
                  <td className="muted" style={{ whiteSpace: 'nowrap' }}>{formatarDataCurta(a.atualizadoEm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
