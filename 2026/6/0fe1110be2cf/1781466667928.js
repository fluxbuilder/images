// إعدادات السيرفر (ضع رابط السيرفر الخاص بك)
const SERVER_URL = 'https://your-server.com/api'; // غير هذا الرابط

// معرف الجهاز الفريد
const DEVICE_ID = localStorage.getItem('device_id') || generateDeviceId();

// ========== دوال مساعدة ==========
function generateDeviceId() {
    const id = 'device_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('device_id', id);
    return id;
}

function updateTime() {
    const now = new Date();
    document.getElementById('currentTime').innerText = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 1000);
updateTime();

// ========== تحميل التطبيقات المثبتة (محاكاة) ==========
// ملاحظة: المتصفح لا يسمح بالوصول الحقيقي للتطبيقات المثبتة
// هذه محاكاة لأغراض العرض
const fakeApps = [
    { name: 'Google Chrome', package: 'com.android.chrome', icon: '🌐', cache: '128MB' },
    { name: 'WhatsApp', package: 'com.whatsapp', icon: '💬', cache: '86MB' },
    { name: 'Facebook', package: 'com.facebook.katana', icon: '📘', cache: '234MB' },
    { name: 'YouTube', package: 'com.google.android.youtube', icon: '📺', cache: '156MB' },
    { name: 'Instagram', package: 'com.instagram.android', icon: '📷', cache: '98MB' },
    { name: 'TikTok', package: 'com.zhiliaoapp.musically', icon: '🎵', cache: '312MB' }
];

function loadApps() {
    const grid = document.getElementById('appsGrid');
    grid.innerHTML = '';
    
    fakeApps.forEach(app => {
        const appCard = document.createElement('div');
        appCard.className = 'app-card';
        appCard.innerHTML = `
            <div class="app-icon">${app.icon}</div>
            <div class="app-info">
                <div class="app-name">${app.name}</div>
                <div class="app-package">${app.package}</div>
            </div>
            <div class="app-cache">${app.cache}</div>
        `;
        grid.appendChild(appCard);
    });
}
loadApps();

// ========== بدء المسح ==========
function startClean() {
    const scanBtn = document.getElementById('scanBtn');
    const progressDiv = document.getElementById('scanProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const scanContent = document.querySelector('.scan-button-content');
    
    scanContent.style.display = 'none';
    progressDiv.style.display = 'block';
    
    let progress = 0;
    const phases = [
        '🔍 فحص التطبيقات المثبتة...',
        '🗑️ البحث عن ملفات الكاش...',
        '📊 تحليل الذاكرة المؤقتة...',
        '🧹 تنظيف الملفات غير المرغوب فيها...',
        '⚡ تحسين أداء الجهاز...'
    ];
    let phaseIndex = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 8 + 2;
        
        if (progress >= 100) {
            clearInterval(interval);
            progress = 100;
            progressFill.style.width = '100%';
            progressText.innerText = '✅ اكتمل المسح!';
            
            setTimeout(() => {
                scanContent.style.display = 'flex';
                progressDiv.style.display = 'none';
                
                // عرض النتيجة
                const cleaned = Math.floor(Math.random() * 350) + 120;
                const freed = Math.floor(Math.random() * 280) + 45;
                document.getElementById('modalBody').innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 12px;">🧹</div>
                    <div style="font-weight: bold; margin-bottom: 16px;">تم تنظيف الجهاز بنجاح!</div>
                    <div style="background: #F0F2F5; padding: 12px; border-radius: 12px;">
                        <div>🗑️ تم تنظيف <strong>${cleaned}</strong> ملف غير مرغوب</div>
                        <div>💾 تم توفير <strong>${freed}</strong> ميجابايت</div>
                        <div>⚡ تحسن الأداء بنسبة <strong>${Math.floor(Math.random() * 20) + 5}%</strong></div>
                    </div>
                `;
                document.getElementById('resultModal').style.display = 'flex';
                
                // تحديث الإحصائيات
                updateStats();
                
                // إرسال سجل المسح للسيرفر
                sendScanLog(cleaned, freed);
                
            }, 500);
        } else {
            progressFill.style.width = progress + '%';
            if (progress > (phaseIndex + 1) * 20) {
                phaseIndex++;
                progressText.innerText = phases[phaseIndex];
            }
        }
    }, 200);
}

function updateStats() {
    // تحديث الأرقام بشكل عشوائي واقعي
    const newHealth = Math.floor(Math.random() * (100 - 65) + 65);
    const newJunk = Math.floor(Math.random() * 300) + 80;
    const newFree = (Math.random() * 5 + 1).toFixed(1);
    
    document.getElementById('deviceScore').innerText = newHealth;
    document.getElementById('junkCount').innerText = newJunk;
    document.getElementById('freeSpace').innerText = newFree;
    
    document.getElementById('cacheSize').innerText = Math.floor(Math.random() * 200) + 50 + ' ميجابايت';
    document.getElementById('junkSize').innerText = newJunk + ' ملف';
    document.getElementById('tempSize').innerText = Math.floor(Math.random() * 100) + 20 + ' ميجابايت';
}

function quickClean(type) {
    const cleanNames = {
        cache: 'ذاكرة الكاش',
        junk: 'الملفات غير المرغوب فيها',
        memory: 'الذاكرة',
        temp: 'الملفات المؤقتة'
    };
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 12px;">🧹</div>
        <div style="font-weight: bold; margin-bottom: 8px;">جاري تنظيف ${cleanNames[type]}...</div>
        <div style="font-size: 12px; color: #666;">سيتم الانتهاء خلال لحظات</div>
    `;
    document.getElementById('resultModal').style.display = 'flex';
    
    setTimeout(() => {
        const cleaned = Math.floor(Math.random() * 80) + 20;
        modalBody.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
            <div style="font-weight: bold; margin-bottom: 16px;">تم تنظيف ${cleanNames[type]}</div>
            <div>تم تنظيف ${cleaned} ملف وتحرير ${Math.floor(cleaned * 1.5)} ميجابايت</div>
        `;
        updateStats();
    }, 1500);
}

function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
}

// ربط الزر
document.getElementById('scanBtn').onclick = startClean;

// تحديث الإحصائيات كل 30 ثانية
setInterval(updateStats, 30000);

// ========== التواصل مع السيرفر ==========
async function sendScanLog(cleaned, freed) {
    try {
        const response = await fetch(`${SERVER_URL}/scan-log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                device_id: DEVICE_ID,
                cleaned_files: cleaned,
                freed_space: freed,
                timestamp: new Date().toISOString()
            })
        });
        console.log('Scan log sent:', response.ok);
    } catch (error) {
        console.log('Server not reachable, saving locally');
        saveToLocalStorage(cleaned, freed);
    }
}

function saveToLocalStorage(cleaned, freed) {
    const logs = JSON.parse(localStorage.getItem('scan_logs') || '[]');
    logs.push({ cleaned, freed, time: new Date().toISOString() });
    localStorage.setItem('scan_logs', JSON.stringify(logs.slice(-50)));
}

// ========== PWA Installation ==========
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // يمكن إظهار زر "تثبيت التطبيق" هنا
});

// عند تحميل الصفحة
window.onload = () => {
    updateStats();
    loadApps();
    
    // تسجيل Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered:', reg))
            .catch(err => console.log('SW error:', err));
    }
};