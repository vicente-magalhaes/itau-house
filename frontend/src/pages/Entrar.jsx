import React from 'react';
import { Button, Input, Logo } from '../ds.js';
import { irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { PERFIS } from '../data/governanca.js';
import { entrarComGoogle } from '../google.js';

// Tela de entrada (RF-23), do design "Entrar 1c Mãos juntas". Roda fora do AppShell.
// Google é login real (T-41, 0034). Login e senha são [SIMULADO]: a senha não é conferida.

// O login diz com qual perfil fictício entrar (RF-24). Começou pelo primeiro nome de um perfil
// ("juliana", "juliana.prado@..." entra na coordenação), entra nele. Qualquer outro entra como membro do squad.
function perfilDoLogin(login) {
  const nome = login.trim().toLowerCase().split(/[@._\s-]/)[0];
  const achado = PERFIS.find((p) => p.pessoa.primeiro.toLowerCase() === nome);
  return achado ? achado.value : 'dev';
}

function FormularioEntrar() {
  const { entrar } = useSessao();
  const [login, setLogin] = React.useState('');

  return (
    <form
      className="stack stack-4"
      onSubmit={(e) => {
        e.preventDefault();
        entrar(perfilDoLogin(login));
        irPara('/');
      }}
    >
      <Button variant="outline" fullWidth onClick={entrarComGoogle}>
        <img src="/assets/google-g.svg" alt="" width={18} height={18} style={{ display: 'block' }} />
        Entrar com Google
      </Button>
      <div className="row row-3">
        <span className="divider grow" />
        <span className="caption" style={{ whiteSpace: 'nowrap' }}>Ou use seu login</span>
        <span className="divider grow" />
      </div>
      <Input label="E-mail ou funcional" placeholder="voce@itau-unibanco.com.br" icon="user" value={login} onChange={(e) => setLogin(e.target.value)} />
      <Input label="Senha" type="password" placeholder="Sua senha" icon="lock" />
      <Button type="submit" fullWidth>
        Entrar
      </Button>
    </form>
  );
}

export function Entrar() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '100vh', background: 'var(--surface-page)' }}>
      {/* A cor de fundo só aparece enquanto a ilustração carrega. */}
      <div
        role="img"
        aria-label="Ilustração: várias mãos segurando a mesma peça"
        style={{ flex: '1 1 560px', minHeight: 420, background: "var(--ilu-amarelo-300) url('/assets/ilustracoes/hero-maos-pedra.png') center / cover no-repeat" }}
      />

      <div
        className="stack"
        style={{
          flex: '1 1 520px',
          minWidth: 0,
          boxSizing: 'border-box',
          justifyContent: 'space-between',
          gap: 'var(--space-7)',
          padding: 'var(--space-7) var(--space-8) var(--space-7) clamp(var(--space-6), 8vw, var(--space-9))',
        }}
      >
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <Logo basePath="/" size={48} />
        </div>

        <div className="stack stack-6 anima-escalonada" style={{ width: '100%', maxWidth: 420 }}>
          <div className="stack stack-4">
            <h1 style={{ margin: 0, font: 'var(--fw-heavy) var(--fs-display-l)/var(--lh-tight) var(--font-display)', letterSpacing: 'var(--ls-display)', color: 'var(--brand)' }}>
              Itaú House
            </h1>
            <p style={{ margin: 0, font: 'var(--fw-regular) var(--fs-h3)/var(--lh-body) var(--font-display)', color: 'var(--text-primary)', textWrap: 'pretty' }}>
              O que uma pessoa do squad cria com IA vira do squad inteiro.
            </p>
          </div>
          <FormularioEntrar />
        </div>

        <span className="caption">
          Protótipo do Hackathon Itaú 2026. Não é um produto oficial do Itaú. O login com Google é real; login e senha e a hierarquia são simulados.
        </span>
      </div>
    </div>
  );
}
