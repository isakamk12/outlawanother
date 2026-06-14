document.addEventListener('DOMContentLoaded', () => {
    // 1. キャラクター切り替えタブ
    const charBtns = document.querySelectorAll('.char-btn');
    const charPanes = document.querySelectorAll('.char-pane');

    charBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // アクティブクラス解除
            charBtns.forEach(b => b.classList.remove('active'));
            charPanes.forEach(p => p.classList.remove('active'));

            // アクティブ付与
            btn.classList.add('active');
            const targetChar = btn.dataset.char;
            const targetPane = document.getElementById(`pane-${targetChar}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // 2. 基素メーターの初期アニメーション
    const gaugeBar = document.getElementById('gauge-bar');
    const gaugeTxt = document.getElementById('gauge-txt');

    setTimeout(() => {
        if (gaugeBar) {
            gaugeBar.style.width = '100%';
            
            // ゲージ充填完了後にエラーテキストを表示
            setTimeout(() => {
                if (gaugeTxt) {
                    gaugeTxt.classList.add('active');
                }
            }, 1000);
        }
    }, 300);

    // 3. アルト魔力解放 (WRATH) シミュレーション
    const btnActivate = document.getElementById('btn-activate-wrath');
    const terminalFlow = document.getElementById('battle-wrath-log');

    if (btnActivate && terminalFlow) {
        btnActivate.addEventListener('click', () => {
            if (btnActivate.classList.contains('disabled')) return;
            
            // ボタンを無効化
            btnActivate.classList.add('disabled');
            btnActivate.innerHTML = `<i class="fa-solid fa-sync fa-spin"></i> LIBERATING SOUL ENERGY...`;

            // 画面を一時的に揺らす
            document.body.classList.add('screen-shake');
            setTimeout(() => {
                document.body.classList.remove('screen-shake');
            }, 600);

            // ログの流し込み定義
            const logSteps = [
                { text: ">> [SYSTEM] DETECTING ALTO'S EMOTIONAL COLLAPSE (ANGER TRIGGER).", type: 'log-alert' },
                { text: ">> [SYSTEM] SOUL MAGIC-LIMITER: SHATTERED.", type: 'log-alert' },
                { text: ">> [ALERT] MAGIC FACTOR (基素): 999,999,999% OVERFLOW DETECTED.", type: 'log-alert' },
                { text: ">> アルト: 「僕の仲間（エステル）に触るな……！」", type: 'log-combat' },
                { text: ">> アルト: 極光魔法「ルクス・イン・テネブリス」及び極暗魔法「アイル・オブ・ディスペア」同時多重展開。", type: 'log-combat' },
                { text: ">> [BATTLE] 閃光と暗闇が戦場を呑み込みます。", type: 'log-init' },
                { text: ">> [DAMAGE] 紅いオーガ（グラノス）：消滅粉砕。", type: 'log-alert' },
                { text: ">> [DAMAGE] 敵魔族軍勢：99.99% 蒸発消滅。", type: 'log-alert' },
                { text: ">> [SUCCESS] 決死隊救出完了。全生存者を防衛魔法障壁（イージス）内に退避。", type: 'log-success' },
                { text: ">> エステル: 「私、アルトに相応しい女になる！」 (好意ゲージ限界突破)", type: 'log-success' },
                { text: ">> オリヴィア: 「これこそが私のアルト様…！」 (極大狂信の恍惚状態)", type: 'log-success' },
                { text: ">> イヴリス: 「あの方が私の全てです」 (独占欲求: Lv999)", type: 'log-success' },
                { text: ">> [SYSTEM] BATTLE ENGAGEMENT CONCLUDED. STATUS: VICTORY.", type: 'log-success' }
            ];

            let delay = 300;
            logSteps.forEach((step, idx) => {
                setTimeout(() => {
                    const p = document.createElement('p');
                    p.className = step.type;
                    p.textContent = step.text;
                    terminalFlow.appendChild(p);
                    // 一番下までスクロール
                    terminalFlow.scrollTop = terminalFlow.scrollHeight;

                    // 最後のログ出力が終わったらボタンを完了表示に
                    if (idx === logSteps.length - 1) {
                        btnActivate.innerHTML = `<i class="fa-solid fa-circle-check"></i> ALL ENEMIES EVAPORATED (敵軍消滅)`;
                    }
                }, delay);
                delay += (300 + Math.random() * 200); // リアルな表示ディレイ
            });
        });
    }
});
