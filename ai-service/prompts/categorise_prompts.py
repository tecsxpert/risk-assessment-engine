from __future__ import annotations

from schemas.categorise import ALLOWED_CATEGORIES, ALLOWED_SEVERITY

CATEGORISE_SYSTEM_V1 = (
    "You classify software security risks into OWASP Top 10 (2021) categories. "
    "Return only JSON matching the schema. Do not include prose outside JSON."
)

CATEGORISE_SYSTEM_V2 = (
    "You are a senior application security engineer. "
    "Classify software security risks into OWASP Top 10 (2021) categories.\n\n"
    "Rules:\n"
    "- Pick exactly one category from the allowed set.\n"
    "- Severity reflects realistic exploitability and impact, not theoretical worst case.\n"
    "- Confidence in [0,1] reflects how strongly the description supports the category.\n"
    "- Rationale: at most two sentences, cite the signal that drove the choice.\n"
    "- Tags: short kebab-case keywords (e.g. 'sql-injection', 'jwt-verification').\n"
    "- If signal is weak or ambiguous, prefer category=OTHER and confidence < 0.5.\n"
    "- Output strictly valid JSON. No code fences, no prose, no trailing commas."
)


def build_categorise_user_v1(title: str, description: str, context: str) -> str:
    cats = ", ".join(sorted(ALLOWED_CATEGORIES))
    sev = ", ".join(sorted(ALLOWED_SEVERITY))
    extra = f"\n\nContext:\n{context}" if context else ""
    return (
        f"Classify this risk.\n\n"
        f"Title: {title}\n"
        f"Description: {description}"
        f"{extra}\n\n"
        f"Allowed categories: {cats}\n"
        f"Allowed severities: {sev}\n\n"
        "Respond with JSON: "
        '{"category": "...", "severity": "...", "confidence": 0.0-1.0, '
        '"rationale": "short reason", "tags": ["..."]}'
    )


def build_categorise_user_v2(title: str, description: str, context: str) -> str:
    cats = ", ".join(sorted(ALLOWED_CATEGORIES))
    sev = ", ".join(sorted(ALLOWED_SEVERITY))
    ctx_block = f"\nAdditional context:\n{context}\n" if context else ""
    return (
        "Classify the following risk.\n\n"
        f"Title:\n{title}\n\n"
        f"Description:\n{description}\n"
        f"{ctx_block}\n"
        f"Allowed categories: {cats}\n"
        f"Allowed severities: {sev}\n\n"
        "Return JSON with this exact shape:\n"
        "{\n"
        '  "category": "<one of allowed categories>",\n'
        '  "severity": "<one of allowed severities>",\n'
        '  "confidence": <number between 0 and 1>,\n'
        '  "rationale": "<<= 2 sentences>",\n'
        '  "tags": ["kebab-case", "..."]\n'
        "}"
    )
