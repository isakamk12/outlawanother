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

    // 2. 錯金琉璃の術・怪異処理コンソール
    const btnCast = document.getElementById('btn-cast-ruri');
    const lifeBar = document.getElementById('life-bar');
    const lifeTxt = document.getElementById('life-txt');
    const targetName = document.getElementById('target-name');
    const consoleFlow = document.getElementById('console-flow');
    const crackOverlay = document.getElementById('crack-overlay');

    let anomalyIndex = 0;
    let life = 45;

    const anomalies = [
        { name: "忘憂閣地下：重装不死兵「血俑」の群れ", code: 1 },
        { name: "大魏の経済を侵食する「国庫の赤字鬼」", code: 2 },
        { name: "大魏帝国国師：李泌（最終決戦）", code: 3 },
        { name: "全怪異処理完了（定時退社）", code: 4 }
    ];

    if (btnCast && consoleFlow && crackOverlay) {
        btnCast.addEventListener('click', () => {
            if (btnCast.classList.contains('disabled')) return;
            btnCast.classList.add('disabled');

            // 1. ひび割れ＆揺れエフェクト
            crackOverlay.classList.add('cracked');
            document.body.classList.add('screen-vibrate');

            setTimeout(() => {
                crackOverlay.classList.remove('cracked');
                document.body.classList.remove('screen-vibrate');
            }, 600);

            // 2. 寿命減少
            let lifeCost = 0;
            if (anomalyIndex === 0) lifeCost = 13; // 45 -> 32
            else if (anomalyIndex === 1) lifeCost = 14; // 32 -> 18
            else if (anomalyIndex === 2) lifeCost = 13; // 18 -> 5
            else if (anomalyIndex === 3) lifeCost = 4;  // 5 -> 1

            life = Math.max(1, life - lifeCost);
            if (lifeBar) lifeBar.style.width = `${life}%`;
            if (lifeTxt) lifeTxt.textContent = `${life}%`;

            // 3. ログ出力
            simulateAnomalyCast(anomalyIndex);

            // 4. 次の怪異へ移行
            setTimeout(() => {
                if (anomalyIndex < anomalies.length) {
                    targetName.textContent = anomalies[anomalyIndex].name;
                    anomalyIndex++;
                    
                    if (anomalyIndex < anomalies.length + 1) {
                        btnCast.classList.remove('disabled');
                    }
                    if (anomalyIndex === 4) {
                        btnCast.innerHTML = `<i class="fa-solid fa-house-user"></i> 定時退社（怪異処理完了）`;
                        btnCast.classList.add('disabled');
                    }
                }
            }, 1500);
        });
    }

    function addLog(text, type = 'sys-msg', delay = 0) {
        setTimeout(() => {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = text;
            consoleFlow.appendChild(p);
            consoleFlow.scrollTop = consoleFlow.scrollHeight;
        }, delay);
    }

    function simulateAnomalyCast(index) {
        if (index === 0) {
            // 太歳肉芝戦
            addLog(">> [PM LOG] 穢物「太歳肉芝」の処理を開始。", "sys-msg", 0);
            addLog(">> 謝必安: 「予算と残業代が出ないので、さっさとガラスに変えます」", "sys-msg", 200);
            addLog(">> 錯金琉璃の術 発動。琥珀色の極光が怪異を包み込みます。", "ruri-success", 400);
            addLog(">> 沈無: 「百辟喪門刀」による追撃、ガラス化した肉塊を完全粉砕！", "shen-slash", 600);
            addLog(">> 銜蟬（デブ猫）が巨大化し、破片をすべて丸呑み（クリーンアップ完了）。", "sys-msg", 800);
            addLog(">> 謝必安の寿命が減少しました (-13%)。", "sys-msg", 1000);
        } else if (index === 1) {
            // 不死兵「血俑」戦
            addLog(">> [PM LOG] 不死身の重装兵「血俑」の群れを検出。", "sys-msg", 0);
            addLog(">> 謝必安: 「物理ファイアウォール（沈無）、前線維持を頼む！」", "sys-msg", 200);
            addLog(">> 錯金琉璃発動。血俑の鋼鉄の鎧が脆い琉璃ガラスに変質！", "ruri-success", 400);
            addLog(">> 沈無の斬撃が炸裂、ガラスの鎧ごと血俑を一瞬で粉砕。", "shen-slash", 600);
            addLog(">> 阿奴が氷の霊気で残党の穢れを浄化封印。", "sys-msg", 800);
            addLog(">> 謝必安の寿命が減少しました (-14%)。", "sys-msg", 1000);
        } else if (index === 2) {
            // 国庫の赤字鬼
            addLog(">> [PM LOG] 財政破綻怪異「国庫の赤字鬼」と遭遇。", "sys-msg", 0);
            addLog(">> 謝必安: 「こいつはまさにうちの科の予算不足の権化だ！」", "sys-msg", 200);
            addLog(">> 錯金琉璃により、赤字鬼の資産差押え（琉璃ガラス封印）成功。", "ruri-success", 400);
            addLog(">> 蘇小小: 「必安、金繕い代金（利子込み）の返済期限よ？」", "sys-msg", 600);
            addLog(">> 謝必安: 「げっ。借金がさらに100万両増えた……」", "sys-msg", 800);
            addLog(">> 謝必安の寿命が減少しました (-13%)。", "sys-msg", 1000);
        } else if (index === 3) {
            // 国師・李泌（最終決戦）
            addLog(">> [PM LOG] 最終フェーズ：国師・李泌との決戦。", "sys-msg", 0);
            addLog(">> 謝知微が自らの血で「地獄の百鬼」を召喚、国師を喰い千切る！", "sys-msg", 200);
            addLog(">> 八牛弩（巨大攻城兵器）が国師を青銅柱に釘付け！", "sys-msg", 400);
            addLog(">> 狂僧・普渡が黄金の髑髏の巨腕となって空から現れ、国師を平手打ち！", "shen-slash", 600);
            addLog(">> 国師・李泌、物理的に粉砕・消滅。大魏帝国の陣法崩壊。", "ruri-success", 800);
            addLog(">> 謝必安: 「定時だ……俺は帰るぞ……」", "sys-msg", 1000);
            addLog(">> [SYSTEM] すべての怪異が処理され、謝必安は無事退社しました（残ライフ：1%）", "ruri-success", 1200);
        }
    }
});
