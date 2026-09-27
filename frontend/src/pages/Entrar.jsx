import React from 'react';
import { Button, Logo, Radio } from '../ds.js';
import { Foto, SeloSimulado } from '../components/comuns.jsx';
import { irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { PERFIS } from '../data/governanca.js';
import { entrarComGoogle } from '../google.js';

// Login simulado (RF-23) com troca de perfil Cord− / Cord+ (RF-24). Roda fora do AppShell.

function OpcaoPerfil({ opcao, escolhido, onEscolher }) {
  const selecionado = escolhido === opcao.value;
  return (
    <Radio
      name="perfil"
      value={opcao.value}
      checked={selecionado}
      onChange={onEscolher}
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 'var(--radius-md)',
        boxShadow: selecionado ? 'inset 0 0 0 2px var(--ih-ink)' : 'inset 0 0 0 1px var(--ih-line)',
        transition: 'box-shadow var(--dur-base) var(--ease-standard)',
      }}
      label={
        <span className="row row-3 grow">
          <Foto pessoa={opcao.pessoa} tamanho={48} anel={selecionado} />
          <span className="stack">
            <span className="strong">{opcao.pessoa.nome}</span>
            <span className="caption">
              {opcao.rotulo} · {opcao.pessoa.squad}
            </span>
          </span>
        </span>
      }
    />
  );
}

export function Entrar() {
  const { perfil, entrar } = useSessao();
  const [escolhido, setEscolhido] = React.useState(perfil);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '100vh' }}>
      {/* Campo chapado laranja, com texto preto: branco sobre laranja só serve para display. */}
      <div
        className="stack"
        style={{ flex: '1 1 440px', justifyContent: 'space-between', background: 'var(--surface-brand)', padding: 'var(--space-8) var(--space-7)' }}
      >
        <Logo variant="negative" basePath="/" size={48} />
        <div className="stack stack-4 anima-entrar" style={{ maxWidth: 440 }}>
          <div style={{ font: 'var(--fw-bold) var(--fs-display-m)/var(--lh-tight) var(--font-display)', letterSpacing: 'var(--ls-display)', color: 'var(--on-brand-display)' }}>
            Itaú House
          </div>
          <p style={{ font: 'var(--fw-regular) var(--fs-body-lg)/var(--lh-body) var(--font-text)', color: 'var(--on-brand)' }}>
            O que uma pessoa do squad cria com IA vira do squad inteiro.
          </p>
        </div>
        <span />
      </div>

      <div style={{ flex: '1 1 440px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8) var(--space-5)' }}>
        <div className="stack stack-5 anima-escalonada" style={{ width: '100%', maxWidth: 400 }}>
          <h1 className="titulo-pagina">Entrar</h1>

          {/* Login real pelo Google (T-41, 0034). A hierarquia continua simulada. */}
          <div className="stack stack-2">
            <Button variant="primary" size="sm" fullWidth onClick={entrarComGoogle}>
              Entrar com Google
            </Button>
            <span className="caption">
              Login real pelo Google. A hierarquia é simulada: quem entra por aqui opera como coordenação.
            </span>
          </div>

          <span className="caption">Ou escolha um perfil de demonstração:</span>

          <div className="stack stack-2" role="radiogroup" aria-label="Perfil">
            {PERFIS.map((opcao) => (
              <OpcaoPerfil key={opcao.value} opcao={opcao} escolhido={escolhido} onEscolher={setEscolhido} />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => {
              entrar(escolhido);
              irPara('/');
            }}
          >
            Entrar com o perfil escolhido
          </Button>

          <div className="row row-2 wrap">
            <SeloSimulado ajuda="O login com Google é real. Os perfis, squads e a hierarquia são fictícios.">Hierarquia simulada</SeloSimulado>
            <span className="caption">Protótipo do Hackathon Itaú 2026. Não é um produto oficial do Itaú.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
