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
        status: 'IDLE'
    },
    {
        id: 'build',
        name: 'Build & SCA',
        description: 'Compile artifacts. Software Composition Analysis checks dependencies.',
        icon: Icons.Box,
        status: 'IDLE'
    },
    {
        id: 'test',
        name: 'Test (SAST)',
        description: 'Static Analysis Security Testing scans source code for flaws.',
        icon: Icons.ShieldCheck,
        status: 'IDLE'
    },
    {
        id: 'deploy',
        name: 'Deploy (IaC)',
        description: 'Infrastructure as Code deployment to staging/production clusters.',
        icon: Icons.Rocket,
        status: 'IDLE'
    },
    {
        id: 'monitor',
        name: 'Monitor (DAST)',
        description: 'Runtime monitoring and Dynamic Analysis.',
        icon: Icons.Activity,
        status: 'IDLE'
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
