from __future__ import annotations

import logging
from dataclasses import asdict

from clients import GroqClient, GroqError
from prompts.report_prompts import REPORT_SYSTEM_V1, build_report_user_v1
from schemas.report import ReportRequest, ReportResult

log = logging.getLogger(__name__)


class ReportGeneratorError(Exception):
    pass


class ReportGenerator:
    def __init__(self, groq: GroqClient) -> None:
        self._groq = groq

    def generate(self, req: ReportRequest) -> ReportResult:
        messages = [
            {"role": "system", "content": REPORT_SYSTEM_V1},
            {
                "role": "user",
                "content": build_report_user_v1(
                    risks=[asdict(r) for r in req.risks],
                    audience=req.audience,
                    fmt=req.format,
                    project_name=req.project_name,
                ),
            },
        ]
        try:
            resp = self._groq.chat(
                messages,
                temperature=0.3,
                max_tokens=2048,
            )
        except GroqError as exc:
            raise ReportGeneratorError(f"groq call failed: {exc}") from exc

        content = resp["choices"][0]["message"]["content"].strip()
        usage = resp.get("usage", {})
        return ReportResult(
            content=content,
            audience=req.audience,
            format=req.format,
            risk_count=len(req.risks),
            metadata={"model": resp.get("model"), "usage": usage},
        )
