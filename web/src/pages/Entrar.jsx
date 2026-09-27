import React from 'react';
import { Button, Card, Icon, Logo, Radio } from '../ds.js';
import { Avatar, SeloSimulado } from '../components/comuns.jsx';
import { irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { PERFIS } from '../data/governanca.js';

// Tela de entrada. Roda fora do AppShell, então ela se basta: sem header e sem rodapé do app.

const PROMESSAS = [
  { icone: 'search', texto: 'O que já existe aparece antes de você construir.' },
  { icone: 'shield-check', texto: 'Nada entra sem verificação e aprovação de uma pessoa.' },
  { icone: 'history', texto: 'Fica registrado quem publicou, aprovou e reaproveitou.' },
];

function Promessa({ icone, texto }) {
  return (
    <li className="row row-3" style={{ alignItems: 'flex-start' }}>
      <Icon name={icone} size={20} color="var(--itau-preto)" style={{ marginTop: 2 }} />
      <span className="grow" style={{ font: 'var(--fw-regular) var(--fs-body)/var(--lh-body) var(--font-text)', color: 'var(--itau-preto)' }}>
        {texto}
      </span>
    </li>
  );
}

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
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-md)',
        background: selecionado ? 'var(--surface-subtle)' : 'var(--surface-card)',
        boxShadow: selecionado ? 'inset 0 0 0 2px var(--itau-laranja)' : 'inset 0 0 0 1px var(--border-default)',
        transition: 'background var(--dur-fast) var(--ease-standard)',
      }}
      label={
        <span className="stack stack-2 grow">
          <span style={{ font: 'var(--fw-bold) var(--fs-body)/1.3 var(--font-text)', color: 'var(--text-primary)' }}>{opcao.rotulo}</span>
          <span className="small" style={{ color: 'var(--text-secondary)' }}>{opcao.descricao}</span>
          <span className="row row-2">
            <Avatar iniciais={opcao.pessoa.iniciais} tamanho={32} tone={selecionado ? 'brand' : 'neutro'} />
            <span className="stack">
              <span className="small" style={{ color: 'var(--text-primary)' }}>{opcao.pessoa.nome}</span>
              <span className="caption">{opcao.pessoa.papel} · {opcao.pessoa.squad}</span>
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

  function entrarNaDemo() {
    entrar(escolhido);
    irPara('/');
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '100vh', alignItems: 'stretch' }}>
      {/* Campo chapado laranja, com texto preto: o contraste do branco sobre laranja só serve para display. */}
      <div
        className="stack"
        style={{
          flex: '1 1 440px',
          gap: 'var(--space-7)',
          background: 'var(--surface-brand)',
          padding: 'var(--space-8) var(--space-7)',
          justifyContent: 'space-between',
        }}
      >
        <Logo variant="negative" basePath="/" size={48} />

        <div className="stack stack-5" style={{ maxWidth: 460 }}>
          {/* O nome é marca, não título da página: o h1 da tela é "Entrar", na coluna da direita. */}
          <div
            style={{
              font: 'var(--fw-bold) var(--fs-display-m)/var(--lh-tight) var(--font-display)',
              letterSpacing: 'var(--ls-display)',
              color: 'var(--itau-branco)',
            }}
          >
            Itaú House
          </div>
          <p style={{ font: 'var(--fw-regular) var(--fs-body-lg)/var(--lh-body) var(--font-text)', color: 'var(--itau-preto)' }}>
            Um lugar para achar o que outra squad já construiu, e para o que você construiu não se perder.
          </p>
          <ul className="stack stack-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {PROMESSAS.map((p) => (
              <Promessa key={p.icone} icone={p.icone} texto={p.texto} />
            ))}
          </ul>
        </div>

        <span className="row row-2" style={{ font: 'var(--fw-bold) var(--fs-body-sm)/1 var(--font-text)', color: 'var(--itau-preto)' }}>
          <Icon name="layers" size={18} color="var(--itau-preto)" />
          Skills, agentes, MCPs, frameworks e esqueletos de código
        </span>
      </div>

      {/* Coluna de entrada. */}
      <div
        style={{
          flex: '1 1 440px',
          background: 'var(--surface-page)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-8) var(--space-5)',
        }}
      >
        <div className="stack stack-6" style={{ width: '100%', maxWidth: 440 }}>
          <div className="stack stack-2">
            <h1 style={{ font: 'var(--fw-bold) var(--fs-h1)/var(--lh-heading) var(--font-display)', letterSpacing: 'var(--ls-display)' }}>
              Entrar
            </h1>
            <p className="muted">Escolha o perfil que você quer usar na demonstração. Dá para trocar depois, dentro do app.</p>
          </div>

          <div className="stack stack-3">
            <span id="rotulo-perfil" style={{ font: 'var(--fw-bold) var(--fs-body-sm)/1.2 var(--font-text)' }}>Perfil</span>
            <div className="stack stack-3" role="radiogroup" aria-labelledby="rotulo-perfil">
              {PERFIS.map((opcao) => (
                <OpcaoPerfil key={opcao.value} opcao={opcao} escolhido={escolhido} onEscolher={setEscolhido} />
              ))}
            </div>
          </div>

          <div className="stack stack-3">
            <Button variant="primary" size="lg" fullWidth iconLeft="building-2" onClick={entrarNaDemo}>
              Entrar com o SSO do Itaú
            </Button>
            <div className="row row-2 wrap">
              <SeloSimulado ajuda="O login por SSO é simulado. Nada é autenticado: trocar de perfil aqui só muda o que a tela mostra.">
                SSO simulado
              </SeloSimulado>
              <span className="caption grow">Nada é autenticado. O perfil só muda o que a tela mostra.</span>
            </div>
          </div>

          <Card tone="subtle" padding={16}>
            <span className="row row-3" style={{ alignItems: 'flex-start' }}>
              <Icon name="flask-conical" size={18} color="var(--text-tertiary)" style={{ marginTop: 2 }} />
              <span className="caption grow">
                Protótipo do Hackathon Itaú 2026, feito pela equipe da Poli Júnior. Não é um produto oficial do Itaú.
                Todos os dados são fictícios e nenhuma tela se conecta a um sistema do banco.
              </span>
            </span>
          </Card>
        </div>
      </div>
    </div>
  );
}
