class DevSecOpsApp {
    constructor() {
        this.currentStageIndex = 0;
        this.pipelineStatus = StageStatus.IDLE;
        this.logs = [];
        this.codeContent = VULNERABLE_CODE_SNIPPET;
        this.isSecure = false;
        this.isGuideOpen = false;
        this.securityScore = 0;
        
        this.init();
    }

    init() {
        this.renderApp();
        this.attachEventListeners();
    }

    renderApp() {
        const app = document.getElementById('app');
        app.innerHTML = this.getAppHTML();
        
        // Update dynamic content
        this.updateSecurityScore();
    }

    getAppHTML() {
        const currentStage = PIPELINE_STAGES[this.currentStageIndex];
        
        return `
            <div class="flex h-screen bg-slate-900 text-white">
                <!-- Sidebar -->
                ${this.getSidebarHTML()}

                <!-- Main Content -->
                <div class="flex-1 flex flex-col">
                    <!-- Header -->
                    ${this.getHeaderHTML(currentStage)}

                    <!-- Content Area -->
                    <div class="flex-1 p-8 overflow-y-auto custom-scrollbar">
                        <!-- Architecture Diagram -->
                        ${ArchitectureDiagram.render(currentStage, this.pipelineStatus, this.isSecure)}
                        
                        <!-- Code and Logs Panels -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Code Panel -->
                            ${this.getCodePanelHTML(currentStage)}

                            <!-- Logs Panel -->
                            ${this.getLogsPanelHTML()}
                        </div>
                    </div>
                </div>

                <!-- Guide Modal -->
                ${GuideModal.render(this.isGuideOpen, this.currentStageIndex, this.isSecure, this.securityScore, () => this.closeGuide())}
            </div>
        `;
    }

    getSidebarHTML() {
        return `
            <div class="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
                <div class="p-6 border-b border-slate-700">
                    <h1 class="text-xl font-bold text-blue-400">DevSecOps Visualizer</h1>
                    <p class="text-sm text-slate-400 mt-2">Interactive Pipeline Demo</p>
                    <button id="guide-btn" class="mt-4 w-full py-2 px-3 bg-blue-500 hover:bg-blue-600 rounded text-sm transition-colors">
                        ${Icons.BookOpen} Security Guide
                    </button>
                </div>

                <!-- Security Score -->
                <div class="p-6">
                    <div class="bg-slate-700 rounded-lg p-4">
                        <div class="flex justify-between items-center mb-2">
                            <div class="text-sm text-slate-300">Security Score</div>
                            <div class="text-2xl font-bold">${this.securityScore}%</div>
                        </div>
                        <div class="w-full bg-slate-600 rounded-full h-2">
                            <div class="h-2 rounded-full ${this.getMaturityClass().bg} transition-all duration-500" 
                                 style="width: ${this.securityScore}%"></div>
                        </div>
                        <div class="text-sm mt-2 text-center ${this.getMaturityClass().color}">${this.getMaturityClass().label}</div>
                    </div>
                </div>

                <!-- Pipeline Stages -->
                <div class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar" id="stages-container">
                    ${PIPELINE_STAGES.map((stage, index) => this.getStageHTML(stage, index)).join('')}
                </div>

                <div class="p-4 border-t border-slate-700">
                    <button id="reset-btn" class="w-full py-2 px-3 bg-slate-600 hover:bg-slate-500 rounded text-sm transition-colors">
                        ${Icons.RefreshCw} Reset Simulation
                    </button>
                </div>
            </div>
        `;
    }

    getStageHTML(stage, index) {
        const isActive = index === this.currentStageIndex;
        const isCompleted = index < this.currentStageIndex;
        let statusText = '';
        
        if (isActive && this.pipelineStatus === StageStatus.RUNNING) statusText = 'Running...';
        if (isActive && this.pipelineStatus === StageStatus.ERROR) statusText = 'Failed';
        if (isCompleted || (isActive && this.pipelineStatus === StageStatus.SUCCESS)) statusText = 'Completed';

        return `
            <div class="p-3 rounded-lg flex items-center gap-3 transition-all ${
                isActive ? 'bg-blue-500/20 border border-blue-500' : 'bg-slate-700'
            }">
                <div class="p-2 rounded ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-300'
                }">
                    ${stage.icon}
                </div>
                <div class="flex-1">
                    <div class="font-medium">${stage.name}</div>
                    <div class="text-xs text-slate-400">${statusText}</div>
                </div>
                ${isCompleted ? `<span class="text-green-400">${Icons.CheckCircle}</span>` : ''}
            </div>
        `;
    }

    getHeaderHTML(currentStage) {
        return `
            <header class="h-16 border-b border-slate-700 bg-slate-800 flex items-center justify-between px-8">
                <h2 class="text-lg font-medium flex items-center gap-3">
                    <span class="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-sm">
                        ${this.currentStageIndex + 1}
                    </span>
                    ${currentStage.name}
                </h2>
                <div class="flex gap-3">
                    ${this.getActionButtonHTML()}
                </div>
            </header>
        `;
    }

    getActionButtonHTML() {
        if (this.pipelineStatus === StageStatus.RUNNING) {
            return `
                <button disabled class="px-5 py-2 bg-slate-700 text-slate-400 rounded text-sm flex items-center gap-2">
                    <span class="animate-spin">${Icons.Loader2}</span>
                    Running...
                </button>
            `;
        } else if (this.pipelineStatus === StageStatus.SUCCESS) {
            const isLastStage = this.currentStageIndex === PIPELINE_STAGES.length - 1;
            return `
                <button id="next-btn" ${isLastStage ? 'disabled' : ''} 
                    class="px-5 py-2 bg-green-600 hover:bg-green-500 rounded text-sm flex items-center gap-2 transition-colors ${isLastStage ? 'opacity-50' : ''}">
                    Next Stage ${Icons.ArrowRight}
                </button>
            `;
        } else {
            return `
                <button id="run-btn" class="px-5 py-2 bg-green-600 hover:bg-green-500 rounded text-sm flex items-center gap-2 transition-colors">
                    ${Icons.Play} Run Pipeline
                </button>
            `;
        }
    }

    getCodePanelHTML(currentStage) {
        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-sm font-semibold text-slate-400">Source Code</h3>
                    ${currentStage.id === 'code' ? `
                        <button id="fix-btn" ${this.isSecure ? 'disabled' : ''} 
                            class="px-3 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                                this.isSecure ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            }">
                            ${this.isSecure ? Icons.Lock : Icons.Unlock}
                            ${this.isSecure ? ' Secured' : ' Fix Vulnerabilities'}
                        </button>
                    ` : ''}
                </div>
                <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                    <div class="bg-slate-900 px-4 py-2 border-b border-slate-700 text-sm font-mono">
                        auth_service.js
                    </div>
                    <pre class="p-4 text-sm font-mono text-slate-300 overflow-auto max-h-80 custom-scrollbar">${this.codeContent}</pre>
                </div>
            </div>
        `;
    }

    getLogsPanelHTML() {
        return `
            <div class="space-y-4">
                <h3 class="text-sm font-semibold text-slate-400">Pipeline Logs</h3>
                <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden h-80">
                    <div class="bg-slate-900 px-4 py-2 border-b border-slate-700 text-sm flex items-center gap-2">
                        ${Icons.Terminal} CI/CD Runner
                    </div>
                    <div class="p-4 font-mono text-sm overflow-y-auto h-64 custom-scrollbar" id="logs-container">
                        ${this.logs.length === 0 ? 
                            '<div class="text-slate-500 text-center py-8">Waiting for pipeline to start...</div>' : 
                            this.logs.map(log => `
                                <div class="border-l-2 pl-2 py-1 mb-1 ${
                                    log.level === 'ERROR' ? 'border-red-500 text-red-400' :
                                    log.level === 'SUCCESS' ? 'border-green-500 text-green-400' :
                                    'border-slate-600 text-slate-300'
                                }">
                                    <span class="text-slate-500 text-xs mr-2">${log.timestamp}</span>
                                    ${log.message}
                                </div>
                            `).join('')
                        }
                        ${this.pipelineStatus === StageStatus.RUNNING ? '<div class="text-blue-400 animate-pulse">Processing...</div>' : ''}
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Guide button
        const guideBtn = document.getElementById('guide-btn');
        if (guideBtn) {
            guideBtn.addEventListener('click', () => this.openGuide());
        }

        // Run pipeline button
        const runBtn = document.getElementById('run-btn');
        if (runBtn) {
            runBtn.addEventListener('click', () => this.runStage());
        }

        // Next stage button
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStage());
        }

        // Fix vulnerabilities button
        const fixBtn = document.getElementById('fix-btn');
        if (fixBtn) {
            fixBtn.addEventListener('click', () => this.fixCode());
        }

        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }

        // Attach guide modal event listeners if modal is open
        if (this.isGuideOpen) {
            GuideModal.attachEventListeners(() => this.closeGuide());
        }
    }

    openGuide() {
        this.isGuideOpen = true;
        this.renderApp();
    }

    closeGuide() {
        this.isGuideOpen = false;
        this.renderApp();
    }

    runStage() {
        this.pipelineStatus = StageStatus.RUNNING;
        this.clearLogs();
        this.addLog(`Starting stage: ${PIPELINE_STAGES[this.currentStageIndex].name}...`);
        
        setTimeout(() => {
            const currentStage = PIPELINE_STAGES[this.currentStageIndex];
            
            if (currentStage.id === 'code') {
                this.addLog('Running pre-commit hooks...');
                this.addLog('Scanning for secrets...');
                if (!this.isSecure) {
                    this.addLog('CRITICAL: Hardcoded API Key found!', 'ERROR');
                    this.addLog('CRITICAL: SQL Injection vulnerability!', 'ERROR');
                    this.pipelineStatus = StageStatus.ERROR;
                } else {
                    this.addLog('Secret scanning passed.', 'SUCCESS');
                    this.pipelineStatus = StageStatus.SUCCESS;
                }
            } else {
                this.addLog('Stage completed successfully.', 'SUCCESS');
                this.pipelineStatus = StageStatus.SUCCESS;
            }
            
            this.renderApp();
        }, 2000);
        
        this.renderApp();
    }

    nextStage() {
        if (this.currentStageIndex < PIPELINE_STAGES.length - 1) {
            this.currentStageIndex++;
            this.pipelineStatus = StageStatus.IDLE;
            this.clearLogs();
            this.renderApp();
        }
    }

    fixCode() {
        this.codeContent = SECURE_CODE_SNIPPET;
        this.isSecure = true;
        this.pipelineStatus = StageStatus.IDLE;
        this.clearLogs();
        this.addLog('Applied security patches.', 'SUCCESS');
        this.addLog('SQL Injection vulnerabilities fixed.', 'SUCCESS');
        this.renderApp();
    }

    reset() {
        this.currentStageIndex = 0;
        this.pipelineStatus = StageStatus.IDLE;
        this.isSecure = false;
        this.codeContent = VULNERABLE_CODE_SNIPPET;
        this.clearLogs();
        this.renderApp();
    }

    addLog(message, level = 'INFO') {
        const timestamp = new Date().toLocaleTimeString();
        this.logs.push({ timestamp, message, level });
    }

    clearLogs() {
        this.logs = [];
    }

    updateSecurityScore() {
        let score = 0;
        if (this.isSecure) score += 40;
        if (this.currentStageIndex >= 1) score += 15;
        if (this.currentStageIndex >= 2) score += 15;
        if (this.currentStageIndex >= 3) score += 15;
        if (this.currentStageIndex >= 4) score += 15;
        this.securityScore = Math.min(100, score);
    }

    getMaturityClass() {
        const score = this.securityScore;
        if (score >= 80) return { label: 'Secure', color: 'text-green-400', bg: 'bg-green-500' };
        if (score >= 40) return { label: 'Improving', color: 'text-yellow-400', bg: 'bg-yellow-500' };
        return { label: 'Vulnerable', color: 'text-red-400', bg: 'bg-red-500' };
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DevSecOpsApp();
});
