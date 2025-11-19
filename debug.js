// Debug Panel for GTFS Box
// Extensive logging to diagnose freezing issues

class DebugPanel {
    constructor() {
        this.logs = [];
        this.maxLogs = 500;
        this.performanceMetrics = new Map();
        this.networkCalls = new Map();
        this.freezeThreshold = 100; // ms - detect freezes longer than this
        this.lastFrameTime = performance.now();
        this.frozenFrames = 0;
        this.enabled = false;
        this.isOpen = false;

        // Defer UI creation until DOM is ready
        if (document.body) {
            this.createUI();
        } else {
            document.addEventListener('DOMContentLoaded', () => this.createUI());
        }

        this.setupPerformanceMonitoring();
        this.interceptNetworkCalls();
        this.monitorFrameRate();
        this.setupGlobalErrorHandlers();
    }

    createUI() {
        // Create debug panel container
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.className = 'debug-panel hidden';
        panel.innerHTML = `
            <div class="debug-header">
                <div class="debug-title">🔍 Debug Panel</div>
                <div class="debug-controls">
                    <button id="debug-clear" title="Clear logs">🗑️</button>
                    <button id="debug-export" title="Export logs">💾</button>
                    <button id="debug-close" title="Close">✖️</button>
                </div>
            </div>
            <div class="debug-stats">
                <div class="stat">
                    <span class="stat-label">Network Calls:</span>
                    <span id="debug-network-count" class="stat-value">0</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Pending:</span>
                    <span id="debug-pending-count" class="stat-value">0</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Frozen Frames:</span>
                    <span id="debug-frozen-frames" class="stat-value">0</span>
                </div>
                <div class="stat">
                    <span class="stat-label">FPS:</span>
                    <span id="debug-fps" class="stat-value">0</span>
                </div>
            </div>
            <div class="debug-tabs">
                <button class="debug-tab active" data-tab="logs">Logs</button>
                <button class="debug-tab" data-tab="network">Network</button>
                <button class="debug-tab" data-tab="performance">Performance</button>
            </div>
            <div class="debug-content">
                <div id="debug-logs" class="debug-tab-content active"></div>
                <div id="debug-network" class="debug-tab-content"></div>
                <div id="debug-performance" class="debug-tab-content"></div>
            </div>
        `;
        document.body.appendChild(panel);

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'debug-toggle';
        toggleBtn.className = 'debug-toggle';
        toggleBtn.innerHTML = '🐛';
        toggleBtn.title = 'Toggle Debug Panel';
        document.body.appendChild(toggleBtn);

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('debug-toggle').addEventListener('click', () => {
            this.toggle();
        });

        document.getElementById('debug-close').addEventListener('click', () => {
            this.hide();
        });

        document.getElementById('debug-clear').addEventListener('click', () => {
            this.clearLogs();
        });

        document.getElementById('debug-export').addEventListener('click', () => {
            this.exportLogs();
        });

        // Tab switching
        document.querySelectorAll('.debug-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
    }

    toggle() {
        const panel = document.getElementById('debug-panel');
        if (!panel) {
            console.warn('Debug panel UI not ready yet');
            return;
        }
        if (panel.classList.contains('hidden')) {
            this.show();
        } else {
            this.hide();
        }
    }

    show() {
        const panel = document.getElementById('debug-panel');
        if (!panel) {
            console.warn('Debug panel UI not ready yet');
            return;
        }
        this.enabled = true;
        this.isOpen = true;
        panel.classList.remove('hidden');
        this.log('DEBUG', 'Debug panel opened');
    }

    hide() {
        const panel = document.getElementById('debug-panel');
        if (!panel) return;
        this.isOpen = false;
        panel.classList.add('hidden');
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.debug-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.debug-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `debug-${tabName}`);
        });

        // Refresh content
        if (tabName === 'network') {
            this.updateNetworkTab();
        } else if (tabName === 'performance') {
            this.updatePerformanceTab();
        }
    }

    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data
        };

        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Update UI if visible
        if (this.enabled) {
            this.updateLogsTab();
        }

        // Console logging
        const consoleMsg = `[${timestamp}] [${level}] ${message}`;
        switch (level) {
            case 'ERROR':
                console.error(consoleMsg, data);
                break;
            case 'WARN':
                console.warn(consoleMsg, data);
                break;
            case 'INFO':
                console.info(consoleMsg, data);
                break;
            default:
                console.log(consoleMsg, data);
        }
    }

    updateLogsTab() {
        const container = document.getElementById('debug-logs');
        const html = this.logs.slice(-100).reverse().map(log => {
            const levelClass = `log-${log.level.toLowerCase()}`;
            const time = new Date(log.timestamp).toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                fractionalSecondDigits: 3
            });
            const dataStr = log.data ? `<pre>${JSON.stringify(log.data, null, 2)}</pre>` : '';
            return `
                <div class="log-entry ${levelClass}">
                    <span class="log-time">${time}</span>
                    <span class="log-level">[${log.level}]</span>
                    <span class="log-message">${this.escapeHtml(log.message)}</span>
                    ${dataStr}
                </div>
            `;
        }).join('');
        container.innerHTML = html;
    }

    updateNetworkTab() {
        const container = document.getElementById('debug-network');
        const calls = Array.from(this.networkCalls.values()).reverse();

        const html = calls.map(call => {
            const duration = call.endTime ? (call.endTime - call.startTime).toFixed(2) : 'pending';
            const statusClass = call.error ? 'network-error' : call.endTime ? 'network-success' : 'network-pending';
            return `
                <div class="network-entry ${statusClass}">
                    <div class="network-url">${this.escapeHtml(call.url)}</div>
                    <div class="network-details">
                        <span class="network-method">${call.method}</span>
                        <span class="network-duration">${duration}ms</span>
                        ${call.size ? `<span class="network-size">${this.formatBytes(call.size)}</span>` : ''}
                        ${call.error ? `<span class="network-error-msg">${this.escapeHtml(call.error)}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html || '<div class="empty-state">No network calls recorded</div>';
    }

    updatePerformanceTab() {
        const container = document.getElementById('debug-performance');
        const metrics = Array.from(this.performanceMetrics.entries());

        const html = metrics.map(([name, timings]) => {
            const avg = timings.reduce((a, b) => a + b, 0) / timings.length;
            const max = Math.max(...timings);
            const min = Math.min(...timings);
            return `
                <div class="perf-entry">
                    <div class="perf-name">${this.escapeHtml(name)}</div>
                    <div class="perf-stats">
                        <span>Avg: ${avg.toFixed(2)}ms</span>
                        <span>Min: ${min.toFixed(2)}ms</span>
                        <span>Max: ${max.toFixed(2)}ms</span>
                        <span>Count: ${timings.length}</span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html || '<div class="empty-state">No performance metrics recorded</div>';
    }

    setupPerformanceMonitoring() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > this.freezeThreshold) {
                            this.log('WARN', `Long task detected: ${entry.duration.toFixed(2)}ms`, {
                                name: entry.name,
                                duration: entry.duration,
                                startTime: entry.startTime
                            });
                        }
                    }
                });
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                this.log('WARN', 'Long task monitoring not supported', e);
            }
        }
    }

    monitorFrameRate() {
        let frameCount = 0;
        let lastFpsUpdate = performance.now();

        const checkFrame = (timestamp) => {
            const delta = timestamp - this.lastFrameTime;

            // Detect freeze (frame took too long)
            if (delta > this.freezeThreshold) {
                this.frozenFrames++;
                this.log('ERROR', `Frame freeze detected: ${delta.toFixed(2)}ms`, {
                    delta,
                    timestamp,
                    lastFrameTime: this.lastFrameTime
                });

                // Update UI
                const frozenEl = document.getElementById('debug-frozen-frames');
                if (frozenEl) {
                    frozenEl.textContent = this.frozenFrames;
                    frozenEl.style.color = '#ff4444';
                }
            }

            this.lastFrameTime = timestamp;
            frameCount++;

            // Update FPS every second
            if (timestamp - lastFpsUpdate >= 1000) {
                const fps = Math.round(frameCount * 1000 / (timestamp - lastFpsUpdate));
                const fpsEl = document.getElementById('debug-fps');
                if (fpsEl) {
                    fpsEl.textContent = fps;
                    fpsEl.style.color = fps < 30 ? '#ff4444' : fps < 50 ? '#ffaa00' : '#44ff44';
                }
                frameCount = 0;
                lastFpsUpdate = timestamp;
            }

            requestAnimationFrame(checkFrame);
        };

        requestAnimationFrame(checkFrame);
    }

    setupGlobalErrorHandlers() {
        // Catch all uncaught errors
        window.addEventListener('error', (event) => {
            this.log('ERROR', `💥 Uncaught Error: ${event.message}`, {
                error: event.error,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });

        // Catch all unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.log('ERROR', `💥 Unhandled Promise Rejection: ${event.reason}`, {
                reason: event.reason,
                promise: event.promise,
                stack: event.reason?.stack
            });
        });

        // DO NOT wrap console.error/warn - causes infinite recursion!
        // The window error and unhandledrejection listeners are sufficient

        this.log('INFO', '✅ Global error handlers installed');
    }

    interceptNetworkCalls() {
        const originalFetch = window.fetch;
        const debugPanel = this;

        window.fetch = async function(...args) {
            // Safely extract URL
            let url = 'unknown';
            try {
                url = typeof args[0] === 'string' ? args[0] : args[0].url;
            } catch (e) {
                // Fallback if URL extraction fails
            }

            const method = args[1]?.method || 'GET';
            const callId = `${Date.now()}-${Math.random()}`;

            const callInfo = {
                id: callId,
                url,
                method,
                startTime: performance.now()
            };

            try {
                debugPanel.networkCalls.set(callId, callInfo);
                debugPanel.log('INFO', `Network request started: ${method} ${url}`);
                debugPanel.updateStats();
            } catch (e) {
                // Debug panel error shouldn't break the request
                console.error('Debug panel logging error:', e);
            }

            try {
                const startTime = performance.now();
                const response = await originalFetch.apply(this, args);
                const endTime = performance.now();
                const duration = endTime - startTime;

                callInfo.endTime = endTime;
                callInfo.status = response.status;

                // Try to get response size in background (non-blocking)
                try {
                    const cloneResponse = response.clone();
                    cloneResponse.blob().then(blob => {
                        callInfo.size = blob.size;
                    }).catch(e => {
                        // Can't read body - this is fine
                    });
                } catch (e) {
                    // Clone might fail in some cases
                }

                try {
                    debugPanel.log('INFO', `Network request completed: ${method} ${url} (${duration.toFixed(2)}ms, ${response.status})`, {
                        duration,
                        status: response.status,
                        size: callInfo.size
                    });

                    // Track if this is a GTFS realtime request
                    if (url.includes('gtfs') || url.includes('realtime') || url.includes('proto')) {
                        debugPanel.recordPerformance('GTFS Realtime Fetch', duration);
                    }

                    debugPanel.updateStats();
                } catch (e) {
                    console.error('Debug panel logging error:', e);
                }

                return response;
            } catch (error) {
                const endTime = performance.now();

                try {
                    callInfo.endTime = endTime;
                    callInfo.error = error.message;

                    debugPanel.log('ERROR', `Network request failed: ${method} ${url}`, {
                        error: error.message,
                        duration: endTime - callInfo.startTime
                    });

                    debugPanel.updateStats();
                } catch (e) {
                    console.error('Debug panel logging error:', e);
                }

                throw error;
            }
        };
    }

    recordPerformance(name, duration) {
        if (!this.performanceMetrics.has(name)) {
            this.performanceMetrics.set(name, []);
        }

        const timings = this.performanceMetrics.get(name);
        timings.push(duration);

        // Keep only last 100 measurements
        if (timings.length > 100) {
            timings.shift();
        }

        if (duration > this.freezeThreshold) {
            this.log('WARN', `Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
        }
    }

    measureAsync(name, asyncFn) {
        const startTime = performance.now();
        const result = asyncFn();

        if (result && typeof result.then === 'function') {
            return result.then(value => {
                const duration = performance.now() - startTime;
                this.recordPerformance(name, duration);
                return value;
            });
        }

        const duration = performance.now() - startTime;
        this.recordPerformance(name, duration);
        return result;
    }

    measure(name, fn) {
        const startTime = performance.now();
        const result = fn();
        const duration = performance.now() - startTime;
        this.recordPerformance(name, duration);
        return result;
    }

    updateStats() {
        const networkCount = this.networkCalls.size;
        const pendingCount = Array.from(this.networkCalls.values()).filter(call => !call.endTime).length;

        const networkEl = document.getElementById('debug-network-count');
        const pendingEl = document.getElementById('debug-pending-count');

        if (networkEl) networkEl.textContent = networkCount;
        if (pendingEl) {
            pendingEl.textContent = pendingCount;
            pendingEl.style.color = pendingCount > 0 ? '#ffaa00' : '#44ff44';
        }
    }

    clearLogs() {
        this.logs = [];
        this.updateLogsTab();
        this.log('INFO', 'Logs cleared');
    }

    exportLogs() {
        const data = {
            exportTime: new Date().toISOString(),
            logs: this.logs,
            networkCalls: Array.from(this.networkCalls.values()),
            performanceMetrics: Object.fromEntries(this.performanceMetrics),
            frozenFrames: this.frozenFrames
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gtfs-box-debug-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.log('INFO', 'Debug logs exported');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}

// Create global debug instance with error protection
try {
    window.debugPanel = new DebugPanel();

    // Log initial page load
    window.debugPanel.log('INFO', 'GTFS Box debug panel initialized');
    window.debugPanel.log('INFO', `User Agent: ${navigator.userAgent}`);
    window.debugPanel.log('INFO', `Screen: ${window.screen.width}x${window.screen.height}`);
    window.debugPanel.log('INFO', `Viewport: ${window.innerWidth}x${window.innerHeight}`);
} catch (error) {
    console.error('Failed to initialize debug panel:', error);
    // Create a minimal stub to prevent errors in gtfs-box.js
    window.debugPanel = {
        log: () => {},
        recordPerformance: () => {},
        measure: (name, fn) => fn(),
        measureAsync: (name, fn) => fn()
    };
}
