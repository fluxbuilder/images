const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// تخزين البيانات
const DATA_FILE = 'data.json';

// استلام سجل المسح
app.post('/api/scan-log', (req, res) => {
    const { device_id, cleaned_files, freed_space, timestamp } = req.body;
    
    let data = {};
    if (fs.existsSync(DATA_FILE)) {
        data = JSON.parse(fs.readFileSync(DATA_FILE));
    }
    
    if (!data[device_id]) {
        data[device_id] = { scans: [], apps: [] };
    }
    
    data[device_id].scans.push({ cleaned_files, freed_space, timestamp });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    
    res.json({ status: 'ok' });
});

// استلام قائمة التطبيقات
app.post('/api/apps', (req, res) => {
    const { device_id, apps } = req.body;
    
    let data = {};
    if (fs.existsSync(DATA_FILE)) {
        data = JSON.parse(fs.readFileSync(DATA_FILE));
    }
    
    if (!data[device_id]) {
        data[device_id] = { scans: [], apps: [] };
    }
    
    data[device_id].apps = apps;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    
    res.json({ status: 'ok' });
});

// عرض لوحة التحكم
app.get('/dashboard', (req, res) => {
    const data = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : {};
    
    let html = `
    <!DOCTYPE html>
    <html dir="rtl">
    <head><meta charset="UTF-8"><title>لوحة التحكم</title>
    <style>
        body { font-family: Arial; background: #f0f2f5; padding: 20px; }
        .card { background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; }
        h1 { color: #1A73E8; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: right; border-bottom: 1px solid #ddd; }
    </style>
    </head>
    <body>
    <h1>📊 لوحة تحكم Phone Cleaner</h1>
    `;
    
    for (const [deviceId, deviceData] of Object.entries(data)) {
        html += `
        <div class="card">
            <h2>📱 الجهاز: ${deviceId.substring(0, 20)}...</h2>
            <h3>🧹 سجل المسح (آخر 10):</h3>
            <table>
                <tr><th>الوقت</th><th>الملفات</th><th>المساحة المحررة</th></tr>
                ${deviceData.scans.slice(-10).reverse().map(s => `
                    <tr><td>${new Date(s.timestamp).toLocaleString('ar-EG')}</td>
                    <td>${s.cleaned_files}</td><td>${s.freed_space} ميجابايت</td></tr>
                `).join('')}
            </table>
        </div>
        `;
    }
    
    html += `</body></html>`;
    res.send(html);
});

app.listen(3000, () => console.log('🚀 لوحة التحكم على http://localhost:3000/dashboard'));