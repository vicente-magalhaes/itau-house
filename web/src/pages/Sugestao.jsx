import React from 'react';
import { Button, Card, Badge, Icon, Toast } from '../ds.js';
import { Avatar, BarraProgresso, Meta, Painel, Secao, SeloSimulado } from '../components/comuns.jsx';
import { Link, irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { cenarioSugestao } from '../data/governanca.js';
import { acharAtivo, iconeTipo, rotuloTipo, formatarData } from '../data/catalogo.js';

// Ato 2 da demo: o aviso proativo chega no fluxo de quem está codando.
// Tudo aqui é simulado: a transcrição é um roteiro fixo de data/governanca.js.

const MS_POR_LINHA = 700;

// Como cada autor da transcrição aparece no terminal. O laranja é só do Itaú House.
const AUTORES = {
  dev: { prefixo: 'você', icone: 'user-round', cor: 'var(--itau-branco)' },
  hook: { prefixo: 'hook do Itaú House', icone: 'plug', cor: 'var(--gray-300)' },
  agente: { prefixo: 'Itaú House', icone: 'sparkles', cor: 'var(--itau-laranja)' },
};

const ICONE_DECISAO = { reaproveitar: 'download', adaptar: 'git-branch', criar: 'pencil' };
const VARIANTE_DECISAO = { reaproveitar: 'primary', adaptar: 'secondary', criar: 'outline' };

function LinhaTerminal({ linha }) {
  const autor = AUTORES[linha.de] || AUTORES.dev;
  return (
    <div className="row row-3" style={{ alignItems: 'flex-start' }}>
      <Icon name={autor.icone} size={16} color={autor.cor} style={{ marginTop: 4 }} />
      <div className="grow" style={{ color: autor.cor }}>
        <span style={{ color: 'var(--gray-400)' }}>{autor.prefixo} · </span>
        {linha.texto}
      </div>
    </div>
  );
}

function Rotulado({ rotulo, children }) {
  return (
    <div className="stack stack-1">
      <div className="caption">{rotulo}</div>
      <div style={{ font: 'var(--fw-bold) var(--fs-body)/1.35 var(--font-text)', color: 'var(--text-primary)' }}>{children}</div>
    </div>
  );
}

// O que fica gravado em cada caminho. Nenhuma das escolhas é julgada.
function registroDe(valor, ativo, pessoa, squadDev) {
  const quem = `${pessoa.nome} · ${pessoa.squad}`;
  if (valor === 'reaproveitar') {
    return {
      tone: 'success',
      toast: `Reuso registrado. ${ativo.nome} entrou no seu projeto na versão ${ativo.versao}.`,
      resumo: 'A decisão ficou gravada dos dois lados: no seu projeto e no post de quem publicou.',
      itens: [
        ['O que foi instalado', `${ativo.nome} (${rotuloTipo(ativo.tipo)})`],
        ['Em que versão', `${ativo.versao}, revalidada em ${formatarData(ativo.atualizadoEm)}`],
        ['Quem decidiu', quem],
        ['O que ficou gravado', `O post de ${ativo.autor.nome} passa de ${ativo.reusos} para ${ativo.reusos + 1} reusos, e ${squadDev} aparece na lista de quem reaproveitou.`],
      ],
    };
  }
  if (valor === 'adaptar') {
    return {
      tone: 'success',
      toast: `Clone criado no seu projeto a partir da versão ${ativo.versao}.`,
      resumo: 'O ativo foi clonado no seu projeto para você ajustar o template do card. A origem fica registrada.',
      itens: [
        ['O que foi clonado', `${ativo.nome} (${rotuloTipo(ativo.tipo)})`],
        ['Em que versão', `${ativo.versao}, o ponto de partida do seu clone`],
        ['Quem decidiu', quem],
        ['O que ficou gravado', `O clone aponta para o ativo de ${ativo.autor.nome}. O reuso conta para ${ativo.autor.squad} e o que você mudar volta como sugestão para a autora.`],
      ],
    };
  }
  return {
    tone: 'neutral',
    toast: 'Seguimos sem reuso. A publicação do que você criar fica agendada para o fim da tarefa.',
    resumo: 'Criar do zero é uma escolha válida. O que muda é que o seu trabalho não se perde depois.',
    itens: [
      ['O que foi decidido', 'Seguir sem reuso nesta tarefa'],
      ['O que acontece agora', 'Você continua no seu editor. A gente sai da frente.'],
      ['Quem decidiu', quem],
      ['O que ficou gravado', 'A ideia é que publicar seja efeito colateral do trabalho: o aviso volta quando a tarefa fechar. Ainda não testamos se isso mantém o catálogo vivo.'],
    ],
  };
}

export function Sugestao() {
  const { pessoa, instalar } = useSessao();
  const linhas = cenarioSugestao.transcricao;
  const achado = cenarioSugestao.achado;
  const ativo = acharAtivo(achado.ativoId);

  const [visiveis, setVisiveis] = React.useState(0);
  const [animando, setAnimando] = React.useState(false);
  const [decisao, setDecisao] = React.useState(null);
  const [toastAberto, setToastAberto] = React.useState(false);

  // Sem clique, a transcrição se completa sozinha depois de 1 s: numa demo a tela nunca pode parecer vazia.
  React.useEffect(() => {
    if (animando || visiveis > 0) return undefined;
    const t = setTimeout(() => setVisiveis(linhas.length), 1000);
    return () => clearTimeout(t);
  }, [animando, visiveis, linhas.length]);

  // Revelação linha a linha, com os timers limpos no cleanup.
  React.useEffect(() => {
    if (!animando) return undefined;
    const timers = linhas.map((_, i) =>
      setTimeout(() => {
        setVisiveis(i + 1);
        if (i === linhas.length - 1) setAnimando(false);
      }, MS_POR_LINHA * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, [animando, linhas]);

  function rodar() {
    setDecisao(null);
    setToastAberto(false);
    setVisiveis(0);
    setAnimando(true);
  }

  function reiniciar() {
    setDecisao(null);
    setToastAberto(false);
    setAnimando(false);
    setVisiveis(0);
  }

  function decidir(valor) {
    setDecisao(valor);
    setToastAberto(true);
    if (valor !== 'criar' && ativo) instalar(ativo.id);
  }

  const concluido = visiveis >= linhas.length;
  const registro = decisao && ativo ? registroDe(decisao, ativo, pessoa, cenarioSugestao.dev.squad) : null;

  return (
    <div className="container page stack stack-6">
      <header className="stack stack-3">
        <div className="row row-3 wrap">
          <span className="eyebrow">No seu fluxo</span>
          <SeloSimulado ajuda="A detecção por hook é simulada. Nenhuma ferramenta de código está conectada a este protótipo.">
            Momento simulado
          </SeloSimulado>
        </div>
        <h1 style={{ font: 'var(--fw-bold) var(--fs-h1)/var(--lh-heading) var(--font-display)', letterSpacing: 'var(--ls-display)', maxWidth: 720 }}>
          O aviso chega onde você já está
        </h1>
        <p className="muted" style={{ maxWidth: 720 }}>
          Nesta demonstração, o aviso chega por um hook da ferramenta de código, com um roteiro fixo: ele percebe o que você
          começou a construir e pergunta antes de você seguir. Onde ele entra de verdade — IDE, abertura de PR ou revisão — ainda está em aberto.
        </p>
        <p className="small muted" style={{ maxWidth: 720 }}>
          <Icon name="info" size={16} style={{ verticalAlign: 'text-bottom', marginRight: 'var(--space-1)' }} />
          {cenarioSugestao.gatilho}
        </p>
      </header>

      <section className="stack stack-4">
        <Card tone="inverse" padding={24}>
          <div className="stack stack-4">
            <div className="row spread row-3 wrap">
              <span className="row row-2" style={{ color: 'var(--gray-300)', font: 'var(--fw-bold) var(--fs-body-sm)/1 var(--font-text)' }}>
                <Icon name="terminal" size={16} color="var(--gray-300)" />
                Sessão de {cenarioSugestao.dev.nome} · {cenarioSugestao.dev.squad}
              </span>
              <SeloSimulado>Transcrição simulada</SeloSimulado>
            </div>
            <div style={{ height: 1, background: 'var(--gray-800)' }} />
            <div className="mono stack stack-3" role="log" aria-live="polite" style={{ minHeight: 132 }}>
              {visiveis === 0 && <div style={{ color: 'var(--gray-400)' }}>Aguardando o primeiro comando.</div>}
              {linhas.slice(0, visiveis).map((linha, i) => (
                <LinhaTerminal key={i} linha={linha} />
              ))}
            </div>
          </div>
        </Card>

        <div className="row row-3 wrap">
          <Button variant="secondary" iconLeft="play" onClick={rodar} disabled={animando}>
            {animando ? 'Rodando o cenário' : 'Rodar o cenário'}
          </Button>
          <Button variant="ghost" iconLeft="rotate-ccw" onClick={reiniciar}>Reiniciar</Button>
          <span className="caption">Cada linha aparece em 0,7 s. Sem clique, a transcrição se completa sozinha.</span>
        </div>
      </section>

      {concluido && ativo && (
        <Secao titulo="O que o agente encontrou">
          <Card padding={24}>
            <div className="stack stack-5">
              <div className="row spread row-4 wrap" style={{ alignItems: 'flex-start' }}>
                <div className="stack stack-2 grow">
                  <span className="row row-2 caption">
                    <Icon name={iconeTipo(ativo.tipo)} size={16} color="var(--text-tertiary)" />
                    {rotuloTipo(ativo.tipo)} · versão {ativo.versao}
                  </span>
                  <h3 style={{ font: 'var(--fw-bold) var(--fs-h2)/var(--lh-heading) var(--font-display)', color: 'var(--text-primary)' }}>
                    {ativo.nome}
                  </h3>
                  <div className="row row-3 wrap">
                    <span className="row row-2">
                      <Avatar iniciais={ativo.autor.iniciais} tamanho={28} />
                      <span className="small" style={{ color: 'var(--text-primary)' }}>{ativo.autor.nome}</span>
                    </span>
                    <Meta icone="building-2">{ativo.squad}</Meta>
                    <Meta icone="trending-up">{ativo.reusos} reusos</Meta>
                  </div>
                </div>
                <span className="stack stack-2" style={{ alignItems: 'flex-end' }}>
                  <Badge tone="brand">{achado.aderencia}% de aderência</Badge>
                  <SeloSimulado ajuda="O cálculo de aderência é um roteiro fixo do protótipo.">Aderência simulada</SeloSimulado>
                </span>
              </div>

              <BarraProgresso valor={achado.aderencia} rotulo="Aderência à sua tarefa" />

              <div className="stack stack-3">
                <div style={{ font: 'var(--fw-bold) var(--fs-body)/1.3 var(--font-text)', color: 'var(--text-primary)' }}>Por que sugerimos</div>
                <ul className="stack stack-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {achado.porques.map((p) => (
                    <li key={p} className="row row-3" style={{ alignItems: 'flex-start' }}>
                      <Icon name="check" size={18} color="var(--itau-laranja)" style={{ marginTop: 2 }} />
                      <span className="grow" style={{ color: 'var(--text-secondary)' }}>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Painel icone="triangle-alert" cor="var(--text-primary)" style={{ background: 'var(--status-warning-bg)' }}>
                <div style={{ font: 'var(--fw-bold) var(--fs-body-sm)/1.3 var(--font-text)', color: 'var(--text-primary)' }}>Um limite antes de você decidir</div>
                <p style={{ color: 'var(--text-secondary)' }}>{achado.limite}</p>
              </Painel>

              <div className="stack stack-3">
                <div style={{ font: 'var(--fw-bold) var(--fs-body)/1.3 var(--font-text)', color: 'var(--text-primary)' }}>O que este ativo acessa</div>
                <div className="stack stack-2">
                  {ativo.acessos.slice(0, 3).map((a) => (
                    <div key={a.titulo} className="row row-3" style={{ alignItems: 'flex-start' }}>
                      <Icon name={a.icone} size={18} color="var(--text-tertiary)" style={{ marginTop: 2 }} />
                      <span className="grow small" style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{a.titulo}</span>
                        {a.detalhe ? ` · ${a.detalhe}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="row row-3 wrap">
                <Button variant="outline" size="sm" iconRight="arrow-right" onClick={() => irPara('/ativo/' + ativo.id)}>
                  Ver detalhes
                </Button>
                <span className="caption">README, permissões, histórico de governança e quem já reaproveitou.</span>
              </div>
            </div>
          </Card>
        </Secao>
      )}

      {concluido && (
        <Card tone="brand" padding={24}>
          <div className="row row-4" style={{ alignItems: 'flex-start' }}>
            <Icon name="scale" size={28} color="var(--itau-preto)" style={{ marginTop: 2 }} />
            <div className="stack stack-1">
              <div style={{ font: 'var(--fw-bold) var(--fs-h3)/var(--lh-heading) var(--font-display)', color: 'var(--itau-preto)' }}>
                O agente sugere e mostra por quê. Quem decide é você.
              </div>
              <div style={{ font: 'var(--fw-regular) var(--fs-body-sm)/1.45 var(--font-text)', color: 'var(--itau-preto)' }}>
                Nada é instalado sozinho, e nenhuma das três opções abaixo é a errada.
              </div>
            </div>
          </div>
        </Card>
      )}

      {concluido && !decisao && (
        <Secao titulo="Sua decisão">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            {cenarioSugestao.decisoes.map((d) => (
              <Card key={d.valor} tone="subtle">
                <div className="stack stack-4" style={{ height: '100%' }}>
                  <p className="small grow" style={{ color: 'var(--text-secondary)' }}>{d.descricao}</p>
                  <Button
                    variant={VARIANTE_DECISAO[d.valor] || 'outline'}
                    iconLeft={ICONE_DECISAO[d.valor]}
                    fullWidth
                    onClick={() => decidir(d.valor)}
                  >
                    {d.rotulo}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Secao>
      )}

      {registro && (
        <Secao titulo="Resultado registrado">
          <div className="stack stack-4">
            {toastAberto && <Toast tone={registro.tone} onClose={() => setToastAberto(false)}>{registro.toast}</Toast>}
            <Card padding={24}>
              <div className="stack stack-5">
                <div className="row row-3 wrap spread">
                  <span className="row row-2">
                    <Icon name="clipboard-check" size={20} color="var(--itau-laranja)" />
                    <span style={{ font: 'var(--fw-bold) var(--fs-body-lg)/1.2 var(--font-display)', color: 'var(--text-primary)' }}>
                      O que ficou no registro
                    </span>
                  </span>
                  <SeloSimulado>Registro simulado</SeloSimulado>
                </div>
                <p className="muted">{registro.resumo}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
                  {registro.itens.map(([rotulo, texto]) => (
                    <Rotulado key={rotulo} rotulo={rotulo}>{texto}</Rotulado>
                  ))}
                </div>
                <div className="row row-3 wrap">
                  <Button variant="ghost" iconLeft="rotate-ccw" onClick={rodar}>Rodar de novo</Button>
                  {decisao !== 'criar' && ativo && (
                    <Button variant="ghost" iconRight="arrow-right" onClick={() => irPara('/ativo/' + ativo.id)}>
                      Ver o post de {ativo.autor.nome}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </Secao>
      )}

      {concluido && (
        <Secao
          titulo="Também encontramos"
          acao={<SeloSimulado ajuda="O cálculo de aderência é um roteiro fixo do protótipo.">Aderência simulada</SeloSimulado>}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
            {cenarioSugestao.parecidos.map((p) => {
              const outro = acharAtivo(p.ativoId);
              if (!outro) return null;
              return (
                <Link key={p.ativoId} para={'/ativo/' + outro.id} style={{ display: 'block' }}>
                  <Card interactive style={{ height: '100%' }}>
                    <div className="stack stack-3">
                      <span className="row row-2 caption">
                        <Icon name={iconeTipo(outro.tipo)} size={16} color="var(--text-tertiary)" />
                        {rotuloTipo(outro.tipo)} · {outro.squad}
                      </span>
                      <div style={{ font: 'var(--fw-bold) var(--fs-body-lg)/1.2 var(--font-display)', color: 'var(--text-primary)' }}>{outro.nome}</div>
                      <BarraProgresso valor={p.aderencia} rotulo={`${p.aderencia}% de aderência`} />
                      <p className="small" style={{ color: 'var(--text-secondary)' }}>{p.porque}</p>
                      <span className="row row-2" style={{ color: 'var(--text-accent)', font: 'var(--fw-bold) var(--fs-body-sm)/1 var(--font-text)' }}>
                        Ver detalhes
                        <Icon name="chevron-right" size={16} />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Secao>
      )}

      <Painel icone="history">
        <p style={{ color: 'var(--text-secondary)' }}>
          Hipótese do time: ouvimos de uma analista de produto que o dev refaz o que outra squad já fez.
          Ainda não validamos isso com uma pessoa dev.
        </p>
      </Painel>
    </div>
  );
}
