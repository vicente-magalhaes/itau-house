import React from 'react';
import { PERFIS } from './data/governanca.js';

// Sessão do esboço. O login por SSO é [SIMULADO]: trocar de perfil é só um seletor.
const SessaoContext = React.createContext(null);

// Curtidas ficam por perfil no localStorage: uma por pessoa por ativo (RF-28).
function lerCurtidos(perfil) {
  try {
    return JSON.parse(localStorage.getItem('ih.curtidos.' + perfil) || '[]');
  } catch {
    return [];
  }
}

// Liga e desliga um id numa lista.
function alternar(lista, id) {
  return lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id];
}

const FILTROS_INICIAIS = { estante: 'tudo', papel: 'todos', ordem: 'alta' };

export function SessaoProvider({ children }) {
  const [perfil, setPerfil] = React.useState(() => localStorage.getItem('ih.perfil') || 'dev');
  const [entrou, setEntrou] = React.useState(() => localStorage.getItem('ih.entrou') === 'sim');
  const [tema, setTema] = React.useState(() => (localStorage.getItem('ih.tema') === 'escuro' ? 'escuro' : 'claro'));
  const [usados, setUsados] = React.useState([]);
  const [curtidos, setCurtidos] = React.useState(() => lerCurtidos(localStorage.getItem('ih.perfil') || 'dev'));
  const [querem, setQuerem] = React.useState([]);
  const [criando, setCriando] = React.useState([]);
  const [busca, setBusca] = React.useState('');
  const [filtros, setFiltros] = React.useState(FILTROS_INICIAIS);
  const [recado, setRecado] = React.useState(null);

  // O tema vale para a página inteira: os tokens do design system mudam no <html>.
  React.useLayoutEffect(() => {
    document.documentElement.dataset.theme = tema;
    localStorage.setItem('ih.tema', tema);
  }, [tema]);

  const trocarTema = React.useCallback(() => setTema((t) => (t === 'escuro' ? 'claro' : 'escuro')), []);

  // Recado curto no rodapé da tela. Some sozinho.
  const temporizador = React.useRef(null);
  const avisar = React.useCallback((texto) => {
    setRecado(texto);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setRecado(null), 3200);
  }, []);

  const trocarPerfil = React.useCallback((p) => {
    setPerfil(p);
    setCurtidos(lerCurtidos(p));
    localStorage.setItem('ih.perfil', p);
  }, []);

  const entrar = React.useCallback((p) => {
    trocarPerfil(p);
    setEntrou(true);
    localStorage.setItem('ih.entrou', 'sim');
  }, [trocarPerfil]);

  const sair = React.useCallback(() => {
    setEntrou(false);
    localStorage.removeItem('ih.entrou');
  }, []);

  const usar = React.useCallback((id) => {
    setUsados((atual) => (atual.includes(id) ? atual : [...atual, id]));
  }, []);

  // Clicar de novo desfaz a curtida.
  const curtir = React.useCallback((id) => {
    setCurtidos((atual) => {
      const novo = alternar(atual, id);
      localStorage.setItem('ih.curtidos.' + perfil, JSON.stringify(novo));
      return novo;
    });
  }, [perfil]);

  const querer = React.useCallback((id) => setQuerem((atual) => alternar(atual, id)), []);
  const criar = React.useCallback((id) => setCriando((atual) => alternar(atual, id)), []);
  const limparFiltros = React.useCallback(() => {
    setFiltros(FILTROS_INICIAIS);
    setBusca('');
  }, []);

  const curtidasDe = React.useCallback((ativo) => ativo.curtidas + (curtidos.includes(ativo.id) ? 1 : 0), [curtidos]);
  const reusosDe = React.useCallback((ativo) => ativo.reusos + (usados.includes(ativo.id) ? 1 : 0), [usados]);

  const valor = React.useMemo(() => {
    const def = PERFIS.find((p) => p.value === perfil) || PERFIS[0];
    return {
      perfil,
      pessoa: def.pessoa,
      rotuloPerfil: def.rotulo,
      ehCoordenador: perfil === 'coordenador',
      entrou,
      tema,
      trocarTema,
      usados,
      curtidos,
      querem,
      criando,
      busca,
      setBusca,
      filtros,
      setFiltros,
      limparFiltros,
      recado,
      avisar,
      trocarPerfil,
      entrar,
      sair,
      usar,
      curtir,
      querer,
      criar,
      curtidasDe,
      reusosDe,
    };
  }, [perfil, entrou, tema, trocarTema, usados, curtidos, querem, criando, busca, filtros, limparFiltros, recado, avisar, trocarPerfil, entrar, sair, usar, curtir, querer, criar, curtidasDe, reusosDe]);

  return <SessaoContext.Provider value={valor}>{children}</SessaoContext.Provider>;
}

export function useSessao() {
  const ctx = React.useContext(SessaoContext);
  if (!ctx) throw new Error('useSessao precisa estar dentro de SessaoProvider');
  return ctx;
}
