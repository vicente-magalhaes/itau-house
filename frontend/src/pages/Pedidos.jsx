import React from 'react';
import { Button, Icon } from '../ds.js';
import { Foto } from '../components/comuns.jsx';
import { useSessao } from '../sessao.jsx';
import { pedidos, ESTANTES, iconeEstante } from '../data/catalogo.js';

// Pedidos: quem não achou pede, quem sabe fazer assume. Tudo aqui é simulado.
export function Pedidos() {
  const { pessoa, querem, criando, querer, criar, avisar } = useSessao();

  return (
    <div className="stack stack-5">
      <div className="row wrap spread row-4" style={{ alignItems: 'flex-end' }}>
        <div className="stack stack-2">
          <h1 className="titulo-pagina">Não achou? Peça pra quem sabe fazer</h1>
          <p className="texto" style={{ maxWidth: '62ch' }}>
            Quem atende um pedido publica o ativo com crédito. Cada pessoa que também quer aumenta a prioridade.
          </p>
        </div>
        <Button variant="primary" size="sm" iconLeft="plus" onClick={() => avisar('Pedido simulado. No produto, ele vai pro feed de quem trabalha com o mesmo tema.')}>
          Fazer um pedido
        </Button>
      </div>

      <div className="stack stack-4">
        {pedidos.map((p) => {
          const quero = querem.includes(p.id);
          const euCrio = criando.includes(p.id);
          const criador = euCrio ? pessoa : p.criador;
          return (
            <article key={p.id} className="painel row wrap row-4" style={{ flexDirection: 'row' }}>
              <span className="icone-quadrado capa">
                <Icon name={iconeEstante(p.estante)} size={20} />
              </span>
              <div className="stack stack-2" style={{ flex: '1 1 320px', minWidth: 0 }}>
                <h2 className="titulo-card">{p.titulo}</h2>
                <span className="row row-2">
                  <Foto pessoa={p.autor} tamanho={24} />
                  <span className="meta">
                    <strong>{p.autor.nome}</strong> · {p.autor.cargo} · {ESTANTES[p.estante].nome}
                  </span>
                </span>
              </div>
              <div className="row wrap row-2">
                {criador && (
                  <span className="btn" style={{ cursor: 'default', padding: '0 var(--space-3) 0 var(--ih-gap-contagem)', background: 'var(--ih-surface)' }}>
                    <Foto pessoa={criador} tamanho={24} />
                    {euCrio ? 'Você está criando' : `${criador.primeiro} está criando`}
                  </span>
                )}
                <button type="button" className="btn btn-sec btn-querer" aria-pressed={quero} onClick={() => querer(p.id)}>
                  <Icon name="arrow-big-up" size={18} />
                  {p.querem + (quero ? 1 : 0)} também querem
                </button>
                {!criador && (
                  <button
                    type="button"
                    className="btn btn-forte"
                    onClick={() => {
                      criar(p.id);
                      avisar(`Pronto! Avisamos ${p.autor.primeiro} que você vai criar.`);
                    }}
                  >
                    Eu crio
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
