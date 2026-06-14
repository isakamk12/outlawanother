document.addEventListener('DOMContentLoaded', () => {
    // 1. キャラクター切り替えタブ制御
    const tabs = document.querySelectorAll('#char-tabs .tab-btn');
    const panes = document.querySelectorAll('#char-content .char-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // タブのアクティブ切り替え
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 表示ペインの切り替え
            const targetChar = tab.getAttribute('data-char');
            panes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `char-${targetChar}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // 2. 負債カウンターのリアルタイム利息加算アニメーション
    // 初期値: 3,000,000,000,000 (三兆 = 3千億の10倍、あるいは文字通りの300,000,000,000)
    // 借金三千億「年」なので、値は 300,000,000,000 (3000億) とする。
    let baseDebt = 300000000000;
    const debtCounter = document.getElementById('debt-counter');

    if (debtCounter) {
        // カウントアップの初期アニメーション
        let currentDisplay = 0;
        const duration = 1500; // 1.5秒でカウントアップ
        const startTime = performance.now();

        function updateCounter(timestamp) {
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // イージング効果（easeOutQuad）
            const easeProgress = progress * (2 - progress);
            currentDisplay = Math.floor(easeProgress * baseDebt);
            
            debtCounter.textContent = currentDisplay.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // 初期カウントアップが終わったら、リアルタイム複利蓄積モードへ移行
                startRealTimeInterest();
            }
        }
        requestAnimationFrame(updateCounter);
    }

    function startRealTimeInterest() {
        // 毎秒利息が増えていく演出（複利120％を非常に小さな間隔で加算）
        // 1ミリ秒あたりに増える極小の利息値
        setInterval(() => {
            // 演出としてランダムに少額（10〜150）を加算し、常に借金が膨れ上がっている感覚を与える
            const increment = Math.floor(Math.random() * 85) + 15;
            baseDebt += increment;
            debtCounter.textContent = baseDebt.toLocaleString();
        }, 100);
    }

    // 3. 戦闘ログ（タイムライン）のスクロールインタラクション
    // Intersection Observer を使用して、スクロール時に各フェーズをフェードイン表示する
    const timelineSteps = document.querySelectorAll('.timeline-step');
    
    if ('IntersectionObserver' in window && timelineSteps.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px', // 画面下部から10%内側に入ったらトリガー
            threshold: 0.15
        };

        const timelineObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // 一度表示されたら監視を外す（スクロールバックで再アニメーションさせない場合）
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        timelineSteps.forEach((step, index) => {
            // 初期状態はCSSで非表示にしておき、 visible クラスで表示
            step.style.opacity = '0';
            step.style.transform = 'translateY(20px)';
            step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            // 遅延を設定して順次表示されるようにする
            step.style.transitionDelay = `${index * 0.1}s`;
            
            timelineObserver.observe(step);
        });

        // CSSに動的に visible クラス用のスタイルを追加
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .timeline-step.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(styleSheet);
    } else {
        // Observer未対応ブラウザ用のフォールバック
        timelineSteps.forEach(step => {
            step.style.opacity = '1';
        });
    }
});
