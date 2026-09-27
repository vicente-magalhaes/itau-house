import React from 'react';
import { Button, Icon } from '../ds.js';
import { Foto } from '../components/comuns.jsx';
import { NumeroVivo, Pulso } from '../components/movimento.jsx';
import { useSessao } from '../sessao.jsx';
import { pedidos, ESTANTES, iconeTipo } from '../data/catalogo.js';

// Pedidos: quem não achou pede, quem sabe fazer assume. Tudo aqui é simulado.
export function Pedidos() {
  const { pessoa, querem, criando, querer, criar, avisar } = useSessao();

  return (
    <div className="stack stack-5">
      <div className="row wrap spread row-4" style={{ alignItems: 'flex-end' }}>
        <h1 className="titulo-pagina">Não achou? Peça pra quem sabe fazer</h1>
        <Button variant="primary" size="sm" iconLeft="plus" onClick={() => avisar('Pedido simulado. No produto, ele vai pro feed de quem trabalha com o mesmo tema.')}>
          Fazer um pedido
        </Button>
      </div>

      <div className="stack stack-4 anima-escalonada">
        {pedidos.map((p) => {
          const quero = querem.includes(p.id);
          const euCrio = criando.includes(p.id);
          const criador = euCrio ? pessoa : p.criador;
          return (
            <article key={p.id} className="painel row wrap row-4" style={{ flexDirection: 'row' }}>
              <span className="icone-quadrado icone-tipo">
                <Icon name={iconeTipo(p.tipo)} size={20} label={p.tipo} />
              </span>
              <div className="stack stack-2" style={{ flex: '1 1 320px', minWidth: 0 }}>
                <h2 className="titulo-card">{p.titulo}</h2>
                <span className="row row-2">
                  <Foto pessoa={p.autor} tamanho={32} />
                  <span className="meta">
                    <strong>{p.autor.nome}</strong> · {p.autor.cargo} · {ESTANTES[p.estante].nome}
                  </span>
                </span>
              </div>
              <div className="row wrap row-2">
                {criador && (
                  <span className="btn anima-surgir" style={{ cursor: 'default', padding: '0 var(--space-3) 0 var(--ih-gap-contagem)', background: 'var(--ih-surface)' }}>
                    <Foto pessoa={criador} tamanho={32} />
                    {euCrio ? 'Você está criando' : `${criador.primeiro} está criando`}
                  </span>
                )}
                <button type="button" className="btn btn-sec btn-querer" aria-pressed={quero} onClick={() => querer(p.id)}>
                  <Pulso gatilho={quero} efeito="seta">
                    <Icon name="arrow-big-up" size={18} />
                  </Pulso>
                  <span>
                    <NumeroVivo valor={p.querem + (quero ? 1 : 0)} /> também querem
                  </span>
                </button>
                {!criador && (
                  <button
                    type="button"
                    className="btn btn-sec"
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
