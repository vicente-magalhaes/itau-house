import React from 'react';
import { curtirAtivo, instalarAtivo, listarUsuarios, SemApi, useDaApi } from './api.js';
import { pessoaDaApi } from './data/daApi.js';
import { PERFIS } from './data/governanca.js';
import { contaGuardada, esquecerConta, lerRetornoDoGoogle } from './google.js';

// Sessão do esboço. O login por SSO é [SIMULADO]: trocar de perfil é só um seletor.
const SessaoContext = React.createContext(null);

// Precisa rodar antes do roteador ler o fragmento da URL: o token do Google chega nele (T-41).
// Quem entra com Google opera como coordenação: a hierarquia é simulada (0034).
const voltouDoGoogle = lerRetornoDoGoogle();
if (voltouDoGoogle) {
  localStorage.setItem('ih.perfil', 'coordenador');
  localStorage.setItem('ih.entrou', 'sim');
}

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

// Ativo que veio da API traz curtidoPorMim (docs/api.md). Os fictícios não trazem: curtir e usar ficam no navegador.
function veioDaApi(ativo) {
  return ativo.curtidoPorMim !== undefined;
}

const FILTROS_INICIAIS = { estante: 'tudo', papel: 'todos', frente: 'todas', ordem: 'alta' };

export function SessaoProvider({ children }) {
  const [perfil, setPerfil] = React.useState(() => localStorage.getItem('ih.perfil') || 'dev');
  const { dados: usuarios, origem: origemUsuarios, carregando: carregandoUsuarios } = useDaApi(
    'usuarios',
    () => listarUsuarios().then((lista) => lista.map(pessoaDaApi)),
    () => PERFIS.map((p) => p.pessoa),
  );
  const perfisDisponiveis = React.useMemo(() => PERFIS.map((def) => ({
    ...def,
    pessoa: origemUsuarios === 'api' ? usuarios.find((p) => p.id === def.usuarioId) || def.pessoa : def.pessoa,
  })), [usuarios, origemUsuarios]);
  const [entrou, setEntrou] = React.useState(() => localStorage.getItem('ih.entrou') === 'sim');
  const [usados, setUsados] = React.useState([]);
  const [curtidos, setCurtidos] = React.useState(() => lerCurtidos(localStorage.getItem('ih.perfil') || 'dev'));
  // Última resposta da API a curtir e instalar, por pessoa e ativo. Vale por cima do que o feed e o post trouxeram.
  const [respostas, setRespostas] = React.useState({});
  const pendentes = React.useRef(new Set());
  const usuarioId = (PERFIS.find((p) => p.value === perfil) || PERFIS[0]).usuarioId;
  const [querem, setQuerem] = React.useState([]);
  const [criando, setCriando] = React.useState([]);
  const [busca, setBusca] = React.useState('');
  const [filtros, setFiltros] = React.useState(FILTROS_INICIAIS);
  // Quem acabou de voltar do Google já nasce com o recado de boas-vindas.
  const [recado, setRecado] = React.useState(() =>
    voltouDoGoogle ? `Você entrou com o Google como ${voltouDoGoogle.email}. Na demo, você opera como coordenação.` : null,
  );
  const [contaGoogle, setContaGoogle] = React.useState(contaGuardada);

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
    esquecerConta();
    setContaGoogle(null);
  }, []);

  React.useEffect(() => {
    if (!voltouDoGoogle) return undefined;
    const t = setTimeout(() => setRecado(null), 3200);
    return () => clearTimeout(t);
  }, []);

  const guardarResposta = React.useCallback(
    (id, parte) => setRespostas((atual) => ({ ...atual, [usuarioId + ':' + id]: { ...atual[usuarioId + ':' + id], ...parte } })),
    [usuarioId],
  );
  const falhou = React.useCallback(
    (e) => avisar(e instanceof SemApi ? 'Não conseguimos falar com o Itaú House. Tente de novo.' : e.message),
    [avisar],
  );

  // Usar (RF-29): com a API, registra a instalação e soma no contador. Nos fictícios, só no navegador.
  // Devolve true quando ficou registrado.
  const usar = React.useCallback(
    async (ativo) => {
      if (veioDaApi(ativo)) {
        try {
          const r = await instalarAtivo(usuarioId, ativo.id);
          guardarResposta(ativo.id, { instalacoes: r.instalacoes });
        } catch (e) {
          falhou(e);
          return false;
        }
      }
      setUsados((atual) => (atual.includes(ativo.id) ? atual : [...atual, ativo.id]));
      return true;
    },
    [usuarioId, guardarResposta, falhou],
  );

  // Curtir (RF-28): clicar de novo desfaz. Com a API, quem diz se ficou curtido é o back.
  const curtir = React.useCallback(
    async (ativo) => {
      if (!veioDaApi(ativo)) {
        setCurtidos((atual) => {
          const novo = alternar(atual, ativo.id);
          localStorage.setItem('ih.curtidos.' + perfil, JSON.stringify(novo));
          return novo;
        });
        return;
      }
      // Dois cliques antes da resposta viram uma curtida só.
      const chave = usuarioId + ':' + ativo.id;
      if (pendentes.current.has(chave)) return;
      pendentes.current.add(chave);
      try {
        const r = await curtirAtivo(usuarioId, ativo.id);
        guardarResposta(ativo.id, { curtido: r.curtido, curtidas: r.curtidas });
      } catch (e) {
        falhou(e);
      } finally {
        pendentes.current.delete(chave);
      }
    },
    [perfil, usuarioId, guardarResposta, falhou],
  );

  const querer = React.useCallback((id) => setQuerem((atual) => alternar(atual, id)), []);
  const criar = React.useCallback((id) => setCriando((atual) => alternar(atual, id)), []);
  const limparFiltros = React.useCallback(() => {
    setFiltros(FILTROS_INICIAIS);
    setBusca('');
  }, []);

  const respostaDe = React.useCallback((ativo) => respostas[usuarioId + ':' + ativo.id] || {}, [respostas, usuarioId]);
  const curtidoDe = React.useCallback(
    (ativo) => respostaDe(ativo).curtido ?? (veioDaApi(ativo) ? ativo.curtidoPorMim : curtidos.includes(ativo.id)),
    [respostaDe, curtidos],
  );
  const curtidasDe = React.useCallback(
    (ativo) => respostaDe(ativo).curtidas ?? ativo.curtidas + (!veioDaApi(ativo) && curtidos.includes(ativo.id) ? 1 : 0),
    [respostaDe, curtidos],
  );
  const reusosDe = React.useCallback(
    (ativo) => respostaDe(ativo).instalacoes ?? ativo.reusos + (!veioDaApi(ativo) && usados.includes(ativo.id) ? 1 : 0),
    [respostaDe, usados],
  );

  const valor = React.useMemo(() => {
    const def = perfisDisponiveis.find((p) => p.value === perfil) || perfisDisponiveis[0];
    return {
      perfil,
      pessoa: def.pessoa,
      usuarioId: def.usuarioId,
      usuarios: origemUsuarios === 'api' ? usuarios : null,
      carregandoUsuarios,
      perfisDisponiveis,
      rotuloPerfil: def.rotulo,
      ehCoordenador: perfil === 'coordenador',
      entrou,
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
      contaGoogle,
      trocarPerfil,
      entrar,
      sair,
      usar,
      curtir,
      querer,
      criar,
      curtidoDe,
      curtidasDe,
      reusosDe,
    };
  }, [perfil, usuarios, origemUsuarios, carregandoUsuarios, perfisDisponiveis, entrou, usados, curtidos, querem, criando, busca, filtros, limparFiltros, recado, avisar, contaGoogle, trocarPerfil, entrar, sair, usar, curtir, querer, criar, curtidoDe, curtidasDe, reusosDe]);

  return <SessaoContext.Provider value={valor}>{children}</SessaoContext.Provider>;
}

export function useSessao() {
  const ctx = React.useContext(SessaoContext);
  if (!ctx) throw new Error('useSessao precisa estar dentro de SessaoProvider');
  return ctx;
}
