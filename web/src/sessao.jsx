import React from 'react';
import { PERFIS } from './data/governanca.js';

// Sessão do esboço. O login por SSO é [SIMULADO]: trocar de perfil é só um seletor.
const SessaoContext = React.createContext(null);

export function SessaoProvider({ children }) {
  const [perfil, setPerfil] = React.useState(() => localStorage.getItem('ih.perfil') || 'dev');
  const [entrou, setEntrou] = React.useState(() => localStorage.getItem('ih.entrou') === 'sim');
  const [instalados, setInstalados] = React.useState([]);

  const trocarPerfil = React.useCallback((p) => {
    setPerfil(p);
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

  const valor = React.useMemo(() => {
    const def = PERFIS.find((p) => p.value === perfil) || PERFIS[0];
    return {
      perfil,
      pessoa: def.pessoa,
      rotuloPerfil: def.rotulo,
      ehCoordenador: perfil === 'coordenador',
      entrou,
      instalados,
      trocarPerfil,
      entrar,
      sair,
      instalar,
    };
  }, [perfil, entrou, instalados, trocarPerfil, entrar, sair, instalar]);

  return <SessaoContext.Provider value={valor}>{children}</SessaoContext.Provider>;
}

export function useSessao() {
  const ctx = React.useContext(SessaoContext);
  if (!ctx) throw new Error('useSessao precisa estar dentro de SessaoProvider');
  return ctx;
}
