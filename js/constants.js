// Enhanced constants with additional security data
const SecurityConstants = {
    OWASP_TOP_10: {
        'A01': { 
            name: 'Broken Access Control', 
            description: 'Restrictions on what authenticated users are allowed to do are not properly enforced.',
            examples: ['Vertical privilege escalation', 'Horizontal privilege escalation', 'IDOR']
        },
        'A03': { 
            name: 'Injection', 
            description: 'Untrusted data is sent to an interpreter as part of a command or query.',
            examples: ['SQL Injection', 'NoSQL Injection', 'Command Injection']
        },
        'A07': { 
            name: 'Identification and Authentication Failures', 
            description: 'Confirmation of the user identity, authentication, and session management is done incorrectly.',
            examples: ['Weak passwords', 'Session fixation', 'Hardcoded credentials']
        }
    },

    SECURITY_STANDARDS: {
        NIST: 'National Institute of Standards and Technology',
        ISO27001: 'Information Security Management',
        SOC2: 'Service Organization Control',
        GDPR: 'General Data Protection Regulation'
    },

    VULNERABILITY_SEVERITIES: {
        CRITICAL: { color: 'bg-red-500', text: 'text-red-400', score: 10 },
        HIGH: { color: 'bg-orange-500', text: 'text-orange-400', score: 8 },
        MEDIUM: { color: 'bg-yellow-500', text: 'text-yellow-400', score: 5 },
        LOW: { color: 'bg-blue-500', text: 'text-blue-400', score: 2 }
    }
};

// Enhanced pipeline stages with security metrics
const PIPELINE_STAGES = [
    {
        id: 'code',
        name: 'Code & Commit',
        description: 'Developer commits code. Pre-commit hooks run secret scanning and SAST analysis.',
        icon: React.createElement(Code, { size: 20 }),
        status: 'IDLE',
        securityChecks: ['Secret Detection', 'SAST', 'Code Quality'],
        tools: ['Git Hooks', 'SonarQube', 'Semgrep'],
        risks: ['Hardcoded Secrets', 'SQL Injection', 'XSS']
    },
    {
        id: 'build',
        name: 'Build & SCA',
        description: 'Compile artifacts. Software Composition Analysis checks dependencies for vulnerabilities.',
        icon: React.createElement(Box, { size: 20 }),
        status: 'IDLE',
        securityChecks: ['Dependency Scanning', 'Software Bill of Materials', 'License Compliance'],
        tools: ['OWASP Dependency Check', 'Snyk', 'WhiteSource'],
        risks: ['Known Vulnerabilities', 'License Violations', 'Outdated Dependencies']
    },
    {
        id: 'test',
        name: 'Test (SAST/DAST)',
        description: 'Static and Dynamic Application Security Testing scans for security flaws.',
        icon: React.createElement(ShieldCheck, { size: 20 }),
        status: 'IDLE',
        securityChecks: ['Static Analysis', 'Dynamic Analysis', 'Security Unit Tests'],
        tools: ['Checkmarx', 'Veracode', 'Burp Suite'],
        risks: ['Business Logic Flaws', 'Authentication Bypass', 'Data Exposure']
    },
    {
        id: 'deploy',
        name: 'Deploy (IaC)',
        description: 'Infrastructure as Code deployment with security scanning and policy enforcement.',
        icon: React.createElement(Rocket, { size: 20 }),
        status: 'IDLE',
        securityChecks: ['Infrastructure Scanning', 'Policy as Code', 'Container Security'],
        tools: ['Terraform', 'Kubernetes', 'OpenPolicyAgent'],
        risks: ['Misconfigured Services', 'Exposed Ports', 'Insecure Network Policies']
    },
    {
        id: 'monitor',
        name: 'Monitor (RASP)',
        description: 'Runtime Application Self-Protection and continuous security monitoring.',
        icon: React.createElement(Activity, { size: 20 }),
        status: 'IDLE',
        securityChecks: ['Runtime Protection', 'Threat Detection', 'Compliance Monitoring'],
        tools: ['WAF', 'SIEM', 'Threat Intelligence'],
        risks: ['Zero-day Attacks', 'Data Breaches', 'Compliance Violations']
    }
];

// Enhanced code examples with multiple vulnerability types
const CODE_EXAMPLES = {
    VULNERABLE: {
        title: 'Vulnerable Authentication Endpoint',
        code: `// INSECURE IMPLEMENTATION - Multiple OWASP Violations
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // A03:2021 - SQL Injection Vulnerability
    const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
    const user = await db.query(query);
    
    if (user) {
        // A07:2021 - Hardcoded Secret
        const JWT_SECRET = "my-super-secret-key-12345";
        
        // A02:2021 - Cryptographic Failures
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        
        // A05:2021 - Security Misconfiguration
        res.cookie('session', token, { httpOnly: false, secure: false });
        
        res.json({ success: true, token });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});`,
        vulnerabilities: [
            { type: 'A03', severity: 'CRITICAL', line: 5, description: 'SQL Injection via string concatenation' },
            { type: 'A07', severity: 'HIGH', line: 9, description: 'Hardcoded JWT secret in source code' },
            { type: 'A02', severity: 'HIGH', line: 12, description: 'Weak cryptographic implementation' },
            { type: 'A05', severity: 'MEDIUM', line: 15, description: 'Insecure cookie configuration' }
        ]
    },
    
    SECURE: {
        title: 'Secure Authentication Implementation',
        code: `// SECURE IMPLEMENTATION - OWASP Compliant
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Input validation and sanitization
    const validationResult = loginSchema.safeParse({ username, password });
    if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid input format" });
    }
    
    // A03:2021 - Parameterized Query Prevention
    const query = 'SELECT * FROM users WHERE username = $1';
    const user = await db.query(query, [username]);
    
    if (user && await bcrypt.compare(password, user.password_hash)) {
        // A07:2021 - Environment-based Secrets
        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign(
            { 
                userId: user.id,
                role: user.role 
            }, 
            JWT_SECRET, 
            { 
                expiresIn: '1h',
                issuer: 'my-app'
            }
        );
        
        // A05:2021 - Secure Cookie Configuration
        res.cookie('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000
        });
        
        // Security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        
        res.json({ success: true });
    } else {
        // Generic error message to prevent user enumeration
        await new Promise(resolve => setTimeout(resolve, 1000)); // Timing attack prevention
        res.status(401).json({ error: "Invalid credentials" });
    }
});`,
        securityFeatures: [
            'Input Validation & Sanitization',
            'Parameterized Queries',
            'Environment-based Secrets',
            'Secure Password Hashing',
            'Proper JWT Configuration',
            'Security Headers',
            'Timing Attack Prevention'
        ]
    }
};

// Export constants
window.SecurityConstants = SecurityConstants;
window.PIPELINE_STAGES = PIPELINE_STAGES;
window.CODE_EXAMPLES = CODE_EXAMPLES;
