import React from "react";
import { Button, Icon, Card, Badge, Tag, Input, Select, Checkbox, Tooltip } from "../ds.js";
import { Avatar, SeloSimulado, Meta, Vazio } from "../components/comuns.jsx";
import { Link, irPara } from "../router.jsx";
import { useSessao } from "../sessao.jsx";
import {
  ativos,
  TIPOS,
  FRENTES,
  FERRAMENTAS,
  VISIBILIDADES,
  rotuloTipo,
  iconeTipo,
  rotuloVisibilidade,
  iconeVisibilidade,
  formatarDataCurta,
} from "../data/catalogo.js";

const ORDENACOES = [
  { value: "aderencia", label: "Mais aderentes à sua squad" },
  { value: "reusos", label: "Mais reaproveitados" },
  { value: "recentes", label: "Atualizados recentemente" },
];

// Busca sem diferenciar acento nem caixa.
function normalizar(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// "Cartões · Emissão" -> "Cartões".
function frenteDaSquad(squad) {
  return String(squad).split("·")[0].trim();
}

// Referência de "hoje" tirada do próprio catálogo: a demo não envelhece sozinha.
const HOJE = ativos.reduce((maior, a) => (a.atualizadoEm > maior ? a.atualizadoEm : maior), ativos[0].atualizadoEm);

function diasDesde(iso) {
  return Math.max(0, Math.round((Date.parse(HOJE) - Date.parse(iso)) / 86400000));
}

// Os três sinais que o card explicável descreve: reuso, aderência à sua squad e atualização.
function pontuarAderencia(a, minhaSquad, minhaFrente) {
  let p = Math.min(a.reusos, 30);
  if (a.squad === minhaSquad) p += 40;
  else if (a.frente === minhaFrente) p += 25;
  if (a.squadsQueReusaram.includes(minhaSquad)) p += 20;
  else if (a.squadsQueReusaram.some((s) => frenteDaSquad(s) === minhaFrente)) p += 12;
  p += Math.max(0, 20 - diasDesde(a.atualizadoEm) * 0.12);
  return p;
}

function Numero({ valor, rotulo }) {
  return (
    <div className="stack stack-1">
      <span style={{ font: "var(--fw-bold) var(--fs-h1)/1 var(--font-display)", letterSpacing: "var(--ls-display)" }}>
        {valor}
      </span>
      <span className="caption">{rotulo}</span>
    </div>
  );
}

function GrupoFiltro({ titulo, children }) {
  return (
    <div role="group" aria-label={titulo} className="stack stack-3">
      <span className="eyebrow">{titulo}</span>
      {children}
    </div>
  );
}

function CardAtivo({ ativo }) {
  const visibilidade = VISIBILIDADES.find((v) => v.value === ativo.visibilidade);
  const idVisibilidade = React.useId();
  const textoVisibilidade = `${rotuloVisibilidade(ativo.visibilidade)}. ${visibilidade ? visibilidade.descricao : ""}`;
  return (
    // O card inteiro é o link, como em "Também encontramos": abre com mouse e com teclado.
    <Link para={"/ativo/" + ativo.id} style={{ display: "block" }}>
      <Card
        interactive
        footer={
          <div className="row spread row-4 wrap" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "var(--space-3)" }}>
            <span className="row row-2">
              <Avatar iniciais={ativo.autor.iniciais} tamanho={28} tone="neutro" />
              <span className="stack" style={{ lineHeight: 1.2 }}>
                <span style={{ font: "var(--fw-bold) var(--fs-body-sm)/1.2 var(--font-text)", color: "var(--text-primary)" }}>
                  {ativo.autor.nome}
                </span>
                <span className="caption">{ativo.squad}</span>
              </span>
            </span>
            <span className="row row-4 wrap">
              <Meta icone="trending-up">
                {ativo.reusos} {ativo.reusos === 1 ? "reuso" : "reusos"}
              </Meta>
              <Meta icone="clock">
                {formatarDataCurta(ativo.atualizadoEm)} · v{ativo.versao}
              </Meta>
            </span>
          </div>
        }
      >
        <div className="stack stack-3">
          <div className="row row-2 wrap">
            <Icon name={iconeTipo(ativo.tipo)} size={18} color="var(--itau-laranja)" />
            <Badge>{rotuloTipo(ativo.tipo)}</Badge>
            <Badge tone="neutral">{ativo.frente}</Badge>
            <span className="grow" />
            <Tooltip content={textoVisibilidade}>
              <span className="row" tabIndex={0} aria-describedby={idVisibilidade}>
                <Icon
                  name={iconeVisibilidade(ativo.visibilidade)}
                  size={18}
                  color="var(--text-tertiary)"
                  label={"Visibilidade: " + rotuloVisibilidade(ativo.visibilidade)}
                />
                <span id={idVisibilidade} className="sr-only">
                  {textoVisibilidade}
                </span>
              </span>
            </Tooltip>
          </div>

          <div className="stack stack-2">
            <h3 style={{ font: "var(--fw-bold) var(--fs-h3)/var(--lh-heading) var(--font-display)", color: "var(--text-primary)" }}>
              {ativo.nome}
            </h3>
            <p className="small muted">{ativo.resumo}</p>
          </div>

          <div className="row row-2 wrap">
            {ativo.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function Catalogo() {
  const { pessoa } = useSessao();
  const minhaSquad = pessoa.squad;
  const minhaFrente = frenteDaSquad(pessoa.squad);

  const [busca, setBusca] = React.useState("");
  const [ordem, setOrdem] = React.useState("aderencia");
  const [tipos, setTipos] = React.useState([]);
  const [frentes, setFrentes] = React.useState([]);
  const [ferramentas, setFerramentas] = React.useState([]);
  const [visibilidades, setVisibilidades] = React.useState([]);

  const alternar = (definir) => (valor) =>
    definir((atual) => (atual.includes(valor) ? atual.filter((x) => x !== valor) : [...atual, valor]));

  const limpar = () => {
    setTipos([]);
    setFrentes([]);
    setFerramentas([]);
    setVisibilidades([]);
  };

  const temFiltro = tipos.length + frentes.length + ferramentas.length + visibilidades.length > 0;

  const totais = React.useMemo(() => {
    const squads = new Set();
    ativos.forEach((a) => a.squadsQueReusaram.forEach((s) => squads.add(s)));
    return {
      publicados: ativos.filter((a) => a.status === "publicado").length,
      reusos: ativos.reduce((soma, a) => soma + a.reusos, 0),
      squads: squads.size,
    };
  }, []);

  const lista = React.useMemo(() => {
    const termo = normalizar(busca).trim();
    const filtrados = ativos.filter((a) => {
      if (tipos.length && !tipos.includes(a.tipo)) return false;
      if (frentes.length && !frentes.includes(a.frente)) return false;
      if (ferramentas.length && !a.ferramentas.some((f) => ferramentas.includes(f))) return false;
      if (visibilidades.length && !visibilidades.includes(a.visibilidade)) return false;
      if (!termo) return true;
      const alvo = normalizar([a.nome, a.resumo, a.tags.join(" "), a.squad].join(" "));
      return alvo.includes(termo);
    });

    const ordenados = filtrados.slice();
    if (ordem === "reusos") ordenados.sort((a, b) => b.reusos - a.reusos);
    else if (ordem === "recentes") ordenados.sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
    else
      ordenados.sort((a, b) => pontuarAderencia(b, minhaSquad, minhaFrente) - pontuarAderencia(a, minhaSquad, minhaFrente));
    return ordenados;
  }, [busca, ordem, tipos, frentes, ferramentas, visibilidades, minhaSquad, minhaFrente]);

  // Filtros ativos viram chips removíveis acima da lista.
  const chips = [
    ...tipos.map((v) => ({ id: "tipo:" + v, rotulo: rotuloTipo(v), remover: () => alternar(setTipos)(v) })),
    ...frentes.map((v) => ({ id: "frente:" + v, rotulo: v, remover: () => alternar(setFrentes)(v) })),
    ...ferramentas.map((v) => ({ id: "ferramenta:" + v, rotulo: v, remover: () => alternar(setFerramentas)(v) })),
    ...visibilidades.map((v) => ({
      id: "visibilidade:" + v,
      rotulo: rotuloVisibilidade(v),
      remover: () => alternar(setVisibilidades)(v),
    })),
  ];

  return (
    <div className="container page stack stack-6">
      <header className="stack stack-3">
        <span className="eyebrow">Catálogo</span>
        <h1 style={{ font: "var(--type-heading)", letterSpacing: "var(--ls-display)" }}>
          O que as squads já construíram
        </h1>
        <p className="muted" style={{ maxWidth: 640 }}>
          Neste protótipo, o catálogo reúne ativos fictícios — skills, agentes, MCPs, frameworks e esqueletos —
          publicados por squads de exemplo.
        </p>
        <div className="row row-6 wrap" style={{ marginTop: "var(--space-2)" }}>
          <Numero valor={totais.publicados} rotulo="ativos publicados" />
          <Numero valor={totais.reusos} rotulo="reusos registrados" />
          <Numero valor={totais.squads} rotulo="squads que já reaproveitaram" />
          <SeloSimulado ajuda="Ativos, pessoas e números do catálogo são fictícios, criados para esta demonstração.">
            Catálogo fictício
          </SeloSimulado>
        </div>
      </header>

      <div className="row row-4 wrap" style={{ alignItems: "flex-end" }}>
        <div className="grow" style={{ minWidth: 280 }}>
          <Input
            label="Buscar no catálogo"
            icon="search"
            placeholder="Nome, tema, tag ou squad"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Select
          label="Ordenar por"
          options={ORDENACOES}
          value={ordem}
          onChange={(e) => setOrdem(e.target.value)}
          style={{ width: 280 }}
        />
      </div>

      <div className="cols-feed">
        <aside
          className="sticky stack stack-5"
          aria-label="Filtros do catálogo"
          // O cabeçalho do app já é fixo: desce o topo do sticky e deixa a coluna rolar sozinha.
          style={{
            top: "calc(var(--space-9) + var(--space-2))",
            maxHeight: "calc(100vh - var(--space-9) - var(--space-6))",
            overflowY: "auto",
          }}
        >
          <div className="row spread row-2">
            <span className="row row-2" style={{ font: "var(--fw-bold) var(--fs-body)/1 var(--font-text)" }}>
              <Icon name="filter" size={18} />
              Filtros
            </span>
            {temFiltro && (
              <Button variant="ghost" size="sm" onClick={limpar}>
                Limpar filtros
              </Button>
            )}
          </div>

          <GrupoFiltro titulo="Tipo">
            <div className="stack stack-2">
              {TIPOS.map((t) => (
                <Checkbox
                  key={t.value}
                  checked={tipos.includes(t.value)}
                  onChange={() => alternar(setTipos)(t.value)}
                  label={
                    <span className="row row-2 small">
                      <Icon name={t.icone} size={16} color="var(--text-tertiary)" />
                      {t.label}
                    </span>
                  }
                />
              ))}
            </div>
          </GrupoFiltro>

          <GrupoFiltro titulo="Frente">
            <div className="stack stack-2">
              {FRENTES.map((f) => (
                <Checkbox
                  key={f}
                  checked={frentes.includes(f)}
                  onChange={() => alternar(setFrentes)(f)}
                  label={<span className="small">{f}</span>}
                />
              ))}
            </div>
          </GrupoFiltro>

          <GrupoFiltro titulo="Ferramenta">
            <div className="row row-2 wrap">
              {FERRAMENTAS.map((f) => (
                <Tag key={f} selected={ferramentas.includes(f)} onClick={() => alternar(setFerramentas)(f)}>
                  {f}
                </Tag>
              ))}
            </div>
          </GrupoFiltro>

          <GrupoFiltro titulo="Visibilidade">
            <div className="row row-2 wrap">
              {VISIBILIDADES.map((v) => (
                <Tag
                  key={v.value}
                  icon={v.icone}
                  selected={visibilidades.includes(v.value)}
                  onClick={() => alternar(setVisibilidades)(v.value)}
                >
                  {v.label}
                </Tag>
              ))}
            </div>
          </GrupoFiltro>
        </aside>

        <div className="stack stack-4">
          {chips.length > 0 && (
            <div className="row row-2 wrap" role="group" aria-label="Filtros ativos">
              {chips.map((c) => (
                <Tag key={c.id} onRemove={c.remover}>
                  {c.rotulo}
                </Tag>
              ))}
            </div>
          )}

          <Card tone="subtle" padding={16}>
            <div className="row row-3 wrap">
              <Icon name="info" size={20} color="var(--text-secondary)" />
              <span className="grow" style={{ minWidth: 260 }}>
                {ordem === "reusos"
                  ? "Esta ordem usa só o número de reusos. Como ranquear ativos ainda é uma decisão em aberto do time."
                  : `Esta ordem combina número de reusos, aderência à sua squad (${minhaSquad}) e atualização recente.`}
              </span>
              <SeloSimulado ajuda="O cálculo da ordem é um roteiro fixo do protótipo. Você continua podendo trocar o critério e ver a lista inteira.">
                Ordem simulada
              </SeloSimulado>
            </div>
          </Card>

          <span className="small muted" role="status">
            {lista.length} {lista.length === 1 ? "ativo" : "ativos"}
          </span>

          {lista.length === 0 ? (
            <Vazio
              icone="search-x"
              titulo="Nenhum ativo com esses filtros"
              acao={
                <Button variant="ghost" iconLeft="rotate-ccw" onClick={limpar}>
                  Limpar filtros
                </Button>
              }
            >
              Tente outra palavra ou tire um filtro. Se ninguém publicou o que você procura,{" "}
              <Link
                para="/publicar"
                style={{ color: "var(--text-primary)", fontWeight: "var(--fw-bold)", borderBottom: "1px solid var(--itau-laranja)" }}
              >
                publique o seu ativo
              </Link>{" "}
              e a próxima squad encontra.
            </Vazio>
          ) : (
            <div className="stack stack-4">
              {lista.map((a) => (
                <CardAtivo key={a.id} ativo={a} />
              ))}
            </div>
          )}

          <Card tone="brand">
            <div className="row spread row-4 wrap">
              <span className="stack stack-1">
                <span style={{ font: "var(--fw-bold) var(--fs-h3)/var(--lh-heading) var(--font-display)" }}>
                  Construiu algo que outra squad pode usar?
                </span>
                <span className="small">
                  Publique no catálogo. O agente validador confere antes, e a coordenação decide a publicação.
                </span>
              </span>
              <Button variant="secondary" iconRight="arrow-right" onClick={() => irPara("/publicar")}>
                Quero publicar
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
