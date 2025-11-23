// Main Application Component with Enhanced Features
class DevSecOpsApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStageIndex: 0,
            pipelineStatus: 'IDLE',
            logs: [],
            codeContent: CODE_EXAMPLES.VULNERABLE.code,
            isSecure: false,
            isGuideOpen: false,
            securityScore: 0,
            vulnerabilities: CODE_EXAMPLES.VULNERABLE.vulnerabilities,
            realTimeMetrics: DevSecOpsUtils.generateMockMetrics(),
            activeThreats: [],
            userPreferences: {
                reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                highContrast: window.matchMedia('(prefers-contrast: high)').matches
            }
        };
        
        // Bind methods
        this.handleRunStage = this.handleRunStage.bind(this);
        this.handleNextStage = this.handleNextStage.bind(this);
        this.handleFixCode = this.handleFixCode.bind(this);
        this.addLog = this.addLog.bind(this);
        this.clearLogs = this.clearLogs.bind(this);
        
        // Initialize performance monitoring
        DevSecOpsUtils.performanceMonitor();
    }

    componentDidMount() {
        // Load user preferences
        const savedPrefs = DevSecOpsUtils.storage.get('userPreferences');
        if (savedPrefs) {
            this.setState({ userPreferences: { ...this.state.userPreferences, ...savedPrefs } });
        }

        // Initialize real-time metrics
        this.metricsInterval = setInterval(() => {
            this.setState(prevState => ({
                realTimeMetrics: DevSecOpsUtils.generateMockMetrics(),
                activeThreats: [...prevState.activeThreats, DevSecOpsUtils.simulateThreatIntelligence()].slice(-5)
            }));
        }, 5000);

        // Calculate initial security score
        this.updateSecurityScore();
    }

    componentDidUpdate(prevProps, prevState) {
        // Update security score when relevant state changes
        if (prevState.isSecure !== this.state.isSecure || 
            prevState.currentStageIndex !== this.state.currentStageIndex ||
            prevState.vulnerabilities !== this.state.vulnerabilities) {
            this.updateSecurityScore();
        }
    }

    componentWillUnmount() {
        clearInterval(this.metricsInterval);
    }

    updateSecurityScore() {
        const securityScore = DevSecOpsUtils.calculateSecurityScore(
            this.state.isSecure,
            this.state.currentStageIndex,
            this.state.vulnerabilities
        );
        this.setState({ securityScore });
    }

    addLog(message, level = 'INFO') {
        const timestamp = new Date().toLocaleTimeString();
        this.setState(prevState => ({
            logs: [...prevState.logs, { timestamp, message, level }]
        }));
    }

    clearLogs() {
        this.setState({ logs: [] });
    }

    handleRunStage() {
        const { currentStageIndex, isSecure } = this.state;
        const currentStage = PIPELINE_STAGES[currentStageIndex];
        
        this.setState({ pipelineStatus: 'RUNNING' });
        this.clearLogs();
        
        this.addLog(`🚀 Starting ${currentStage.name} stage...`, 'INFO');
        this.addLog(`🔍 Running security checks: ${currentStage.securityChecks.join(', ')}`, 'INFO');
        
        // Simulate stage execution with enhanced logging
        setTimeout(() => {
            this.simulateStageExecution(currentStage, isSecure);
        }, 1000);
    }

    simulateStageExecution(stage, isSecure) {
        switch (stage.id) {
            case 'code':
                this.simulateCodeStage(isSecure);
                break;
            case 'build':
                this.simulateBuildStage(isSecure);
                break;
            case 'test':
                this.simulateTestStage(isSecure);
                break;
            case 'deploy':
                this.simulateDeployStage(isSecure);
                break;
            case 'monitor':
                this.simulateMonitorStage(isSecure);
                break;
        }
    }

    simulateCodeStage(isSecure) {
        this.addLog('🔎 Scanning for secrets and credentials...', 'INFO');
        this.addLog('📝 Analyzing code patterns for security issues...', 'INFO');
        
        if (!isSecure) {
            this.addLog('❌ CRITICAL: Hardcoded JWT secret detected!', 'ERROR');
            this.addLog('❌ CRITICAL: SQL Injection vulnerability found!', 'ERROR');
            this.addLog('⚠️  WARNING: Insecure cookie configuration detected', 'WARN');
            this.setState({ pipelineStatus: 'ERROR' });
        } else {
            this.addLog('✅ No secrets found in codebase', 'SUCCESS');
            this.addLog('✅ Input validation properly implemented', 'SUCCESS');
            this.addLog('✅ Secure authentication patterns detected', 'SUCCESS');
            this.setState({ pipelineStatus: 'SUCCESS' });
        }
    }

    simulateBuildStage(isSecure) {
        this.addLog('📦 Installing dependencies...', 'INFO');
        this.addLog('🔍 Scanning 3rd party libraries for vulnerabilities...', 'INFO');
        
        // Simulate dependency scan results
        setTimeout(() => {
            this.addLog('📊 Generating Software Bill of Materials (SBOM)...', 'INFO');
            this.addLog('✅ All dependencies comply with security policy', 'SUCCESS');
            this.addLog('✅ No critical vulnerabilities found in dependencies', 'SUCCESS');
            this.setState({ pipelineStatus: 'SUCCESS' });
        }, 2000);
    }

    simulateTestStage(isSecure) {
        this.addLog('🧪 Executing security test suite...', 'INFO');
        this.addLog('🔍 Running Static Application Security Testing (SAST)...', 'INFO');
        
        if (!isSecure) {
            this.addLog('❌ SAST FAILED: Multiple critical vulnerabilities detected', 'ERROR');
            this.addLog('📍 SQL Injection at auth_service.js:12', 'ERROR');
            this.addLog('📍 Hardcoded secret at auth_service.js:25', 'ERROR');
            this.setState({ pipelineStatus: 'ERROR' });
        } else {
            this.addLog('✅ SAST passed: No security vulnerabilities found', 'SUCCESS');
            this.addLog('✅ Dynamic analysis completed successfully', 'SUCCESS');
            this.addLog('✅ Security unit tests passed', 'SUCCESS');
            this.setState({ pipelineStatus: 'SUCCESS' });
        }
    }

    simulateDeployStage(isSecure) {
        this.addLog('🏗️  Validating Infrastructure as Code...', 'INFO');
        this.addLog('🔒 Applying security policies...', 'INFO');
        this.addLog('🛡️  Configuring network security groups...', 'INFO');
        
        setTimeout(() => {
            this.addLog('✅ Infrastructure security validation passed', 'SUCCESS');
            this.addLog('✅ Container security scan completed', 'SUCCESS');
            this.addLog('✅ Deployment to secure environment successful', 'SUCCESS');
            this.setState({ pipelineStatus: 'SUCCESS' });
        }, 2000);
    }

    simulateMonitorStage(isSecure) {
        this.addLog('👀 Starting runtime security monitoring...', 'INFO');
        this.addLog('🛡️  Initializing Web Application Firewall...', 'INFO');
        this.addLog('📊 Collecting security metrics...', 'INFO');
        
        if (!isSecure) {
            this.addLog('🚨 ALERT: SQL Injection attempt blocked by WAF', 'WARN');
            this.addLog('🚨 ALERT: Suspicious user agent detected', 'WARN');
            this.addLog('⚠️  Multiple security events requiring review', 'WARN');
            this.setState({ pipelineStatus: 'WARNING' });
        } else {
            this.addLog('✅ Runtime protection active', 'SUCCESS');
            this.addLog('✅ No security events detected', 'SUCCESS');
            this.addLog('✅ System operating within secure parameters', 'SUCCESS');
            this.setState({ pipelineStatus: 'SUCCESS' });
        }
    }

    handleNextStage() {
        const { currentStageIndex } = this.state;
        if (currentStageIndex < PIPELINE_STAGES.length - 1) {
            this.setState(prevState => ({
                currentStageIndex: prevState.currentStageIndex + 1,
                pipelineStatus: 'IDLE'
            }));
            this.clearLogs();
        }
    }

    handleFixCode() {
        this.setState({
            codeContent: CODE_EXAMPLES.SECURE.code,
            isSecure: true,
            vulnerabilities: [],
            pipelineStatus: 'IDLE'
        });
        this.clearLogs();
        this.addLog('🔧 Applying security patches...', 'INFO');
        this.addLog('✅ Implemented parameterized queries', 'SUCCESS');
        this.addLog('✅ Removed hardcoded secrets', 'SUCCESS');
        this.addLog('✅ Enhanced input validation', 'SUCCESS');
        this.addLog('✅ Updated security headers configuration', 'SUCCESS');
    }

    handleResetSimulation() {
        this.setState({
            currentStageIndex: 0,
            pipelineStatus: 'IDLE',
            codeContent: CODE_EXAMPLES.VULNERABLE.code,
            isSecure: false,
            vulnerabilities: CODE_EXAMPLES.VULNERABLE.vulnerabilities,
            logs: []
        });
    }

    render() {
        const { 
            currentStageIndex, 
            pipelineStatus, 
            logs, 
            codeContent, 
            isSecure, 
            isGuideOpen,
            securityScore,
            realTimeMetrics,
            activeThreats
        } = this.state;

        const currentStage = PIPELINE_STAGES[currentStageIndex];
        const maturity = this.getMaturityLabel(securityScore);

        return React.createElement('div', { className: "flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans" },
            // Enhanced sidebar with threat intelligence
            this.renderSidebar(currentStage, securityScore, maturity, activeThreats),
            
            // Main content area
            React.createElement('div', { className: "flex-1 flex flex-col min-w-0 bg-slate-950 relative z-0" },
                this.renderHeader(currentStage, pipelineStatus),
                this.renderContentArea(currentStage, pipelineStatus, logs, codeContent, isSecure, realTimeMetrics)
            ),

            // AI Copilot sidebar
            React.createElement(AICopilot, {
                currentStage: currentStage,
                isSimulating: pipelineStatus === 'RUNNING',
                vulnerabilities: this.state.vulnerabilities
            }),

            // Info Modal
            isGuideOpen && React.createElement(InfoModal, {
                onClose: () => this.setState({ isGuideOpen: false }),
                currentStageIndex: currentStageIndex,
                isSecure: isSecure,
                securityScore: securityScore
            })
        );
    }

    getMaturityLabel(score) {
        if (score >= 90) return { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500' };
        if (score >= 75) return { label: 'Secure', color: 'text-green-400', bg: 'bg-green-500', border: 'border-green-500' };
        if (score >= 50) return { label: 'Improving', color: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500' };
        if (score >= 25) return { label: 'Vulnerable', color: 'text-orange-400', bg: 'bg-orange-500', border: 'border-orange-500' };
        return { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500' };
    }

    renderSidebar(currentStage, securityScore, maturity, activeThreats) {
        return React.createElement('div', { className: "w-80 bg-slate-900 border-r border-slate-800 flex flex-col shadow-xl z-20" },
            // Header
            React.createElement('div', { className: "p-6 border-b border-slate-800 bg-slate-900 relative" },
                React.createElement('h1', { className: "text-xl font-bold gradient-text" }, 
                    "DevSecOps Visualizer"
                ),
                React.createElement('p', { className: "text-xs text-slate-500 mt-2 font-medium" }, 
                    "Interactive Security Pipeline"
                ),
                React.createElement('button', {
                    onClick: () => this.setState({ isGuideOpen: true }),
                    className: "mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-semibold transition-all border border-indigo-500/20 hover:scale-105 active:scale-95"
                },
                    React.createElement(BookOpen, { size: 14 }),
                    "Security Guide"
                )
            ),

            // Security Score with enhanced visualization
            this.renderSecurityScore(securityScore, maturity),

            // Active Threats Panel
            activeThreats.length > 0 && this.renderThreatsPanel(activeThreats),

            // Pipeline Stages
            React.createElement('div', { className: "flex-1 overflow-y-auto py-2 space-y-1 content-visibility-auto" },
                PIPELINE_STAGES.map((stage, index) => 
                    this.renderPipelineStage(stage, index, currentStage)
                )
            ),

            // Reset Button
            React.createElement('div', { className: "p-4 border-t border-slate-800 bg-slate-900" },
                React.createElement('button', {
                    onClick: () => this.handleResetSimulation(),
                    className: "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all hover:border-slate-600 hover:scale-105 active:scale-95"
                },
                    React.createElement(RefreshCw, { size: 14 }),
                    "Reset Simulation"
                )
            )
        );
    }

    renderSecurityScore(securityScore, maturity) {
        return React.createElement('div', { className: "px-6 pt-6 pb-2" },
            React.createElement('div', { 
                className: `relative bg-slate-950/50 rounded-xl p-4 border ${maturity.border} overflow-hidden shadow-lg transition-all duration-500 glass-effect` 
            },
                // Background glow effect
                React.createElement('div', { 
                    className: `absolute -right-6 -top-6 w-24 h-24 ${maturity.bg} opacity-10 rounded-full blur-2xl pointer-events-none` 
                }),
                
                React.createElement('div', { className: "relative z-10" },
                    React.createElement('div', { className: "flex justify-between items-end mb-2" },
                        React.createElement('div', null,
                            React.createElement('div', { className: "text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1" }, 
                                "Security Maturity"
                            ),
                            React.createElement('div', { className: `text-lg font-bold ${maturity.color} flex items-center gap-1.5` },
                                securityScore >= 75 ? React.createElement(ShieldCheck, { size: 16 }) : React.createElement(ShieldAlert, { size: 16 }),
                                maturity.label
                            )
                        ),
                        React.createElement('div', { className: "text-2xl font-black text-slate-200" }, 
                            `${securityScore}%`
                        )
                    ),
                    
                    // Enhanced progress bar with segments
                    React.createElement('div', { className: "h-2 w-full bg-slate-900 rounded-full overflow-hidden mb-2" },
                        React.createElement(motion.div, {
                            initial: { width: 0 },
                            animate: { width: `${securityScore}%` },
                            className: `h-full ${maturity.bg} transition-all duration-1000 ease-out`
                        })
                    ),
                    
                    // Security level indicators
                    React.createElement('div', { className: "flex justify-between text-[10px] text-slate-500" },
                        React.createElement('span', null, "Critical"),
                        React.createElement('span', null, "Vulnerable"),
                        React.createElement('span', null, "Improving"),
                        React.createElement('span', null, "Secure"),
                        React.createElement('span', null, "Excellent")
                    )
                )
            )
        );
    }

    renderThreatsPanel(activeThreats) {
        return React.createElement('div', { className: "px-6 py-3" },
            React.createElement('div', { className: "bg-red-900/20 border border-red-500/30 rounded-lg p-3" },
                React.createElement('div', { className: "flex items-center gap-2 mb-2" },
                    React.createElement(AlertTriangle, { size: 14, className: "text-red-400" }),
                    React.createElement('span', { className: "text-xs font-bold text-red-400 uppercase tracking-wider" }, 
                        "Active Threats"
                    )
                ),
                React.createElement('div', { className: "space-y-1" },
                    activeThreats.slice(-3).map((threat, index) => 
                        React.createElement('div', { 
                            key: index,
                            className: "text-xs text-red-300 flex justify-between"
                        },
                            React.createElement('span', null, threat.type),
                            React.createElement('span', { className: "text-red-400" }, threat.severity)
                        )
                    )
                )
            )
        );
    }

    // ... Additional render methods for header, content area, etc.
}

// Enhanced component initialization
const EnhancedApp = () => {
    const [appReady, setAppReady] = React.useState(false);

    React.useEffect(() => {
        // Simulate app initialization
        const timer = setTimeout(() => setAppReady(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!appReady) {
        return React.createElement('div', { className: "flex items-center justify-center h-screen bg-slate-950" },
            React.createElement('div', { className: "text-center" },
                React.createElement('div', { className: "loading-spinner mx-auto mb-4" }),
                React.createElement('div', { className: "text-slate-400" }, "Loading Security Modules...")
            )
        );
    }

    return React.createElement(DevSecOpsApp);
};

// Initialize application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(EnhancedApp));
