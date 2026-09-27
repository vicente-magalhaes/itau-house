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

export function SessaoProvider({ children }) {
  const [perfil, setPerfil] = React.useState(() => localStorage.getItem('ih.perfil') || 'dev');
  const [entrou, setEntrou] = React.useState(() => localStorage.getItem('ih.entrou') === 'sim');
  const [instalados, setInstalados] = React.useState([]);
  const [curtidos, setCurtidos] = React.useState(() => lerCurtidos(localStorage.getItem('ih.perfil') || 'dev'));
  const [busca, setBusca] = React.useState('');

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

  const instalar = React.useCallback((id) => {
    setInstalados((atual) => (atual.includes(id) ? atual : [...atual, id]));
  }, []);

  // Clicar de novo desfaz a curtida.
  const curtir = React.useCallback((id) => {
    setCurtidos((atual) => {
      const novo = atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id];
      localStorage.setItem('ih.curtidos.' + perfil, JSON.stringify(novo));
      return novo;
    });
  }, [perfil]);

  const curtidasDe = React.useCallback((ativo) => ativo.curtidas + (curtidos.includes(ativo.id) ? 1 : 0), [curtidos]);
  const instalacoesDe = React.useCallback((ativo) => ativo.reusos + (instalados.includes(ativo.id) ? 1 : 0), [instalados]);

  const valor = React.useMemo(() => {
    const def = PERFIS.find((p) => p.value === perfil) || PERFIS[0];
    return {
      perfil,
      pessoa: def.pessoa,
      rotuloPerfil: def.rotulo,
      ehCoordenador: perfil === 'coordenador',
      entrou,
      instalados,
      curtidos,
      busca,
      setBusca,
      trocarPerfil,
      entrar,
      sair,
      instalar,
      curtir,
      curtidasDe,
      instalacoesDe,
    };
  }, [perfil, entrou, instalados, curtidos, busca, trocarPerfil, entrar, sair, instalar, curtir, curtidasDe, instalacoesDe]);

  return <SessaoContext.Provider value={valor}>{children}</SessaoContext.Provider>;
}

export function useSessao() {
  const ctx = React.useContext(SessaoContext);
  if (!ctx) throw new Error('useSessao precisa estar dentro de SessaoProvider');
  return ctx;
}
