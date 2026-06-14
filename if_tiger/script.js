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

    // 2. 砂塵パーティクル演出
    const sandContainer = document.getElementById('sand-container');
    if (sandContainer) {
        const particleCount = 25;
        const width = window.innerWidth;
        const height = window.innerHeight;

        for (let i = 0; i < particleCount; i++) {
            createParticle();
        }

        function createParticle() {
            const grain = document.createElement('div');
            grain.className = 'sand-grain';
            
            const startX = Math.random() * width;
            const startY = height + 10;
            const size = 1 + Math.random() * 4;
            
            grain.style.left = `${startX}px`;
            grain.style.top = `${startY}px`;
            grain.style.width = `${size}px`;
            grain.style.height = `${size}px`;
            
            sandContainer.appendChild(grain);

            // 上向きのゆったりした浮遊アニメーション
            const duration = 4000 + Math.random() * 6000;
            const driftX = (Math.random() - 0.5) * 100;

            const anim = grain.animate([
                { transform: 'translate(0, 0)', opacity: 0 },
                { opacity: 0.6, offset: 0.2 },
                { transform: `translate(${driftX}px, -${height + 50}px)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'linear'
            });

            anim.onfinish = () => {
                grain.remove();
                createParticle();
            };
        }
    }

    // 3. 砂化能力バトルコンソール
    const btnGaze = document.getElementById('btn-gaze-action');
    const btnGouge = document.getElementById('btn-gouge-action');
    const enemyStatus = document.getElementById('enemy-status');
    const combatFlow = document.getElementById('combat-flow');
    const exposureBar = document.getElementById('exposure-bar');
    const exposureTxt = document.getElementById('exposure-txt');

    if (btnGaze && btnGouge && enemyStatus && combatFlow) {
        // Gaze button click
        btnGaze.addEventListener('click', () => {
            if (btnGaze.classList.contains('disabled')) return;
            btnGaze.classList.add('disabled');

            // 画面の軽微な揺れ
            document.body.classList.add('screen-vibrate');
            setTimeout(() => {
                document.body.classList.remove('screen-vibrate');
            }, 300);

            // ログ追加
            addLog(">> 睦理：魔獣の右眼と四肢に視線を集中。", 'sys-msg');
            addLog(">> [能力発動] 視覚情報の砂化処理を開始します。", 'sand-alert', 200);
            addLog(">> 魔獣の右眼と前脚の先端が砂（ゴールドダスト）へと崩落！", 'sand-alert', 400);
            addLog(">> 魔獣：機動力を喪失。苦悶の咆哮を上げつつ転倒。", 'sys-msg', 600);

            setTimeout(() => {
                enemyStatus.textContent = "PARTIALLY SANDIFIED (部分砂化・行動不能)";
                enemyStatus.className = "target-status text-gold";
                
                // 次のボタンを有効化
                btnGouge.classList.remove('disabled');
            }, 600);
        });

        // Gouge button click
        btnGouge.addEventListener('click', () => {
            if (btnGouge.classList.contains('disabled')) return;
            btnGouge.classList.add('disabled');

            // 画面の大きな揺れ
            document.body.classList.add('screen-vibrate');
            setTimeout(() => {
                document.body.classList.remove('screen-vibrate');
            }, 600);

            addLog(">> 睦理：魔獣の上に馬乗りになり、右眼の眼窩へ直接手を突っ込みます。", 'sys-msg');
            addLog(">> 睦理: 「うるさい。消えてよ」", 'sys-msg', 200);
            addLog(">> [能力発動] 脳髄の直接砂化処理。", 'sand-fatal', 400);
            addLog(">> 魔獣の頭部から脳内組織がサラサラとした金砂になり流出。", 'sand-fatal', 600);
            addLog(">> 魔獣：完全消滅を確認。", 'sand-fatal', 800);

            setTimeout(() => {
                enemyStatus.textContent = "COMPLETELY CRUSHED (完全消滅)";
                enemyStatus.className = "target-status text-red";

                // 正体発覚の危機！
                if (exposureBar && exposureTxt) {
                    exposureBar.style.width = '90%';
                    exposureTxt.textContent = '90% (正体発覚の危機！)';
                    
                    addLog(">> ================================================", 'sand-fatal', 1000);
                    addLog(">> 浜井: 「お前……一体何なんだ？」 (冒険者達がドン引き)", 'sys-msg', 1200);
                    addLog(">> 田橋: 「あいつ、素手で魔獣を瞬殺しやがったぞ……」", 'sys-msg', 1400);
                    addLog(">> [WARNING] EXPOSURE RISK LEVEL: CRITICAL (異常性が周知されました)", 'sand-fatal', 1600);
                    addLog(">> ================================================", 'sand-fatal', 1800);
                }
            }, 800);
        });
    }

    function addLog(text, type, delay = 0) {
        setTimeout(() => {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = text;
            combatFlow.appendChild(p);
            combatFlow.scrollTop = combatFlow.scrollHeight;
        }, delay);
    }
});
