import React from "react";
import { Button, Icon, Card, Badge, Tag, Input, Select, Toast } from "../ds.js";
import { SeloSimulado, Meta, SeloGrau, Avatar, Painel } from "../components/comuns.jsx";
import { TextArea } from "../components/TextArea.jsx";
import { irPara } from "../router.jsx";
import { useSessao } from "../sessao.jsx";
import {
  CRITERIOS,
  VEREDITOS,
  rascunhoAna,
  verificacaoReprovada,
  verificacaoAprovada,
} from "../data/governanca.js";
import { VISIBILIDADES, rotuloTipo, iconeTipo } from "../data/catalogo.js";

// Ato 1 da demo: o hook detecta, o agente verifica, a pessoa corrige e a coordenação decide.
// O fio é sempre o mesmo: entrada, trabalho do agente, revisão humana, resultado registrado.

const PASSOS = [
  { n: 1, rotulo: "Detecção" },
  { n: 2, rotulo: "Verificação" },
  { n: 3, rotulo: "Post" },
  { n: 4, rotulo: "Fila" },
];

// Resultado de cada critério. Falha usa azul-marinho, nunca vermelho.
const RESULTADOS = {
  ok: { icone: "circle-check", cor: "var(--status-success)", rotulo: "Sem apontamento" },
  atencao: { icone: "triangle-alert", cor: "var(--text-primary)", rotulo: "Atenção" },
  falhou: { icone: "circle-alert", cor: "var(--status-error)", rotulo: "Precisa de ajuste" },
  humano: { icone: "user-round", cor: "var(--status-info)", rotulo: "Revisão humana" },
};

const DURACAO_VERIFICACAO = 1200;

function acharCriterio(id) {
  return CRITERIOS.find((c) => c.id === id);
}

// Evidência que cita arquivo ou trecho de código ganha fonte mono.
function pareceCodigo(texto) {
  return /\.(md|py|jsx?|tsx?|json|ya?ml)\b/.test(texto) || /[A-Z_]{3,}\s*=/.test(texto);
}

function Passos({ atual }) {
  return (
    <nav aria-label="Passos da publicação">
      <ol className="row row-2 wrap" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {PASSOS.map((p, i) => {
          const agora = p.n === atual;
          const concluido = p.n < atual;
          return (
            <li key={p.n} className="row row-2">
              <span
                aria-current={agora ? "step" : undefined}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  height: 36,
                  padding: "0 var(--space-3)",
                  borderRadius: "var(--radius-pill)",
                  background: agora
                    ? "var(--itau-laranja)"
                    : concluido
                      ? "var(--surface-muted)"
                      : "transparent",
                  color: agora
                    ? "var(--itau-preto)"
                    : concluido
                      ? "var(--text-primary)"
                      : "var(--text-tertiary)",
                  boxShadow: agora || concluido ? "none" : "inset 0 0 0 1px var(--border-subtle)",
                  font: "var(--fw-bold) var(--fs-body-sm)/1 var(--font-text)",
                  whiteSpace: "nowrap",
                }}
              >
                {concluido ? <Icon name="check" size={16} /> : <span>{p.n}</span>}
                {p.rotulo}
              </span>
              {i < PASSOS.length - 1 && (
                <Icon name="chevron-right" size={16} color="var(--text-tertiary)" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function LinhaCriterio({ item }) {
  const criterio = acharCriterio(item.criterio);
  const r = RESULTADOS[item.resultado] || RESULTADOS.ok;
  const evidenciaCodigo = item.evidencia ? pareceCodigo(item.evidencia) : false;
  return (
    <li
      className="row row-3"
      style={{
        alignItems: "flex-start",
        padding: "var(--space-4) 0",
        boxShadow: "inset 0 1px 0 var(--border-subtle)",
      }}
    >
      <Icon
        name={r.icone}
        size={22}
        color={r.cor}
        label={r.rotulo}
        style={{ flex: "none", marginTop: 2 }}
      />
      <div className="stack stack-2 grow">
        <div className="row row-2 wrap">
          <span style={{ font: "var(--fw-bold) var(--fs-body)/1.3 var(--font-text)" }}>
            {criterio ? criterio.nome : item.criterio}
          </span>
          {criterio && <Badge tone="neutral">{criterio.checagem}</Badge>}
        </div>
        <div className="small">{item.titulo}</div>
        {item.evidencia && (
          <div
            className={evidenciaCodigo ? "mono" : "caption"}
            style={
              evidenciaCodigo
                ? {
                    padding: "var(--space-2) var(--space-3)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--surface-subtle)",
                    color: "var(--text-secondary)",
                    overflowWrap: "anywhere",
                  }
                : undefined
            }
          >
            {item.evidencia}
          </div>
        )}
        {item.comoCorrigir && (
          <Painel icone="wand-sparkles" cor="var(--itau-laranja)">
            <span style={{ font: "var(--fw-bold) var(--fs-body-sm)/1.3 var(--font-text)" }}>
              Como corrigir
            </span>
            <span className="muted">{item.comoCorrigir}</span>
          </Painel>
        )}
      </div>
    </li>
  );
}

function TabelaCriterios() {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <caption className="caption" style={{ textAlign: "left", paddingBottom: "var(--space-2)" }}>
          O mesmo checklist roda em todo ativo, seja qual for a squad.
        </caption>
        <thead>
          <tr>
            <th
              className="caption"
              style={{ padding: "var(--space-2) var(--space-3) var(--space-2) 0" }}
            >
              Critério
            </th>
            <th className="caption" style={{ padding: "var(--space-2) 0" }}>
              Como é checado
            </th>
          </tr>
        </thead>
        <tbody>
          {CRITERIOS.map((c) => (
            <tr key={c.id} style={{ boxShadow: "inset 0 1px 0 var(--border-subtle)" }}>
              <td
                className="small"
                style={{
                  padding: "var(--space-3) var(--space-3) var(--space-3) 0",
                  verticalAlign: "top",
                }}
              >
                {c.nome}
              </td>
              <td className="small muted" style={{ padding: "var(--space-3) 0", verticalAlign: "top" }}>
                {c.checagem}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Gate({ icone, titulo, detalhe, estado, ultimo }) {
  const estados = {
    concluido: { cor: "var(--status-success)", rotulo: "Concluído", tone: "success" },
    esperando: { cor: "var(--itau-laranja)", rotulo: "Esperando", tone: "brand" },
    pendente: { cor: "var(--text-tertiary)", rotulo: "Depois", tone: "neutral" },
  };
  const e = estados[estado] || estados.pendente;
  return (
    <li className="row row-3" style={{ alignItems: "flex-start" }}>
      <span
        aria-hidden="true"
        style={{
          width: 40,
          height: 40,
          flex: "none",
          display: "grid",
          placeItems: "center",
          borderRadius: "var(--radius-pill)",
          background: "var(--surface-subtle)",
          color: e.cor,
        }}
      >
        <Icon name={icone} size={20} />
      </span>
      <div className="stack stack-1 grow" style={{ paddingBottom: ultimo ? 0 : "var(--space-4)" }}>
        <div className="row row-2 wrap">
          <span style={{ font: "var(--fw-bold) var(--fs-body)/1.3 var(--font-text)" }}>{titulo}</span>
          <Badge tone={e.tone}>{e.rotulo}</Badge>
        </div>
        <div className="caption">{detalhe}</div>
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
  const [mostrarCriterios, setMostrarCriterios] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [erros, setErros] = React.useState({});

  // Campos do post, pré-preenchidos a partir do rascunho detectado.
  const [nome, setNome] = React.useState(rascunhoAna.nome);
  const [resumo, setResumo] = React.useState(rascunhoAna.resumo);
  const [readme, setReadme] = React.useState(rascunhoAna.readme);
  const [visibilidade, setVisibilidade] = React.useState(rascunhoAna.visibilidade);
  const [tags, setTags] = React.useState(rascunhoAna.tags);
  const [novaTag, setNovaTag] = React.useState("");
  const [projeto, setProjeto] = React.useState("");

  // A verificação é simulada: um tempo curto com os critérios sendo marcados.
  React.useEffect(() => {
    if (!verificando) return undefined;
    setRevelados(0);
    const intervalo = setInterval(
      () => setRevelados((n) => Math.min(n + 1, CRITERIOS.length)),
      DURACAO_VERIFICACAO / CRITERIOS.length,
    );
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
  const aprovado = resultado.veredito === "aprovado";
  const veredito = VEREDITOS[resultado.veredito];
  const corVeredito = aprovado ? "var(--status-success)" : "var(--status-error)";
  const semApontamento = resultado.itens.filter((i) => i.resultado === "ok").length;
  const visDef = VISIBILIDADES.find((v) => v.value === visibilidade) || VISIBILIDADES[0];

  function comecarVerificacao(proximaRodada) {
    setRodada(proximaRodada);
    setVerificando(true);
    setMostrarCriterios(false);
    setPasso(2);
  }

  // Sem nome ou sem resumo o post entraria vazio no catálogo: o campo avisa antes do envio.
  function enviarParaAprovacao() {
    const novos = {};
    if (!nome.trim()) novos.nome = "Escreva o nome do ativo para enviar. Ele é o que aparece no catálogo.";
    if (!resumo.trim()) novos.resumo = "Escreva o resumo para enviar. São as 2 linhas que aparecem no catálogo.";
    setErros(novos);
    if (novos.nome || novos.resumo) return;
    setPasso(4);
  }

  function adicionarTag(e) {
    e.preventDefault();
    const limpa = novaTag.trim().toLowerCase();
    if (limpa && !tags.includes(limpa)) setTags([...tags, limpa]);
    setNovaTag("");
  }

  function recomecar() {
    setPasso(1);
    setRodada(1);
    setVerificando(false);
    setRevelados(0);
    setAdiado(false);
    setMostrarCriterios(false);
    setNome(rascunhoAna.nome);
    setResumo(rascunhoAna.resumo);
    setReadme(rascunhoAna.readme);
    setVisibilidade(rascunhoAna.visibilidade);
    setTags(rascunhoAna.tags);
    setNovaTag("");
    setProjeto("");
    setErros({});
  }

  return (
    <div className="container page stack stack-6">
      <header className="stack stack-3" style={{ maxWidth: 820 }}>
        <span className="eyebrow">Publicar</span>
        <h1
          style={{
            font: "var(--fw-bold) var(--fs-h1)/var(--lh-heading) var(--font-display)",
            letterSpacing: "var(--ls-display)",
          }}
        >
          Publicar um ativo
        </h1>
        <p className="muted">
          O hook detecta, o agente verifica, você decide o que vai no post e a coordenação aprova.
          Cada passo fica registrado no histórico do ativo.
        </p>
        <Passos atual={passo} />
      </header>

      {passo === 1 && (
        <section className="stack stack-5" style={{ maxWidth: 820 }}>
          <Card>
            <div className="stack stack-4">
              <div className="row spread row-3 wrap">
                <span className="row row-2">
                  <Icon name="terminal" size={20} color="var(--itau-laranja)" />
                  <span style={{ font: "var(--fw-bold) var(--fs-body)/1.2 var(--font-text)" }}>
                    O hook viu um ativo novo na sua sessão
                  </span>
                </span>
                <SeloSimulado ajuda="A detecção viria de um hook da ferramenta de código. Aqui é um roteiro fixo da demonstração.">
                  Detecção simulada
                </SeloSimulado>
              </div>

              <div className="stack stack-2">
                <div className="row row-2 wrap">
                  <Icon name={iconeTipo(rascunhoAna.tipo)} size={18} color="var(--text-tertiary)" />
                  <span
                    style={{ font: "var(--fw-bold) var(--fs-h3)/var(--lh-heading) var(--font-display)" }}
                  >
                    {rascunhoAna.nome}
                  </span>
                  <Badge tone="neutral">{rotuloTipo(rascunhoAna.tipo)}</Badge>
                </div>
                <div
                  className="mono"
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--surface-subtle)",
                    color: "var(--text-secondary)",
                    overflowWrap: "anywhere",
                  }}
                >
                  {rascunhoAna.caminho}
                </div>
                <div className="row row-4 wrap">
                  <Meta icone="clock">{rascunhoAna.detectadoEm}</Meta>
                  <Meta icone="user-round">{rascunhoAna.autor.nome}</Meta>
                  <Meta icone="building-2">{rascunhoAna.autor.squad}</Meta>
                </div>
              </div>

              <p className="small muted">
                A ideia é que publicar seja efeito colateral do trabalho, não tarefa extra: você já escreveu
                a skill, a gente monta o resto e devolve para você conferir. Ainda não testamos se isso
                mantém o catálogo vivo.
              </p>
            </div>
          </Card>

          {adiado && (
            <Painel icone="clock" cor="var(--itau-laranja)">
              <span style={{ font: "var(--fw-bold) var(--fs-body-sm)/1.3 var(--font-text)" }}>
                A publicação ficou agendada para o fim da tarefa
              </span>
              <span className="muted">
                Nada sai sem você. O aviso volta quando a tarefa fechar, e até lá o rascunho
                continua só seu.
              </span>
            </Painel>
          )}

          <div className="row row-3 wrap">
            <Button variant="primary" iconRight="arrow-right" onClick={() => comecarVerificacao(1)}>
              Quero verificar
            </Button>
            <Button variant="ghost" onClick={() => setAdiado(true)}>
              Agora não
            </Button>
          </div>
        </section>
      )}

      {passo === 2 && (
        <section className="stack stack-5" style={{ maxWidth: 820 }}>
          {verificando ? (
            <Card>
              <div className="stack stack-4">
                <div className="row spread row-3 wrap">
                  <span className="row row-2">
                    <Icon name="shield-check" size={20} color="var(--itau-laranja)" />
                    <span style={{ font: "var(--fw-bold) var(--fs-body)/1.2 var(--font-text)" }}>
                      Verificando o ativo
                    </span>
                  </span>
                  <SeloSimulado ajuda="O agente validador é simulado. O resultado desta demonstração é fixo.">
                    Agente validador
                  </SeloSimulado>
                </div>
                <ul className="stack stack-3" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {CRITERIOS.map((c, i) => {
                    const pronto = i < revelados;
                    return (
                      <li key={c.id} className="row row-3">
                        <Icon
                          name={pronto ? "check" : "clock"}
                          size={18}
                          color={pronto ? "var(--status-success)" : "var(--text-tertiary)"}
                          style={{ flex: "none" }}
                        />
                        <span
                          className="small"
                          style={{
                            color: pronto ? "var(--text-primary)" : "var(--text-tertiary)",
                            transition: "color var(--dur-base) var(--ease-standard)",
                          }}
                        >
                          {c.nome}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="caption" role="status">
                  {revelados} de {CRITERIOS.length} critérios checados
                </div>
              </div>
            </Card>
          ) : (
            <>
              <Card>
                <div className="stack stack-4">
                  <div className="row row-3 wrap" style={{ alignItems: "flex-start" }}>
                    <Icon
                      name={aprovado ? "circle-check" : "circle-alert"}
                      size={32}
                      color={corVeredito}
                      style={{ flex: "none" }}
                    />
                    <div className="stack stack-2 grow">
                      <span
                        style={{
                          font: "var(--fw-bold) var(--fs-h3)/var(--lh-heading) var(--font-display)",
                          color: corVeredito,
                        }}
                      >
                        {veredito.rotulo}
                      </span>
                      <div className="row row-4 wrap">
                        <Meta icone="clock">Rodada {resultado.rodadaEm}</Meta>
                        <Meta icone="activity">{resultado.duracao}</Meta>
                        <Meta icone="shield-check">
                          {semApontamento} de {resultado.itens.length} critérios sem apontamento
                        </Meta>
                      </div>
                    </div>
                    <SeloSimulado ajuda="O agente validador é simulado. O resultado desta demonstração é fixo.">
                      Agente validador
                    </SeloSimulado>
                  </div>

                  <p className="small muted">
                    {aprovado
                      ? "O aviso de similaridade segue na lista como atenção. Ele informa quem for reaproveitar, não bloqueia a publicação."
                      : "Quando reprova, a verificação sempre diz o motivo e como corrigir. Nada é recusado sem explicação."}
                  </p>

                  <ul className="stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {resultado.itens.map((item) => (
                      <LinhaCriterio key={item.criterio} item={item} />
                    ))}
                  </ul>
                </div>
              </Card>

              <div className="stack stack-3">
                <div>
                  <Button
                    variant="ghost"
                    iconRight={mostrarCriterios ? "chevron-down" : "chevron-right"}
                    onClick={() => setMostrarCriterios(!mostrarCriterios)}
                  >
                    Ver o que cada critério checa
                  </Button>
                </div>
                {mostrarCriterios && (
                  <Card tone="subtle">
                    <TabelaCriterios />
                  </Card>
                )}
              </div>

              <div className="row row-3 wrap">
                {aprovado ? (
                  <Button variant="primary" iconRight="arrow-right" onClick={() => setPasso(3)}>
                    Montar o post
                  </Button>
                ) : (
                  <Button variant="primary" iconLeft="rotate-ccw" onClick={() => comecarVerificacao(2)}>
                    Corrigi, verificar de novo
                  </Button>
                )}
                <Button variant="ghost" iconLeft="arrow-left" onClick={() => setPasso(1)}>
                  Voltar à detecção
                </Button>
              </div>
            </>
          )}
        </section>
      )}

      {passo === 3 && (
        <section className="stack stack-5">
          <p className="muted" style={{ maxWidth: 820 }}>
            Montamos o post a partir do seu README e dos dados da sua squad.
            Ajuste o que quiser antes de enviar.
          </p>

          <div className="cols-detalhe">
            <div className="stack stack-5">
              <Card>
                <div className="stack stack-5">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                      gap: "var(--space-4)",
                    }}
                  >
                    <Input
                      label="Nome do ativo"
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value);
                        if (erros.nome) setErros((atual) => ({ ...atual, nome: "" }));
                      }}
                      helper="Comece pelo que o ativo faz, não pela tecnologia."
                      error={erros.nome}
                    />
                    <Select
                      label="Quem pode ver"
                      value={visibilidade}
                      onChange={(e) => setVisibilidade(e.target.value)}
                      options={VISIBILIDADES.map((v) => ({ value: v.value, label: v.label }))}
                      helper={visDef.descricao}
                    />
                  </div>

                  <TextArea
                    label="Resumo"
                    value={resumo}
                    onChange={(e) => {
                      setResumo(e.target.value);
                      if (erros.resumo) setErros((atual) => ({ ...atual, resumo: "" }));
                    }}
                    rows={3}
                    helper="2 linhas bastam. É o que aparece no catálogo."
                    error={erros.resumo}
                  />

                  <TextArea
                    label="README"
                    value={readme}
                    onChange={(e) => setReadme(e.target.value)}
                    rows={12}
                    mono
                    helper="Veio do arquivo da skill: o que faz, quando usar e os limites."
                  />

                  <div className="stack stack-3">
                    <span style={{ font: "var(--fw-bold) var(--fs-body-sm)/1.2 var(--font-text)" }}>
                      Tags
                    </span>
                    <div className="row row-2 wrap">
                      {tags.map((t) => (
                        <Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>
                          {t}
                        </Tag>
                      ))}
                      {tags.length === 0 && <span className="caption">Sem tags por enquanto.</span>}
                    </div>
                    <form onSubmit={adicionarTag}>
                      <Input
                        label="Adicionar tag"
                        value={novaTag}
                        onChange={(e) => setNovaTag(e.target.value)}
                        placeholder="Por exemplo: refinamento"
                        helper="Digite e pressione Enter."
                      />
                    </form>
                  </div>

                  <Input
                    label="Em que projeto você usou"
                    value={projeto}
                    onChange={(e) => setProjeto(e.target.value)}
                    placeholder="Por exemplo: refinamento do backlog de emissão"
                    helper="Esse contexto ajuda quem for reaproveitar a saber se serve para o caso dele."
                  />
                </div>
              </Card>

              <div className="row row-3 wrap">
                <Button variant="primary" iconRight="send" onClick={enviarParaAprovacao}>
                  Enviar para aprovação
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setToast("Rascunho salvo. Ele continua visível só para você.")}
                >
                  Salvar rascunho
                </Button>
              </div>
            </div>

            <div className="stack stack-3 sticky">
              <div className="row spread row-2 wrap">
                <span className="caption">Prévia no catálogo</span>
                <SeloSimulado ajuda="Prévia do card. O catálogo desta demonstração usa dados fictícios.">
                  Prévia
                </SeloSimulado>
              </div>
              <Card eyebrow={rotuloTipo(rascunhoAna.tipo)} title={nome || "Sem nome ainda"}>
                <div className="stack stack-3">
                  <span>{resumo || "Escreva um resumo para ele aparecer aqui."}</span>
                  <div className="row row-2 wrap">
                    {tags.map((t) => (
                      <Badge key={t} tone="neutral">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <div className="row row-2">
                    <Avatar iniciais={rascunhoAna.autor.iniciais} tamanho={32} />
                    <span className="stack" style={{ lineHeight: 1.2 }}>
                      <span
                        style={{
                          font: "var(--fw-bold) var(--fs-body-sm)/1.2 var(--font-text)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {rascunhoAna.autor.nome}
                      </span>
                      <span className="caption">{rascunhoAna.autor.squad}</span>
                    </span>
                  </div>
                  <div className="row row-3 wrap">
                    <Meta icone={visDef.icone}>{visDef.label}</Meta>
                    {projeto && <Meta icone="folder">{projeto}</Meta>}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {passo === 4 && (
        <section className="stack stack-5" style={{ maxWidth: 820 }}>
          <Card>
            <div className="stack stack-4">
              <div className="row spread row-3 wrap">
                <span className="row row-3">
                  <Icon name="circle-check" size={28} color="var(--status-success)" />
                  <span
                    style={{ font: "var(--fw-bold) var(--fs-h3)/var(--lh-heading) var(--font-display)" }}
                  >
                    {nome} entrou na fila da coordenação
                  </span>
                </span>
                <SeloSimulado ajuda="A fila de aprovação é simulada. Nenhum sistema do Itaú é acionado.">
                  Fila simulada
                </SeloSimulado>
              </div>

              <div className="row row-3 wrap">
                <SeloGrau grau={verificacaoAprovada.grau} />
                <Meta icone={visDef.icone}>{visDef.label}</Meta>
                <Meta icone="clock">Enviado {verificacaoAprovada.rodadaEm}</Meta>
              </div>

              <ul className="stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                <Gate
                  icone="shield-check"
                  titulo="Agente validador"
                  estado="concluido"
                  detalhe={
                    "Aprovado na 2ª rodada, " +
                    verificacaoAprovada.rodadaEm +
                    ", em " +
                    verificacaoAprovada.duracao +
                    "."
                  }
                />
                <Gate
                  icone="clipboard-check"
                  titulo="Coordenação"
                  estado="esperando"
                  detalhe="Rafael Costa, coordenação de Cartões, é quem decide a publicação."
                />
                <Gate
                  icone={visDef.icone}
                  titulo="Publicação"
                  estado="pendente"
                  detalhe={"Com o aval, o ativo entra no catálogo. " + visDef.descricao}
                  ultimo
                />
              </ul>

              <Painel icone="scale">
                <span style={{ font: "var(--fw-bold) var(--fs-body-sm)/1.3 var(--font-text)" }}>
                  Grau baixo passa por 2 gates
                </span>
                <span className="muted">
                  Um ativo de grau alto, que toca dado de cliente ou age fora do banco,
                  acrescentaria o parecer de risco e segurança antes da coordenação.
                </span>
              </Painel>

              <Painel icone="history">
                <span style={{ font: "var(--fw-bold) var(--fs-body-sm)/1.3 var(--font-text)" }}>
                  O que fica registrado
                </span>
                <span className="muted">
                  Quem criou, o que o validador apontou nas duas rodadas e quem aprovou a publicação.
                  Esse histórico acompanha o ativo e fica visível para quem for reaproveitar.
                </span>
              </Painel>
            </div>
          </Card>

          <div className="stack stack-3">
            <div className="row row-3 wrap">
              <Button variant="outline" iconRight="arrow-right" onClick={() => irPara("/aprovacoes")}>
                Ver a fila de aprovação
              </Button>
              <Button variant="ghost" iconLeft="rotate-ccw" onClick={recomecar}>
                Publicar outro ativo
              </Button>
            </div>
            {!ehCoordenador && (
              <p className="caption">
                A fila é da coordenação. Troque para o perfil Coordenação no topo da tela para abri-la.
              </p>
            )}
          </div>
        </section>
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: "var(--space-6)",
            transform: "translateX(-50%)",
            zIndex: 1100,
          }}
        >
          <Toast tone="neutral" onClose={() => setToast(null)}>
            {toast}
          </Toast>
        </div>
      )}
    </div>
  );
}
