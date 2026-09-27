import React from 'react';

// Peças de movimento que o CSS sozinho não resolve: animar só quando o valor muda depois de um toque,
// e segurar um elemento na tela enquanto ele sai. As animações em si ficam no app.css (seção Movimento).

// Número que troca deslizando: entra por baixo quando aumenta e por cima quando diminui.
// Na primeira pintura não anima; só quando o valor muda.
export function NumeroVivo({ valor }) {
  const [antes, setAntes] = React.useState(valor);
  const [direcao, setDirecao] = React.useState(null);
  if (valor !== antes) {
    setDirecao(valor > antes ? 'sobe' : 'desce');
    setAntes(valor);
  }
  // A chave nova remonta o span e a animação roda de novo a cada troca.
  return (
    <span key={valor} className={'numero-vivo' + (direcao ? ' numero-' + direcao : '')}>
      {valor}
    </span>
  );
}

// Envolve um ícone ou botão e roda o efeito quando `gatilho` muda para verdadeiro.
// efeito: 'seta' (impulso para cima), 'confirmar' (volta de um aperto) ou 'marcar' (aparece crescendo).
export function Pulso({ gatilho, efeito, children }) {
  const [antes, setAntes] = React.useState(gatilho);
  const [vezes, setVezes] = React.useState(0);
  if (gatilho !== antes) {
    setAntes(gatilho);
    setVezes((v) => v + 1);
  }
  return (
    <span key={vezes} className={'pulso' + (vezes > 0 && gatilho ? ' pulso-' + efeito : '')}>
      {children}
    </span>
  );
}

// Mantém o último valor na tela enquanto a saída anima. Devolve [valor mostrado, está saindo].
// A duração acompanha --dur-base do DS.
export function useSaida(valor, duracao = 200) {
  const [mostrado, setMostrado] = React.useState(valor);
  if (valor && valor !== mostrado) setMostrado(valor);

  React.useEffect(() => {
    if (valor) return undefined;
    const t = setTimeout(() => setMostrado(null), duracao);
    return () => clearTimeout(t);
  }, [valor, duracao]);

  return [valor || mostrado, !valor && !!mostrado];
}
