import React from 'react';
import { Button, Icon, Tag, Input, Select, Toast } from '../ds.js';
import { BotaoSec, SeloSimulado, Aviso } from '../components/comuns.jsx';
import { PostCard } from '../components/Post.jsx';
import { TextArea } from '../components/TextArea.jsx';
import { irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { CRITERIOS, VEREDITOS, rascunhoAna, verificacaoReprovada, verificacaoAprovada } from '../data/governanca.js';
import { VISIBILIDADES, iconeEstante } from '../data/catalogo.js';

// Publicação (RF-13 a RF-19): o hook detecta, o validador confere por código (sem IA, D-26), a pessoa corrige e a coordenação decide.

const PASSOS = ['Detecção', 'Verificação', 'Post', 'Fila'];

// Falha usa azul-marinho, nunca vermelho.
const RESULTADOS = {
  ok: { icone: 'circle-check', cor: 'var(--status-success)', rotulo: 'Sem apontamento' },
  atencao: { icone: 'triangle-alert', cor: 'var(--text-primary)', rotulo: 'Atenção' },
  falhou: { icone: 'circle-alert', cor: 'var(--status-error)', rotulo: 'Precisa de ajuste' },
};

const DURACAO_VERIFICACAO = 1200;

// Evidência que cita arquivo ou trecho de código ganha fonte mono.
function pareceCodigo(texto) {
  return /\.(md|py|jsx?|tsx?|json|ya?ml)\b/.test(texto) || /[A-Z_]{3,}\s*=/.test(texto);
}

function Passos({ atual }) {
  return (
    <ol className="row row-2 wrap" aria-label="Passos da publicação" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {PASSOS.map((rotulo, i) => {
        const n = i + 1;
        const agora = n === atual;
        const feito = n < atual;
        return (
          <li key={rotulo} className="row row-2">
            {i > 0 && <span aria-hidden="true" style={{ width: 24, height: 1, background: 'var(--border-default)' }} />}
            <span
              aria-current={agora ? 'step' : undefined}
              className="row row-2 small"
              style={{ color: agora || feito ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: agora ? 'var(--fw-bold)' : undefined }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 'var(--radius-pill)',
                  background: agora ? 'var(--brand)' : feito ? 'var(--surface-muted)' : 'transparent',
                  color: agora ? 'var(--on-brand)' : 'inherit',
                  boxShadow: agora || feito ? 'none' : 'inset 0 0 0 1px var(--border-default)',
                  font: 'var(--fw-bold) var(--fs-caption)/1 var(--font-text)',
                }}
              >
                {feito ? <Icon name="check" size={14} /> : n}
              </span>
              {rotulo}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function LinhaCriterio({ item }) {
  const criterio = CRITERIOS.find((c) => c.id === item.criterio);
  const r = RESULTADOS[item.resultado] || RESULTADOS.ok;
  return (
    <li className="row row-3" style={{ alignItems: 'flex-start', padding: 'var(--space-3) 0', boxShadow: 'inset 0 1px 0 var(--border-subtle)' }}>
      <Icon name={r.icone} size={20} color={r.cor} label={r.rotulo} style={{ marginTop: 2 }} />
      <div className="stack stack-1 grow">
        <span className="row row-2 wrap">
          <span className="small strong">{item.titulo}</span>
          {criterio && <span className="caption">{criterio.nome}</span>}
        </span>
        {item.resultado !== 'ok' && item.evidencia && (
          <span className={pareceCodigo(item.evidencia) ? 'mono muted' : 'caption'} style={{ overflowWrap: 'anywhere' }}>
            {item.evidencia}
          </span>
        )}
        {item.comoCorrigir && (
          <span className="small" style={{ padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-subtle)' }}>
            <span className="strong">Como corrigir: </span>
            {item.comoCorrigir}
          </span>
        )}
      </div>
    </li>
  );
}

export function Publicar() {
  const { ehCoordenador } = useSessao();

  const [passo, setPasso] = React.useState(1);
  const [adiado, setAdiado] = React.useState(false);
  const [rodada, setRodada] = React.useState(1);
  const [verificando, setVerificando] = React.useState(false);
  const [revelados, setRevelados] = React.useState(0);
  const [toast, setToast] = React.useState(null);
  const [erros, setErros] = React.useState({});

  // Campos do post, pré-preenchidos a partir do rascunho detectado.
  const [nome, setNome] = React.useState(rascunhoAna.nome);
  const [resumo, setResumo] = React.useState(rascunhoAna.resumo);
  const [readme, setReadme] = React.useState(rascunhoAna.readme);
  const [visibilidade, setVisibilidade] = React.useState(rascunhoAna.visibilidade);
  const [tags, setTags] = React.useState(rascunhoAna.tags);
  const [novaTag, setNovaTag] = React.useState('');

  // A verificação é simulada: um tempo curto com os critérios sendo marcados.
  React.useEffect(() => {
    if (!verificando) return undefined;
    const intervalo = setInterval(() => setRevelados((n) => Math.min(n + 1, CRITERIOS.length)), DURACAO_VERIFICACAO / CRITERIOS.length);
    const fim = setTimeout(() => setVerificando(false), DURACAO_VERIFICACAO);
    return () => {
      clearInterval(intervalo);
      clearTimeout(fim);
    };
  }, [verificando, rodada]);

  React.useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const resultado = rodada === 1 ? verificacaoReprovada : verificacaoAprovada;
  const aprovado = resultado.veredito === 'aprovado';
  const veredito = VEREDITOS[resultado.veredito];
  const visDef = VISIBILIDADES.find((v) => v.value === visibilidade) || VISIBILIDADES[0];

  function verificar(proximaRodada) {
    setRevelados(0);
    setRodada(proximaRodada);
    setVerificando(true);
    setPasso(2);
  }

  function enviar() {
    const novos = {};
    if (!nome.trim()) novos.nome = 'Escreva o nome do ativo.';
    if (!resumo.trim()) novos.resumo = 'Escreva o resumo.';
    setErros(novos);
    if (!novos.nome && !novos.resumo) setPasso(4);
  }

  function adicionarTag(e) {
    e.preventDefault();
    const limpa = novaTag.trim().toLowerCase();
    if (limpa && !tags.includes(limpa)) setTags([...tags, limpa]);
    setNovaTag('');
  }

  function recomecar() {
    setPasso(1);
    setRodada(1);
    setVerificando(false);
    setRevelados(0);
    setAdiado(false);
    setNome(rascunhoAna.nome);
    setResumo(rascunhoAna.resumo);
    setReadme(rascunhoAna.readme);
    setVisibilidade(rascunhoAna.visibilidade);
    setTags(rascunhoAna.tags);
    setNovaTag('');
    setErros({});
  }

  // Prévia no formato do card do início. Sem data: ainda não foi publicado.
  const previa = {
    ...rascunhoAna,
    id: 'previa',
    titulo: nome || 'Sem nome ainda',
    resumo: resumo || 'Sem resumo ainda',
    curtidas: 0,
    reusos: 0,
    adapt: 0,
  };

  return (
    <div className="stack stack-5" style={{ maxWidth: 1040 }}>
      <div className="row spread wrap row-4">
        <h1 className="titulo-pagina">Publicar</h1>
        <Passos atual={passo} />
      </div>

      {passo === 1 && (
        <section className="stack stack-4" style={{ maxWidth: 720 }}>
          <div className="caixa stack stack-3">
            <div className="row spread">
              <span className="row row-2 small strong">
                <Icon name="square-terminal" size={18} />
                Novo ativo na sua sessão
              </span>
              <SeloSimulado ajuda="A detecção viria de um hook da ferramenta de código. Aqui é um roteiro fixo.">Detecção simulada</SeloSimulado>
            </div>
            <div className="row row-2">
              <span className="pastilha">
                <Icon name={iconeEstante(rascunhoAna.estante)} size={14} />
                {rascunhoAna.tipo}
              </span>
              <span className="strong">{rascunhoAna.nome}</span>
            </div>
            <code className="mono muted">{rascunhoAna.caminho}</code>
            <span className="caption">{rascunhoAna.detectadoEm}</span>
          </div>

          <div className="row row-3">
            <Button variant="primary" size="sm" iconRight="arrow-right" onClick={() => verificar(1)}>
              Verificar
            </Button>
            <BotaoSec onClick={() => setAdiado(true)}>Agora não</BotaoSec>
            {adiado && <span className="caption">O aviso volta no fim da tarefa.</span>}
          </div>
        </section>
      )}

      {passo === 2 && (
        <section className="stack stack-4" style={{ maxWidth: 720 }}>
          <div className="caixa stack stack-3">
            {verificando ? (
              <>
                <span className="row row-2 small strong">
                  <Icon name="shield-check" size={18} />
                  Checagens fixas, por código
                </span>
                <ul className="stack stack-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {CRITERIOS.map((c, i) => {
                    const pronto = i < revelados;
                    return (
                      <li key={c.id} className="row row-2 small" style={{ color: pronto ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                        <Icon name={pronto ? 'check' : 'circle-dashed'} size={16} color={pronto ? 'var(--status-success)' : 'var(--text-tertiary)'} />
                        {c.nome}
                      </li>
                    );
                  })}
                </ul>
                <span className="sr-only" role="status">
                  {revelados} de {CRITERIOS.length} critérios checados
                </span>
              </>
            ) : (
              <>
                <div className="row row-3">
                  <Icon name={aprovado ? 'circle-check' : 'circle-alert'} size={24} color={aprovado ? 'var(--status-success)' : 'var(--status-error)'} />
                  <span className="strong grow" style={{ fontSize: 'var(--fs-body-lg)' }}>{veredito.rotulo}</span>
                  <SeloSimulado ajuda="O validador faz checagens fixas por código, sem IA. Nesta demonstração o resultado é fixo.">Validador simulado</SeloSimulado>
                </div>
                <ul className="stack" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {resultado.itens.map((item) => (
                    <LinhaCriterio key={item.criterio} item={item} />
                  ))}
                </ul>
              </>
            )}
          </div>

          {!verificando && (
            <div className="row row-3">
              {aprovado ? (
                <Button variant="primary" size="sm" iconRight="arrow-right" onClick={() => setPasso(3)}>
                  Montar o post
                </Button>
              ) : (
                <Button variant="primary" size="sm" iconLeft="rotate-ccw" onClick={() => verificar(2)}>
                  Corrigi, verificar de novo
                </Button>
              )}
              <BotaoSec onClick={() => setPasso(1)}>Voltar</BotaoSec>
            </div>
          )}
        </section>
      )}

      {passo === 3 && (
        <section className="cols-post" style={{ gridTemplateColumns: 'minmax(0, 1fr) 380px' }}>
          <div className="stack stack-4">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
              <Input
                label="Nome"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (erros.nome) setErros((a) => ({ ...a, nome: '' }));
                }}
                error={erros.nome}
              />
              <Select
                label="Quem pode ver"
                value={visibilidade}
                onChange={(e) => setVisibilidade(e.target.value)}
                options={VISIBILIDADES.map((v) => ({ value: v.value, label: v.label }))}
              />
            </div>
            <TextArea
              label="Resumo"
              value={resumo}
              onChange={(e) => {
                setResumo(e.target.value);
                if (erros.resumo) setErros((a) => ({ ...a, resumo: '' }));
              }}
              rows={2}
              error={erros.resumo}
            />
            <TextArea label="README" value={readme} onChange={(e) => setReadme(e.target.value)} rows={10} mono />
            <div className="stack stack-2">
              <form onSubmit={adicionarTag}>
                <Input label="Tags" value={novaTag} onChange={(e) => setNovaTag(e.target.value)} placeholder="Digite e aperte Enter" />
              </form>
              <div className="row row-2 wrap">
                {tags.map((t) => (
                  <Tag key={t} style={{ height: 28 }} onRemove={() => setTags(tags.filter((x) => x !== t))}>
                    {t}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="row row-3">
              <Button variant="primary" size="sm" iconRight="send" onClick={enviar}>
                Enviar para aprovação
              </Button>
              <BotaoSec onClick={() => setToast('Rascunho salvo. Só você vê.')}>Salvar rascunho</BotaoSec>
            </div>
          </div>

          <div className="stack stack-2 sticky">
            <span className="caption">Prévia no feed</span>
            <PostCard ativo={previa} preview />
          </div>
        </section>
      )}

      {passo === 4 && (
        <section className="stack stack-4" style={{ maxWidth: 720 }}>
          <div className="caixa stack stack-4">
            <div className="row row-3">
              <Icon name="circle-check" size={24} color="var(--status-success)" />
              <span className="strong grow" style={{ fontSize: 'var(--fs-body-lg)' }}>Na fila da coordenação</span>
            </div>
            <ul className="stack stack-3" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                { icone: 'circle-check', cor: 'var(--status-success)', titulo: 'Validador', nota: `passou na 2ª rodada, ${verificacaoAprovada.rodadaEm}` },
                { icone: 'user-round', cor: 'var(--text-primary)', titulo: 'Coordenação', nota: 'Rafael Costa decide' },
                { icone: visDef.icone, cor: 'var(--text-tertiary)', titulo: 'Publicação', nota: visDef.label },
              ].map((g) => (
                <li key={g.titulo} className="row row-3 small">
                  <Icon name={g.icone} size={18} color={g.cor} />
                  <span className="strong">{g.titulo}</span>
                  <span className="muted">{g.nota}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="row row-3">
            {ehCoordenador && (
              <BotaoSec icone="arrow-right" onClick={() => irPara('/coord/fila')}>
                Ver a fila
              </BotaoSec>
            )}
            <BotaoSec icone="rotate-ccw" onClick={recomecar}>
              Publicar outro
            </BotaoSec>
          </div>
        </section>
      )}

      {toast && (
        <Aviso>
          <Toast tone="neutral" onClose={() => setToast(null)}>
            {toast}
          </Toast>
        </Aviso>
      )}
    </div>
  );
}
