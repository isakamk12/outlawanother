document.addEventListener('DOMContentLoaded', () => {
    const themeWrapper = document.getElementById('theme-wrapper');
    const btnModeFront = document.getElementById('btn-mode-front');
    const btnModeBack = document.getElementById('btn-mode-back');

    // 1. ルート（表裏）切り替え
    if (btnModeFront && btnModeBack && themeWrapper) {
        btnModeFront.addEventListener('click', () => {
            if (themeWrapper.classList.contains('mode-front')) return;
            themeWrapper.className = 'mode-front';
            btnModeBack.classList.remove('active');
            btnModeFront.classList.add('active');

            // キャラクター表示の初期値としてオリバーを選択
            const oliverBtn = document.querySelector('.char-btn[data-char="oliver"]');
            if (oliverBtn) oliverBtn.click();
        });

        btnModeBack.addEventListener('click', () => {
            if (themeWrapper.classList.contains('mode-back')) return;
            themeWrapper.className = 'mode-back';
            btnModeFront.classList.remove('active');
            btnModeBack.classList.add('active');

            // キャラクター表示の初期値として父イワオを選択
            const iwaoBtn = document.querySelector('.char-btn[data-char="iwao"]');
            if (iwaoBtn) iwaoBtn.click();
        });
    }

    // 2. キャラクター切り替えタブ
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

    // 3. 表コンソール: ゴブリン集落殲滅シミュレーター
    const btnCastStart = document.getElementById('btn-cast-start');
    const castBar = document.getElementById('cast-bar');
    const castTxt = document.getElementById('cast-txt');
    const castTimer = document.getElementById('cast-timer');
    const frontFlow = document.getElementById('front-flow');

    if (btnCastStart && castBar && castTxt && frontFlow) {
        btnCastStart.addEventListener('click', () => {
            if (btnCastStart.classList.contains('disabled')) return;
            btnCastStart.classList.add('disabled');
            btnCastStart.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> CASTING SPELL...`;

            // タイマーカウントダウン演出 (模擬)
            let timeRemaining = 90.00;
            const timerInterval = setInterval(() => {
                timeRemaining = Math.max(0, timeRemaining - 2.5);
                castTimer.textContent = `${timeRemaining.toFixed(2)}s`;
                if (timeRemaining <= 0) clearInterval(timerInterval);
            }, 80);

            // ゲージ充填
            castBar.style.width = '100%';
            castTxt.textContent = '詠唱中...';

            const frontSteps = [
                { text: ">> [CAST] リリィ：極大魔法「ストーン・メテオ・シャワー」の詠唱を開始。(目標: 90秒)", type: 'sys-msg-f' },
                { text: ">> [TANK] オリバー：ヘイト大盾「グランドバンパー」発動。敵の視線を引き受けます。", type: 'log-combat' },
                { text: ">> [BATTLE] ゴブリン兵15体がオリバーに一斉突撃！", type: 'sys-msg-f' },
                { text: ">> [TANK] オリバーの堅牢な防御：ダメージ0 (完全無傷で攻撃を耐え忍びます)。", type: 'log-combat' },
                { text: ">> [CAST] リリィ：詠唱率 50% 突破...", type: 'sys-msg-f' },
                { text: ">> [CAST] リリィ：詠唱完了。「すべてを閉じ込め、砕け散りなさい！」", type: 'sys-msg-f' },
                { text: ">> [SPELL] 大規模土魔術「石壁ドーム」展開。ゴブリン達を退路のない空間に閉じ込め！", type: 'log-combat' },
                { text: ">> [SPELL] 続いて「石礫の雨」がドーム内に降り注ぎます！", type: 'log-combat' },
                { text: ">> [BATTLE] ゴブリン集落の完全殲滅を確認。作戦完了。", type: 'log-combat' }
            ];

            let delay = 300;
            frontSteps.forEach((step, idx) => {
                setTimeout(() => {
                    const p = document.createElement('p');
                    p.className = step.type;
                    p.textContent = step.text;
                    frontFlow.appendChild(p);
                    frontFlow.scrollTop = frontFlow.scrollHeight;

                    if (idx === frontSteps.length - 1) {
                        btnCastStart.innerHTML = `<i class="fa-solid fa-circle-check"></i> ANNIHILATION COMPLETED`;
                        castTxt.textContent = '発動完了 (CASTED)';
                    }
                }, delay);
                delay += (300 + Math.random() * 150);
            });
        });
    }

    // 4. 裏コンソール: 合法復讐執行
    const btnRevengeExec = document.getElementById('btn-revenge-exec');
    const revengeBar = document.getElementById('revenge-bar');
    const revengeTxt = document.getElementById('revenge-txt');
    const revengeStatus = document.getElementById('revenge-status');
    const backFlow = document.getElementById('back-flow');

    if (btnRevengeExec && revengeBar && revengeTxt && backFlow) {
        // 初期状態アニメーション (25%)
        setTimeout(() => {
            revengeBar.style.width = '25%';
        }, 300);

        btnRevengeExec.addEventListener('click', () => {
            if (btnRevengeExec.classList.contains('disabled')) return;
            btnRevengeExec.classList.add('disabled');
            btnRevengeExec.innerHTML = `<i class="fa-solid fa-scale-balanced fa-beat"></i> EXECUTING SANCTION...`;

            // 画面を暗く揺らす
            document.body.classList.add('screen-shake');
            setTimeout(() => {
                document.body.classList.remove('screen-shake');
            }, 600);

            // メーターを満タンへ
            revengeBar.style.width = '100%';
            revengeTxt.textContent = '100% (復讐完了)';
            if (revengeStatus) {
                revengeStatus.textContent = "COMPLETED (破滅執行済)";
                revengeStatus.style.color = "#ef5350";
            }

            const backSteps = [
                { text: ">> [LAW] アヤノ家天才頭脳ルイ：転生者コウタの戸籍・魔力悪用データを王室監査機関へハックリーク完了。", type: 'sys-msg-b' },
                { text: ">> [LAW] 鈴木幸多：チート不法改竄・詐取罪により「王家奴隷」に格下げ指定。", type: 'log-ruin' },
                { text: ">> [LABOUR] コウタ：強制労働処分（死ぬまで魔獣討伐の肉壁）の執行開始。", type: 'log-ruin' },
                { text: ">> [SOCIAL] 母ヘレナの貴族「奥様ネットワーク」包囲網が完成。", type: 'sys-msg-b' },
                { text: ">> [SOCIAL] オリビア：裏切りのレッテルを貼られ、社交界から完全追放＆実家ロッシ家を破産へ誘導。", type: 'log-ruin' },
                { text: ">> [STATUS] オリビア：貧民街の片隅で、ハジメの（偽装）死を悔いて後悔と絶望の日々へ。", type: 'log-ruin' },
                { text: ">> [SYSTEM] ALL TARGETS FULLY RUINED. LEGAL REVENGE SHUT DOWN.", type: 'sys-msg-b' }
            ];

            let delay = 300;
            backSteps.forEach((step, idx) => {
                setTimeout(() => {
                    const p = document.createElement('p');
                    p.className = step.type;
                    p.textContent = step.text;
                    backFlow.appendChild(p);
                    backFlow.scrollTop = backFlow.scrollHeight;

                    if (idx === backSteps.length - 1) {
                        btnRevengeExec.innerHTML = `<i class="fa-solid fa-circle-check"></i> ALL TARGETS CRUSHED`;
                    }
                }, delay);
                delay += (300 + Math.random() * 200);
            });
        });
    }
});
