document.addEventListener('DOMContentLoaded', () => {
    const btnSubmit = document.getElementById('btn-submit-post');
    const btnSync = document.getElementById('btn-sync-database');
    const postsList = document.getElementById('posts-list');
    const inputName = document.getElementById('post-name');
    const inputContent = document.getElementById('post-content');
    const statusMsg = document.getElementById('post-status');

    let currentPostNum = 5; // すでに5レスある

    // 1. 書き込み処理
    if (btnSubmit && postsList) {
        btnSubmit.addEventListener('click', () => {
            const name = inputName.value.trim() || '名無し管理神';
            const content = inputContent.value.trim();

            if (!content) {
                showStatus('エラー: 本文が空です', 'red');
                return;
            }

            currentPostNum++;
            
            // 投稿日付とIDの自動生成
            const now = new Date();
            const dateStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}(月) ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
            const randomId = 'ID:' + Math.random().toString(36).substring(2, 10).toUpperCase();

            // レス要素生成
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.id = `post-${currentPostNum}`;
            
            // 改行をbrに変換
            const formattedContent = content.replace(/\n/g, '<br>');

            postDiv.innerHTML = `
                <div class="post-header">
                    <span class="num">${currentPostNum}</span>
                    <span class="name">${escapeHTML(name)}</span>
                    <span class="date">${dateStr}</span>
                    <span class="id">${randomId}</span>
                </div>
                <div class="post-body">
                    ${formattedContent}
                </div>
            `;

            postsList.appendChild(postDiv);
            
            // テキストエリアをクリア
            inputContent.value = '';
            showStatus('書き込みが完了しました', 'green');

            // スクロール
            postsList.scrollTop = postsList.scrollHeight;
        });
    }

    // 2. データベース同期（自動レス追加）
    const presetReplies = [
        {
            name: "コア7系担当神",
            id: "ID:No_Limit_Alto",
            content: "男で魔力上限エラーって、それあいつだろ。前世で過労死した善良凡人アルト。あいつの魔力基素メーター、測定限界突破して基素測定器が爆発したぞ"
        },
        {
            name: "コア10系担当神",
            id: "ID:Yandere_Theory",
            content: "俺の担当世界なんか、確定死モブのルークって男が【恩寵の簒奪】とかいうやばいヤンデレ搾取スキルに目覚めて、ヒロインたちの狂気を搾り取って最強になってる。背後でヤンデレたちが火花散らしてていつ刺されるかハラハラしながらモニタリングしてる"
        },
        {
            name: "コア1系担当神",
            id: "ID:Debt_Dungeon",
            content: "魔王討伐した勇者に報酬として3000億年の借金と不良債権ダンジョンを押し付けたら、そいつがダンジョンを株式会社化して経営再建し始めたんだが？ 経済システム壊れる"
        },
        {
            name: "地球管理神 ★ [管理者]",
            id: "ID:Sys_Manager",
            content: "お前らやらかしすぎだろｗｗｗｗ 監査入ったら全次元一発アウトだぞこれ"
        }
    ];

    let syncIndex = 0;

    if (btnSync) {
        btnSync.addEventListener('click', () => {
            if (syncIndex >= presetReplies.length) {
                showStatus('サーバーに未同期データはありません', 'orange');
                return;
            }

            btnSync.classList.add('disabled');
            btnSync.innerHTML = `<i class="fa-solid fa-sync fa-spin"></i> SYNCING...`;
            showStatus('データベース接続中...', 'blue');

            setTimeout(() => {
                const reply = presetReplies[syncIndex];
                currentPostNum++;

                const now = new Date();
                const dateStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}(月) ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.id = `post-${currentPostNum}`;
                postDiv.innerHTML = `
                    <div class="post-header">
                        <span class="num">${currentPostNum}</span>
                        <span class="name" style="${reply.name.includes('★') ? 'color:#22c55e;' : 'color:#0f52ba;'}">${escapeHTML(reply.name)}</span>
                        <span class="date">${dateStr}</span>
                        <span class="id">${reply.id}</span>
                    </div>
                    <div class="post-body">
                        ${reply.content}
                    </div>
                `;

                postsList.appendChild(postDiv);
                postsList.scrollTop = postsList.scrollHeight;

                syncIndex++;
                btnSync.classList.remove('disabled');
                btnSync.innerHTML = `<i class="fa-solid fa-rotate"></i> バグバスター同期 (自動スレ更新)`;
                showStatus('同期完了: 1件の新規バグ報告', 'green');
            }, 1000);
        });
    }

    // ヘルパー関数
    function showStatus(text, color) {
        if (!statusMsg) return;
        statusMsg.textContent = text;
        if (color === 'red') statusMsg.style.color = '#ef4444';
        else if (color === 'green') statusMsg.style.color = '#22c55e';
        else if (color === 'orange') statusMsg.style.color = '#f97316';
        else if (color === 'blue') statusMsg.style.color = '#3b82f6';
        
        setTimeout(() => {
            statusMsg.textContent = '';
        }, 3000);
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
