import React from 'react';
import { Button, Icon } from '../ds.js';
import { Vazio } from '../components/comuns.jsx';
import { PostCard } from '../components/Post.jsx';
import { irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { ativos, ORDENS, ordenar, visivelPara, pluralTipo, iconeTipo } from '../data/catalogo.js';

// Busca sem diferenciar acento nem caixa.
function normalizar(texto) {
  return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Feed por popularidade (RF-25), com curtir (RF-28) e filtro por tipo ou frente (RF-26).
export function Feed({ tipo, frente }) {
  const { pessoa, busca, setBusca, curtidasDe, instalacoesDe } = useSessao();
  const [ordem, setOrdem] = React.useState('alta');

  const lista = React.useMemo(() => {
    const termo = normalizar(busca).trim();
    const filtrados = ativos.filter((a) => {
      if (!visivelPara(a, pessoa)) return false;
      if (tipo && a.tipo !== tipo) return false;
      if (frente && a.frente !== frente) return false;
      if (!termo) return true;
      return normalizar([a.nome, a.resumo, a.tags.join(' '), a.squad, a.autor.nome].join(' ')).includes(termo);
    });
    return ordenar(filtrados, ordem, curtidasDe, instalacoesDe);
  }, [busca, ordem, tipo, frente, pessoa, curtidasDe, instalacoesDe]);

  const titulo = tipo ? pluralTipo(tipo) : frente || null;

  return (
    <div className="feed">
      {titulo ? (
        <header className="row row-3" style={{ paddingBottom: 'var(--space-4)' }}>
          <span
            style={{
              width: 48,
              height: 48,
              flex: 'none',
              display: 'grid',
              placeItems: 'center',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--brand)',
              color: 'var(--on-brand)',
            }}
          >
            <Icon name={tipo ? iconeTipo(tipo) : 'users'} size={24} />
          </span>
          <h1 className="titulo-pagina">{titulo}</h1>
        </header>
      ) : (
        <h1 className="sr-only">Início</h1>
      )}

      <div className="ordens" role="group" aria-label="Ordenar o feed">
        {ORDENS.map((o) => (
          <button key={o.value} type="button" className="chip" aria-pressed={ordem === o.value} onClick={() => setOrdem(o.value)}>
            <Icon name={o.icone} size={16} />
            {o.label}
          </button>
        ))}
        {busca && (
          <>
            <span className="grow" />
            <span className="caption" role="status">
              {lista.length} para “{busca}”
            </span>
            <button type="button" className="chip" onClick={() => setBusca('')}>
              <Icon name="x" size={16} />
              Limpar
            </button>
          </>
        )}
      </div>

      <hr className="divider" />

      {lista.length === 0 ? (
        <Vazio
          icone="search-x"
          titulo="Nada por aqui ainda"
          acao={
            <Button variant="outline" size="sm" iconLeft="plus" onClick={() => irPara('/publicar')}>
              Publicar o primeiro
            </Button>
          }
        />
      ) : (
        lista.map((a, i) => (
          <React.Fragment key={a.id}>
            {i > 0 && <hr className="divider" />}
            <PostCard ativo={a} />
          </React.Fragment>
        ))
      )}
    </div>
  );
}
