import React from 'react';
import { Button, Logo } from '../ds.js';
import { Foto } from '../components/comuns.jsx';
import { irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { entrarComGoogle } from '../google.js';
import { useEstreito } from '../tela.js';

// Tela de entrada (RF-23), do design "Entrar 1c Mãos juntas". Roda fora do AppShell.
// Google é login real (T-41, 0034). A persona é [SIMULADO]: quem entra escolhe com qual pessoa fictícia opera (RF-24).

function FormularioEntrar() {
  const { entrar, perfisDisponiveis } = useSessao();
  const [selecionado, setSelecionado] = React.useState('dev');

  return (
    <form
      className="stack stack-4"
      onSubmit={(e) => {
        e.preventDefault();
        entrar(selecionado);
        irPara('/');
      }}
    >
      <Button variant="outline" fullWidth onClick={entrarComGoogle}>
        <img src="/assets/google-g.svg" alt="" width={18} height={18} style={{ display: 'block' }} />
        Entrar com Google
      </Button>
      <div className="row row-3">
        <span className="divider grow" />
        <span className="caption" style={{ whiteSpace: 'nowrap' }}>Ou escolha uma persona</span>
        <span className="divider grow" />
      </div>
      <div className="stack stack-2" role="group" aria-label="Escolha seu perfil simulado">
        {perfisDisponiveis.map((p) => (
          <button key={p.value} type="button" className="btn btn-sec row row-3" aria-pressed={selecionado === p.value} onClick={() => setSelecionado(p.value)} style={{ height: 'auto', justifyContent: 'flex-start', padding: 'var(--space-2) var(--space-3)', borderColor: selecionado === p.value ? 'var(--brand)' : undefined }}>
            <Foto pessoa={p.pessoa} tamanho={40} />
            <span className="stack stack-1" style={{ alignItems: 'flex-start', textAlign: 'left', minWidth: 0 }}>
              <span className="strong">{p.rotulo} · {p.pessoa.nome}</span>
              <span className="meta">{p.pessoa.cargo} · {p.pessoa.squad}</span>
            </span>
          </button>
        ))}
      </div>
      <Button type="submit" fullWidth>
        Entrar
      </Button>
    </form>
  );
}

export function Entrar() {
  // No celular a ilustração vira uma faixa e o botão de entrar cabe na primeira tela.
  const estreito = useEstreito();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '100vh', background: 'var(--surface-page)' }}>
      {/* A cor de fundo só aparece enquanto a ilustração carrega. */}
      <div
        role="img"
        aria-label="Ilustração: várias mãos segurando a mesma peça"
        style={{ flex: '1 1 560px', minHeight: estreito ? 160 : 420, background: "var(--ilu-amarelo-300) url('/assets/ilustracoes/hero-maos-pedra.png') center / cover no-repeat" }}
      />

      <div
        className="stack"
        style={{
          flex: '1 1 520px',
          minWidth: 0,
          boxSizing: 'border-box',
          justifyContent: 'space-between',
          gap: estreito ? 'var(--space-5)' : 'var(--space-7)',
          padding: estreito
            ? 'var(--space-5) var(--space-4) calc(var(--space-5) + env(safe-area-inset-bottom, 0px))'
            : 'var(--space-7) var(--space-8) var(--space-7) clamp(var(--space-6), 8vw, var(--space-9))',
        }}
      >
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <Logo basePath="/" size={estreito ? 36 : 48} />
        </div>

        <div className={'stack anima-escalonada ' + (estreito ? 'stack-5' : 'stack-6')} style={{ width: '100%', maxWidth: 420 }}>
          <div className={'stack ' + (estreito ? 'stack-2' : 'stack-4')}>
            <h1 style={{ margin: 0, font: `var(--fw-heavy) ${estreito ? 'var(--fs-display-m)' : 'var(--fs-display-l)'}/var(--lh-tight) var(--font-display)`, letterSpacing: 'var(--ls-display)', color: 'var(--brand)' }}>
              Itaú House
            </h1>
            <p style={{ margin: 0, font: 'var(--fw-regular) var(--fs-h3)/var(--lh-body) var(--font-display)', color: 'var(--text-primary)', textWrap: 'pretty' }}>
              O que uma pessoa do squad cria com IA vira do squad inteiro.
            </p>
          </div>
          <FormularioEntrar />
        </div>

        <p className="caption" style={{ margin: 0 }}>
          Protótipo do Hackathon Itaú 2026. Não é um produto oficial do Itaú.
          <br />
          O login com Google é real; as personas são simuladas.
        </p>
      </div>
    </div>
  );
}
