// Enhanced Guide Content
const GUIDE_CONTENT = [
    {
        id: 'intro',
        title: 'Introduction to DevSecOps',
        icon: Icons.BookOpen,
        content: {
            heading: "What is DevSecOps?",
            subheading: "Security as a Shared Responsibility",
            text: "DevSecOps integrates security practices within the DevOps process. It creates a 'Security as Code' culture with collaboration between release engineers and security teams.",
            points: [
                "Security becomes everyone's responsibility, not just the security team",
                "Automated security checks are embedded in the development workflow",
                "Continuous security feedback enables rapid remediation",
                "Security shifts left to earlier stages of development"
            ],
            benefits: [
                "Faster vulnerability detection and remediation",
                "Reduced cost of fixing security issues",
                "Improved compliance and audit readiness",
                "Enhanced customer trust and brand reputation"
            ]
        }
    },
    {
        id: 'pipeline',
        title: 'Pipeline Stages',
        icon: Icons.Activity,
        content: {
            heading: "5-Stage DevSecOps Pipeline",
            subheading: "Security at Every Step",
            text: "Each stage in the CI/CD pipeline incorporates specific security checks and tools to ensure comprehensive coverage.",
            stages: PIPELINE_STAGES.map(stage => ({
                name: stage.name,
                description: stage.description,
                securityTools: stage.securityChecks,
                risks: stage.risks
            })),
            tools: {
                'Code': ['Git Hooks', 'SonarQube', 'Semgrep', 'Checkov'],
                'Build': ['OWASP DC', 'Snyk', 'WhiteSource', 'Dependabot'],
                'Test': ['Checkmarx', 'Veracode', 'Burp Suite', 'ZAP'],
                'Deploy': ['Terraform', 'Kubernetes', 'OPA', 'Trivy'],
                'Monitor': ['WAF', 'SIEM', 'Threat Intel', 'RASP']
            }
        }
    },
    {
        id: 'vulnerabilities',
        title: 'Common Vulnerabilities',
        icon: Icons.ShieldAlert,
        content: {
            heading: "OWASP Top 10 Security Risks",
            subheading: "Understanding Common Attack Vectors",
            text: "The Open Web Application Security Project (OWASP) Top 10 represents the most critical security risks to web applications.",
            vulnerabilities: [
                {
                    id: 'A03',
                    name: 'Injection',
                    description: 'Untrusted data is sent to an interpreter as part of a command or query.',
                    example: 'SQL Injection, NoSQL Injection, OS Command Injection',
                    impact: 'Data theft, data loss, denial of service, complete system compromise',
                    prevention: 'Use parameterized queries, input validation, stored procedures'
                },
                {
                    id: 'A07',
                    name: 'Identification and Authentication Failures',
                    description: 'Confirmation of user identity and session management is done incorrectly.',
                    example: 'Weak passwords, session fixation, hardcoded credentials',
                    impact: 'Account takeover, privilege escalation, identity theft',
                    prevention: 'Multi-factor authentication, strong password policies, secure session management'
                },
                {
                    id: 'A01',
                    name: 'Broken Access Control',
                    description: 'Restrictions on what authenticated users are allowed to do are not properly enforced.',
                    example: 'Vertical/horizontal privilege escalation, IDOR attacks',
                    impact: 'Unauthorized data access, data modification, privilege escalation',
                    prevention: 'Role-based access control, proper authorization checks'
                }
            ]
        }
    },
    {
        id: 'checklist',
        title: 'Security Checklist',
        icon: Icons.CheckCircle,
        content: {
            heading: "DevSecOps Maturity Checklist",
            subheading: "Track Your Security Progress",
            text: "Use this checklist to assess and improve your DevSecOps maturity level. Each item represents a key security control.",
            checklist: [
                {
                    id: 1,
                    title: "Secret Management",
                    description: "Secrets are managed via secure vaults, not in source code",
                    category: "Code Security",
                    priority: "HIGH",
                    completed: false
                },
                {
                    id: 2,
                    title: "Input Validation",
                    description: "All user inputs are validated and sanitized",
                    category: "Code Security",
                    priority: "HIGH",
                    completed: false
                },
                {
                    id: 3,
                    title: "Dependency Scanning",
                    description: "Automated scanning for vulnerable dependencies",
                    category: "Build Security",
                    priority: "HIGH",
                    completed: false
                },
                {
                    id: 4,
                    title: "SAST Implementation",
                    description: "Static Application Security Testing in CI/CD",
                    category: "Test Security",
                    priority: "MEDIUM",
                    completed: false
                },
                {
                    id: 5,
                    title: "Infrastructure Scanning",
                    description: "IaC security scanning before deployment",
                    category: "Deploy Security",
                    priority: "MEDIUM",
                    completed: false
                },
                {
                    id: 6,
                    title: "Runtime Protection",
                    description: "WAF and RASP implemented in production",
                    category: "Monitor Security",
                    priority: "MEDIUM",
                    completed: false
                }
            ]
        }
    }
];
