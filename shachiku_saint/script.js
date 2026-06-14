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

    // 2. 光魔法グリッターダストエフェクト (動的粒子生成)
    const glitterContainer = document.getElementById('glitter-container');
    if (glitterContainer) {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            createGlitterParticle();
        }
    }

    function createGlitterParticle() {
        if (!glitterContainer) return;
        const particle = document.createElement('div');
        particle.className = 'glitter-particle';
        
        // ランダムな位置・速度・遅延の設定
        const randomX = Math.random() * 100; // 0vw 〜 100vw
        const randomDelay = Math.random() * 6; // 0s 〜 6s
        const randomScale = Math.random() * 0.8 + 0.3; // 0.3 〜 1.1倍
        const randomDuration = Math.random() * 4 + 4; // 4s 〜 8s
        
        particle.style.left = `${randomX}vw`;
        particle.style.animationDelay = `${randomDelay}s`;
        particle.style.animationDuration = `${randomDuration}s`;
        particle.style.transform = `scale(${randomScale})`;
        
        // 稀にゴールドの粒子にする
        if (Math.random() > 0.6) {
            particle.style.boxShadow = `0 0 8px #ffffff, 0 0 15px var(--royal-gold)`;
        }
        
        glitterContainer.appendChild(particle);
        
        // アニメーション周期が終わったら再度ランダム配置し直す
        particle.addEventListener('animationiteration', () => {
            particle.style.left = `${Math.random() * 100}vw`;
        });
    }

    // 3. 兄オスカーのビジネスプレゼンテーションスライド
    const slideScreen = document.getElementById('presentation-slide');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const indicatorsContainer = document.getElementById('slide-indicators');
    const slideNoDisplay = document.querySelector('.slide-no');

    const slidesData = [
        {
            title: "1. 経営危機と起死回生の事業転換",
            html: `
                <div class="slide-body">
                    <h4>【現状分析】一家離散レベルの巨大危機</h4>
                    <p>ジェラルド第一王子の浮気と理不尽な婚約破棄により、ホワイト子爵家の最大取引先（伯爵家）からの一方的な契約解除・薬草の取引停止を通達される。</p>
                    <div class="business-contrast">
                        <div class="contrast-box">
                            <h5>旧来モデル (破綻)</h5>
                            <p>薬草原料のまま国内市場へ買い叩かれ売り。外部の権力に依存。</p>
                        </div>
                        <div class="contrast-box success">
                            <h5>新規モデル (起死回生)</h5>
                            <p>自社で魔法薬に加工し付加価値を最大化。国内依存からの脱却。</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "2. 魔法薬製造の自社内製化",
            html: `
                <div class="slide-body">
                    <h4>【生産戦略】原料から高付加価値製薬へのバリューチェーン構築</h4>
                    <p>薬草「延命草」をそのまま買い叩かせる旧体制を廃止。オスカーが密かに魔導学園で培った製造メソッドを活かし、領内で魔法薬への加工プロセスを内製化する。</p>
                    <ul>
                        <li><strong>原料価格の保護:</strong> 仲介業者による中間搾取の完全排除。</li>
                        <li><strong>利益率の向上:</strong> 魔法薬に加工することで、取引単価を約12倍に引き上げ。</li>
                    </ul>
                </div>
            `
        },
        {
            title: "3. 隣国レヴェリーへの新規輸出ルート開拓",
            html: `
                <div class="slide-body">
                    <h4>【グローバル戦略】非魔法国へのニッチマーケット輸出</h4>
                    <p>魔法が非常に貴重とされる隣国「レヴェリー」をターゲット市場に選定。国内でのしがらみ（伯爵家や第一王子の圧力）を一切受けない国外への販路を開拓し、圧倒的シェアを獲得する。</p>
                    <ul>
                        <li><strong>圧倒的な価格競争力:</strong> 魔法不足のレヴェリーでは通常の数倍の価格で魔法薬が取引可能。</li>
                        <li><strong>王国の強制力回避:</strong> 停戦関係にある隣国との直接交易により、国内貴族の不当介入を完全防止。</li>
                    </ul>
                </div>
            `
        }
    ];

    let currentSlide = 0;

    function renderSlide() {
        if (!slideScreen) return;
        const slide = slidesData[currentSlide];
        
        slideScreen.innerHTML = `
            <div class="slide-title">${slide.title}</div>
            ${slide.html}
        `;

        if (slideNoDisplay) {
            slideNoDisplay.textContent = `SLIDE 0${currentSlide + 1}/03`;
        }

        // インジケーターのアクティブ更新
        const dots = document.querySelectorAll('.indicator-dot');
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // インジケーターの動的生成
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
        slidesData.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = 'indicator-dot';
            if (idx === 0) dot.className += ' active';
            dot.addEventListener('click', () => {
                currentSlide = idx;
                renderSlide();
            });
            indicatorsContainer.appendChild(dot);
        });
    }

    // ボタンナビゲーション
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                renderSlide();
            } else {
                currentSlide = slidesData.length - 1; // ループ
                renderSlide();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentSlide < slidesData.length - 1) {
                currentSlide++;
                renderSlide();
            } else {
                currentSlide = 0; // ループ
                renderSlide();
            }
        });
    }

    // 初期レンダリング
    renderSlide();
});
