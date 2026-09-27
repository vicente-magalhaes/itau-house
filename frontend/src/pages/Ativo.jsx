import React from 'react';
import { Button, Icon, Dialog, Checkbox } from '../ds.js';
import { Foto, BotaoSec, SeloSimulado, Vazio } from '../components/comuns.jsx';
import { BotaoCurtir } from '../components/Post.jsx';
import { Link, irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { acharAtivo, visivelPara, PAPEIS, iconeTipo, rotuloVisibilidade, tempoRelativo, passosDeUso } from '../data/catalogo.js';

function voltar() {
  if (window.history.length > 1) window.history.back();
  else irPara('/');
}

// Pessoa com foto, nome e uma linha de detalhe. Abre o perfil.
function LinhaPessoa({ pessoa, detalhe, texto }) {
  return (
    <button type="button" className="linha-pessoa" onClick={() => irPara('/perfil/' + pessoa.id)}>
      <Foto pessoa={pessoa} tamanho={40} />
      <span className="stack stack-1" style={{ minWidth: 0 }}>
        <span className="nome">
          {pessoa.nome} <span className="meta">· {detalhe}</span>
        </span>
        <span className="texto">{texto}</span>
      </span>
    </button>
  );
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
      <ol className="passos">
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

// Página do ativo (RF-27): capa, ações, o que ele acessa, como usar, conteúdo, derivações, reuso por papel e trilha (RF-22, RF-30).
export function Ativo({ id }) {
  const ativo = acharAtivo(id);
  const { pessoa, usados, usar, reusosDe, avisar, ehCoordenador } = useSessao();
  const [confirmando, setConfirmando] = React.useState(false);
  const [ciente, setCiente] = React.useState(false);

  if (!ativo || !visivelPara(ativo, pessoa)) {
    return <Vazio icone="search-x" titulo="Este ativo não está disponível para você" acao={<Button size="sm" onClick={() => irPara('/')}>Voltar ao início</Button>} />;
  }

  const autor = ativo.autor;
  const usado = usados.includes(ativo.id);
  const maior = Math.max(...ativo.papeis, 1);
  const deFora = ativo.papeis.reduce((t, n, i) => t + (PAPEIS[i] !== autor.papel ? n : 0), 0);
  const trilha = [
    { icone: 'shield-check', titulo: 'Passou no validador', detalhe: 'Sem segredo, sem dado pessoal e com descrição' },
    { icone: 'user-check', titulo: 'Aprovado por ' + ativo.aprovou, detalhe: 'Coordenação da squad de quem publicou' },
    { icone: 'globe', titulo: 'Alcance: ' + rotuloVisibilidade(ativo.visibilidade), detalhe: 'Qualquer pessoa do banco encontra' },
    { icone: 'tag', titulo: 'Versão ' + ativo.versao, detalhe: 'Atualizado ' + tempoRelativo(ativo.atualizadoEm) },
  ];

  const fechar = () => {
    setConfirmando(false);
    setCiente(false);
  };
  const confirmar = () => {
    usar(ativo.id);
    fechar();
    avisar(`Pronto! Uma cópia foi pro seu ${ativo.ferr[0]}. O crédito fica com ${autor.primeiro}.`);
  };

  return (
    <div className="stack stack-5">
      <BotaoSec icone="arrow-left" onClick={voltar} style={{ alignSelf: 'flex-start', paddingLeft: 'var(--space-3)' }}>
        Voltar
      </BotaoSec>

      <section className="capa-ativo">
        <span className="tipo-ativo">
          <Icon name={iconeTipo(ativo.tipo)} size={20} color="var(--brand)" />
          {ativo.tipo}
        </span>
        <h1 className="titulo-pagina">{ativo.titulo}</h1>
        <p className="texto">{ativo.resumo}</p>
        <button type="button" className="linha-pessoa" onClick={() => irPara('/perfil/' + autor.id)}>
          <Foto pessoa={autor} tamanho={40} />
          <span className="stack stack-1">
            <span className="nome">{autor.nome}</span>
            <span className="meta">
              {autor.cargo} · {autor.squad} · {tempoRelativo(ativo.atualizadoEm)}
            </span>
          </span>
        </button>
      </section>

      <div className="row wrap" style={{ gap: 'var(--space-2) var(--space-4)' }}>
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
        <BotaoSec icone="git-fork" onClick={() => avisar(`Criamos sua versão. Ela entra na árvore como derivada do trabalho de ${autor.primeiro}.`)}>
          Adaptar pra mim
        </BotaoSec>
        <BotaoCurtir ativo={ativo} />
        <span className="texto">
          {reusosDe(ativo)} reaproveitamentos · {ativo.adapt} adaptações
        </span>
      </div>

      <div className="colunas">
        <div className="coluna-principal coluna-principal-ativo">
          <UsarEm key={ativo.id} ativo={ativo} />

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

          <section className="stack stack-4">
            <div className="stack stack-2">
              <h2 className="titulo-secao">Árvore de adaptações</h2>
              <p className="texto">Cada versão guarda de onde veio. O crédito volta pra quem criou o original.</p>
            </div>
            <div className="row row-3">
              <Foto pessoa={autor} tamanho={40} anel />
              <span className="stack stack-1">
                <span className="nome">Original · {autor.nome}</span>
                <span className="meta">
                  {autor.papel} · {autor.squad}
                </span>
              </span>
            </div>
            <div className="arvore-ramos">
              {ativo.deriv.map((d) => (
                <LinhaPessoa key={d.pessoa.id} pessoa={d.pessoa} detalhe={d.pessoa.papel} texto={d.texto} />
              ))}
            </div>
          </section>
        </div>

        <aside className="coluna-lateral">
          <div className="painel">
            <div className="stack stack-2">
              <h2 className="titulo-card">O que ele acessa</h2>
              <p className="meta">Declarado por quem publicou. Você confirma antes de usar.</p>
            </div>
            <ListaAcessos acessos={ativo.acessos} />
          </div>

          <div className="painel">
            <h2 className="titulo-card">Quem reaproveitou</h2>
            <p className="texto">
              {deFora} dos {ativo.reusos} reaproveitamentos vieram de fora de {autor.papel}.
            </p>
            {PAPEIS.map((papel, i) => (
              <div key={papel} className="stack stack-2">
                <div className="row spread nome" style={{ lineHeight: 1 }}>
                  <span>{papel}</span>
                  <span style={{ color: 'var(--ih-ink2)' }}>{ativo.papeis[i]}</span>
                </div>
                <div className="barra-papel">
                  <span style={{ width: Math.round((ativo.papeis[i] / maior) * 100) + '%' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="painel">
            <h2 className="titulo-card">Governança</h2>
            {trilha.map((t) => (
              <div key={t.titulo} className="row row-3">
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
    </div>
  );
}
