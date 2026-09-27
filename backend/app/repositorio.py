"""Acesso aos usuários do catálogo, em memória ou no Supabase."""

import os
from copy import deepcopy
from datetime import UTC, datetime
from functools import lru_cache
from typing import Protocol

from supabase import create_client

from app import catalogo


class Repositorio(Protocol):
    def usuarios(self) -> list[dict]: ...

    def usuario(self, usuario_id: str) -> dict | None: ...

    def ativos(self) -> list[dict]: ...

    def ativo(self, ativo_id: str) -> dict | None: ...

    def salvar_ativo(self, ativo: dict) -> None: ...

    def registrar_evento(
        self, tipo: str, ator_id: str, ativo_id: str | None, dados: dict
    ) -> dict: ...

    def eventos(self, ativo_id: str) -> list[dict]: ...

    def salvar_validacao(self, validacao: dict) -> None: ...

    def validacoes(self, ativo_id: str) -> list[dict]: ...

    def vincular_validacoes(self, ids: list[str], ator_id: str, ativo_id: str | None) -> bool: ...

    def curtido(self, ativo_id: str, usuario_id: str) -> bool: ...

    def alternar_curtida(self, ativo_id: str, usuario_id: str) -> bool: ...


def agora() -> str:
    return datetime.now(UTC).isoformat()


class RepositorioMemoria:
    def __init__(self) -> None:
        self._dados = deepcopy(catalogo.seed())
        self._eventos: list[dict] = []
        self._validacoes: list[dict] = []
        self._curtidas: set[tuple[str, str]] = set()

    def usuarios(self) -> list[dict]:
        return self._dados["usuarios"]

    def usuario(self, usuario_id: str) -> dict | None:
        return next((u for u in self.usuarios() if u["id"] == usuario_id), None)

    def ativos(self) -> list[dict]:
        return [self._com_contadores(ativo) for ativo in self._dados["ativos"]]

    def ativo(self, ativo_id: str) -> dict | None:
        return next((a for a in self.ativos() if a["id"] == ativo_id), None)

    def _com_contadores(self, ativo: dict) -> dict:
        resultado = deepcopy(ativo)
        for evento in self.eventos(ativo["id"]):
            campo = {"instalacao": "instalacoes", "derivacao": "derivacoes"}.get(evento["tipo"])
            if campo:
                resultado[campo] += 1
        resultado["curtidas"] += sum(id_ == ativo["id"] for id_, _ in self._curtidas)
        return resultado

    def salvar_ativo(self, ativo: dict) -> None:
        for indice, existente in enumerate(self._dados["ativos"]):
            if existente["id"] == ativo["id"]:
                atualizado = deepcopy(ativo)
                for campo in ("instalacoes", "derivacoes", "curtidas"):
                    atualizado[campo] = existente[campo]
                self._dados["ativos"][indice] = atualizado
                return
        self._dados["ativos"].append(deepcopy(ativo))

    def registrar_evento(self, tipo: str, ator_id: str, ativo_id: str | None, dados: dict) -> dict:
        evento = {
            "tipo": tipo,
            "atorId": ator_id,
            "ativoId": ativo_id,
            "dados": dados,
            "em": agora(),
        }
        self._eventos.append(evento)
        return evento

    def eventos(self, ativo_id: str) -> list[dict]:
        return [e for e in self._eventos if e["ativoId"] == ativo_id]

    def salvar_validacao(self, validacao: dict) -> None:
        self._validacoes.append(deepcopy(validacao))

    def validacoes(self, ativo_id: str) -> list[dict]:
        return [deepcopy(v) for v in self._validacoes if v["ativoId"] == ativo_id]

    def vincular_validacoes(self, ids: list[str], ator_id: str, ativo_id: str | None) -> bool:
        if len(set(ids)) != len(ids) or any(
            not any(
                v["id"] == id_ and v["atorId"] == ator_id and v["ativoId"] is None
                for v in self._validacoes
            )
            for id_ in ids
        ):
            return False
        if ativo_id is None:
            return True
        for validacao in self._validacoes:
            if validacao["id"] in ids:
                validacao["ativoId"] = ativo_id
        return True

    def curtido(self, ativo_id: str, usuario_id: str) -> bool:
        return (ativo_id, usuario_id) in self._curtidas

    def alternar_curtida(self, ativo_id: str, usuario_id: str) -> bool:
        chave = (ativo_id, usuario_id)
        if chave in self._curtidas:
            self._curtidas.remove(chave)
            return False
        self._curtidas.add(chave)
        return True


class RepositorioSupabase:
    def __init__(self, url: str, chave: str) -> None:
        self._cliente = create_client(url, chave)

    @staticmethod
    def _pessoa(linha: dict) -> dict:
        return {
            "id": linha["id"],
            "nome": linha["nome"],
            "iniciais": linha["iniciais"],
            "papel": linha["papel"],
            "cargo": linha["cargo"],
            "squadId": linha["squad_id"],
            "squad": linha["squads"]["nome"],
            "frente": linha["squads"]["frente"],
            "perfil": linha["perfil"],
        }

    def _consulta(self):
        return self._cliente.table("usuarios").select(
            "id,nome,iniciais,papel,cargo,squad_id,perfil,squads(nome,frente)"
        )

    def usuarios(self) -> list[dict]:
        return [self._pessoa(linha) for linha in self._consulta().execute().data]

    def usuario(self, usuario_id: str) -> dict | None:
        linhas = self._consulta().eq("id", usuario_id).limit(1).execute().data
        return self._pessoa(linhas[0]) if linhas else None

    def _ativo(self, linha: dict, contadores: dict) -> dict:
        autor = self.usuario(linha["autor_id"])
        return {
            "id": linha["id"],
            "nome": linha["nome"],
            "tipo": linha["tipo"],
            "resumo": linha["resumo"],
            "readme": linha["readme"],
            "arquivos": linha["arquivos"],
            "manualInstalacao": linha["manual_instalacao"],
            "autorId": linha["autor_id"],
            "squadId": linha["squad_id"],
            "squad": autor["squad"],
            "frente": autor["frente"],
            "visibilidade": linha["visibilidade"],
            "status": linha["status"],
            "derivadoDe": linha["derivado_de"],
            "aprovadoPorId": linha["aprovado_por"],
            "comentarioCoordenador": linha["comentario_coordenador"],
            "tags": linha["tags"],
            "ferramentas": linha["ferramentas"],
            "versao": linha["versao"],
            "acessos": linha["acessos"],
            "curtidas": contadores["curtidas"],
            "instalacoes": contadores["instalacoes"],
            "derivacoes": contadores["derivacoes"],
            "squadsQueReusaram": linha["squads_reuso_base"],
            "usos": [],
            "enviadoEm": linha["enviado_em"],
            "publicadoEm": linha["publicado_em"],
            "atualizadoEm": linha["atualizado_em"],
        }

    def ativos(self) -> list[dict]:
        linhas = self._cliente.table("ativos").select("*").execute().data
        contadores = self._cliente.table("ativos_contadores").select("*").execute().data
        por_id = {c["ativo_id"]: c for c in contadores}
        return [self._ativo(linha, por_id[linha["id"]]) for linha in linhas]

    def ativo(self, ativo_id: str) -> dict | None:
        linha = self._cliente.table("ativos").select("*").eq("id", ativo_id).limit(1).execute().data
        if not linha:
            return None
        contadores = (
            self._cliente.table("ativos_contadores")
            .select("*")
            .eq("ativo_id", ativo_id)
            .single()
            .execute()
            .data
        )
        return self._ativo(linha[0], contadores)

    def salvar_ativo(self, ativo: dict) -> None:
        anterior = self._cliente.table("ativos").select("id").eq("id", ativo["id"]).execute().data
        linha = {
            "id": ativo["id"],
            "nome": ativo["nome"],
            "tipo": ativo["tipo"],
            "resumo": ativo["resumo"],
            "readme": ativo["readme"],
            "arquivos": ativo["arquivos"],
            "manual_instalacao": ativo["manualInstalacao"],
            "autor_id": ativo["autorId"],
            "squad_id": ativo["squadId"],
            "visibilidade": ativo["visibilidade"],
            "status": ativo["status"],
            "derivado_de": ativo["derivadoDe"],
            "aprovado_por": ativo["aprovadoPorId"],
            "comentario_coordenador": ativo["comentarioCoordenador"],
            "tags": ativo["tags"],
            "ferramentas": ativo["ferramentas"],
            "versao": ativo["versao"],
            "acessos": ativo["acessos"],
            "enviado_em": ativo["enviadoEm"],
            "publicado_em": ativo["publicadoEm"],
            "atualizado_em": ativo["atualizadoEm"],
        }
        if anterior:
            self._cliente.table("ativos").update(linha).eq("id", ativo["id"]).execute()
        else:
            linha.update(
                curtidas_base=ativo["curtidas"],
                instalacoes_base=ativo["instalacoes"],
                derivacoes_base=ativo["derivacoes"],
                squads_reuso_base=ativo["squadsQueReusaram"],
            )
            self._cliente.table("ativos").insert(linha).execute()

    def registrar_evento(self, tipo: str, ator_id: str, ativo_id: str | None, dados: dict) -> dict:
        linha = (
            self._cliente.table("eventos")
            .insert(
                {
                    "tipo": tipo,
                    "ator_id": ator_id,
                    "ativo_id": ativo_id,
                    "dados": dados,
                }
            )
            .execute()
            .data[0]
        )
        return {
            "tipo": linha["tipo"],
            "atorId": linha["ator_id"],
            "ativoId": linha["ativo_id"],
            "dados": linha["dados"],
            "em": linha["criado_em"],
        }

    def eventos(self, ativo_id: str) -> list[dict]:
        linhas = (
            self._cliente.table("eventos")
            .select("*")
            .eq("ativo_id", ativo_id)
            .order("criado_em")
            .execute()
            .data
        )
        return [
            {
                "tipo": e["tipo"],
                "atorId": e["ator_id"],
                "ativoId": e["ativo_id"],
                "dados": e["dados"],
                "em": e["criado_em"],
            }
            for e in linhas
        ]

    def salvar_validacao(self, validacao: dict) -> None:
        self._cliente.table("validacoes").insert(
            {
                "id": validacao["id"],
                "ativo_id": validacao["ativoId"],
                "ator_id": validacao["atorId"],
                "resultado": validacao["resultado"],
                "itens": validacao["itens"],
                "criado_em": validacao["em"],
            }
        ).execute()

    def validacoes(self, ativo_id: str) -> list[dict]:
        linhas = (
            self._cliente.table("validacoes")
            .select("*")
            .eq("ativo_id", ativo_id)
            .order("criado_em")
            .execute()
            .data
        )
        return [
            {
                "id": v["id"],
                "ativoId": v["ativo_id"],
                "atorId": v["ator_id"],
                "resultado": v["resultado"],
                "itens": v["itens"],
                "em": v["criado_em"],
            }
            for v in linhas
        ]

    def vincular_validacoes(self, ids: list[str], ator_id: str, ativo_id: str | None) -> bool:
        if len(set(ids)) != len(ids):
            return False
        if not ids:
            return True
        linhas = (
            self._cliente.table("validacoes")
            .select("id,ator_id,ativo_id")
            .in_("id", ids)
            .execute()
            .data
        )
        if len(linhas) != len(ids) or any(
            v["ator_id"] != ator_id or v["ativo_id"] is not None for v in linhas
        ):
            return False
        if ativo_id is None:
            return True
        self._cliente.table("validacoes").update({"ativo_id": ativo_id}).in_("id", ids).execute()
        return True

    def curtido(self, ativo_id: str, usuario_id: str) -> bool:
        return bool(
            self._cliente.table("curtidas")
            .select("usuario_id")
            .eq("ativo_id", ativo_id)
            .eq("usuario_id", usuario_id)
            .execute()
            .data
        )

    def alternar_curtida(self, ativo_id: str, usuario_id: str) -> bool:
        if self.curtido(ativo_id, usuario_id):
            self._cliente.table("curtidas").delete().eq("ativo_id", ativo_id).eq(
                "usuario_id", usuario_id
            ).execute()
            return False
        self._cliente.table("curtidas").insert(
            {"ativo_id": ativo_id, "usuario_id": usuario_id}
        ).execute()
        return True


@lru_cache(maxsize=1)
def obter_repositorio() -> Repositorio:
    url = os.environ.get("SUPABASE_URL")
    chave = os.environ.get("SUPABASE_SECRET_KEY")
    if url and chave:
        return RepositorioSupabase(url, chave)
    return RepositorioMemoria()
