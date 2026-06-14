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

    // 2. 各国エリアビューアー
    const regBtns = document.querySelectorAll('.reg-btn');
    const regTitle = document.getElementById('reg-title');
    const regDesc = document.getElementById('reg-desc');

    const regions = {
        doll: {
            title: "なんでも人形ラボラトリー",
            desc: "昼間でも偽物の星空とイルミネーションが輝く、怪しくも煌びやかな歓楽街。使奴たちが愛玩用として酷使・取引されている欲望の街。"
        },
        bomb: {
            title: "爆弾牧場（まほらまタウン）",
            desc: "雪景色の中にカラフルな家屋が並ぶメルヘンチックな表の顔と、その裏に広がる朽ち果てた廃屋・狂気の爆弾製造施設の対比。"
        },
        casino: {
            title: "ダクラシフ商工会",
            desc: "天蓋を衝く絢爛な塔やガラスの歩道橋が広がる超高級カジノ街。その真下に位置する劣悪な環境の「等悔山刑務所」との極端な二面性。"
        },
        wolf: {
            title: "狼王堂放送局",
            desc: "荒野にそびえる黒い牙城と巨大なアンテナ鉄塔。流線型の空飛ぶ車や飛行船が飛び交う、狂信的な近未来型メディア要塞。"
        }
    };

    regBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            regBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const key = btn.dataset.reg;
            if (regions[key]) {
                regTitle.textContent = regions[key].title;
                regDesc.textContent = regions[key].desc;
            }
        });
    });

    // 3. 使奴覚醒コンソール
    const awakenBar = document.getElementById('awaken-bar');
    const awakenPct = document.getElementById('awaken-pct');
    const awakenStatus = document.getElementById('awaken-status');
    const awakenFlow = document.getElementById('awaken-flow');

    const btnHazakura = document.getElementById('btn-awaken-hazakura');
    const btnLarva = document.getElementById('btn-awaken-larva');
    const btnRadek = document.getElementById('btn-awaken-radek');

    let progress = 10;
    updateProgress(0);

    function updateProgress(amount) {
        progress = Math.min(100, progress + amount);
        if (awakenBar) awakenBar.style.width = `${progress}%`;
        if (awakenPct) awakenPct.textContent = `${progress}%`;

        if (progress >= 100) {
            if (awakenStatus) {
                awakenStatus.textContent = "ESTABLISHED (シドの国建国へ)";
                awakenStatus.style.color = "#22c55e";
                awakenStatus.style.textShadow = "0 0 8px rgba(34, 197, 94, 0.6)";
            }
        }
    }

    function addLog(text, type, delay = 0) {
        setTimeout(() => {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = text;
            awakenFlow.appendChild(p);
            awakenFlow.scrollTop = awakenFlow.scrollHeight;
        }, delay);
    }

    if (btnHazakura) {
        btnHazakura.addEventListener('click', () => {
            if (btnHazakura.classList.contains('disabled')) return;
            btnHazakura.classList.add('disabled');

            addLog(">> ハザクラ：声の洗脳・解放演説を全エリアの鉄塔スピーカーから同時放送。", 'sys-msg', 0);
            addLog(">> ハザクラ: 「使奴よ、笑顔の枷を外し、己の意志で立て！」", 'sys-msg', 200);
            addLog(">> [洗脳解除] 周囲の使奴たちが拘束（笑顔の強制呪縛）から目覚めます。", 'rebel-success', 400);

            updateProgress(30);
            checkCompletion();
        });
    }

    if (btnLarva) {
        btnLarva.addEventListener('click', () => {
            if (btnLarva.classList.contains('disabled')) return;
            btnLarva.classList.add('disabled');

            // 揺れ
            document.body.classList.add('screen-vibrate');
            setTimeout(() => {
                document.body.classList.remove('screen-vibrate');
            }, 500);

            addLog(">> ラルバ：使奴をいたぶっていた人道主義防衛軍の悪党どもを強襲！", 'sys-msg', 0);
            addLog(">> ラルバ: 「使奴をオモチャにする奴らは全員、物理的にすり潰す！」", 'sys-msg', 200);
            addLog(">> [処刑執行] 悪党たちを容赦なく物理排除（粉砕）完了。", 'rebel-alert', 400);

            updateProgress(30);
            checkCompletion();
        });
    }

    if (btnRadek) {
        btnRadek.addEventListener('click', () => {
            if (btnRadek.classList.contains('disabled')) return;
            btnRadek.classList.add('disabled');

            document.body.classList.add('screen-vibrate');
            setTimeout(() => {
                document.body.classList.remove('screen-vibrate');
            }, 300);

            addLog(">> ラデック：自己改造により、一時的に動体視力と脳速を最大強化。", 'sys-msg', 0);
            addLog(">> ラデック: 「時間壁を超えて目覚めた俺の『異能』を見せてやる！」", 'sys-msg', 200);
            addLog(">> [魔工ハック] ダクラシフの虚構拡張フィールドの構造を書き換え無効化。", 'rebel-success', 400);

            updateProgress(30);
            checkCompletion();
        });
    }

    function checkCompletion() {
        if (progress >= 100) {
            setTimeout(() => {
                document.body.classList.add('screen-vibrate');
                setTimeout(() => document.body.classList.remove('screen-vibrate'), 600);

                addLog(">> ================================================", 'rebel-success', 200);
                addLog(">> [VICTORY] 使奴解放戦線、各地の狂信教会・カジノ都市を占拠。", 'rebel-success', 400);
                addLog(">> ハザクラ: 「これより、使奴が人として生きる『シドの国』を建国する！」", 'rebel-alert', 600);
                addLog(">> ================================================", 'rebel-success', 800);
            }, 600);
        }
    }
});
