import { listarAprovacoes, recarregar, useDaApi } from './api.js';
import { useSessao } from './sessao.jsx';
import { filaAprovacao } from './data/governanca.js';
import { itemFilaDaApi } from './data/daApi.js';

// Fila do Cord+ logado (RF-32). A tela de aprovações e o contador do topo leem a mesma, com a mesma chave.
// Quem não é coordenação não chama a rota: a API responderia 403.
export function useFila() {
  const { usuarioId, ehCoordenador } = useSessao();
  const leitura = useDaApi(
    'fila:' + usuarioId,
    () => (ehCoordenador ? listarAprovacoes(usuarioId).then((itens) => itens.map(itemFilaDaApi)) : Promise.resolve([])),
    () => filaAprovacao,
  );
  return { ...leitura, recarregar: () => recarregar('fila:' + usuarioId) };
}
