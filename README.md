# Risk Assessment Engine

## Internship Work Log – AI Developer 3

**Name:** Sanjana Dhananjaya  
**Role:** AI Developer 3  
**Project:** Risk Assessment Engine  

---

# 📅 DAY 1 – 20 April 2026  

## 🔴 Primary Task (As per Assignment)

Read the tool specification and create `SECURITY.md` documenting **OWASP Top 10 risks**, including:
- Attack Scenario  
- Damage / Impact  
- Mitigation Strategy  

---

## 🎯 Objective

To understand standard application security risks and document them in a structured format relevant to the system.

---

## 🛠️ Work Completed

### 1. Study of OWASP Top 10

A detailed study of major vulnerabilities was performed, focusing on:

- Injection attacks  
- Broken authentication  
- Data exposure  
- Access control issues  
- Misconfigurations  

---

### 2. SECURITY.md Creation (Core Deliverable)

Created a structured `SECURITY.md` covering:

### ✔ OWASP Top 10 Risks

1. Injection  
2. Broken Authentication  
3. Sensitive Data Exposure  
4. XML External Entities (XXE)  
5. Broken Access Control  
6. Security Misconfiguration  
7. Cross-Site Scripting (XSS)  
8. Insecure Deserialization  
9. Using Vulnerable Components  
10. Insufficient Logging & Monitoring  

---

### ✔ Each Risk Includes:

- Attack Scenario  
- Damage / Impact  
- Mitigation Strategy  

---

## 🔐 Additional Implementation (Support Work)

### ✔ Flask API Setup
- Created backend service using Flask  
- Added `/test` endpoint  

---

### ✔ Input Sanitization
- Removed HTML tags  
- Detected prompt injection patterns  

---

### ✔ Rate Limiting
- Implemented using `flask-limiter`  
- Configured limit: **5 requests per minute**

---

## 🖼️ Day 1 Screenshots

### 🔹 app.py (VS Code)
![App Code](images/day1_app_code.png)

---

### 🔹 Application Running Output
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

- Understanding of OWASP Top 10 risks  
- Importance of input validation and sanitization  
- API-level security implementation  
- Basics of Flask backend development  

---

# 📅 DAY 2 – 21 April 2026  

## 🔴 Primary Task (As per Assignment)

Document **tool-specific security threats** in `SECURITY.md`, including:
- Attack Vector  
- Damage Potential  
- Mitigation Plan  

---

## 🎯 Objective

To identify and document vulnerabilities specific to this AI-based risk assessment tool and apply security concepts in implementation.

---

## 🛠️ Work Completed

### 1. Tool-Specific Threat Documentation (Core Deliverable)

Updated `SECURITY.md` with 10 system-specific risks, including:

- Prompt Injection  
- API Abuse  
- Malicious Input Patterns  
- XSS via user input  
- SQL Injection simulation  
- Denial of Service  
- Sensitive data leakage  
- Improper error handling  
- Dependency vulnerabilities  
- Logging failures  

---

### ✔ Each Threat Includes:

- Attack Vector  
- Damage Potential  
- Mitigation Strategy  

---

## 💻 2. Implementation

### ✔ Risk Analyzer Module

Created:


**Functionality:**
- Detects:
  - No firewall  
  - Weak password  
  - SQL injection patterns  
  - XSS attempts  
  - Privilege escalation  

---

### ✔ New API Endpoint

#### POST `/analyze`

**Flow:**
1. Input received  
2. Sanitization applied  
3. Risk analysis executed  
4. Structured response returned  

---

## 🧪 3. Testing (Postman)

### 🔹 Tool-Specific Threats (VS Code)
![Threats Code](images/day2_threats_code.png)

---

### 🔹 Postman Test – Normal Input
![Postman Test 1](images/day2_postman1.png)

---

### 🔹 Postman Test – Risk Detection
![Postman Test 2](images/day2_postman2.png)

---

### 🔹 Postman Test – Attack Input
![Postman Test 3](images/day2_postman3.png)

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