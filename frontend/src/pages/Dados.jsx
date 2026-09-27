import React from 'react';
import { Icon, IconButton, Tag } from '../ds.js';
import { SeloSimulado, Vazio } from '../components/comuns.jsx';
import { irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { ativos, acharAtivo, visivelPara, iconeTipo, formatarDataCurta, PAPEIS } from '../data/catalogo.js';
import { ativoDaApi, ativoDetalheDaApi } from '../data/daApi.js';
import { detalharAtivo, listarAtivos, useDaApi } from '../api.js';

// Área só da coordenação: os números por ativo e por frente (RF-30, RF-22).
// Lê da API com as mesmas chaves do início e da página do ativo, então os ids e os números são os mesmos.
// O contrato não traz o reuso por papel: da API, o alcance conta as squads que reaproveitaram.

const alcancados = (ativo) => (ativo.papeis ? ativo.papeis.filter((n) => n > 0).length : (ativo.squadsQueReusaram || []).length);
const rotuloAlcance = (ativo) => (ativo.papeis ? 'Papéis alcançados' : 'Squads alcançadas');
const dataCurta = (iso) => (iso ? formatarDataCurta(iso.slice(0, 10)) : '');

// Trilha (RF-22): da API vem o histórico de eventos; nos fictícios, o que o catálogo declara.
function historico(ativo) {
  if (ativo.trilha) return ativo.trilha.map((h) => ({ data: h.em, evento: h.evento, quem: h.quem }));
  return [
    { data: ativo.atualizadoEm, evento: 'Passou nas checagens do validador', quem: 'Validador' },
    { data: ativo.atualizadoEm, evento: `Versão ${ativo.versao} aprovada`, quem: ativo.aprovou },
  ];
}

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
        const detalhe = `${l.frente}: ${l.valor} reaproveitamentos em ${l.ativos} ${l.ativos === 1 ? 'ativo' : 'ativos'}`;
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

function Detalhe({ ativo, curtidas, reusos }) {
  const squads = ativo.squadsQueReusaram || [];
  return (
    <div className="stack stack-5" style={{ maxWidth: 960 }}>
      <div className="row row-3">
        <IconButton icon="arrow-left" label="Voltar aos dados" size={36} variant="subtle" onClick={() => irPara('/coord/dados')} />
        <h1 className="titulo-pagina grow">{ativo.titulo}</h1>
        <SeloSimulado ajuda="Todos os números desta área são fictícios, criados para a demonstração.">Números fictícios</SeloSimulado>
        <IconButton icon="external-link" label="Abrir o post" size={36} variant="subtle" onClick={() => irPara('/ativo/' + ativo.id)} />
      </div>

      <div className="kpis">
        <Kpi rotulo="Curtidas" valor={curtidas} />
        <Kpi rotulo="Reaproveitamentos" valor={reusos} />
        <Kpi rotulo="Adaptações" valor={ativo.adapt} />
        <Kpi rotulo={rotuloAlcance(ativo)} valor={alcancados(ativo)} />
      </div>

      <section className="stack stack-3">
        <h2 className="small strong">{ativo.papeis ? 'Reaproveitamentos por papel' : 'Squads que reaproveitaram'}</h2>
        <div className="row row-2 wrap">
          {ativo.papeis
            ? PAPEIS.map((papel, i) => (
                <Tag key={papel} style={{ height: 28 }}>
                  {papel} · {ativo.papeis[i]}
                </Tag>
              ))
            : squads.length === 0
              ? <span className="small muted">Nenhuma squad reaproveitou ainda.</span>
              : squads.map((s) => (
                  <Tag key={s} style={{ height: 28 }}>
                    {s}
                  </Tag>
                ))}
        </div>
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
            {historico(ativo).map((h, i) => (
              <tr key={i}>
                <td style={{ whiteSpace: 'nowrap' }}>{dataCurta(h.data)}</td>
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

// Mesma chave da página do ativo: quem vem de lá já tem a leitura. A API responde 404 para o que a persona não vê (RF-05).
function DadosDoAtivo({ id }) {
  const { pessoa, usuarioId, curtidasDe, reusosDe } = useSessao();
  const { dados: ativo, erro, carregando } = useDaApi(
    `ativo:${usuarioId}:${id}`,
    () => detalharAtivo(usuarioId, id).then(ativoDetalheDaApi),
    () => {
      const a = acharAtivo(id);
      return a && visivelPara(a, pessoa) ? a : null;
    },
  );

  if (carregando) return <Vazio icone="loader" titulo="Carregando os dados do ativo" />;
  if (!ativo) return <Vazio titulo={erro && erro.status !== 404 ? erro.message : 'Ativo não encontrado'} />;
  return <Detalhe ativo={ativo} curtidas={curtidasDe(ativo)} reusos={reusosDe(ativo)} />;
}

export function Dados({ id }) {
  if (id) return <DadosDoAtivo id={id} />;
  return <Painel />;
}

// Mesma chave do início: os ativos que a persona vê, na mesma leitura.
function Painel() {
  const { pessoa, usuarioId, curtidasDe, reusosDe } = useSessao();
  const { dados, erro, carregando } = useDaApi(
    'ativos:' + usuarioId,
    () => listarAtivos(usuarioId).then((lista) => lista.map(ativoDaApi)),
    () => ativos.filter((a) => visivelPara(a, pessoa)),
  );

  if (carregando) return <Vazio icone="loader" titulo="Carregando os dados" />;
  if (erro) return <Vazio icone="circle-alert" titulo={erro.message} />;

  const visiveis = dados || [];
  const soma = (f) => visiveis.reduce((t, a) => t + f(a), 0);
  const porFrente = Object.values(
    visiveis.reduce((acc, a) => {
      const l = acc[a.frente] || { frente: a.frente, valor: 0, ativos: 0 };
      l.valor += reusosDe(a);
      l.ativos += 1;
      acc[a.frente] = l;
      return acc;
    }, {}),
  ).sort((a, b) => b.valor - a.valor);
  const linhas = visiveis.slice().sort((a, b) => curtidasDe(b) + reusosDe(b) - (curtidasDe(a) + reusosDe(a)));
  const porPapel = visiveis.some((a) => a.papeis);

  return (
    <div className="stack stack-6" style={{ maxWidth: 960 }}>
      <div className="row spread">
        <h1 className="titulo-pagina">Dados</h1>
        <SeloSimulado ajuda="Todos os números desta área são fictícios, criados para a demonstração.">Números fictícios</SeloSimulado>
      </div>

      <div className="kpis">
        <Kpi rotulo="Ativos publicados" valor={visiveis.length} />
        <Kpi rotulo="Curtidas" valor={soma(curtidasDe)} />
        <Kpi rotulo="Reaproveitamentos" valor={soma(reusosDe)} />
        <Kpi rotulo="Adaptações" valor={soma((a) => a.adapt)} />
      </div>

      <section className="stack stack-4">
        <h2 className="small strong">Reaproveitamentos por frente</h2>
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
                <th className="num">Reaproveitamentos</th>
                <th className="num">Adaptações</th>
                <th className="num">{porPapel ? 'Papéis' : 'Squads'}</th>
                <th>Atualizado</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((a) => (
                <tr key={a.id} onClick={() => irPara('/coord/dados/' + a.id)} style={{ cursor: 'pointer' }}>
                  <td>
                    <a href={'#/coord/dados/' + a.id} className="link-reset row row-2 strong" onClick={(e) => e.stopPropagation()}>
                      <Icon name={iconeTipo(a.tipo)} size={16} label={a.tipo} />
                      {a.titulo}
                    </a>
                  </td>
                  <td className="muted">{a.squad}</td>
                  <td className="num">{curtidasDe(a)}</td>
                  <td className="num">{reusosDe(a)}</td>
                  <td className="num">{a.adapt}</td>
                  <td className="num">{alcancados(a)}</td>
                  <td className="muted" style={{ whiteSpace: 'nowrap' }}>{dataCurta(a.atualizadoEm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
