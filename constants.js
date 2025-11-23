// Icons
const Icons = {
    Code: '💻', Box: '📦', ShieldCheck: '🛡️', Rocket: '🚀', Activity: '📊',
    Play: '▶️', CheckCircle: '✅', Terminal: '💻', RefreshCw: '🔄', 
    ArrowRight: '→', Lock: '🔒', Unlock: '🔓', BookOpen: '📚',
    ShieldAlert: '⚠️', Shield: '🛡️', Bot: '🤖', Sparkles: '✨',
    Loader2: '⏳', AlertTriangle: '⚠️', Server: '🖥️', Database: '💾',
    Globe: '🌐', Users: '👥', Cloud: '☁️', UserX: '👤', Bug: '🐛',
    FileJson: '📄', Search: '🔍', X: '✖️', ChevronRight: '›',
    Circle: '⚪'
};

// Pipeline Stages
const PIPELINE_STAGES = [
    {
        id: 'code',
        name: 'Code & Commit',
        description: 'Developer commits code. Pre-commit hooks run secret scanning.',
        icon: Icons.Code,
        status: 'IDLE',
        securityChecks: ['Secret Detection', 'SAST', 'Code Quality'],
        tools: ['Git Hooks', 'SonarQube', 'Semgrep'],
        risks: ['Hardcoded Secrets', 'SQL Injection', 'XSS']
    },
    {
        id: 'build',
        name: 'Build & SCA',
        description: 'Compile artifacts. Software Composition Analysis checks dependencies.',
        icon: Icons.Box,
        status: 'IDLE',
        securityChecks: ['Dependency Scanning', 'Software Bill of Materials', 'License Compliance'],
        tools: ['OWASP Dependency Check', 'Snyk', 'WhiteSource'],
        risks: ['Known Vulnerabilities', 'License Violations', 'Outdated Dependencies']
    },
    {
        id: 'test',
        name: 'Test (SAST)',
        description: 'Static Analysis Security Testing scans source code for flaws.',
        icon: Icons.ShieldCheck,
        status: 'IDLE',
        securityChecks: ['Static Analysis', 'Dynamic Analysis', 'Security Unit Tests'],
        tools: ['Checkmarx', 'Veracode', 'Burp Suite'],
        risks: ['Business Logic Flaws', 'Authentication Bypass', 'Data Exposure']
    },
    {
        id: 'deploy',
        name: 'Deploy (IaC)',
        description: 'Infrastructure as Code deployment to staging/production clusters.',
        icon: Icons.Rocket,
        status: 'IDLE',
        securityChecks: ['Infrastructure Scanning', 'Policy as Code', 'Container Security'],
        tools: ['Terraform', 'Kubernetes', 'OpenPolicyAgent'],
        risks: ['Misconfigured Services', 'Exposed Ports', 'Insecure Network Policies']
    },
    {
        id: 'monitor',
        name: 'Monitor (DAST)',
        description: 'Runtime monitoring and Dynamic Analysis.',
        icon: Icons.Activity,
        status: 'IDLE',
        securityChecks: ['Runtime Protection', 'Threat Detection', 'Compliance Monitoring'],
        tools: ['WAF', 'SIEM', 'Threat Intelligence'],
        risks: ['Zero-day Attacks', 'Data Breaches', 'Compliance Violations']
    }
];

// Code Examples
const VULNERABLE_CODE_SNIPPET = `// VULNERABLE CODE - SQL Injection & Hardcoded Secrets
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // SQL Injection vulnerability
  const query = "SELECT * FROM users WHERE user = '" + username + "'";
  db.query(query, (err, user) => {
    if (user) {
      // Hardcoded secret
      const apiKey = "SECRET-12345";
      res.json({ token: apiKey });
    }
  });
});`;

const SECURE_CODE_SNIPPET = `// SECURE CODE - Parameterized Queries & Environment Vars
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Parameterized query prevents SQL injection
  const query = "SELECT * FROM users WHERE user = ?";
  db.query(query, [username], (err, user) => {
    if (user) {
      // Secret from environment variable
      const apiKey = process.env.API_KEY;
      res.json({ token: apiKey });
    }
  });
});`;

// Stage Status
const StageStatus = {
    IDLE: 'IDLE',
    RUNNING: 'RUNNING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
};

// Security Constants
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
            description: 'Confirmation of user identity, authentication, and session management is done incorrectly.',
            examples: ['Weak passwords', 'Session fixation', 'Hardcoded credentials']
        }
    },
    VULNERABILITY_SEVERITIES: {
        CRITICAL: { color: 'bg-red-500', text: 'text-red-400', score: 10 },
        HIGH: { color: 'bg-orange-500', text: 'text-orange-400', score: 8 },
        MEDIUM: { color: 'bg-yellow-500', text: 'text-yellow-400', score: 5 },
        LOW: { color: 'bg-blue-500', text: 'text-blue-400', score: 2 }
    }
};
