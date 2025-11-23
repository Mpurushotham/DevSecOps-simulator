// Enhanced Guide Modal Functions
class GuideModal {
    static render(isOpen, currentStageIndex, isSecure, securityScore, onClose) {
        if (!isOpen) return '';

        const activeTab = 'intro'; // Default tab
        const activeContent = GUIDE_CONTENT.find(item => item.id === activeTab)?.content;
        const currentStage = PIPELINE_STAGES[currentStageIndex];

        // Dynamic checklist based on current state
        const dynamicChecklist = [
            {
                id: 1,
                title: "Secret Management (OWASP A07)",
                description: "Secrets removed from source code and managed via environment variables",
                met: isSecure,
                stage: "Code"
            },
            {
                id: 2,
                title: "Input Validation (OWASP A03)",
                description: "Parameterized queries implemented to prevent SQL injection",
                met: isSecure,
                stage: "Code"
            },
            {
                id: 3,
                title: "Dependency Scanning (SCA)",
                description: "Automated analysis of third-party libraries for known CVEs",
                met: currentStageIndex >= 1,
                stage: "Build"
            },
            {
                id: 4,
                title: "Static Analysis (SAST)",
                description: "Source code scanned for vulnerabilities before deployment",
                met: currentStageIndex >= 2,
                stage: "Test"
            },
            {
                id: 5,
                title: "Infrastructure Security",
                description: "Infrastructure as Code validated and scanned for misconfigurations",
                met: currentStageIndex >= 3,
                stage: "Deploy"
            },
            {
                id: 6,
                title: "Runtime Protection",
                description: "WAF and monitoring implemented for production environment",
                met: currentStageIndex >= 4,
                stage: "Monitor"
            }
        ];

        const completedItems = dynamicChecklist.filter(item => item.met).length;
        const totalItems = dynamicChecklist.length;

        return `
            <div class="modal-overlay" id="guide-modal-overlay">
                <div class="modal-content">
                    
                    <!-- Sidebar Navigation -->
                    <div class="w-64 bg-slate-900 border-r border-slate-700 p-4 overflow-y-auto">
                        <div class="flex items-center gap-2 text-blue-400 mb-6">
                            <span class="text-lg">${Icons.BookOpen}</span>
                            <span class="font-bold">Security Guide</span>
                        </div>
                        
                        <nav class="space-y-1">
                            ${GUIDE_CONTENT.map((item) => `
                                <button class="guide-tab-btn w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-all ${
                                    activeTab === item.id 
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }" data-tab="${item.id}">
                                    <span class="text-lg">${item.icon}</span>
                                    <span class="text-sm font-medium">${item.title}</span>
                                </button>
                            `).join('')}
                        </nav>

                        <!-- Progress Summary -->
                        <div class="mt-6 p-3 bg-slate-800 rounded-lg border border-slate-700">
                            <div class="text-xs text-slate-400 mb-2">Security Progress</div>
                            <div class="flex items-center justify-between mb-2">
                                <div class="text-sm font-semibold text-green-400">
                                    ${completedItems}/${totalItems} Complete
                                </div>
                                <div class="text-lg font-bold">${securityScore}%</div>
                            </div>
                            <div class="w-full bg-slate-700 rounded-full h-2">
                                <div class="h-2 rounded-full bg-green-500 transition-all duration-500" 
                                     style="width: ${(completedItems / totalItems) * 100}%"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Content Area -->
                    <div class="flex-1 flex flex-col">
                        <div class="flex justify-between items-center p-6 border-b border-slate-700">
                            <h2 class="text-xl font-bold text-white">${GUIDE_CONTENT.find(item => item.id === activeTab)?.title}</h2>
                            <button class="close-guide-btn text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors">
                                <span class="text-lg">${Icons.X}</span>
                            </button>
                        </div>

                        <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            ${activeTab === 'checklist' ? this.renderChecklist(dynamicChecklist, currentStage) : this.renderContent(activeContent, activeTab)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderChecklist(checklist, currentStage) {
        return `
            <div class="space-y-4">
                <div class="grid gap-4">
                    ${checklist.map((item) => `
                        <div class="p-4 rounded-lg border-2 transition-all duration-300 ${
                            item.met 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : 'bg-slate-700/50 border-slate-600'
                        }">
                            <div class="flex items-start gap-4">
                                <div class="p-2 rounded-full flex-shrink-0 ${
                                    item.met ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-400'
                                }">
                                    ${item.met ? Icons.CheckCircle : Icons.Circle}
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-2">
                                        <h3 class="font-bold ${item.met ? 'text-green-200' : 'text-slate-200'}">
                                            ${item.title}
                                        </h3>
                                        <span class="text-xs uppercase font-bold px-2 py-1 rounded bg-slate-600 text-slate-300">
                                            ${item.stage}
                                        </span>
                                        ${!item.met && item.stage === currentStage.id ? `
                                            <span class="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded animate-pulse">
                                                Current Stage
                                            </span>
                                        ` : ''}
                                    </div>
                                    <p class="text-slate-300 text-sm">${item.description}</p>
                                </div>
                                ${item.met ? `
                                    <div class="text-green-500 font-bold text-sm">
                                        COMPLIANT
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    static renderContent(content, activeTab) {
        if (!content) return '';

        return `
            <div class="space-y-6">
                <div class="prose prose-invert max-w-none">
                    <h1 class="text-2xl font-bold text-white mb-2">${content.heading}</h1>
                    <h2 class="text-lg text-blue-400 font-medium mb-4">${content.subheading}</h2>
                    <p class="text-slate-300 text-lg leading-relaxed mb-6">${content.text}</p>
                </div>

                ${content.points ? `
                    <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                        <h3 class="text-lg font-semibold text-white mb-4">Key Points</h3>
                        <ul class="space-y-3">
                            ${content.points.map((point, index) => `
                                <li class="flex items-start gap-3 text-slate-200">
                                    <span class="text-green-400 mt-1">${Icons.CheckCircle}</span>
                                    <span>${point}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }

    static attachEventListeners(onClose) {
        // Close button
        const closeBtn = document.querySelector('.close-guide-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', onClose);
        }

        // Overlay click to close
        const overlay = document.getElementById('guide-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    onClose();
                }
            });
        }

        // Tab buttons
        const tabBtns = document.querySelectorAll('.guide-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                // In a full implementation, this would switch tabs
                console.log('Switching to tab:', tabId);
            });
        });
    }
}
