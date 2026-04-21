def analyze_risk(text):
    risks = []

    text_lower = text.lower()

    if "no firewall" in text_lower:
        risks.append("No firewall detected")

    if "weak password" in text_lower:
        risks.append("Weak password usage")

    if "drop table" in text_lower or "select * from" in text_lower:
        risks.append("SQL Injection attempt")

    if "<script>" in text_lower or "script" in text_lower:
        risks.append("Possible XSS attack")

    if "admin access" in text_lower:
        risks.append("Privilege escalation attempt")

    # Risk level logic
    if len(risks) >= 2:
        level = "HIGH"
    elif len(risks) == 1:
        level = "MEDIUM"
    else:
        level = "LOW"

    return level, risks