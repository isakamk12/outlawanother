document.addEventListener('DOMContentLoaded', () => {
    // 1. キャラクター切り替え
    const charButtons = document.querySelectorAll('#char-tab-list .char-btn');
    const charPanes = document.querySelectorAll('#char-content .char-pane');

    charButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            charButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetChar = btn.getAttribute('data-char');
            charPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `pane-${targetChar}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // 2. ベストバウト切り替え
    const battleButtons = document.querySelectorAll('#battle-tabs .b-tab');
    const battlePanes = document.querySelectorAll('#battle-contents .battle-pane');

    battleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            battleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetBattle = btn.getAttribute('data-battle');
            battlePanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `battle-${targetBattle}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // 3. 無限カーリン稼ぎ模擬戦ループ・シミュレータ
    const logContainer = document.getElementById('karlin-loop-log');
    const levelDisplay = document.getElementById('daichi-level');
    const toggleBtn = document.getElementById('btn-loop-toggle');
    const glitchOverlay = document.querySelector('.screen-glitch-overlay');
    const footerRetry = document.getElementById('footer-retry');

    let currentLvl = 115; // 模擬戦時点の初期超高レベル
    let loopActive = true;
    let loopTimer = null;
    let stepIndex = 0;
    let totalRetries = 9999;

    const logPhrases = [
        { text: "[EVENT] 模擬戦開始：遠征部隊長カーリン (Lv115) が現れた！", type: "sys" },
        { text: "カーリンがよそ見をした！", type: "normal" },
        { text: "ダイチの不意打ちドロップキック！", type: "atk" },
        { text: "カーリンに 256 ダメージ！(オーバーフロー)", type: "normal" },
        { text: "ダイチが詠唱中のカーリンに容赦なくマウントパンチ！", type: "atk" },
        { text: "カーリンが倒れた！", type: "normal" },
        { text: "[SYSTEM] 経験値 85,000 を獲得！", type: "sys" },
        { text: "[LEVEL UP] ダイチのレベルが 1 上昇！", type: "lvl" },
        { text: "[SYSTEM] カーリンの撃破によりイベントフラグ不整合が発生！", type: "sys" },
        { text: "[FATAL_BUG] クエスト進行不能。戦闘開始前まで強制巻き戻しを開始...", type: "sys" }
    ];

    function addLogLine(text, type) {
        if (!logContainer) return;
        
        const line = document.createElement('div');
        line.className = 'log-entry';
        
        if (type === 'atk') {
            line.innerHTML = `<span class="label">></span> <span class="atk">${text}</span>`;
        } else if (type === 'sys') {
            line.innerHTML = `<span class="label">></span> <span class="sys">${text}</span>`;
        } else if (type === 'lvl') {
            line.innerHTML = `<span class="label">></span> <span class="lvl">${text}</span>`;
        } else {
            line.innerHTML = `<span class="label">></span> <span>${text}</span>`;
        }
        
        logContainer.appendChild(line);
        
        // ログの数が10行を超えたら古いものを消す
        while (logContainer.children.length > 8) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }

    function runSimulationStep() {
        if (!loopActive) return;

        const currentStep = logPhrases[stepIndex];
        addLogLine(currentStep.text, currentStep.type);

        // レベルアップの演出
        if (currentStep.type === 'lvl') {
            currentLvl++;
            if (levelDisplay) {
                levelDisplay.textContent = currentLvl;
            }
        }

        // バグ巻き戻りの演出
        if (stepIndex === logPhrases.length - 1) {
            // 一瞬画面を赤く光らせる（バググリッチ）
            if (glitchOverlay) {
                glitchOverlay.style.opacity = '1';
                setTimeout(() => {
                    glitchOverlay.style.opacity = '0';
                }, 100);
            }
            // リトライ数を増やす
            totalRetries++;
            if (footerRetry) {
                footerRetry.textContent = totalRetries;
            }
            stepIndex = 0; // ループを最初に戻す
        } else {
            stepIndex++;
        }

        // 次のログ表示までの時間をステップ毎に少し変化させる
        let delay = 900;
        if (currentStep.type === 'atk') delay = 500;
        if (currentStep.type === 'lvl') delay = 1200;
        
        loopTimer = setTimeout(runSimulationStep, delay);
    }

    // ループ切り替えボタン
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            loopActive = !loopActive;
            if (loopActive) {
                toggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i> PAUSE_LOOP';
                runSimulationStep();
            } else {
                toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i> RESUME_LOOP';
                clearTimeout(loopTimer);
            }
        });
    }

    // 初回起動
    runSimulationStep();
});
