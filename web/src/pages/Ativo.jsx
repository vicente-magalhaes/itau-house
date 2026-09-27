import React from "react";
import { Button, IconButton, Icon, Card, Badge, Tag, Tabs, Dialog, Toast, Checkbox } from "../ds.js";
import { Avatar, SeloSimulado, Meta, Secao, Vazio, SeloGrau, Painel } from "../components/comuns.jsx";
import { TextArea } from "../components/TextArea.jsx";
import { Link, irPara } from "../router.jsx";
import { useSessao } from "../sessao.jsx";
import {
  acharAtivo,
  rotuloTipo,
  iconeTipo,
  rotuloVisibilidade,
  iconeVisibilidade,
  VISIBILIDADES,
  formatarData,
  formatarDataCurta,
} from "../data/catalogo.js";

const ABAS = [
  { value: "visao", label: "Visão geral" },
  { value: "acessos", label: "O que ele acessa" },
  { value: "historico", label: "Histórico" },
  { value: "comentarios", label: "Comentários" },
];

function descricaoVisibilidade(v) {
  const achado = VISIBILIDADES.find((x) => x.value === v);
  return achado ? achado.descricao : "";
}

// No histórico, o que veio de máquina ganha o ícone de agente; o resto é pessoa.
function ehAutomatico(quem) {
  return /agente|ita[úu] house/i.test(quem || "");
}

// Markdown mínimo do readme: linha com "## " vira subtítulo, o resto vira parágrafo.
function Leitura({ texto }) {
  const linhas = String(texto || "").split("\n");
  return (
    <div className="stack stack-3">
      {linhas.map((bruta, i) => {
        const linha = bruta.trim();
        if (!linha) return null;
        if (linha.startsWith("## ")) {
          return (
            <h2
              key={i}
              style={{ font: "var(--fw-bold) var(--fs-h3)/var(--lh-heading) var(--font-display)", marginTop: i === 0 ? 0 : "var(--space-2)" }}
            >
              {linha.slice(3)}
            </h2>
          );
        }
        return (
          <p key={i} style={{ font: "var(--type-body)", color: "var(--text-secondary)", maxWidth: "62ch" }}>
            {linha}
          </p>
        );
      })}
    </div>
  );
}

function ListaAcessos({ acessos }) {
  return (
    <ul className="stack stack-4" style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {acessos.map((acesso, i) => (
        <li key={i} className="row row-3" style={{ alignItems: "flex-start" }}>
          <span
            style={{
              width: 36,
              height: 36,
              flex: "none",
              borderRadius: "var(--radius-pill)",
              background: "var(--surface-muted)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name={acesso.icone} size={18} color="var(--itau-preto)" />
          </span>
          <span className="stack stack-1">
            <span style={{ font: "var(--fw-bold) var(--fs-body)/1.35 var(--font-text)", color: "var(--text-primary)" }}>{acesso.titulo}</span>
            {acesso.detalhe && <span className="small muted">{acesso.detalhe}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ItemHistorico({ item, ultimo }) {
  const automatico = ehAutomatico(item.quem);
  return (
    <li className="row row-3" style={{ alignItems: "stretch" }}>
      <div className="stack" style={{ alignItems: "center", width: 32, flex: "none" }}>
        <span
          style={{
            width: 32,
            height: 32,
            flex: "none",
            borderRadius: "var(--radius-pill)",
            display: "grid",
            placeItems: "center",
            background: automatico ? "var(--surface-muted)" : "var(--itau-laranja)",
            color: "var(--itau-preto)",
          }}
        >
          <Icon name={automatico ? "bot" : "user-round"} size={16} />
        </span>
        {!ultimo && <span style={{ width: 2, flex: 1, background: "var(--border-subtle)", marginTop: "var(--space-1)" }} />}
      </div>
      <div className="stack stack-1" style={{ paddingBottom: ultimo ? 0 : "var(--space-5)" }}>
        <span className="caption">{formatarDataCurta(item.data)}</span>
        <span style={{ font: "var(--fw-bold) var(--fs-body)/1.35 var(--font-text)", color: "var(--text-primary)" }}>{item.evento}</span>
        <span className="small muted">
          {item.quem} · {automatico ? "verificação automática" : "decisão de uma pessoa"}
        </span>
      </div>
    </li>
  );
}

export function Ativo({ id }) {
  const ativo = acharAtivo(id);
  const { instalados, instalar } = useSessao();
  const [aba, setAba] = React.useState("visao");
  const [dialogo, setDialogo] = React.useState(null);
  const [ciente, setCiente] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");
  const [aviso, setAviso] = React.useState(null);

  if (!ativo) {
    return (
      <div className="container-narrow page">
        <Vazio icone="search" titulo="Não encontramos este ativo" acao={<Button onClick={() => irPara("/")}>Voltar ao catálogo</Button>}>
          O endereço pede o ativo {id}, que não está no catálogo. Ele pode ter sido retirado do ar por quem publicou.
        </Vazio>
      </div>
    );
  }

  const instalado = instalados.includes(ativo.id);
  const comando = `itau-house instalar ${ativo.id}@${ativo.versao}`;

  const fecharDialogo = () => {
    setDialogo(null);
    setCiente(false);
  };

  const confirmarInstalacao = () => {
    instalar(ativo.id);
    fecharDialogo();
    setAviso({
      tone: "success",
      texto: `Ficou registrado que você reaproveitou este ativo na versão ${ativo.versao}. Quem publicou vê o reuso.`,
    });
  };

  const enviarFeedback = () => {
    fecharDialogo();
    setFeedback("");
    setAviso({ tone: "neutral", texto: `Feedback enviado para ${ativo.autor.nome}. Só quem publicou vê a mensagem.` });
  };

  const copiarComando = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(comando).catch(() => {});
    setAviso({ tone: "neutral", texto: "Comando copiado. Ele é de demonstração e não instala nada." });
  };

  const controles = [
    {
      icone: "lock",
      titulo: "Versão fixa na instalação",
      texto: `Você instala a versão ${ativo.versao}. Nenhuma versão nova entra no seu projeto sozinha.`,
    },
    {
      icone: "shield-check",
      titulo: "Revalidação a cada atualização",
      texto: "A cada versão publicada, o validador rodaria de novo antes de ela ficar disponível.",
    },
    {
      icone: "history",
      titulo: "Retirada do ar com aviso",
      texto: "Se o ativo saísse do catálogo, quem instalou receberia o aviso com o motivo.",
    },
  ];

  return (
    <div className="container page">
      <div className="stack stack-5">
        <Link
          para="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            font: "var(--fw-bold) var(--fs-body-sm)/1.2 var(--font-text)",
            alignSelf: "flex-start",
          }}
        >
          <Icon name="arrow-left" size={16} />
          Voltar ao catálogo
        </Link>

        <div className="cols-detalhe">
          <main className="stack stack-6">
            <header className="stack stack-4">
              <div className="row row-2 wrap">
                <Badge tone="neutral" style={{ gap: "var(--space-1)" }}>
                  <Icon name={iconeTipo(ativo.tipo)} size={14} />
                  {rotuloTipo(ativo.tipo)}
                </Badge>
                <Badge tone="brand">{ativo.frente}</Badge>
              </div>

              <h1 style={{ font: "var(--fw-bold) var(--fs-h1)/var(--lh-heading) var(--font-display)", letterSpacing: "var(--ls-display)" }}>
                {ativo.nome}
              </h1>

              <p style={{ font: "var(--fw-regular) var(--fs-body-lg)/1.45 var(--font-text)", color: "var(--text-secondary)", maxWidth: "62ch" }}>
                {ativo.resumo}
              </p>

              <div className="row row-5 wrap">
                <span className="row row-2">
                  <Avatar iniciais={ativo.autor.iniciais} tamanho={36} />
                  <span className="stack stack-1">
                    <span style={{ font: "var(--fw-bold) var(--fs-body-sm)/1.2 var(--font-text)" }}>{ativo.autor.nome}</span>
                    <span className="caption">
                      {ativo.autor.papel} · {ativo.autor.squad}
                    </span>
                  </span>
                </span>
                <Meta icone="git-branch">Versão {ativo.versao}</Meta>
                <Meta icone="clock">Atualizado em {formatarData(ativo.atualizadoEm)}</Meta>
              </div>

              <div className="row row-3 wrap">
                {instalado ? (
                  <Button
                    variant="secondary"
                    iconLeft="check"
                    onClick={() =>
                      setAviso({
                        tone: "success",
                        texto: `Você reaproveitou este ativo na versão ${ativo.versao}. O reuso está registrado no histórico.`,
                      })
                    }
                  >
                    Instalado
                  </Button>
                ) : (
                  <Button variant="primary" onClick={() => setDialogo("instalar")}>
                    Quero reaproveitar
                  </Button>
                )}
                <Button
                  variant="outline"
                  iconLeft="git-branch"
                  onClick={() =>
                    setAviso({
                      tone: "neutral",
                      texto: "A cópia para o seu projeto é simulada neste protótipo. A origem do reuso fica registrada no ativo.",
                    })
                  }
                >
                  Adaptar no meu projeto
                </Button>
                <IconButton icon="message-square" label="Enviar feedback para quem publicou" variant="subtle" onClick={() => setDialogo("feedback")} />
              </div>

              <div className="row row-2 wrap">
                <SeloSimulado />
                <span className="caption">
                  {instalado
                    ? `Instalação simulada na versão ${ativo.versao}. Nada foi escrito no seu ambiente.`
                    : "Instalar e adaptar são simulados neste protótipo. Nada é escrito no seu ambiente."}
                </span>
              </div>
            </header>

            <div className="stack stack-5">
              <Tabs items={ABAS} value={aba} onChange={setAba} idPrefix="ativo" />

              <div role="tabpanel" id={"ativo-painel-" + aba} aria-labelledby={"ativo-tab-" + aba}>
                {aba === "visao" && (
                  <div className="stack stack-6">
                    <Leitura texto={ativo.readme} />
                    <Secao
                      titulo="Onde já foi reaproveitado"
                      acao={
                        <SeloSimulado ajuda="Histórico e números de reuso são fictícios, criados para esta demonstração.">
                          Números fictícios
                        </SeloSimulado>
                      }
                    >
                      {ativo.squadsQueReusaram.length > 0 ? (
                        <div className="stack stack-3">
                          <div className="row row-2 wrap">
                            {ativo.squadsQueReusaram.map((squad) => (
                              <Tag key={squad} icon="users">
                                {squad}
                              </Tag>
                            ))}
                          </div>
                          <p className="small muted">
                            {ativo.reusos} reusos registrados desde a publicação, em {formatarData(ativo.publicadoEm)}.
                          </p>
                        </div>
                      ) : (
                        <p className="muted">Ainda não houve reuso registrado. Quando outra squad instalar, ela aparece aqui.</p>
                      )}
                    </Secao>
                  </div>
                )}

                {aba === "acessos" && (
                  <div className="stack stack-5">
                    <div className="row spread row-3 wrap" style={{ alignItems: "flex-start" }}>
                      <p className="grow" style={{ font: "var(--type-body)", color: "var(--text-secondary)", maxWidth: "58ch" }}>
                        Antes de instalar, você vê o que o ativo declara acessar, como as permissões de um aplicativo.
                      </p>
                      <span className="row row-2 wrap">
                        <SeloSimulado ajuda="A lista de acessos é fixa nesta demonstração. Nenhum código foi analisado.">
                          Permissões fictícias
                        </SeloSimulado>
                        <SeloGrau grau={ativo.grau} />
                      </span>
                    </div>

                    {ativo.grau === "alto" && (
                      <Painel icone="shield" cor="var(--text-primary)">
                        <span>Ativo de grau alto passa também por risco e segurança, além da coordenação.</span>
                      </Painel>
                    )}

                    <Card>
                      <ListaAcessos acessos={ativo.acessos} />
                    </Card>

                    <Secao titulo="Controles previstos">
                      <ul className="stack stack-4" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {controles.map((controle) => (
                          <li key={controle.titulo} className="row row-3" style={{ alignItems: "flex-start" }}>
                            <Icon name={controle.icone} size={20} color="var(--itau-laranja)" style={{ marginTop: 2 }} />
                            <span className="stack stack-1">
                              <span style={{ font: "var(--fw-bold) var(--fs-body)/1.35 var(--font-text)" }}>{controle.titulo}</span>
                              <span className="small muted">{controle.texto}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Secao>
                  </div>
                )}

                {aba === "historico" && (
                  <div className="stack stack-5">
                    <div className="row spread row-3 wrap" style={{ alignItems: "flex-start" }}>
                      <p className="grow" style={{ font: "var(--type-body)", color: "var(--text-secondary)", maxWidth: "62ch" }}>
                        Fica registrado quem publicou, quem verificou, quem aprovou e quem reaproveitou.
                      </p>
                      <SeloSimulado ajuda="Histórico e números de reuso são fictícios, criados para esta demonstração.">
                        Histórico fictício
                      </SeloSimulado>
                    </div>
                    <ol className="stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {ativo.historico.map((item, i) => (
                        <ItemHistorico key={`${item.data}-${i}`} item={item} ultimo={i === ativo.historico.length - 1} />
                      ))}
                    </ol>
                  </div>
                )}

                {aba === "comentarios" && (
                  <div className="stack stack-5">
                    {ativo.comentarios.length > 0 && (
                      <div className="row">
                        <SeloSimulado ajuda="Os comentários desta tela foram escritos para a demonstração. Nenhuma pessoa real comentou aqui.">
                          Comentários fictícios
                        </SeloSimulado>
                      </div>
                    )}
                    {ativo.comentarios.length > 0 ? (
                      <ul className="stack stack-5" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {ativo.comentarios.map((comentario, i) => (
                          <li key={`${comentario.autor}-${i}`} className="row row-3" style={{ alignItems: "flex-start" }}>
                            <Avatar iniciais={comentario.iniciais} tamanho={36} tone="neutro" />
                            <span className="stack stack-1 grow">
                              <span className="row row-2 wrap">
                                <span style={{ font: "var(--fw-bold) var(--fs-body-sm)/1.2 var(--font-text)" }}>{comentario.autor}</span>
                                <span className="caption">
                                  {comentario.squad} · {formatarDataCurta(comentario.data)}
                                </span>
                              </span>
                              <span className="small muted">{comentario.texto}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Vazio icone="message-square" titulo="Ainda não há comentário">
                        Quem reaproveitar este ativo pode contar aqui o que funcionou e o que precisou adaptar.
                      </Vazio>
                    )}

                    <div
                      className="stack stack-3"
                      style={{ padding: "var(--space-4)", background: "var(--surface-subtle)", borderRadius: "var(--radius-md)" }}
                    >
                      <div className="row spread row-2 wrap">
                        <span style={{ font: "var(--fw-bold) var(--fs-body)/1.2 var(--font-text)" }}>Escrever um comentário</span>
                        <SeloSimulado />
                      </div>
                      <TextArea
                        id="novo-comentario"
                        label="Seu comentário"
                        value=""
                        disabled
                        placeholder="Conte o que funcionou e o que você precisou adaptar."
                        helper="O campo entra depois da demonstração. Por enquanto, os comentários são fixos."
                        rows={3}
                      />
                      <Button variant="outline" size="sm" disabled>
                        Publicar comentário
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>

          <aside className="stack stack-5 sticky">
            <Card>
              <div className="stack stack-4">
                <div className="stack stack-1">
                  <span
                    style={{
                      font: "var(--fw-bold) var(--fs-display-m)/var(--lh-tight) var(--font-display)",
                      letterSpacing: "var(--ls-display)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {ativo.reusos}
                  </span>
                  <span className="small muted">{ativo.reusos === 1 ? "reuso registrado" : "reusos registrados"}</span>
                  <div className="row" style={{ marginTop: "var(--space-1)" }}>
                    <SeloSimulado ajuda="Histórico e números de reuso são fictícios, criados para esta demonstração.">
                      Números fictícios
                    </SeloSimulado>
                  </div>
                </div>

                <hr className="divider" />

                <div className="stack stack-2">
                  <span className="eyebrow">Quem reaproveitou</span>
                  {ativo.squadsQueReusaram.length > 0 ? (
                    <div className="row row-2 wrap">
                      {ativo.squadsQueReusaram.map((squad) => (
                        <Tag key={squad}>{squad}</Tag>
                      ))}
                    </div>
                  ) : (
                    <span className="small muted">Ainda não houve reuso registrado.</span>
                  )}
                </div>

                <hr className="divider" />

                <div className="stack stack-2">
                  <span className="eyebrow">Visibilidade</span>
                  <span className="row row-2">
                    <Icon name={iconeVisibilidade(ativo.visibilidade)} size={18} color="var(--itau-preto)" />
                    <span style={{ font: "var(--fw-bold) var(--fs-body-sm)/1.2 var(--font-text)", color: "var(--text-primary)" }}>
                      {rotuloVisibilidade(ativo.visibilidade)}
                    </span>
                  </span>
                  <span className="small muted">{descricaoVisibilidade(ativo.visibilidade)}</span>
                </div>

                <hr className="divider" />

                <div className="stack stack-2">
                  <span className="eyebrow">Ferramentas</span>
                  <div className="row row-2 wrap">
                    {ativo.ferramentas.map((ferramenta) => (
                      <Tag key={ferramenta} icon="terminal">
                        {ferramenta}
                      </Tag>
                    ))}
                  </div>
                </div>

                <div className="stack stack-2">
                  <span className="eyebrow">Tags</span>
                  <div className="row row-2 wrap">
                    {ativo.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>

                <hr className="divider" />

                <div className="stack stack-1">
                  <span className="eyebrow">Versão</span>
                  <span style={{ font: "var(--fw-bold) var(--fs-body)/1.2 var(--font-text)", color: "var(--text-primary)" }}>{ativo.versao}</span>
                  <span className="small muted">Publicado em {formatarData(ativo.publicadoEm)}.</span>
                </div>
              </div>
            </Card>

            <div className="stack stack-3">
              <div className="row spread row-2 wrap">
                <h2 style={{ font: "var(--fw-bold) var(--fs-h3)/var(--lh-heading) var(--font-display)" }}>Como instalar</h2>
                <SeloSimulado />
              </div>
              <Card tone="inverse" padding={16}>
                <div className="row row-2">
                  <code className="mono grow" style={{ wordBreak: "break-all" }}>
                    {comando}
                  </code>
                  <IconButton icon="copy" label="Copiar comando" variant="inverse" size={36} onClick={copiarComando} />
                </div>
              </Card>
              <span className="caption">O comando é de demonstração. Nenhuma instalação acontece de verdade.</span>
            </div>
          </aside>
        </div>
      </div>

      {dialogo === "instalar" && (
        <Dialog
          title={`Instalar na versão ${ativo.versao}`}
          onClose={fecharDialogo}
          width={560}
          actions={
            <>
              <Button variant="ghost" onClick={fecharDialogo}>
                Agora não
              </Button>
              <Button variant="secondary" disabled={!ciente} onClick={confirmarInstalacao}>
                Quero reaproveitar
              </Button>
            </>
          }
        >
          <div className="stack stack-4">
            <p>Veja o que este ativo acessa no seu ambiente. Você decide depois de ler.</p>
            <ListaAcessos acessos={ativo.acessos} />
            <hr className="divider" />
            <Checkbox checked={ciente} onChange={setCiente} label="Entendi o que este ativo acessa" />
            <div className="row row-2 wrap">
              <SeloSimulado />
              <span className="caption">A instalação é simulada. Fica registrado o reuso para quem publicou.</span>
            </div>
          </div>
        </Dialog>
      )}

      {dialogo === "feedback" && (
        <Dialog
          title="Enviar feedback para quem publicou"
          onClose={fecharDialogo}
          width={560}
          actions={
            <>
              <Button variant="ghost" onClick={fecharDialogo}>
                Cancelar
              </Button>
              <Button variant="secondary" disabled={!feedback.trim()} onClick={enviarFeedback}>
                Enviar feedback
              </Button>
            </>
          }
        >
          <div className="stack stack-4">
            <TextArea
              id="feedback-privado"
              label={`O que você quer contar para ${ativo.autor.nome}?`}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Conte o que funcionou, o que faltou ou o que você precisou adaptar."
            />
            <div className="row row-2 wrap">
              <Icon name="lock" size={16} color="var(--text-tertiary)" />
              <span className="small">Só quem publicou vê este feedback.</span>
              <SeloSimulado />
            </div>
          </div>
        </Dialog>
      )}

      {aviso && (
        <div style={{ position: "fixed", right: "var(--space-5)", bottom: "var(--space-5)", zIndex: 1100 }}>
          <Toast tone={aviso.tone} onClose={() => setAviso(null)}>
            {aviso.texto}
          </Toast>
        </div>
      )}
    </div>
  );
}
