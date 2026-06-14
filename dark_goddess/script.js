document.addEventListener('DOMContentLoaded', () => {
    // 1. キャラクター切り替えタブ
    const charBtns = document.querySelectorAll('.char-btn');
    const charPanes = document.querySelectorAll('.char-pane');

    charBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            charBtns.forEach(b => b.classList.remove('active'));
            charPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetChar = btn.dataset.char;
            const targetPane = document.getElementById(`pane-${targetChar}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // 2. 大神殿建築シミュレーター
    const templeBar = document.getElementById('temple-bar');
    const templePct = document.getElementById('temple-pct');
    const templeStatus = document.getElementById('temple-status');
    const simLog = document.getElementById('sim-log');
    
    const btnCult = document.getElementById('btn-conquer-cult');
    const btnGuild = document.getElementById('btn-conquer-guild');
    const btnKingdom = document.getElementById('btn-conquer-kingdom');

    let progress = 15; // 初期進捗率
    updateProgress(0);

    function updateProgress(amount) {
        progress = Math.min(100, progress + amount);
        if (templeBar) {
            templeBar.style.width = `${progress}%`;
        }
        if (templePct) {
            templePct.textContent = `${progress}%`;
        }

        if (progress >= 100) {
            if (templeStatus) {
                templeStatus.textContent = "COMPLETED (建立完了)";
                templeStatus.style.color = "#00e5ff";
                templeStatus.style.textShadow = "0 0 8px rgba(0, 229, 255, 0.6)";
            }
        }
    }

    function addLog(text, type = 'sys-msg') {
        if (!simLog) return;
        const p = document.createElement('p');
        p.className = type;
        p.textContent = text;
        simLog.appendChild(p);
        simLog.scrollTop = simLog.scrollHeight;
    }

    // 3. 雷エフェクト
    const lightningContainer = document.getElementById('lightning-container');

    function triggerLightningEffect() {
        // 画面フラッシュ用のdiv
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100vw';
        flash.style.height = '100vh';
        flash.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        flash.style.zIndex = '99';
        flash.style.pointerEvents = 'none';
        document.body.appendChild(flash);

        // フェードアウトさせて消去
        flash.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: 300,
            easing: 'ease-out'
        });
        setTimeout(() => flash.remove(), 300);

        // 稲妻の線を何本かランダムに生成
        if (lightningContainer) {
            const linesCount = 3 + Math.floor(Math.random() * 4);
            const containerWidth = window.innerWidth;
            const containerHeight = window.innerHeight;

            for (let i = 0; i < linesCount; i++) {
                const line = document.createElement('div');
                line.className = 'bolt-line';
                
                const startX = Math.random() * containerWidth;
                const startY = 0;
                const length = 200 + Math.random() * 300;
                const angle = 60 + Math.random() * 60; // ほぼ下向き

                line.style.left = `${startX}px`;
                line.style.top = `${startY}px`;
                line.style.width = `${length}px`;
                line.style.height = `${2 + Math.random() * 3}px`;
                line.style.transform = `rotate(${angle}deg)`;

                lightningContainer.appendChild(line);

                line.animate([
                    { opacity: 1 },
                    { opacity: 0 }
                ], {
                    duration: 200 + Math.random() * 200,
                    easing: 'ease-out'
                });

                setTimeout(() => line.remove(), 400);
            }
        }
    }

    // 各ボタンのクリックイベント
    if (btnCult) {
        btnCult.addEventListener('click', () => {
            if (btnCult.classList.contains('disabled')) return;
            btnCult.classList.add('disabled');
            
            triggerLightningEffect();
            addLog(">> 邪教『闇の使徒』の本部に突入完了。", "sys-msg");
            addLog(">> ダークン: 「常闇って何？ 私のこと？」", "sys-msg");
            addLog(">> トルシェの凄腕交渉＆乗っ取り：成功！", "progress-msg");
            addLog(">> 信徒1,200名が女神ダークンの信仰に鞍替えしました。", "progress-msg");
            
            updateProgress(20);
            checkCompletion();
        });
    }

    if (btnGuild) {
        btnGuild.addEventListener('click', () => {
            if (btnGuild.classList.contains('disabled')) return;
            btnGuild.classList.add('disabled');
            
            triggerLightningEffect();
            addLog(">> 王都魔術師ギルド本部ビルの蹂躙を開始。", "sys-msg");
            addLog(">> アズランの一撃により、防衛魔法結界ごとギルドビルが半壊。", "sys-msg");
            addLog(">> ダークンの極大魔術に恐れをなし、ギルド長が傘下入りを直訴。", "progress-msg");
            addLog(">> +500,000 GOLD 及び魔道資源を獲得。", "progress-msg");
            
            updateProgress(25);
            checkCompletion();
        });
    }

    if (btnKingdom) {
        btnKingdom.addEventListener('click', () => {
            if (btnKingdom.classList.contains('disabled')) return;
            btnKingdom.classList.add('disabled');
            
            triggerLightningEffect();
            addLog(">> 敵国ハイデン軍の主力30,000と平原にて激突。", "sys-msg");
            addLog(">> ダークン: 「めんどくさいから一発でいい？」", "sys-msg");
            addLog(">> 広域深淵魔術「アビス・ディザスター」発動。", "sys-msg");
            addLog(">> ハイデン軍は一瞬にして漆黒の霧と消え失せました。", "progress-msg");
            addLog(">> +2,000,000 GOLD 相当の戦利品を獲得。", "progress-msg");
            
            updateProgress(40);
            checkCompletion();
        });
    }

    function checkCompletion() {
        if (progress >= 100) {
            setTimeout(() => {
                triggerLightningEffect();
                setTimeout(triggerLightningEffect, 150);
                addLog(">> ================================================", "victory-msg");
                addLog(">> [VICTORY] 『常闇の大神殿』が王都の中心部に建立されました！", "victory-msg");
                addLog(">> ダークン: 「わーい！これで毎日美味しいお酒が飲めるね！」", "victory-msg");
                addLog(">> ================================================", "victory-msg");
            }, 500);
        }
    }
});
