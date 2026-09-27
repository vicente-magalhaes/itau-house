import React from 'react';
import { Button, IconButton, Icon, Tag, Dialog, Toast, Checkbox } from '../ds.js';
import { Avatar, SeloSimulado, Vazio, Aviso } from '../components/comuns.jsx';
import { BotaoCurtir, Instalacoes } from '../components/Post.jsx';
import { TextArea } from '../components/TextArea.jsx';
import { Link, irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { acharAtivo, visivelPara, rotuloTipo, iconeTipo, rotuloVisibilidade, iconeVisibilidade, tempoRelativo } from '../data/catalogo.js';

// Markdown mínimo do readme: "## " vira subtítulo, o resto vira parágrafo.
function Leitura({ texto }) {
  return (
    <div className="leitura stack stack-2">
      {String(texto || '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((linha, i) => (linha.startsWith('## ') ? <h2 key={i}>{linha.slice(3)}</h2> : <p key={i}>{linha}</p>))}
    </div>
  );
}

function ListaAcessos({ acessos }) {
  return (
    <ul className="stack stack-3" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {acessos.map((a) => (
        <li key={a.titulo} className="row row-3 small">
          <Icon name={a.icone} size={18} color="var(--text-secondary)" />
          {a.titulo}
        </li>
      ))}
    </ul>
  );
}

function Campo({ rotulo, children }) {
  return (
    <div className="stack stack-1">
      <span className="caption">{rotulo}</span>
      <div className="small strong">{children}</div>
    </div>
  );
}

// Página do post (RF-27): conteúdo, ações e comentários. Os números ficam na área da coordenação.
export function Ativo({ id }) {
  const ativo = acharAtivo(id);
  const { pessoa, instalados, instalar, ehCoordenador } = useSessao();
  const [instalando, setInstalando] = React.useState(false);
  const [ciente, setCiente] = React.useState(false);
  const [aviso, setAviso] = React.useState(null);

  if (!ativo || !visivelPara(ativo, pessoa)) {
    return <Vazio icone="search-x" titulo="Este ativo não está disponível para você" acao={<Button onClick={() => irPara('/')}>Voltar ao início</Button>} />;
  }

  const instalado = instalados.includes(ativo.id);
  const comando = `itau-house instalar ${ativo.id}@${ativo.versao}`;

  const fechar = () => {
    setInstalando(false);
    setCiente(false);
  };

  const confirmar = () => {
    instalar(ativo.id);
    fechar();
    setAviso(`Instalado na versão ${ativo.versao}.`);
  };

  const copiar = (texto, mensagem) => {
    if (navigator.clipboard) navigator.clipboard.writeText(texto).catch(() => {});
    setAviso(mensagem);
  };

  return (
    <div className="cols-post">
      <article className="stack stack-4">
        <div className="post-meta">
          <IconButton icon="arrow-left" label="Voltar" size={36} variant="subtle" onClick={() => window.history.back()} />
          <Avatar iniciais={ativo.autor.iniciais} tamanho={24} tone="neutro" />
          <span className="strong">{ativo.autor.nome}</span>
          <span aria-hidden="true">·</span>
          <span>{ativo.squad}</span>
          <span aria-hidden="true">·</span>
          <span>{tempoRelativo(ativo.publicadoEm)}</span>
          <span className="pastilha">
            <Icon name={iconeTipo(ativo.tipo)} size={14} />
            {rotuloTipo(ativo.tipo)}
          </span>
        </div>

        <h1 className="titulo-pagina">{ativo.nome}</h1>

        <Leitura texto={ativo.readme} />

        <div className="post-acoes">
          <BotaoCurtir ativo={ativo} />
          <span className="pill pill-fixa" aria-label={`${ativo.comentarios.length} comentários`}>
            <Icon name="message-circle" size={16} />
            {ativo.comentarios.length}
          </span>
          <Instalacoes ativo={ativo} />
          <button type="button" className="pill" aria-pressed={instalado} onClick={() => (instalado ? setAviso(`Você já instalou a versão ${ativo.versao}.`) : setInstalando(true))}>
            <Icon name={instalado ? 'check' : 'download'} size={16} />
            {instalado ? 'Instalado' : 'Instalar'}
          </button>
          <button type="button" className="pill" onClick={() => setAviso('Cópia simulada. O ativo novo guarda o "derivado de".')}>
            <Icon name="git-fork" size={16} />
            Adaptar
          </button>
          <button type="button" className="pill" onClick={() => copiar(window.location.href, 'Link copiado.')}>
            <Icon name="share-2" size={16} />
            Compartilhar
          </button>
        </div>

        <hr className="divider" />

        <section className="stack stack-4" aria-labelledby="titulo-comentarios">
          <h2 id="titulo-comentarios" className="small strong">
            {ativo.comentarios.length} {ativo.comentarios.length === 1 ? 'comentário' : 'comentários'}
          </h2>
          <TextArea id="novo-comentario" label="Comentário" value="" disabled placeholder="Conte o que funcionou e o que você adaptou" rows={2} />
          {ativo.comentarios.map((c, i) => (
            <div key={`${c.autor}-${i}`} className="row row-3" style={{ alignItems: 'flex-start' }}>
              <Avatar iniciais={c.iniciais} tamanho={32} tone="neutro" />
              <div className="stack stack-1 grow">
                <span className="post-meta">
                  <span className="strong">{c.autor}</span>
                  <span aria-hidden="true">·</span>
                  <span>{c.squad}</span>
                  <span aria-hidden="true">·</span>
                  <span>{tempoRelativo(c.data)}</span>
                </span>
                <p className="small">{c.texto}</p>
              </div>
            </div>
          ))}
          {ativo.comentarios.length > 0 && (
            <div>
              <SeloSimulado ajuda="Os comentários foram escritos para a demonstração. Nenhuma pessoa real comentou aqui.">Comentários fictícios</SeloSimulado>
            </div>
          )}
        </section>
      </article>

      <aside className="stack stack-4 sticky">
        <div className="caixa stack stack-4">
          <span className="small strong">O que ele acessa</span>
          <ListaAcessos acessos={ativo.acessos} />
        </div>

        <div className="caixa stack stack-4">
          <Campo rotulo="Versão">{ativo.versao}</Campo>
          <Campo rotulo="Alcance">
            <span className="row row-2">
              <Icon name={iconeVisibilidade(ativo.visibilidade)} size={16} />
              {rotuloVisibilidade(ativo.visibilidade)}
            </span>
          </Campo>
          <Campo rotulo="Funciona com">{ativo.ferramentas.join(', ')}</Campo>
          <div className="row row-2 wrap">
            {ativo.tags.map((t) => (
              <Tag key={t} style={{ height: 28 }}>{t}</Tag>
            ))}
          </div>
        </div>

        {ehCoordenador && (
          <Link para={'/coord/dados/' + ativo.id} className="nav-item" style={{ boxShadow: 'inset 0 0 0 1px var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <Icon name="chart-column" size={18} />
            Ver dados deste ativo
            <Icon name="chevron-right" size={16} style={{ marginLeft: 'auto' }} />
          </Link>
        )}
      </aside>

      {instalando && (
        <Dialog
          title={`Instalar a versão ${ativo.versao}`}
          onClose={fechar}
          width={520}
          actions={
            <>
              <Button variant="ghost" onClick={fechar}>
                Agora não
              </Button>
              <Button variant="secondary" disabled={!ciente} onClick={confirmar}>
                Instalar
              </Button>
            </>
          }
        >
          <div className="stack stack-4">
            <ListaAcessos acessos={ativo.acessos} />
            <div className="row row-2" style={{ padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-inverse)', color: 'var(--text-inverse)' }}>
              <code className="mono grow" style={{ wordBreak: 'break-all' }}>{comando}</code>
              <IconButton icon="copy" label="Copiar comando" variant="inverse" size={32} onClick={() => copiar(comando, 'Comando copiado.')} />
            </div>
            <Checkbox checked={ciente} onChange={setCiente} label="Entendi o que este ativo acessa" />
            <div>
              <SeloSimulado ajuda="A instalação é simulada. Nada é escrito no seu ambiente; só o contador de instalações muda.">Instalação simulada</SeloSimulado>
            </div>
          </div>
        </Dialog>
      )}

      {aviso && (
        <Aviso>
          <Toast tone="neutral" onClose={() => setAviso(null)}>
            {aviso}
          </Toast>
        </Aviso>
      )}
    </div>
  );
}
