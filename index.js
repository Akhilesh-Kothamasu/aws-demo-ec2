import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Beautiful status page dashboard HTML
const getDashboardHtml = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS EC2 Express Server</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%);
            --card-bg: rgba(30, 41, 59, 0.4);
            --card-border: rgba(255, 255, 255, 0.08);
            --primary: #818cf8;
            --primary-glow: rgba(129, 140, 248, 0.15);
            --success: #34d399;
            --success-glow: rgba(52, 211, 153, 0.15);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: var(--bg-gradient);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow-x: hidden;
            padding: 2rem;
        }

        .container {
            max-width: 700px;
            width: 100%;
            position: relative;
        }

        /* Ambient glows */
        .glow {
            position: absolute;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%);
            filter: blur(40px);
            z-index: -1;
            pointer-events: none;
        }
        .glow-1 { top: -100px; left: -100px; }
        .glow-2 { bottom: -100px; right: -100px; }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            padding: 3rem;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 0 30px var(--primary-glow);
            border-color: rgba(129, 140, 248, 0.3);
        }

        .logo-container {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 80px;
            background: rgba(129, 140, 248, 0.1);
            border: 1.5px solid rgba(129, 140, 248, 0.3);
            border-radius: 20px;
            margin-bottom: 1.5rem;
            position: relative;
            animation: pulse 3s infinite ease-in-out;
        }

        @keyframes pulse {
            0%, 100% {
                box-shadow: 0 0 0 0 rgba(129, 140, 248, 0.2);
            }
            50% {
                box-shadow: 0 0 20px 4px rgba(129, 140, 248, 0.4);
            }
        }

        .logo-container svg {
            width: 40px;
            height: 40px;
            fill: var(--primary);
        }

        h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
        }

        .subtitle {
            color: var(--text-muted);
            font-size: 1.1rem;
            margin-bottom: 2rem;
            font-weight: 300;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(52, 211, 153, 0.1);
            border: 1px solid rgba(52, 211, 153, 0.2);
            color: var(--success);
            padding: 8px 16px;
            border-radius: 100px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 2.5rem;
        }

        .status-ping {
            width: 8px;
            height: 8px;
            background-color: var(--success);
            border-radius: 50%;
            display: inline-block;
            position: relative;
        }

        .status-ping::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: var(--success);
            border-radius: 50%;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            top: 0;
            left: 0;
        }

        @keyframes ping {
            75%, 100% {
                transform: scale(2.5);
                opacity: 0;
            }
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-bottom: 2.5rem;
            text-align: left;
        }

        .info-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 16px;
            padding: 1.25rem;
            transition: background 0.2s;
        }

        .info-card:hover {
            background: rgba(255, 255, 255, 0.04);
        }

        .info-label {
            color: var(--text-muted);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.25rem;
        }

        .info-value {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-main);
        }

        .api-link {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.06);
            color: var(--text-main);
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.2s;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .api-link:hover {
            background: var(--text-main);
            color: #0f172a;
            border-color: var(--text-main);
        }

        footer {
            margin-top: 2rem;
            color: var(--text-muted);
            font-size: 0.85rem;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
        
        <div class="card">
            <div class="logo-container">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
            </div>
            
            <h1>Express Server</h1>
            <p class="subtitle">Powered by Node.js & AWS EC2 Demo</p>
            
            <div class="status-badge">
                <span class="status-ping"></span>
                Running & Healthy
            </div>
            
            <div class="info-grid">
                <div class="info-card">
                    <div class="info-label">Port</div>
                    <div class="info-value" id="port-val">${PORT}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Environment</div>
                    <div class="info-value">development</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Platform</div>
                    <div class="info-value" id="platform-val">${process.platform}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Uptime</div>
                    <div class="info-value" id="uptime-val">0s</div>
                </div>
            </div>
            
            <a href="/api/health" class="api-link">
                <span>Test API Health</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
        
        <footer>
            Node.js version: ${process.version} • AWS Demo EC2 Workspace
        </footer>
    </div>

    <script>
        // Update Uptime
        let seconds = 0;
        setInterval(() => {
            seconds++;
            const hrs = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            
            let timeStr = '';
            if (hrs > 0) timeStr += hrs + 'h ';
            if (mins > 0 || hrs > 0) timeStr += mins + 'm ';
            timeStr += secs + 's';
            
            document.getElementById('uptime-val').innerText = timeStr;
        }, 1000);
    </script>
</body>
</html>
`;

app.get('/', (req, res) => {
  res.send(getDashboardHtml());
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
});

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 Express Server is running on port ${PORT}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`=============================================`);
});
