import React from 'react';
import { Button, IconButton, Icon, Badge, Tabs, Dialog, Toast, Input } from '../ds.js';
import { Avatar, BotaoSec, SeloSimulado, Vazio, Aviso } from '../components/comuns.jsx';
import { useSessao } from '../sessao.jsx';
import { filaAprovacao } from '../data/governanca.js';
import { iconeTipo } from '../data/catalogo.js';

// Fila do Cord+ (RF-32): aprovar (RF-19) ou devolver com motivo (RF-21).
// O validador só faz checagens fixas por código; quem julga é o coordenador (D-13, D-26).

// Erro é azul-marinho com ícone, nunca vermelho.
const TOM_APONTAMENTO = {
  alerta: { icone: 'triangle-alert', cor: 'var(--status-error)' },
  atencao: { icone: 'triangle-alert', cor: 'var(--text-primary)' },
  info: { icone: 'info', cor: 'var(--text-tertiary)' },
};

const DECISOES = {
  aprovar: { rotulo: 'Aprovada', tone: 'success', toast: 'Publicação aprovada.' },
  ajuste: { rotulo: 'Devolvida', tone: 'neutral', toast: 'Devolvida para a autora com o motivo.' },
  recusar: { rotulo: 'Recusada', tone: 'dark', toast: 'Publicação recusada.' },
};

// Validador já passou; a vez é do coordenador; publicar vem depois.
const GATES = [
  { nome: 'Validador', icone: 'circle-check', cor: 'var(--status-success)' },
  { nome: 'Coordenação', icone: 'user-round', atual: true },
  { nome: 'Publicado', icone: 'clock', cor: 'var(--text-tertiary)' },
];

function Gates() {
  return (
    <div className="row row-2 wrap" role="group" aria-label="Etapas até a publicação">
      {GATES.map((g, i) => (
        <React.Fragment key={g.nome}>
          {i > 0 && <Icon name="chevron-right" size={14} color="var(--text-tertiary)" />}
          <span className="pastilha" style={g.atual ? { background: 'var(--brand)', color: 'var(--on-brand)' } : undefined}>
            <Icon name={g.icone} size={14} color={g.atual ? 'var(--on-brand)' : g.cor} />
            {g.nome}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

function ItemFila({ item, aberto, aoAlternar, aoAprovar, aoDevolver, aoRecusar }) {
  return (
    <div className="caixa stack stack-4">
      <div className="row row-3">
        <Icon name={iconeTipo(item.tipo)} size={20} label={item.tipo} />
        <div className="stack stack-1 grow">
          <span className="strong">{item.nome}</span>
          <span className="post-meta">
            <Avatar iniciais={item.autor.iniciais} tamanho={20} tone="neutro" />
            <span>{item.autor.nome}</span>
            <span aria-hidden="true">·</span>
            <span>{item.autor.squad}</span>
            <span aria-hidden="true">·</span>
            <span>há {item.esperandoHa}</span>
          </span>
        </div>
        <Badge tone="success">
          <Icon name="circle-check" size={12} style={{ marginRight: 'var(--space-1)' }} />
          Checagens ok
        </Badge>
        <IconButton icon={aberto ? 'chevron-up' : 'chevron-down'} label={aberto ? `Fechar ${item.nome}` : `Abrir ${item.nome}`} size={36} onClick={aoAlternar} />
      </div>

      {aberto && (
        <div className="stack stack-4 anima-cair">
          <Gates />
          <span className="small">{item.checagens}</span>
          <ul className="stack stack-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {item.apontamentos.map((a, i) => {
              const t = TOM_APONTAMENTO[a.tom] || TOM_APONTAMENTO.info;
              return (
                <li key={i} className="row row-2 small" style={{ alignItems: 'flex-start' }}>
                  <Icon name={t.icone} size={16} color={t.cor} style={{ marginTop: 2 }} />
                  {a.texto}
                </li>
              );
            })}
          </ul>
          <div className="row row-3 wrap">
            <Button variant="primary" size="sm" iconLeft="check" onClick={aoAprovar}>
              Aprovar
            </Button>
            <BotaoSec icone="undo-2" onClick={aoDevolver}>
              Devolver
            </BotaoSec>
            <BotaoSec icone="x" onClick={aoRecusar}>
              Recusar
            </BotaoSec>
          </div>
        </div>
      )}
    </div>
  );
}

function ItemDecidido({ registro }) {
  const d = DECISOES[registro.decisao];
  return (
    <div className="caixa stack stack-2">
      <div className="row row-3">
        <Icon name={iconeTipo(registro.item.tipo)} size={18} color="var(--text-tertiary)" />
        <span className="strong grow">{registro.item.nome}</span>
        <Badge tone={d.tone}>{d.rotulo}</Badge>
      </div>
      <span className="caption">
        {registro.quem} · {registro.quando}
        {registro.motivo ? ` · “${registro.motivo}”` : ''}
      </span>
    </div>
  );
}

export function Aprovacoes() {
  const { pessoa } = useSessao();

  const [aba, setAba] = React.useState('espera');
  const [abertoId, setAbertoId] = React.useState(filaAprovacao[0] ? filaAprovacao[0].id : null);
  const [decididos, setDecididos] = React.useState([]);
  const [dialogo, setDialogo] = React.useState(null); // { id, decisao }
  const [motivo, setMotivo] = React.useState('');
  const [erroMotivo, setErroMotivo] = React.useState('');
  const [toast, setToast] = React.useState(null); // { id, texto, tone }

  const decididosIds = decididos.map((d) => d.id);
  const naFila = filaAprovacao.filter((i) => !decididosIds.includes(i.id));
  const itemDoDialogo = dialogo ? filaAprovacao.find((i) => i.id === dialogo.id) : null;

  function registrar(item, decisao, motivoTexto) {
    setDecididos((atual) => [{ id: item.id, item, decisao, quem: pessoa.nome, quando: 'agora', motivo: motivoTexto || '' }, ...atual]);
    setAbertoId(null);
    setToast({ id: item.id, texto: DECISOES[decisao].toast, tone: decisao === 'aprovar' ? 'success' : 'neutral' });
  }

  function fecharDialogo() {
    setDialogo(null);
    setMotivo('');
    setErroMotivo('');
  }

  // Devolver e recusar exigem motivo: é o que a pessoa autora vai ler.
  function enviarDialogo() {
    if (!motivo.trim()) {
      setErroMotivo('Escreva o motivo. Ele vai junto para a pessoa autora.');
      return;
    }
    registrar(itemDoDialogo, dialogo.decisao, motivo.trim());
    fecharDialogo();
  }

  function desfazer() {
    if (!toast) return;
    setDecididos((atual) => atual.filter((d) => d.id !== toast.id));
    setAbertoId(toast.id);
    setAba('espera');
    setToast(null);
  }

  return (
    <div className="stack stack-5" style={{ maxWidth: 860 }}>
      <div className="row spread">
        <h1 className="titulo-pagina">Fila de aprovação</h1>
        <SeloSimulado ajuda="Fila, ativos e pareceres são fictícios. Nada vem de um sistema do Itaú.">Fila simulada</SeloSimulado>
      </div>

      <Tabs
        value={aba}
        onChange={setAba}
        items={[
          { value: 'espera', label: `Esperando você (${naFila.length})` },
          { value: 'decididos', label: `Decididos (${decididos.length})` },
        ]}
      />

      {aba === 'espera' &&
        (naFila.length === 0 ? (
          <Vazio icone="inbox" titulo="Nada esperando por você" />
        ) : (
          <div className="stack stack-3 anima-escalonada">
            {naFila.map((item) => (
              <ItemFila
                key={item.id}
                item={item}
                aberto={abertoId === item.id}
                aoAlternar={() => setAbertoId(abertoId === item.id ? null : item.id)}
                aoAprovar={() => registrar(item, 'aprovar')}
                aoDevolver={() => setDialogo({ id: item.id, decisao: 'ajuste' })}
                aoRecusar={() => setDialogo({ id: item.id, decisao: 'recusar' })}
              />
            ))}
          </div>
        ))}

      {aba === 'decididos' &&
        (decididos.length === 0 ? (
          <Vazio icone="history" titulo="Nada decidido ainda" />
        ) : (
          <div className="stack stack-3 anima-escalonada">
            {decididos.map((d) => (
              <ItemDecidido key={d.id} registro={d} />
            ))}
          </div>
        ))}

      {dialogo && itemDoDialogo && (
        <Dialog
          title={dialogo.decisao === 'ajuste' ? 'Devolver para ajuste' : 'Recusar a publicação'}
          onClose={fecharDialogo}
          actions={
            <>
              <BotaoSec onClick={fecharDialogo}>Voltar</BotaoSec>
              <Button variant="secondary" size="sm" iconLeft="send" onClick={enviarDialogo}>
                {dialogo.decisao === 'ajuste' ? 'Devolver' : 'Recusar'}
              </Button>
            </>
          }
        >
          <Input
            label="Motivo"
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
              if (erroMotivo) setErroMotivo('');
            }}
            placeholder={dialogo.decisao === 'ajuste' ? 'Ex.: declare o limite de volume no README' : 'Ex.: a squad já mantém um ativo igual'}
            error={erroMotivo}
          />
        </Dialog>
      )}

      {toast && (
        <Aviso>
          <Toast tone={toast.tone} action="Desfazer" onAction={desfazer} onClose={() => setToast(null)}>
            {toast.texto}
          </Toast>
        </Aviso>
      )}
    </div>
  );
}
