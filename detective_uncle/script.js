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

    // 2. 凄みの覇気トグル ＆ 滝汗演出
    const toggleAura = document.getElementById('toggle-aura');
    const awePct = document.getElementById('awe-pct');
    const sweatContainer = document.getElementById('sweat-container');
    const scanFlow = document.getElementById('scan-flow');

    let sweatInterval = null;

    if (toggleAura && awePct && sweatContainer && scanFlow) {
        toggleAura.addEventListener('change', () => {
            if (toggleAura.checked) {
                // 覇気発動
                awePct.textContent = '999% (ドラゴン誤認)';
                awePct.className = 'text-pink';

                addLog(">> [AURA] 凄みの覇気が最大出力で発動！", 'scan-alert');
                addLog(">> ヨーゼフ: 「この神々しくも禍々しい重圧……やはり人に化けたドラゴンだ！」", 'scan-funny', 200);
                addLog(">> ハバムー: 「我々を値踏みしているのか……冷や汗が止まらん！」", 'scan-funny', 400);

                // 滝汗エフェクトの開始
                sweatInterval = setInterval(() => {
                    spawnSweatDrop();
                }, 150);
            } else {
                // 覇気解除
                awePct.textContent = '0%';
                awePct.className = 'text-muted';

                addLog(">> [AURA] 凄みの覇気が沈静化。", 'sys-msg');
                addLog(">> ヨーゼフ: 「……ふう、覇気を収められたか。死ぬかと思った……」", 'scan-funny', 200);

                // 滝汗停止
                clearInterval(sweatInterval);
            }
        });
    }

    function spawnSweatDrop() {
        if (!sweatContainer) return;
        const drop = document.createElement('div');
        drop.className = 'sweat-drop';
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * (window.innerHeight / 2); // 画面上半分から
        const sizeWidth = 4 + Math.random() * 6;
        const sizeHeight = 8 + Math.random() * 10;

        drop.style.left = `${startX}px`;
        drop.style.top = `${startY}px`;
        drop.style.width = `${sizeWidth}px`;
        drop.style.height = `${sizeHeight}px`;

        sweatContainer.appendChild(drop);

        setTimeout(() => {
            drop.remove();
        }, 1000);
    }

    // 3. 能力値測定器コンソール
    const btnScan = document.getElementById('btn-start-scan');
    const btnSplit = document.getElementById('btn-split-log');
    
    const magicVal = document.getElementById('magic-val');
    const physVal = document.getElementById('phys-val');
    const knowVal = document.getElementById('know-val');

    if (btnScan && btnSplit && magicVal && physVal && knowVal) {
        btnScan.addEventListener('click', () => {
            if (btnScan.classList.contains('disabled')) return;
            btnScan.classList.add('disabled');
            btnScan.innerHTML = `<i class="fa-solid fa-sync fa-spin"></i> SCANNING...`;

            addLog(">> [SCAN] 能力測定魔法陣と同期完了。測定光線照射。", 'sys-msg', 0);
            addLog(">> ラランフォード・パイ: 「まさしさん、そのままじっとしてて」", 'sys-msg', 200);
            addLog(">> [WARNING] システムエラー：数値が検出されません。", 'scan-alert', 500);

            setTimeout(() => {
                magicVal.textContent = "0";
                magicVal.style.color = "#ef4444";
                physVal.textContent = "0";
                physVal.style.color = "#ef4444";
                knowVal.textContent = "0";
                knowVal.style.color = "#ef4444";

                addLog(">> [RESULT] 魔力：0 // 身体能力：0 // 知識力：0", 'scan-alert');
                addLog(">> [RESULT] 探偵力：測定不能 // 持病：四十肩・切れ痔活性化", 'scan-alert', 200);
                addLog(">> パイ: 「嘘でしょ……すべて0！？ 逆にどうやって生きてるの！？」", 'scan-funny', 400);

                btnScan.innerHTML = `<i class="fa-solid fa-circle-check"></i> SCAN COMPLETED`;
                btnSplit.classList.remove('disabled');
            }, 800);
        });

        btnSplit.addEventListener('click', () => {
            if (btnSplit.classList.contains('disabled')) return;
            btnSplit.classList.add('disabled');

            document.body.classList.add('screen-shake');
            setTimeout(() => {
                document.body.classList.remove('screen-shake');
            }, 600);

            addLog(">> パイ: 「では物理テストです。その大剣で目の前の丸太を両断してください」", 'sys-msg', 0);
            addLog(">> 権蔵まさし: 「フッ、いいだろう……（四十肩で肩から上が上がらねえ！）」", 'sys-msg', 200);
            addLog(">> 権蔵まさし：横振りで丸太に突撃！ 大剣を横薙ぎに叩きつけます！", 'sys-msg', 400);
            addLog(">> [BATTLE] カキィィィン！丸太の圧倒的硬さに大剣が弾き返される！", 'scan-alert', 600);
            addLog(">> [ALERT] 弾け飛んだ大剣が空中で大回転し、まさしのお尻に垂直落下！", 'scan-alert', 800);
            addLog(">> 権蔵まさし：剣がお尻（ちょうど二つに割れている部分）に突き刺さる！", 'scan-fatal', 1000);
            addLog(">> [FATAL] 権蔵まさし：大出血！ 切れ痔レベルが限界突破！", 'scan-fatal', 1200);
            addLog(">> パイ: 「ギャーー！何やってるんですかおじさん！！」", 'scan-funny', 1400);
        });
    }

    function addLog(text, type, delay = 0) {
        setTimeout(() => {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = text;
            scanFlow.appendChild(p);
            scanFlow.scrollTop = scanFlow.scrollHeight;
        }, delay);
    }
});
