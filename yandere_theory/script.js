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

    // 3. 降る灰エフェクト (動的粒子生成)
    const ashContainer = document.querySelector('.falling-ash');
    if (ashContainer) {
        const ashCount = 25;
        for (let i = 0; i < ashCount; i++) {
            createAshParticle();
        }
    }

    function createAshParticle() {
        if (!ashContainer) return;
        const particle = document.createElement('div');
        particle.className = 'ash-particle';
        
        const randomX = Math.random() * 100; // 0vw 〜 100vw
        const randomDelay = Math.random() * 8; // 0s 〜 8s
        const randomScale = Math.random() * 0.9 + 0.3; // 0.3 〜 1.2倍
        const randomDuration = Math.random() * 5 + 6; // 6s 〜 11s
        
        particle.style.left = `${randomX}vw`;
        particle.style.animationDelay = `${randomDelay}s`;
        particle.style.animationDuration = `${randomDuration}s`;
        particle.style.transform = `scale(${randomScale})`;
        
        ashContainer.appendChild(particle);
        
        particle.addEventListener('animationiteration', () => {
            particle.style.left = `${Math.random() * 100}vw`;
        });
    }

    // 4. 胃痛警告アラートポップアップ ＆ 胃薬減少ギミック
    const alertArea = document.getElementById('alert-popup-area');
    const ulcerDisplay = document.getElementById('ulcer-value');
    const medicineDisplay = document.getElementById('medicine-value');

    let stomachMedicineCount = 2;
    let baseUlcer = 98;

    // パラメータを小刻みに動かす
    setInterval(() => {
        const flux = (Math.random() * 2 - 1).toFixed(1); // -1.0% 〜 +1.0%
        let currentUlcer = Math.min(100, Math.max(90, baseUlcer + parseFloat(flux)));
        if (ulcerDisplay) {
            ulcerDisplay.textContent = `${currentUlcer.toFixed(1)}% (EXTREME)`;
        }
    }, 2000);

    const alertMessages = [
        { title: "GASTRIC_ULCER_WARNING", body: "胃潰瘍危険パラメータが98%を突破しました。速やかに胃薬を服用してください。" },
        { title: "YANDERE_APPROACHING", body: "セリアが裏庭で他の女の影を感知しました。抜刀音が近接しています。" },
        { title: "CULT_OVERFLOW", body: "エルリアがルーク教聖歌隊の規模をさらに拡大。領民の9割が狂信化完了。" },
        { title: "BIRD_CAGE_LOCKED", body: "イヴが領地の脱出経路を自動壁で封印。引きこもり要塞化率120%に到達。" },
        { title: "PRINCESS_DOJI_ALERT", body: "アリシア王女が毒入り紅茶に躓き、誤ってクソ王子の使者にぶちまけました。(善意と超解釈発動)" },
        { title: "HERO_MISUNDERSTANDING", body: "勇者アレンが『悪徳領主ルークめ、待っていろ！』と呟きました。ステルス護衛の追加配備が必要です。" }
    ];

    function triggerStomachAlert() {
        if (!alertArea) return;

        // ランダムな警告メッセージを選択
        const msg = alertMessages[Math.floor(Math.random() * alertMessages.length)];
        
        const card = document.createElement('div');
        card.className = 'ulcer-alert-card';
        card.innerHTML = `
            <div class="alert-title"><i class="fa-solid fa-skull"></i> ${msg.title}</div>
            <div class="alert-body">${msg.body}</div>
        `;
        
        alertArea.appendChild(card);
        
        // リフロー後に表示クラスを追加（アニメーション用）
        card.offsetHeight;
        card.classList.add('show');

        // 胃痛に耐えかねて薬を飲むジョーク
        if (msg.title === 'GASTRIC_ULCER_WARNING') {
            setTimeout(() => {
                if (stomachMedicineCount > 0) {
                    stomachMedicineCount--;
                    if (medicineDisplay) {
                        medicineDisplay.innerHTML = `残り <span style="font-size: 1.1rem; color: #ff3333;">${stomachMedicineCount}</span> 錠 (服用済)`;
                    }
                    baseUlcer -= 5; // 一時的に胃痛が和らぐ
                    addSystemLogEntry("ルークが胃薬を服用しました。胃痛値が少し和らぎました。");
                } else {
                    if (medicineDisplay) {
                        medicineDisplay.innerHTML = `<span class="blinking" style="color: #ff3333; font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> STOCK DEPLETED</span>`;
                    }
                    baseUlcer = 99.9; // 胃薬が切れて限界突破
                    addSystemLogEntry("警告：胃薬がありません！胃痛が最高潮に達しています！");
                }
            }, 1000);
        }

        // 3.5秒後にスライドアウトして消滅させる
        setTimeout(() => {
            card.classList.remove('show');
            setTimeout(() => {
                if (card.parentNode === alertArea) {
                    alertArea.removeChild(card);
                }
            }, 400);
        }, 3500);
    }

    // コンソール等へのジョークログ出力
    function addSystemLogEntry(msg) {
        console.warn(`[恩寵の簒奪システム] %c${msg}`, "color: #00bfff; font-weight: bold;");
    }

    // 初回トリガー（5秒後）と、その後15秒〜25秒おきの不定期アラート
    setTimeout(triggerStomachAlert, 4000);

    function scheduleNextAlert() {
        const delay = Math.random() * 10000 + 12000; // 12s 〜 22s
        setTimeout(() => {
            triggerStomachAlert();
            scheduleNextAlert();
        }, delay);
    }
    scheduleNextAlert();
});
