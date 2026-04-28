# Risk Assessment Engine

## Internship Work Log – AI Developer 3

**Name:** Sanjana D  
**Role:** AI Developer 3  
**Project:** Risk Assessment Engine  

---

# 📅 DAY 1 – 20 April 2026  

## 🔴 Primary Task

Read the tool specification and create `SECURITY.md` documenting **OWASP Top 10 (2021)** risks, including:
- Attack Scenario  
- Impact  
- Mitigation Strategy  

---

## 🎯 Objective

To understand modern web application security risks and document them in alignment with current industry standards.

---

## 🛠️ Work Completed

### ✔ SECURITY.md Creation (Core Deliverable)

A structured `SECURITY.md` was created using the **OWASP Top 10 (2021)** standard.

### ✔ OWASP Top 10 (2021) Covered

- A01: Broken Access Control  
- A02: Cryptographic Failures  
- A03: Injection  
- A04: Insecure Design  
- A05: Security Misconfiguration  
- A06: Vulnerable and Outdated Components  
- A07: Identification and Authentication Failures  
- A08: Software and Data Integrity Failures  
- A09: Security Logging and Monitoring Failures  
- A10: Server-Side Request Forgery (SSRF)  

---

### ✔ Documentation Depth

Each vulnerability includes:
- Real-world attack scenario  
- Damage / impact  
- Concrete mitigation strategies  

---

## 🔐 Supporting Implementation (Additional Work)

### ✔ Flask API Setup
- Built backend service using Flask  
- Created `/test` endpoint  

### ✔ Input Sanitization
- Removed HTML tags  
- Detected prompt injection patterns  

### ✔ Rate Limiting
- Implemented using `flask-limiter`  
- Configured: **5 requests per minute**

---

## 🖼️ Day 1 Screenshots

### 🔹 app.py (VS Code)
![App Code](images/day1_app_code.png)

---

### 🔹 Application Running
![App Running](images/day1_app_running.png)

---

### 🔹 Postman Test – Basic Input
![Postman Test 1](images/day1_postman1.png)

---

### 🔹 Postman Test – Sanitization Check
![Postman Test 2](images/day1_postman2.png)

---

### 🔹 Rate Limiting Verification
![Rate Limit](images/day1_rate_limit.png)

---

## 📚 Learning Outcomes

- Understanding OWASP Top 10 (2021)  
- Secure API design fundamentals  
- Importance of validation and rate limiting  
- Real-world vulnerability mapping  

---

# 📅 DAY 2 – 21 April 2026  

## 🔴 Primary Task

Document **tool-specific security threats** in `SECURITY.md`, including:
- Attack Vector  
- Damage Potential  
- Mitigation Plan  

---

## 🎯 Objective

To identify and document security risks specific to the architecture of this system rather than generic web vulnerabilities.

---

## 🛠️ Work Completed

### ✔ Tool-Specific Threat Documentation (Core Deliverable)

The following threats were documented based on the system stack:

- Groq API usage  
- ChromaDB (vector database)  
- Retrieval-Augmented Generation (RAG)  
- JWT-based authentication  
- Multi-service architecture  

---

### ✔ Key Tool-Specific Threats

#### 1. API Key Leakage (Groq)
Sensitive API keys may be exposed through logs, `.env` files, or accidental commits.

#### 2. RAG Context Injection
Malicious documents injected into the knowledge base can manipulate LLM output.

#### 3. Vector Store Poisoning (ChromaDB)
Attackers insert misleading embeddings to influence results.

#### 4. LLM Hallucination Risk
The model generates incorrect outputs, affecting risk decisions.

#### 5. JWT Token Replay Attacks
Stolen tokens reused for unauthorized access.

#### 6. Cross-Service Communication Exploits
Improper validation between backend and AI service.

#### 7. Prompt Injection
User input alters intended model behavior.

#### 8. Sensitive Data Leakage via Logs
Logging raw inputs may expose confidential data.

#### 9. API Abuse / DoS
Repeated calls overwhelm system resources.

#### 10. Dependency Supply Chain Attack
Compromised external libraries introduce vulnerabilities.

---

### ✔ Implementation Work

#### Risk Analyzer Module
Created:


**Features:**
- Detects:
  - Weak passwords  
  - Missing firewall  
  - SQL injection patterns  
  - XSS indicators  
  - Privilege escalation  

---

#### New Endpoint

**POST `/analyze`**

**Flow:**
1. Input received  
2. Sanitization applied  
3. Risk analysis executed  
4. Structured response returned  

---

## 🧪 Testing (Postman)

### 🔹 Tool-Specific Threats Code
![Threat Code](images/day2_threats_code.png)

---

### 🔹 Postman Test – Normal Input
![Postman 1](images/day2_postman1.png)

---

### 🔹 Postman Test – Risk Detection
![Postman 2](images/day2_postman2.png)

---

### 🔹 Postman Test – Attack Scenario
![Postman 3](images/day2_postman3.png)

---

## 📊 Sample Output

```json
{
  "risk_level": "HIGH",
  "detected_issues": [
    "No firewall detected",
    "Weak password usage"
  ]
}