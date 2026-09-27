"""Gera supabase/seed.sql a partir do catálogo fictício (backend/app/dados/seed.json).

O JSON é a fonte: mudou pessoa, ativo ou número, edite o JSON e rode `python3 supabase/gerar_seed_sql.py`.
O SQL é idempotente: rodar de novo atualiza as linhas do seed, sem duplicar.
"""

import json
import uuid
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
seed = json.loads((RAIZ / "backend/app/dados/seed.json").read_text(encoding="utf-8"))
NS = uuid.UUID("6f1c2b1e-0000-4000-8000-1ca0a0005eed")


def q(v):
    """Literal SQL. Listas viram text[]; dicts e listas de dicts viram jsonb."""
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, int):
        return str(v)
    if isinstance(v, list) and all(isinstance(x, str) for x in v):
        return "array[" + ", ".join(q(x) for x in v) + "]::text[]" if v else "'{}'::text[]"
    if isinstance(v, (list, dict)):
        return q(json.dumps(v, ensure_ascii=False)) + "::jsonb"
    return "'" + str(v).replace("'", "''") + "'"


def upsert(tabela, linhas, chave="id"):
    if not linhas:
        return ""
    cols = list(linhas[0])
    valores = ",\n".join("  (" + ", ".join(q(l[c]) for c in cols) + ")" for l in linhas)
    atualiza = ", ".join(f"{c} = excluded.{c}" for c in cols if c != chave)
    return (
        f"insert into {tabela} ({', '.join(cols)}) values\n{valores}\n"
        f"on conflict ({chave}) do update set {atualiza};\n\n"
    )


squads = [{"id": s["id"], "nome": s["nome"], "frente": s["frente"]} for s in seed["squads"]]
usuarios = [
    {k: u[k] for k in ("id", "nome", "iniciais", "papel", "cargo")}
    | {"squad_id": u["squadId"], "perfil": u["perfil"], "foto_url": u.get("fotoUrl")}
    for u in seed["usuarios"]
]

# Originais antes das derivações, por causa da chave estrangeira derivado_de.
ativos_json = sorted(seed["ativos"], key=lambda a: a["derivadoDe"] is not None)
ativos, eventos = [], []
for a in ativos_json:
    usos = a["usos"]
    n_inst = sum(u["tipo"] == "instalacao" for u in usos)
    n_deriv = sum(u["tipo"] == "derivacao" for u in usos)
    ativos.append({
        "id": a["id"], "nome": a["nome"], "tipo": a["tipo"], "resumo": a["resumo"],
        "readme": a["readme"], "arquivos": a["arquivos"], "manual_instalacao": a["manualInstalacao"],
        "autor_id": a["autorId"], "squad_id": a["squadId"], "visibilidade": a["visibilidade"],
        "status": a["status"], "derivado_de": a["derivadoDe"], "aprovado_por": a["aprovadoPorId"],
        "tags": a["tags"], "ferramentas": a["ferramentas"], "versao": a["versao"], "acessos": a["acessos"],
        # Os usos do seed viram eventos; a base é o resto, para o total bater com o JSON.
        "curtidas_base": a["curtidas"], "instalacoes_base": a["instalacoes"] - n_inst,
        "derivacoes_base": a["derivacoes"] - n_deriv, "squads_reuso_base": a["squadsQueReusaram"],
        "enviado_em": a["enviadoEm"], "publicado_em": a["publicadoEm"], "atualizado_em": a["atualizadoEm"],
    })

    def evento(tipo, ator, em, dados=None):
        eventos.append({
            "id": str(uuid.uuid5(NS, f"{a['id']}:{tipo}:{ator}:{em}")), "tipo": tipo, "ator_id": ator,
            "ativo_id": a["id"], "dados": dados or {}, "criado_em": em,
        })

    evento("envio", a["autorId"], a["enviadoEm"], {"visibilidade": a["visibilidade"]})
    if a["status"] == "publicado":
        evento("aprovacao", a["aprovadoPorId"], a["publicadoEm"])
    for u in usos:
        evento(u["tipo"], u["pessoaId"], u["em"])

sql = (
    "-- Dados fictícios de demonstração. Nada aqui é dado real (regulamento 3.8).\n"
    "-- Nomes de pessoas, squads e ativos são inventados.\n"
    "--\n"
    "-- GERADO por supabase/gerar_seed_sql.py a partir de backend/app/dados/seed.json. Não editar à mão.\n"
    "-- Aplicar na nuvem junto com as migrações: supabase db push --include-seed\n"
    "-- Idempotente: rodar de novo atualiza as linhas do seed, sem duplicar.\n\n"
    + upsert("squads", squads)
    + upsert("usuarios", usuarios)
    + upsert("ativos", ativos)
    + upsert("eventos", eventos)
)
(RAIZ / "supabase/seed.sql").write_text(sql, encoding="utf-8")
print(f"seed.sql: {len(squads)} squads, {len(usuarios)} usuários, {len(ativos)} ativos, {len(eventos)} eventos")
