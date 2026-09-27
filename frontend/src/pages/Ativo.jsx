import React from 'react';
import { Button, Icon, Dialog, Checkbox, Badge, Toast } from '../ds.js';
import { Foto, BotaoSec, SeloSimulado, Vazio, Aviso } from '../components/comuns.jsx';
import { BotaoCurtir } from '../components/Post.jsx';
import { NumeroVivo, Pulso } from '../components/movimento.jsx';
import { Link, irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import {
  acharAtivo,
  visivelPara,
  PAPEIS,
  VISIBILIDADES,
  iconeTipo,
  iconeVisibilidade,
  rotuloVisibilidade,
  tempoRelativo,
  formatarDataCurta,
  passosDeUso,
  horasParaCriar,
  formatarHoras,
} from '../data/catalogo.js';
import { ativoDetalheDaApi } from '../data/daApi.js';
import { detalharAtivo, useDaApi } from '../api.js';

function voltar() {
  if (window.history.length > 1) window.history.back();
  else irPara('/');
}

// Pessoa com foto, nome e uma linha de detalhe. Abre o perfil.
// Quem vem nos `usos` da API não traz id (docs/api.md): a linha só mostra, não abre perfil.
function LinhaPessoa({ pessoa, detalhe, texto }) {
  const conteudo = (
    <>
      <Foto pessoa={pessoa} tamanho={48} />
      <span className="stack stack-1" style={{ minWidth: 0 }}>
        <span className="nome">
          {pessoa.nome} <span className="meta">· {detalhe}</span>
        </span>
        <span className="texto">{texto}</span>
      </span>
    </>
  );
  if (!pessoa.id) return <div className="row row-3">{conteudo}</div>;
  return (
    <button type="button" className="linha-pessoa" onClick={() => irPara('/perfil/' + pessoa.id)}>
      {conteudo}
    </button>
  );
}

// Trecho com `código` no meio do texto.
function TextoComCodigo({ texto }) {
  return texto.split('`').map((parte, i) =>
    i % 2 ? (
      <code key={i} className="mono">
        {parte}
      </code>
    ) : (
      parte
    ),
  );
}

// Markdown simples do README e do manual: títulos, listas e parágrafos. Sem dependência nova.
function Markdown({ texto }) {
  const blocos = [];
  let lista = null;
  texto.split('\n').forEach((bruta) => {
    const linha = bruta.trim();
    if (/^[-*] /.test(linha)) {
      if (!lista) {
        lista = [];
        blocos.push({ tipo: 'lista', itens: lista });
      }
      lista.push(linha.slice(2));
      return;
    }
    lista = null;
    if (!linha) return;
    const titulo = linha.match(/^#{1,6} (.*)$/);
    blocos.push(titulo ? { tipo: 'titulo', texto: titulo[1] } : { tipo: 'paragrafo', texto: linha });
  });
  return (
    <div className="stack stack-2">
      {blocos.map((b, i) => {
        if (b.tipo === 'titulo') {
          return (
            <h3 key={i} className="titulo-card" style={{ marginTop: i ? 'var(--space-2)' : 0 }}>
              {b.texto}
            </h3>
          );
        }
        if (b.tipo === 'lista') {
          return (
            <ul key={i} className="texto" style={{ paddingLeft: 'var(--space-5)' }}>
              {b.itens.map((t, j) => (
                <li key={j}>
                  <TextoComCodigo texto={t} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="texto">
            <TextoComCodigo texto={b.texto} />
          </p>
        );
      })}
    </div>
  );
}

// Status de quem não está publicado: o autor vê o próprio rascunho, o Cord+ vê o que está na fila.
const STATUS = {
  rascunho: 'Rascunho',
  barrado: 'Barrado no validador',
  em_aprovacao: 'Aguardando aprovação',
  devolvido: 'Devolvido ao autor',
};

// Ícone de cada evento da trilha (RF-22), pelo texto do evento. "Enviado para aprovação" é envio, não aprovação.
function iconeEvento(evento) {
  if (/devolv/i.test(evento)) return 'undo-2';
  if (/envi/i.test(evento)) return 'send';
  if (/aprov/i.test(evento)) return 'user-check';
  if (/valid|barr/i.test(evento)) return 'shield-check';
  return 'history';
}

// O que o ativo acessa, como as permissões de um aplicativo. Aparece na página e antes de usar (RF-29).
function ListaAcessos({ acessos }) {
  return (
    <ul className="stack stack-3" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {acessos.map((a) => (
        <li key={a.titulo} className="row row-3">
          <Icon name={a.icone} size={20} color="var(--ih-ink2)" />
          <span className="texto" style={{ color: 'var(--ih-ink)' }}>
            {a.titulo}
          </span>
        </li>
      ))}
    </ul>
  );
}

// Retorno de tempo (decisão 0025): quanto levou pra criar e quanto os reaproveitamentos já pouparam.
// A economia é reaproveitamentos × horas pra criar. Usar o ativo soma um reaproveitamento na hora.
function TempoEconomizado({ ativo, reusos }) {
  const horas = horasParaCriar(ativo);
  return (
    <div className="painel">
      <div className="row spread row-2">
        <h2 className="titulo-card">Tempo economizado</h2>
        <SeloSimulado ajuda="O tempo de criação e os reaproveitamentos são fictícios, criados para a demonstração. Num piloto, quem publica informa o tempo.">
          Números fictícios
        </SeloSimulado>
      </div>
      {horas === null ? (
        <p className="texto">Quem publicou ainda não informou quanto tempo levou pra criar. Sem isso, a gente não calcula a economia.</p>
      ) : (
        <>
          <div className="tempo-numeros">
            <div className="stack stack-1">
              <span className="meta">Levou pra criar</span>
              <span className="tempo-valor">{formatarHoras(horas)}</span>
            </div>
            <div className="stack stack-1">
              <span className="meta">Já economizou</span>
              <span className="tempo-valor destaque">
                <NumeroVivo valor={reusos * horas} formatar={formatarHoras} />
              </span>
            </div>
          </div>
          <p className="texto">
            {reusos === 0
              ? 'Ninguém reaproveitou ainda. Cada reaproveitamento poupa o tempo de criar do zero.'
              : `${reusos} ${reusos === 1 ? 'reaproveitamento' : 'reaproveitamentos'} × ${formatarHoras(horas)}. É uma estimativa: cada um conta como o tempo de criar do zero.`}
          </p>
        </>
      )}
    </div>
  );
}

// "Usar em": uma aba por ferramenta, com os passos daquela ferramenta.
function UsarEm({ ativo }) {
  const [ferramenta, setFerramenta] = React.useState(ativo.ferr[0]);
  return (
    <section className="stack stack-4">
      <div className="row row-3 wrap">
        <h2 className="titulo-secao">Usar em</h2>
        <SeloSimulado ajuda="Conector, extensão e plugin são simulados. Nada é instalado nem copiado de verdade.">Uso simulado</SeloSimulado>
      </div>
      <div className="row wrap row-2" role="group" aria-label="Ferramenta">
        {ativo.ferr.map((f) => (
          <button key={f} type="button" className="btn btn-sec btn-aba" aria-pressed={f === ferramenta} onClick={() => setFerramenta(f)}>
            {f}
          </button>
        ))}
      </div>
      {/* A chave pela ferramenta faz os passos entrarem de novo a cada aba. */}
      <ol key={ferramenta} className="passos anima-escalonada">
        {passosDeUso(ferramenta, ativo).map((texto, i) => (
          <li key={i} className="passo">
            <span className="passo-n">{i + 1}</span>
            <span className="texto" style={{ color: 'var(--ih-ink)' }}>
              {texto}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Página do ativo (RF-27): capa, ações, tempo economizado (0025), o que ele acessa, como usar, conteúdo, derivações, reuso por papel e trilha (RF-22, RF-30).
export function Ativo({ id }) {
  const { pessoa, usuarioId, usados, usar, reusosDe, avisar, ehCoordenador } = useSessao();
  // A API responde 404 para o que a persona não vê (RF-05). Nos dados fictícios, o filtro de alcance é daqui.
  const { dados: ativo, erro, carregando } = useDaApi(
    `ativo:${usuarioId}:${id}`,
    () => detalharAtivo(usuarioId, id).then(ativoDetalheDaApi),
    () => {
      const a = acharAtivo(id);
      return a && visivelPara(a, pessoa) ? a : null;
    },
  );
  const [confirmando, setConfirmando] = React.useState(false);
  const [ciente, setCiente] = React.useState(false);
  // Quem enviou chega aqui pelo link do plugin: o aviso confirma que o post está na fila (RF-18, RF-19).
  const [envioVisto, setEnvioVisto] = React.useState(false);

  if (carregando) return <Vazio icone="loader" titulo="Carregando o ativo" />;
  if (!ativo) {
    const titulo = erro && erro.status !== 404 ? erro.message : 'Este ativo não está disponível para você';
    return <Vazio icone="search-x" titulo={titulo} acao={<Button size="sm" onClick={() => irPara('/')}>Voltar ao início</Button>} />;
  }

  const autor = ativo.autor;
  const usado = usados.includes(ativo.id);
  const naFila = ativo.status === 'em_aprovacao' && autor.id === usuarioId;
  const autorOriginal = ativo.derivadoDe && ativo.derivadoDe.autor ? ativo.derivadoDe.autor.nome.split(' ')[0] : null;
  // Os fictícios não têm status: estão todos publicados.
  const publicado = !ativo.status || ativo.status === 'publicado';
  const ferramenta = ativo.ferr[0] || 'editor';
  // Reuso por papel (RF-30): só os dados fictícios têm. Da API vêm as squads que reaproveitaram.
  const papeis = ativo.papeis;
  const maior = papeis ? Math.max(...papeis, 1) : 1;
  const deFora = papeis ? papeis.reduce((t, n, i) => t + (PAPEIS[i] !== autor.papel ? n : 0), 0) : 0;
  const squads = ativo.squadsQueReusaram || [];
  const alcance = VISIBILIDADES.find((v) => v.value === ativo.visibilidade);
  // Trilha (RF-22): da API vem o histórico de eventos; nos fictícios, o que o catálogo declara.
  const eventos = ativo.trilha
    ? ativo.trilha.map((h) => ({ icone: iconeEvento(h.evento), titulo: h.evento, detalhe: [h.quem, h.em && formatarDataCurta(h.em.slice(0, 10))].filter(Boolean).join(' · ') }))
    : [
        { icone: 'shield-check', titulo: 'Passou no validador', detalhe: 'Sem segredo, sem dado pessoal e com descrição' },
        { icone: 'user-check', titulo: 'Aprovado por ' + ativo.aprovou, detalhe: 'Coordenação da squad de quem publicou' },
      ];
  const trilha = [
    ...eventos,
    ...(ativo.comentarioCoordenador ? [{ icone: 'message-square', titulo: 'Comentário da coordenação', detalhe: ativo.comentarioCoordenador }] : []),
    { icone: iconeVisibilidade(ativo.visibilidade), titulo: 'Alcance: ' + rotuloVisibilidade(ativo.visibilidade), detalhe: alcance ? alcance.descricao : '' },
    { icone: 'tag', titulo: 'Versão ' + ativo.versao, detalhe: ativo.atualizadoEm ? 'Atualizado ' + tempoRelativo(ativo.atualizadoEm) : '' },
  ];

  const fechar = () => {
    setConfirmando(false);
    setCiente(false);
  };
  const confirmar = () => {
    usar(ativo.id);
    fechar();
    avisar(`Pronto! Uma cópia foi pro seu ${ferramenta}. O crédito fica com ${autor.primeiro}.`);
  };

  return (
    <div className="stack stack-5">
      <BotaoSec icone="arrow-left" onClick={voltar} style={{ alignSelf: 'flex-start', paddingLeft: 'var(--space-3)' }}>
        Voltar
      </BotaoSec>

      <section className="capa-ativo">
        <div className="row row-3 wrap">
          <span className="tipo-ativo">
            <Icon name={iconeTipo(ativo.tipo)} size={20} color="var(--brand)" />
            {ativo.tipo}
          </span>
          {STATUS[ativo.status] && <Badge tone="neutral">{STATUS[ativo.status]}</Badge>}
        </div>
        <h1 className="titulo-pagina">{ativo.titulo}</h1>
        <p className="texto">{ativo.resumo}</p>
        {/* Origem da adaptação, com link para o original (RF-09, RF-27). */}
        {ativo.derivadoDe && (
          <div className="row row-2">
            <Icon name="git-fork" size={16} color="var(--ih-ink2)" />
            <p className="texto">
              Adaptado de{' '}
              <Link para={'/ativo/' + ativo.derivadoDe.id} className="btn-texto">
                {ativo.derivadoDe.nome}
              </Link>
              {ativo.derivadoDe.autor && `, de ${ativo.derivadoDe.autor.nome}`}
            </p>
          </div>
        )}
        <button type="button" className="linha-pessoa" onClick={() => irPara('/perfil/' + autor.id)}>
          <Foto pessoa={autor} tamanho={48} />
          <span className="stack stack-1">
            <span className="nome">{autor.nome}</span>
            <span className="meta">{[autor.cargo, autor.squad, ativo.atualizadoEm && tempoRelativo(ativo.atualizadoEm)].filter(Boolean).join(' · ')}</span>
          </span>
        </button>
      </section>

      <div className="row wrap" style={{ gap: 'var(--space-2) var(--space-4)' }}>
        {/* Só o publicado se usa, adapta e curte. Na fila, o coordenador lê o post antes de decidir. */}
        {publicado && (
          <>
            <Pulso gatilho={usado} efeito="confirmar">
              <Button
                variant="primary"
                size="sm"
                iconLeft={usado ? 'check' : 'download'}
                onClick={() => {
                  if (!usado) setConfirmando(true);
                }}
              >
                {usado ? 'Em uso' : 'Usar'}
              </Button>
            </Pulso>
            <BotaoSec icone="git-fork" onClick={() => avisar(`Criamos sua versão. Ela entra na árvore como derivada do trabalho de ${autor.primeiro}.`)}>
              Adaptar pra mim
            </BotaoSec>
            <BotaoCurtir ativo={ativo} />
          </>
        )}
        <span className="texto">
          {reusosDe(ativo)} reaproveitamentos · {ativo.adapt} adaptações
        </span>
      </div>

      <div className="colunas">
        <div className="coluna-principal coluna-principal-ativo">
          {ativo.readme && (
            <section className="stack stack-4">
              <h2 className="titulo-secao">Sobre</h2>
              <Markdown texto={ativo.readme} />
            </section>
          )}

          {ativo.ferr.length > 0 && <UsarEm key={ativo.id} ativo={ativo} />}

          <section className="stack stack-2">
            <h2 className="titulo-secao">O que tem dentro</h2>
            {ativo.dentro.map((d) => (
              <div key={d.nome} className="item-dentro">
                <Icon name="file-text" size={20} color="var(--ih-ink3)" />
                <span className="nome" style={{ flex: 'none' }}>
                  {d.nome}
                </span>
                <span className="texto">{d.detalhe}</span>
              </div>
            ))}
          </section>

          {/* Manual de quem publicou (RF-17). O botão de instalar com o manual é o RF-29 (T-20). */}
          {ativo.manualInstalacao && (
            <section className="stack stack-4">
              <h2 className="titulo-secao">Como instalar</h2>
              <Markdown texto={ativo.manualInstalacao} />
            </section>
          )}

          <section className="stack stack-4">
            <div className="stack stack-2">
              <h2 className="titulo-secao">Árvore de adaptações</h2>
              <p className="texto">Cada versão guarda de onde veio. O crédito volta pra quem criou o original.</p>
            </div>
            <div className="row row-3">
              <Foto pessoa={autor} tamanho={48} anel />
              <span className="stack stack-1">
                <span className="nome">Original · {autor.nome}</span>
                <span className="meta">
                  {autor.papel} · {autor.squad}
                </span>
              </span>
            </div>
            <div className="arvore-ramos">
              {ativo.deriv.map((d, i) => (
                <LinhaPessoa key={d.pessoa.id || i} pessoa={d.pessoa} detalhe={d.detalhe || d.pessoa.papel} texto={d.texto} />
              ))}
            </div>
          </section>
        </div>

        <aside className="coluna-lateral">
          <TempoEconomizado ativo={ativo} reusos={reusosDe(ativo)} />

          <div className="painel">
            <div className="stack stack-2">
              <h2 className="titulo-card">O que ele acessa</h2>
              <p className="meta">Declarado por quem publicou. Você confirma antes de usar.</p>
            </div>
            <ListaAcessos acessos={ativo.acessos} />
          </div>

          <div className="painel">
            <h2 className="titulo-card">Quem reaproveitou</h2>
            {papeis ? (
              <>
                <p className="texto">
                  {deFora} dos {ativo.reusos} reaproveitamentos vieram de fora de {autor.papel}.
                </p>
                {PAPEIS.map((papel, i) => (
                  <div key={papel} className="stack stack-2">
                    <div className="row spread nome" style={{ lineHeight: 1 }}>
                      <span>{papel}</span>
                      <span style={{ color: 'var(--ih-ink2)' }}>{papeis[i]}</span>
                    </div>
                    <div className="barra-papel">
                      <span style={{ width: Math.round((papeis[i] / maior) * 100) + '%' }} />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <p className="texto">
                  {squads.length === 0
                    ? 'Nenhuma squad reaproveitou ainda.'
                    : `${squads.length} ${squads.length === 1 ? 'squad reaproveitou' : 'squads reaproveitaram'}.`}
                </p>
                {squads.map((s) => (
                  <div key={s} className="row row-3">
                    <Icon name="users" size={20} color="var(--ih-ink2)" />
                    <span className="texto" style={{ color: 'var(--ih-ink)' }}>
                      {s}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="painel">
            <h2 className="titulo-card">Governança</h2>
            {/* O histórico repete eventos ("Validação realizada" a cada rodada): a chave leva a posição. */}
            {trilha.map((t, i) => (
              <div key={i + t.titulo} className="row row-3">
                <span className="icone-quadrado">
                  <Icon name={t.icone} size={20} />
                </span>
                <span className="stack stack-1">
                  <span className="nome">{t.titulo}</span>
                  <span className="meta">{t.detalhe}</span>
                </span>
              </div>
            ))}
            {ehCoordenador && (
              <Link para={'/coord/dados/' + ativo.id} className="btn btn-sec" style={{ alignSelf: 'flex-start' }}>
                <Icon name="chart-column" size={18} />
                Ver dados deste ativo
              </Link>
            )}
          </div>
        </aside>
      </div>

      {confirmando && (
        <Dialog
          title={`Usar a versão ${ativo.versao}`}
          onClose={fechar}
          width={520}
          actions={
            <>
              <BotaoSec onClick={fechar}>Agora não</BotaoSec>
              <Button variant="secondary" size="sm" disabled={!ciente} onClick={confirmar}>
                Usar
              </Button>
            </>
          }
        >
          <div className="stack stack-4">
            <p className="texto">Antes de usar, veja o que este ativo acessa no seu ambiente.</p>
            <ListaAcessos acessos={ativo.acessos} />
            <Checkbox checked={ciente} onChange={setCiente} label="Entendi o que este ativo acessa" />
            <div>
              <SeloSimulado ajuda="O uso é simulado. Nada é instalado nem copiado; só o contador de reaproveitamentos muda.">Uso simulado</SeloSimulado>
            </div>
          </div>
        </Dialog>
      )}

      {naFila && !envioVisto && (
        <Aviso>
          <Toast tone="success" onClose={() => setEnvioVisto(true)}>
            {`Enviado! Seu post está na fila da coordenação da ${autor.squad}.`}
            {autorOriginal && ` Quando for aprovado, o crédito da adaptação vai para ${autorOriginal}.`}
          </Toast>
        </Aviso>
      )}
    </div>
  );
}
