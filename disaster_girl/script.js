document.addEventListener('DOMContentLoaded', () => {
    // 1. キャラクターカルテ切り替え
    const charButtons = document.querySelectorAll('#char-list .char-selector-btn');
    const charPanes = document.querySelectorAll('#char-board .char-detail-pane');

    charButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            charButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const target = btn.getAttribute('data-target');
            charPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `pane-${target}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // 2. ベストバウト切り替え
    const boutButtons = document.querySelectorAll('#bout-tabs .bout-tab-btn');
    const boutPanes = document.querySelectorAll('#bout-contents .bout-pane');

    boutButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            boutButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetBout = btn.getAttribute('data-bout');
            boutPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `bout-${targetBout}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // 3. メタフィクション：テキストバグ・自動修復エフェクト
    // 特定の要素テキストを一時的にハック（文字化け）させ、数ミリ秒で復元する
    const glitchTargets = [
        { selector: '.disaster-header .novel-title', originalText: '厄災の魔法少女' },
        { selector: '.disaster-header .sub-alert-label', originalText: 'FILE NO. #DISASTER-024 // SPEC-C' }
    ];

    // 文字化け用のノイズキャラクタ群
    const noiseChars = '░▒▓█░▄▀■◆▲▼○●★☆☠☣☢⚓⚕⚖⚙⚙✈✉⚡⚰⚱✿❀';

    function glitchElement(element, originalText, duration = 800) {
        if (!element) return;
        
        const startTime = performance.now();
        
        function updateGlitch(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // 進捗状況に応じて、元の文字とノイズ文字を混ぜる割合を変化させる
                let glitchedString = '';
                for (let i = 0; i < originalText.length; i++) {
                    // 各文字について、ランダムにノイズ化するか決める
                    if (Math.random() > progress) {
                        // ランダムなノイズ文字を選択
                        glitchedString += noiseChars[Math.floor(Math.random() * noiseChars.length)];
                    } else {
                        // 復元された元の文字
                        glitchedString += originalText[i];
                    }
                }
                
                element.textContent = glitchedString;
                // data-text 属性も同時に更新（CSSグリッチエフェクト用）
                if (element.hasAttribute('data-text')) {
                    element.setAttribute('data-text', glitchedString);
                }
                
                requestAnimationFrame(updateGlitch);
            } else {
                // 完全復元
                element.textContent = originalText;
                if (element.hasAttribute('data-text')) {
                    element.setAttribute('data-text', originalText);
                }
            }
        }
        
        requestAnimationFrame(updateGlitch);
    }

    // 初回ロード時の演出 (1秒ディレイ)
    setTimeout(() => {
        glitchTargets.forEach(target => {
            const el = document.querySelector(target.selector);
            glitchElement(el, target.originalText, 1000);
        });
    }, 600);

    // 周期的な偶発バグ (15秒おきにランダムで実行)
    setInterval(() => {
        if (Math.random() < 0.4) {
            const randomTarget = glitchTargets[Math.floor(Math.random() * glitchTargets.length)];
            const el = document.querySelector(randomTarget.selector);
            glitchElement(el, randomTarget.originalText, 600);
        }
    }, 12000);
});
