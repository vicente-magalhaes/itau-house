import React from 'react';
import { Button, Dialog, Icon, Radio } from '../ds.js';
import { BotaoSec, SeloSimulado } from './comuns.jsx';

// Instalar o Itaú House no agente da pessoa (RF-01). Quem instala é o próprio agente: a pessoa
// escolhe o modo, copia o texto e cola no Claude Code. Serve a quem não programa.

// Modos do plugin (RF-02, RF-04). Sem escolha, perguntar antes (0017).
const MODOS = [
  {
    valor: 'perguntar_antes',
    rotulo: 'Perguntar antes (padrão)',
    detalhe: 'Quando você pedir para criar uma skill, um agente ou um MCP, ele pergunta se pode procurar no Itaú House.',
  },
  { valor: 'proativo', rotulo: 'Proativo', detalhe: 'Procura sozinho antes de criar e mostra o que encontrou.' },
  { valor: 'sob_demanda', rotulo: 'Sob demanda', detalhe: 'Só procura quando você pede, com /itau-house.' },
];

// Marketplace na raiz do repositório (.claude-plugin/marketplace.json), com o plugin em plugin/.
const REPOSITORIO = 'vicente-magalhaes/itau-house';
const TESTE = '/itau-house harness de memória para o meu projeto';

// O texto que o agente segue. Leva a persona e o modo porque o plugin fala com a API como essa persona.
function textoParaOAgente({ site, usuarioId, modo }) {
  return [
    'Instale o plugin do Itaú House no meu Claude Code, para todos os meus projetos. Eu não programo: rode os comandos por mim, um de cada vez, e me conte em uma frase o que cada um fez.',
    '',
    '1. Confira se este computador tem git, uv e Python 3.10 ou mais novo. No Windows, o comando do Python costuma ser python, e não python3. Se faltar algum, me diga qual e peça minha permissão antes de instalar.',
    '',
    '2. Rode no terminal, nesta ordem:',
    `claude plugin marketplace add ${REPOSITORIO} --sparse .claude-plugin plugin`,
    'claude plugin install itau-house@itau-house',
    'Se o Itaú House já estiver instalado, pule este passo. Se o GitHub negar o acesso, pare e me avise: o repositório é privado, e eu preciso pedir acesso ao time.',
    '',
    '3. Abra o settings.json da pasta de configuração do Claude Code: a pasta da variável CLAUDE_CONFIG_DIR, se ela existir; se não, a pasta .claude dentro da minha pasta de usuário. Crie o arquivo se ele não existir. Dentro de "env", grave estes valores, sem apagar nada do que já está lá:',
    `"ITAU_HOUSE_API": "${site}",`,
    `"ITAU_HOUSE_SITE": "${site}",`,
    `"ITAU_HOUSE_USUARIO": "${usuarioId}",`,
    `"ITAU_HOUSE_MODO": "${modo}"`,
    '',
    '4. Rode claude mcp list e confira se plugin:itau-house:itau-house aparece como conectado. Na primeira vez, ele baixa o que precisa e pode levar um minuto. Se falhar, rode de novo uma vez; se falhar outra vez, me mostre o erro.',
    '',
    `5. No fim, me diga como fechar e abrir o Claude Code no meu caso. Depois, eu testo com: ${TESTE}`,
  ].join('\n');
}

function Passo({ n, titulo, children }) {
  return (
    <li className="passo-instalar">
      <span className="passo-n">{n}</span>
      <div className="stack stack-2">
        <span className="nome">{titulo}</span>
        {children}
      </div>
    </li>
  );
}

export function InstalarNoAgente({ pessoa, usuarioId, onClose }) {
  const [modo, setModo] = React.useState('perguntar_antes');
  const [copia, setCopia] = React.useState(null); // 'ok' | 'erro'
  const bloco = React.useRef(null);
  const texto = textoParaOAgente({ site: window.location.origin, usuarioId, modo });

  React.useEffect(() => {
    const fecharComEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fecharComEsc);
    return () => window.removeEventListener('keydown', fecharComEsc);
  }, [onClose]);

  function escolher(valor) {
    setModo(valor);
    setCopia(null); // o texto mudou: precisa copiar de novo
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopia('ok');
    } catch {
      // Sem acesso à área de transferência: deixa o texto selecionado para a pessoa copiar.
      const faixa = document.createRange();
      faixa.selectNodeContents(bloco.current);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(faixa);
      setCopia('erro');
    }
  }

  return (
    <Dialog
      title="Instale o Itaú House no seu agente"
      onClose={onClose}
      // O Dialog centraliza numa grade que cresce com a largura fixa; pela tela, cabe no celular.
      // Quem rola é só o conteúdo (.dialogo-rolagem): título e "Fechar" ficam parados.
      style={{ width: 'min(640px, calc(100vw - 2 * var(--space-5)))', maxHeight: 'calc(100dvh - 2 * var(--space-5))', overflow: 'hidden' }}
      actions={<BotaoSec onClick={onClose}>Fechar</BotaoSec>}
    >
      <div className="dialogo-rolagem stack stack-5">
        <p className="texto">
          Com o Itaú House, o seu agente avisa quando alguém já criou o que você vai criar e ajuda você a publicar o que fez. Você não
          precisa programar: o próprio agente faz a instalação.
        </p>

        <ol className="passos-instalar">
          <Passo n={1} titulo="Abra o Claude Code em um projeto seu.">
            <p className="texto">Nesta versão, o passo a passo é para o Claude Code.</p>
          </Passo>

          <Passo n={2} titulo="Escolha como o Itaú House avisa você.">
            <div className="stack stack-3" role="radiogroup" aria-label="Como o Itaú House avisa você">
              {MODOS.map((m) => (
                <div key={m.valor} className="modo-instalar">
                  <Radio label={m.rotulo} value={m.valor} checked={modo === m.valor} onChange={escolher} style={{ font: 'var(--fw-bold) var(--fs-body-sm)/1.3 var(--font-text)' }} />
                  <span className="texto">{m.detalhe}</span>
                </div>
              ))}
            </div>
            <p className="meta">Dá pra trocar depois: escolha outro modo aqui e mande o texto de novo.</p>
          </Passo>

          <Passo n={3} titulo="Copie o texto e cole no Claude Code.">
            <p className="texto">
              Ele confere o que falta no seu computador, instala e pede sua permissão antes de rodar cada comando. O texto é para o agente:
              você não precisa ler.
            </p>
            <pre ref={bloco} className="mono bloco-codigo texto-instalar" tabIndex={0} aria-label="Texto para colar no Claude Code">
              {texto}
            </pre>
            <div className="row wrap row-3">
              <Button variant="secondary" size="sm" iconLeft={copia === 'ok' ? 'check' : 'copy'} onClick={copiar}>
                {copia === 'ok' ? 'Texto copiado' : 'Copiar texto'}
              </Button>
              <span className="meta">
                O agente vai usar o seu perfil: <strong>{pessoa.nome}</strong>, {pessoa.squad}.
              </span>
            </div>
            <span role="status" className="sr-only">
              {copia === 'ok' ? 'Texto copiado. Agora cole no Claude Code.' : ''}
            </span>
            {copia === 'erro' && (
              <p role="alert" className="row row-2 meta" style={{ color: 'var(--status-error)' }}>
                <Icon name="circle-alert" size={18} color="var(--status-error)" />
                Não deu para copiar sozinho. O texto já está selecionado: copie com Ctrl+C (no Mac, Cmd+C).
              </p>
            )}
          </Passo>

          <Passo n={4} titulo="Quando ele terminar, feche e abra o Claude Code.">
            <p className="texto">O Itaú House começa a valer na próxima conversa.</p>
          </Passo>

          <Passo n={5} titulo="Teste pedindo:">
            <code className="mono bloco-codigo">{TESTE}</code>
            <p className="texto">Se ele mostrar o harness-hacka, está tudo certo.</p>
          </Passo>
        </ol>

        <div className="row row-3 wrap">
          <SeloSimulado ajuda="Num piloto, o plugin viria do repositório interno de plugins do banco, com o seu login corporativo.">Simulado</SeloSimulado>
          <span className="meta">No protótipo, o plugin vem do repositório do time no GitHub, que é privado: só quem tem acesso consegue instalar.</span>
        </div>
      </div>
    </Dialog>
  );
}
