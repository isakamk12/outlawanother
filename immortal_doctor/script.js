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

    // 2. ターミナルログ操作ユーティリティ
    const terminalLogs = document.getElementById('terminal-logs');

    function addLog(text, type = 'system') {
        if (!terminalLogs) return;
        const line = document.createElement('div');
        line.className = `log-line ${type}-msg`;
        line.innerHTML = text;
        terminalLogs.appendChild(line);
        // 最下部にスクロール
        terminalLogs.scrollTop = terminalLogs.scrollHeight;
    }

    // 3. 自殺＆自動蘇生シミュレータ
    const btnSuicide = document.getElementById('btn-suicide');
    const hpBar = document.getElementById('hp-bar');
    const hpText = document.getElementById('hp-text');
    const vitalStatus = document.getElementById('vital-status');
    const deathOverlay = document.getElementById('death-overlay');
    const toxicAttacks = document.querySelectorAll('.btn-toxic-attack');

    if (btnSuicide && hpBar && hpText && vitalStatus && deathOverlay) {
        btnSuicide.addEventListener('click', () => {
            // ボタンや他の操作を一時無効化
            btnSuicide.disabled = true;
            toxicAttacks.forEach(btn => btn.disabled = true);

            // 画面強振動
            document.body.classList.add('screen-vibrate');
            setTimeout(() => {
                document.body.classList.remove('screen-vibrate');
            }, 300);

            // バイタル停止（死亡状態）
            hpBar.style.width = '0%';
            hpBar.className = 'gauge-fill bg-red';
            hpText.textContent = '0% (DEAD)';
            vitalStatus.textContent = 'DEAD (心停止・生命反応消失)';
            vitalStatus.className = 'text-muted';

            // 死亡画面オーバーレイ表示
            deathOverlay.classList.add('active');

            // ログ書き出し
            addLog('>> [自傷] 首元を切り裂き、あるいは心臓に毒針を刺すも、傷口から常緑の光が溢れ出す。', 'suicide');
            addLog('>> [警告] 致命傷の自動修復プロセスが強制開始されました。', 'suicide');

            // 1.5秒後に蘇生
            setTimeout(() => {
                // オーバーレイ非表示
                deathOverlay.classList.remove('active');

                // 画面復元
                hpBar.style.width = '100%';
                hpBar.className = 'gauge-fill bg-toxic';
                hpText.textContent = '100% (ALIVE)';
                vitalStatus.textContent = 'ALIVE (蘇生完了 / 死ねなかった男)';
                vitalStatus.className = 'text-toxic';

                // 蘇生ログ
                addLog('>> [再生] 心拍再開。肺機能復旧。細胞分裂を極限加速し全組織を完全修元。', 'revive');
                addLog('>> [独白] 「また死ねなかったか……おばあちゃん、ボクはどうして死ねないの？」', 'revive');

                // 操作有効化
                btnSuicide.disabled = false;
                toxicAttacks.forEach(btn => btn.disabled = false);
            }, 1800);
        });
    }

    // 4. 広域毒魔法発動
    const toxicOverlay = document.getElementById('toxic-overlay');

    if (toxicAttacks && toxicOverlay) {
        toxicAttacks.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;
                
                // ボタンの無効化
                btnSuicide.disabled = true;
                toxicAttacks.forEach(b => b.disabled = true);

                // 毒霧オーバーレイ有効化
                toxicOverlay.classList.add('active');

                // 画面振動
                document.body.classList.add('screen-vibrate');
                setTimeout(() => {
                    document.body.classList.remove('screen-vibrate');
                }, 500);

                // ログ開始
                addLog('>> ロビン：広域毒魔法の詠唱を開始。', 'toxic');
                addLog('>> 魔力測定限界値を突破。超高濃度・致死性『常緑の霧（アッシド・グリーン・ネビュラ）』を展開。', 'toxic');

                setTimeout(() => {
                    if (target === 'fairy') {
                        addLog('>> [戦闘ログ] 妖精の集落が毒霧に包まれます。', 'toxic');
                        addLog('>> 敵対勢力（妖精）：呼吸困難、粘膜融解、魔力暴走。防壁および巨木ごとドロドロに溶解。', 'toxic');
                        addLog('>> シャノワ：「これでは王都へ強制送還（送還命令）されるのも無理はありませんね……」', 'system');
                    } else if (target === 'orc') {
                        addLog('>> [戦闘ログ] オークの城砦が毒霧に包まれます。', 'toxic');
                        addLog('>> 敵対勢力（オーク）：頑強な石壁ごと腐食。数千の生存反応が完全に消失。', 'toxic');
                        addLog('>> ハンナ：「ロビン、またやりすぎよ！加減って言葉を知らないの！？」', 'system');
                    }
                    addLog('>> ロビン：「ボクはただ、ボクを殺せるほど強い奴を探しに来ただけなんだけどな……」', 'revive');
                }, 1200);

                // 3秒後に終了
                setTimeout(() => {
                    toxicOverlay.classList.remove('active');
                    
                    // 操作有効化
                    btnSuicide.disabled = false;
                    toxicAttacks.forEach(b => b.disabled = false);
                }, 3500);
            });
        });
    }
});
