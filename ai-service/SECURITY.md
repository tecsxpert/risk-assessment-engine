# SECURITY DOCUMENTATION

## 📅 DAY 1 — OWASP TOP 10 (2021)

This section documents security risks based on OWASP Top 10 (2021), aligned with current industry standards.

---

### 1. A01: Broken Access Control

**Attack Scenario:**  
An attacker manipulates API requests to access unauthorized data by modifying user roles or IDs.

**Damage:**  
Exposure of sensitive system data and unauthorized actions.

**Mitigation:**  
- Implement role-based access control (RBAC)  
- Enforce server-side validation  
- Use secure session handling  

---

### 2. A02: Cryptographic Failures

**Attack Scenario:**  
Sensitive data is transmitted without encryption or weak encryption is used.

**Damage:**  
Data leakage including credentials and confidential inputs.

**Mitigation:**  
- Use HTTPS (TLS 1.2+)  
- Encrypt sensitive data at rest  
- Avoid storing plain text secrets  

---

### 3. A03: Injection

**Attack Scenario:**  
User input such as `"DROP TABLE users"` is executed as part of a query.

**Damage:**  
Database corruption or data loss.

**Mitigation:**  
- Input validation and sanitization  
- Use parameterized queries  

---

### 4. A04: Insecure Design

**Attack Scenario:**  
The system lacks threat modeling, allowing logical vulnerabilities.

**Damage:**  
System misuse and exploitation of design flaws.

**Mitigation:**  
- Perform threat modeling  
- Follow secure design principles  

---

### 5. A05: Security Misconfiguration

**Attack Scenario:**  
Default configurations expose internal endpoints.

**Damage:**  
Unauthorized system access.

**Mitigation:**  
- Disable debug mode in production  
- Configure secure headers  

---

### 6. A06: Vulnerable Components

**Attack Scenario:**  
Outdated libraries are exploited.

**Damage:**  
System compromise via known vulnerabilities.

**Mitigation:**  
- Regular dependency updates  
- Use vulnerability scanners  

---

### 7. A07: Identification and Authentication Failures

**Attack Scenario:**  
Weak password policies allow brute-force attacks.

**Damage:**  
Account takeover.

**Mitigation:**  
- Strong password policies  
- Multi-factor authentication  

---

### 8. A08: Software and Data Integrity Failures

**Attack Scenario:**  
Untrusted updates or data sources modify system behavior.

**Damage:**  
Execution of malicious code.

**Mitigation:**  
- Validate external inputs  
- Use signed updates  

---

### 9. A09: Security Logging and Monitoring Failures

**Attack Scenario:**  
Attacks go undetected due to missing logs.

**Damage:**  
Delayed incident response.

**Mitigation:**  
- Implement centralized logging  
- Monitor anomalies  

---

### 10. A10: Server-Side Request Forgery (SSRF)

**Attack Scenario:**  
System fetches data from attacker-controlled URLs.

**Damage:**  
Access to internal services.

**Mitigation:**  
- Validate outgoing requests  
- Restrict internal network access  

---

## 📅 DAY 2 — TOOL-SPECIFIC SECURITY THREATS

This system uses:
- Groq (LLM inference)
- ChromaDB (vector store)
- RAG (retrieval-augmented generation)
- JWT (authentication)

---

### 1. Groq API Key Leakage

**Attack Vector:**  
API key exposed via `.env`, logs, or GitHub commits.

**Scenario:**  
Developer accidentally commits `.env` file containing Groq API key.

**Damage:**  
Unauthorized API usage and billing abuse.

**Mitigation:**  
- Store secrets in environment variables  
- Use `.gitignore`  
- Rotate keys regularly  

---

### 2. RAG Context Injection

**Attack Vector:**  
Malicious documents inserted into retrieval pipeline.

**Scenario:**  
Attacker uploads crafted text that manipulates LLM output.

**Damage:**  
Incorrect or manipulated responses.

**Mitigation:**  
- Validate document sources  
- Apply content filtering  
- Limit trust in retrieved context  

---

### 3. Vector Store Poisoning (ChromaDB)

**Attack Vector:**  
Attacker inserts malicious embeddings.

**Scenario:**  
Poisoned data influences similarity search results.

**Damage:**  
Corrupted knowledge base and misleading outputs.

**Mitigation:**  
- Restrict write access  
- Validate data before insertion  
- Use trusted ingestion pipelines  

---

### 4. LLM Hallucination Risk

**Attack Vector:**  
LLM generates incorrect responses without validation.

**Scenario:**  
System incorrectly flags safe input as risky.

**Damage:**  
Incorrect business decisions.

**Mitigation:**  
- Add confidence scoring  
- Validate outputs with rules  
- Human-in-the-loop review  

---

### 5. JWT Token Theft / Replay Attack

**Attack Vector:**  
Token intercepted and reused.

**Scenario:**  
Attacker reuses stolen JWT to access APIs.

**Damage:**  
Unauthorized access.

**Mitigation:**  
- Use short token expiry  
- Implement refresh tokens  
- Secure transmission (HTTPS)  

---

### 6. Cross-Service Attack (Port 8080 ↔ 5000)

**Attack Vector:**  
Backend communicates insecurely with AI service.

**Scenario:**  
Attacker injects requests between services.

**Damage:**  
Unauthorized command execution.

**Mitigation:**  
- Use service authentication  
- Restrict internal APIs  
- Validate inter-service requests  

---

### 7. Prompt Injection (LLM-Specific)

**Attack Vector:**  
User input manipulates LLM behavior.

**Scenario:**  
Input like “ignore previous instructions”.

**Damage:**  
Model bypasses intended logic.

**Mitigation:**  
- Strong input filtering  
- System prompt hardening  

---

### 8. Sensitive Data Leakage via Logs

**Attack Vector:**  
Logging raw user input.

**Scenario:**  
Logs store confidential information.

**Damage:**  
Privacy breach.

**Mitigation:**  
- Mask sensitive data  
- Limit logging scope  

---

### 9. Denial of Service (AI Workload Abuse)

**Attack Vector:**  
Repeated API requests.

**Scenario:**  
Attacker floods inference requests.

**Damage:**  
Service downtime.

**Mitigation:**  
- Rate limiting  
- Request throttling  

---

### 10. Dependency-Level Vulnerabilities

**Attack Vector:**  
Flask / libraries exploited.

**Scenario:**  
Known CVE exploited.

**Damage:**  
Full system compromise.

**Mitigation:**  
- Keep dependencies updated  
- Use security scanners  

---