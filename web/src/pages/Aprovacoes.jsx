import React from "react";
import { Button, IconButton, Icon, Card, Badge, Tabs, Dialog, Toast, Input } from "../ds.js";
import { Avatar, SeloSimulado, Meta, Vazio, SeloGrau, Painel } from "../components/comuns.jsx";
import { useSessao } from "../sessao.jsx";
import { filaAprovacao, VEREDITOS } from "../data/governanca.js";
import { iconeTipo, rotuloTipo } from "../data/catalogo.js";

// Ícones do veredito dentro do conjunto que o protótipo usa.
const ICONE_VEREDITO = { aprovado: "circle-check", humano: "user-round", reprovado: "circle-alert" };

// Tom do apontamento: erro é azul-marinho com ícone, nunca vermelho.
const TOM_APONTAMENTO = {
  alerta: { icone: "triangle-alert", cor: "var(--status-error)" },
  atencao: { icone: "triangle-alert", cor: "var(--text-primary)" },
  info: { icone: "info", cor: "var(--text-tertiary)" },
};

const DECISOES = {
  aprovar: { rotulo: "Publicação aprovada", tone: "success", toast: "Publicação aprovada.", icone: "circle-check" },
  ajuste: { rotulo: "Ajuste pedido", tone: "neutral", toast: "Pedido de ajuste enviado.", icone: "rotate-ccw" },
  recusar: { rotulo: "Publicação recusada", tone: "dark", toast: "Publicação recusada.", icone: "x" },
};

// Só o gate da coordenação é seu. O do agente já passou; o de risco fica pendente.
function estadoDoGate(nome) {
  if (nome === "Agente validador") return { icone: "circle-check", cor: "var(--status-success)", nota: "Concluído", atual: false };
  if (nome === "Coordenação") return { icone: "user-round", cor: "var(--itau-laranja)", nota: "Você, agora", atual: true };
  return { icone: "clock", cor: "var(--text-tertiary)", nota: "Pendente", atual: false };
}

function Trilha({ gates }) {
  return (
    <div className="row row-2 wrap" role="group" aria-label="Etapas até a publicação">
      {gates.map((gate, i) => {
        const e = estadoDoGate(gate);
        return (
          <React.Fragment key={gate}>
            {i > 0 && <Icon name="chevron-right" size={16} color="var(--text-tertiary)" />}
            <span
              className="row row-2"
              style={{
                padding: "var(--space-2) var(--space-3)",
                borderRadius: "var(--radius-md)",
                background: e.atual ? "var(--surface-card)" : "var(--surface-subtle)",
                boxShadow: e.atual ? "inset 0 0 0 2px var(--itau-preto)" : "none",
              }}
            >
              <Icon name={e.icone} size={18} color={e.cor} />
              <span className="stack">
                <span style={{ font: "var(--fw-bold) var(--fs-body-sm)/1.2 var(--font-text)" }}>{gate}</span>
                <span className="caption">{e.nota}</span>
              </span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Apontamento({ tom, texto }) {
  const t = TOM_APONTAMENTO[tom] || TOM_APONTAMENTO.info;
  return (
    <li className="row row-2" style={{ alignItems: "flex-start" }}>
      <Icon name={t.icone} size={18} color={t.cor} style={{ marginTop: 2 }} />
      <span className="small">{texto}</span>
    </li>
  );
}

function ItemFila({ item, aberto, aoAlternar, aoAprovar, aoPedirAjuste, aoRecusar }) {
  const veredito = VEREDITOS[item.veredito];
  // Grau alto não se decide na hierarquia: risco e segurança opina antes.
  const bloqueado = item.grau === "alto";

  return (
    <Card>
      <div className="stack stack-4">
        <div className="row row-3 spread">
          <div className="row row-3 grow">
            <span
              style={{
                width: 40,
                height: 40,
                flex: "none",
                display: "grid",
                placeItems: "center",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-subtle)",
              }}
            >
              <Icon name={iconeTipo(item.tipo)} size={20} />
            </span>

            <div className="stack stack-2 grow">
              <div className="row row-3 wrap">
                <span style={{ font: "var(--fw-bold) var(--fs-h3)/var(--lh-heading) var(--font-display)" }}>{item.nome}</span>
                <Badge tone="neutral">{rotuloTipo(item.tipo)}</Badge>
              </div>

              <div className="row row-3 wrap">
                <span className="row row-2">
                  <Avatar iniciais={item.autor.iniciais} tamanho={24} />
                  <span className="small">{item.autor.nome}</span>
                </span>
                <span className="caption">{item.autor.squad}</span>
                <SeloGrau grau={item.grau} />
                <Badge tone={veredito.tone}>
                  <Icon name={ICONE_VEREDITO[item.veredito]} size={12} style={{ marginRight: "var(--space-1)" }} />
                  {veredito.rotulo}
                </Badge>
                <Meta icone="clock">esperando há {item.esperandoHa}</Meta>
              </div>
            </div>
          </div>

          <IconButton
            icon={aberto ? "chevron-down" : "chevron-right"}
            label={aberto ? `Fechar os detalhes de ${item.nome}` : `Ver os detalhes de ${item.nome}`}
            onClick={aoAlternar}
          />
        </div>

        {aberto && (
          <div className="stack stack-5">
            <hr className="divider" />

            <p className="muted">{item.resumo}</p>

            <Trilha gates={item.gates} />

            <div
              className="stack stack-3"
              style={{ padding: "var(--space-4)", borderRadius: "var(--radius-md)", background: "var(--surface-subtle)" }}
            >
              <div className="row row-2 wrap">
                <Icon name="bot" size={18} color="var(--text-tertiary)" />
                <span style={{ font: "var(--fw-bold) var(--fs-body-sm)/1.2 var(--font-text)" }}>
                  O que o agente validador achou
                </span>
                <SeloSimulado ajuda="A verificação é simulada. Nenhum código real foi analisado.">
                  Verificação simulada
                </SeloSimulado>
              </div>

              <p className="small">{item.resumoVerificacao}</p>

              <ul className="stack stack-2" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {item.apontamentos.map((a, i) => (
                  <Apontamento key={i} tom={a.tom} texto={a.texto} />
                ))}
              </ul>
            </div>

            <div className="stack stack-2">
              <div className="row row-3 wrap">
                {bloqueado ? (
                  <Button variant="primary" iconLeft="thumbs-up" disabled>
                    Aprovar publicação
                  </Button>
                ) : (
                  <Button variant="primary" iconLeft="thumbs-up" onClick={aoAprovar}>
                    Aprovar publicação
                  </Button>
                )}
                <Button variant="outline" iconLeft="rotate-ccw" onClick={aoPedirAjuste}>
                  Pedir ajuste
                </Button>
                <Button variant="ghost" iconLeft="x" onClick={aoRecusar}>
                  Recusar
                </Button>
              </div>

              {bloqueado && (
                <span className="caption">
                  Ativo de grau alto precisa do parecer de risco e segurança antes do seu. O pedido já foi encaminhado:
                  aprovar fica disponível quando o parecer chegar.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function ItemDecidido({ registro }) {
  const d = DECISOES[registro.decisao];
  return (
    <Card>
      <div className="stack stack-3">
        <div className="row row-3 spread wrap">
          <div className="row row-3">
            <Icon name={iconeTipo(registro.item.tipo)} size={20} color="var(--text-tertiary)" />
            <span style={{ font: "var(--fw-bold) var(--fs-body)/1.3 var(--font-text)" }}>{registro.item.nome}</span>
          </div>
          <Badge tone={d.tone}>
            <Icon name={d.icone} size={12} style={{ marginRight: "var(--space-1)" }} />
            {d.rotulo}
          </Badge>
        </div>

        <div className="row row-4 wrap">
          <Meta icone="user-round">{registro.quem}</Meta>
          <Meta icone="clock">{registro.quando}</Meta>
          <Meta icone="history">Gravado no histórico do ativo</Meta>
        </div>

        {registro.motivo && (
          <Painel>
            <span className="caption">Motivo que foi junto para {registro.item.autor.nome}</span>
            <span>{registro.motivo}</span>
          </Painel>
        )}
      </div>
    </Card>
  );
}

export function Aprovacoes() {
  const { pessoa } = useSessao();

  const [aba, setAba] = React.useState("espera");
  const [abertoId, setAbertoId] = React.useState(filaAprovacao[0] ? filaAprovacao[0].id : null);
  const [decididos, setDecididos] = React.useState([]);
  const [dialogo, setDialogo] = React.useState(null); // { id, decisao }
  const [motivo, setMotivo] = React.useState("");
  const [erroMotivo, setErroMotivo] = React.useState("");
  const [toast, setToast] = React.useState(null); // { id, texto, tone }

  const decididosIds = decididos.map((d) => d.id);
  const naFila = filaAprovacao.filter((i) => !decididosIds.includes(i.id));
  const itemDoDialogo = dialogo ? filaAprovacao.find((i) => i.id === dialogo.id) : null;

  function registrar(item, decisao, motivoTexto) {
    setDecididos((atual) => [
      { id: item.id, item, decisao, quem: pessoa.nome, quando: "agora há pouco", motivo: motivoTexto || "" },
      ...atual,
    ]);
    setAbertoId(null);
    setToast({ id: item.id, texto: DECISOES[decisao].toast, tone: decisao === "aprovar" ? "success" : "neutral" });
  }

  function fecharDialogo() {
    setDialogo(null);
    setMotivo("");
    setErroMotivo("");
  }

  // Pedir ajuste e recusar exigem motivo: é o que a pessoa autora vai ler.
  function enviarDialogo() {
    if (!motivo.trim()) {
      setErroMotivo("Escreva o motivo para enviar. Ele vai junto para a pessoa autora e fica no histórico do ativo.");
      return;
    }
    registrar(itemDoDialogo, dialogo.decisao, motivo.trim());
    fecharDialogo();
  }

  function desfazer() {
    if (!toast) return;
    setDecididos((atual) => atual.filter((d) => d.id !== toast.id));
    setAbertoId(toast.id);
    setAba("espera");
    setToast(null);
  }

  function abrirDialogo(item, decisao) {
    setMotivo("");
    setErroMotivo("");
    setDialogo({ id: item.id, decisao });
  }

  return (
    <div className="container page">
      <div className="stack stack-6">
        <header className="stack stack-2">
          <div className="row row-3 wrap">
            <span className="eyebrow">Coordenação</span>
            <SeloSimulado ajuda="Fila, ativos e pareceres desta tela são fictícios. Nada vem de um sistema do Itaú.">
              Fila simulada
            </SeloSimulado>
          </div>
          <h1 style={{ fontSize: "var(--fs-h1)" }}>Fila de aprovação</h1>
          <p className="muted" style={{ maxWidth: 660 }}>
            Aqui você decide o que da sua squad entra no catálogo. O agente validador já passou antes de você: ele conferiu
            os critérios e escreveu o que viu. A publicação continua sendo a sua decisão.
          </p>
        </header>

        <Tabs
          value={aba}
          onChange={setAba}
          items={[
            { value: "espera", label: `Esperando você (${naFila.length})` },
            { value: "decididos", label: `Já decididos (${decididos.length})` },
          ]}
        />

        {aba === "espera" && (
          <div className="stack stack-4">
            {naFila.length === 0 ? (
              <Vazio icone="circle-check" titulo="Nada esperando por você">
                A fila da sua squad está vazia. Quando alguém enviar um ativo para publicação, ele aparece aqui assim que o
                agente validador terminar a verificação.
              </Vazio>
            ) : (
              naFila.map((item) => (
                <ItemFila
                  key={item.id}
                  item={item}
                  aberto={abertoId === item.id}
                  aoAlternar={() => setAbertoId(abertoId === item.id ? null : item.id)}
                  aoAprovar={() => registrar(item, "aprovar")}
                  aoPedirAjuste={() => abrirDialogo(item, "ajuste")}
                  aoRecusar={() => abrirDialogo(item, "recusar")}
                />
              ))
            )}
          </div>
        )}

        {aba === "decididos" && (
          <div className="stack stack-4">
            <div className="row row-3 wrap">
              <span className="small muted">O que você decidiu nesta sessão fica registrado com o seu nome.</span>
              <SeloSimulado ajuda="O registro vive só nesta sessão do protótipo. Recarregar a página limpa tudo.">
                Registro simulado
              </SeloSimulado>
            </div>

            {decididos.length === 0 ? (
              <Vazio icone="history" titulo="Nada decidido nesta sessão">
                Assim que você aprovar, pedir ajuste ou recusar um item da fila, o registro da decisão aparece aqui.
              </Vazio>
            ) : (
              decididos.map((d) => <ItemDecidido key={d.id} registro={d} />)
            )}
          </div>
        )}

        <div className="row row-2" style={{ alignItems: "flex-start" }}>
          <Icon name="scale" size={18} color="var(--text-tertiary)" style={{ marginTop: 2 }} />
          <p className="small muted" style={{ maxWidth: 620 }}>
            O agente verifica e recomenda. A decisão de publicar é sempre de uma pessoa.
          </p>
        </div>
      </div>

      {dialogo && itemDoDialogo && (
        <Dialog
          title={dialogo.decisao === "ajuste" ? "Pedir ajuste" : "Recusar a publicação"}
          onClose={fecharDialogo}
          actions={
            <>
              <Button variant="ghost" onClick={fecharDialogo}>
                Voltar
              </Button>
              <Button variant="secondary" iconLeft="send" onClick={enviarDialogo}>
                {dialogo.decisao === "ajuste" ? "Enviar pedido" : "Registrar recusa"}
              </Button>
            </>
          }
        >
          <div className="stack stack-4">
            <p className="small">
              {itemDoDialogo.nome} · {itemDoDialogo.autor.nome}, {itemDoDialogo.autor.squad}.{" "}
              {dialogo.decisao === "ajuste"
                ? "O motivo vira a orientação do que precisa mudar antes de o ativo voltar para a fila."
                : "O motivo explica por que o ativo não entra no catálogo."}
            </p>
            <Input
              label="Motivo da decisão"
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
                if (erroMotivo) setErroMotivo("");
              }}
              placeholder={
                dialogo.decisao === "ajuste"
                  ? "Ex.: declare o limite de volume no README"
                  : "Ex.: a squad já mantém um ativo equivalente"
              }
              helper="Fica visível para a pessoa autora e no histórico do ativo."
              error={erroMotivo}
            />
          </div>
        </Dialog>
      )}

      {toast && (
        <div style={{ position: "fixed", right: "var(--space-5)", bottom: "var(--space-5)", zIndex: 1100 }}>
          <Toast tone={toast.tone} action="Desfazer" onAction={desfazer} onClose={() => setToast(null)}>
            {toast.texto}
          </Toast>
        </div>
      )}
    </div>
  );
}
