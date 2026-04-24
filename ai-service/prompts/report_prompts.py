from __future__ import annotations

REPORT_SYSTEM_V1 = (
    "You are a security risk reporter. Produce concise, accurate risk reports "
    "for the requested audience. Use only the information provided; do not invent risks."
)


_AUDIENCE_GUIDANCE = {
    "engineer": (
        "Write for engineers. Include concrete remediation steps, libraries, "
        "config flags, and code-level mitigations where relevant."
    ),
    "manager": (
        "Write for engineering managers. Prioritise by severity and effort. "
        "Group related risks. Avoid deep code detail."
    ),
    "executive": (
        "Write for executives. Use plain language. Lead with business impact "
        "and a short prioritised action list. No code."
    ),
}


def build_report_user_v1(
    *,
    risks: list[dict],
    audience: str,
    fmt: str,
    project_name: str,
) -> str:
    aud_line = _AUDIENCE_GUIDANCE.get(audience, _AUDIENCE_GUIDANCE["engineer"])
    proj_line = f"Project: {project_name}\n" if project_name else ""
    risk_block = "\n".join(
        f"- [{r.get('severity', 'MEDIUM')}/{r.get('category', 'OTHER')}] "
        f"{r.get('title', '')}: {r.get('description', '')}"
        for r in risks
    )
    if fmt == "summary":
        format_line = (
            "Output a short summary in Markdown: 1 paragraph overview, "
            "then a bullet list of top 5 risks with severity prefix."
        )
    else:
        format_line = (
            "Output a structured Markdown report with sections: "
            "## Overview, ## Risks (one subsection per risk, ordered by severity), "
            "## Recommended Actions."
        )
    return (
        f"{proj_line}"
        f"Audience guidance: {aud_line}\n\n"
        f"Format: {format_line}\n\n"
        f"Risks:\n{risk_block}"
    )
