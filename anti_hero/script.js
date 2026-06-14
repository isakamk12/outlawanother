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

    // 2. バトルログ切り替えタブ
    const battleTabs = document.querySelectorAll('#battle-tabs .b-tab');
    const battlePanes = document.querySelectorAll('#battle-contents .battle-pane');

    battleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            battleTabs.forEach(t => t.classList.remove('active'));
            battlePanes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            // データ属性の余計なスペースをトリムして処理する
            const battleId = tab.dataset.battle.trim();
            const targetPane = document.getElementById(`battle-${battleId}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // 3. 殺意の渇き (KILL LUST) インタラクティブ演出
    const lustTrigger = document.getElementById('lust-trigger-area');
    const lustBar = document.getElementById('lust-bar');
    const lustStatus = document.getElementById('lust-status');
    const bloodLayer = document.getElementById('blood-spatter-layer');

    let isCooldown = false;

    if (lustTrigger && lustBar && lustStatus && bloodLayer) {
        // 初期状態として95%へ
        setTimeout(() => {
            lustBar.style.width = '95%';
        }, 150);

        lustTrigger.addEventListener('click', (e) => {
            if (isCooldown) return;
            isCooldown = true;

            // 1. 血飛沫スプラッター演出の生成
            const rect = lustTrigger.getBoundingClientRect();
            // クリック位置（画面全体の絶対位置）
            const clickX = e.clientX;
            const clickY = e.clientY;

            for (let i = 0; i < 15; i++) {
                const drop = document.createElement('div');
                drop.className = 'blood-drop';
                
                // ランダムな飛び散り方向と距離
                const angle = Math.random() * Math.PI * 2;
                const distance = 40 + Math.random() * 120;
                const targetX = clickX + Math.cos(angle) * distance;
                const targetY = clickY + Math.sin(angle) * distance;
                
                // 初期位置をクリック位置に設定
                drop.style.left = `${clickX}px`;
                drop.style.top = `${clickY}px`;
                
                // ランダムな大きさ
                const size = 10 + Math.random() * 25;
                drop.style.width = `${size}px`;
                drop.style.height = `${size}px`;

                bloodLayer.appendChild(drop);

                // アニメーション設定
                drop.animate([
                    { transform: 'translate(0, 0) scale(0.5)', opacity: 1 },
                    { transform: `translate(${targetX - clickX}px, ${targetY - clickY + 80}px) scale(1.2)`, opacity: 0 }
                ], {
                    duration: 1000 + Math.random() * 500,
                    easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
                    fill: 'forwards'
                });

                // クリーンアップ
                setTimeout(() => {
                    drop.remove();
                }, 1500);
            }

            // 2. 渇き度メーターのリセット
            lustBar.style.width = '0%';
            lustStatus.textContent = 'SATISFIED (一時的充足)';
            lustStatus.className = 'text-muted'; // 色を落ち着かせる
            
            // 3. 徐々に渇きが戻るアニメーション (3秒)
            setTimeout(() => {
                lustStatus.textContent = 'RE-AROUSING (殺意再燃中...)';
                lustStatus.style.color = '#eab308'; // 黄色警告色

                // メーターを徐々に上昇
                let percent = 0;
                const interval = setInterval(() => {
                    percent += 5;
                    lustBar.style.width = `${percent}%`;
                    if (percent >= 95) {
                        clearInterval(interval);
                        lustStatus.textContent = 'CRITICAL ARUSAL';
                        lustStatus.className = 'text-red'; // 赤に復帰
                        isCooldown = false;
                    }
                }, 100);
            }, 1000);
        });
    }
});
