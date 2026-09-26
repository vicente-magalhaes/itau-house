import { useEffect, useState } from 'react'
import { Badge } from '../../design-system/components/display/Badge.jsx'

type StatusApi = 'verificando' | 'ok' | 'indisponivel'

const BADGE: Record<StatusApi, { tone: 'neutral' | 'success'; texto: string }> = {
  verificando: { tone: 'neutral', texto: 'Verificando' },
  ok: { tone: 'success', texto: 'No ar' },
  indisponivel: { tone: 'neutral', texto: 'Indisponível' },
}

// Página provisória. Só confirma que front, proxy /api e back estão ligados.
function App() {
  const [status, setStatus] = useState<StatusApi>('verificando')

  useEffect(() => {
    fetch('/api/health')
      .then((resposta) => setStatus(resposta.ok ? 'ok' : 'indisponivel'))
      .catch(() => setStatus('indisponivel'))
  }, [])

  return (
    <main className="pagina">
      <h1>Itaú House</h1>
      <p>Protótipo em construção. Todos os dados são fictícios.</p>
      <div className="status">
        <span>API</span>
        <Badge tone={BADGE[status].tone}>{BADGE[status].texto}</Badge>
      </div>
    </main>
  )
}

export default App
