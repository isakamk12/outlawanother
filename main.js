/**
 * ==========================================================================
 * タガ外れ本棚 (ANTI-MORAL ARCHIVE) - メインスクリプト
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// アプリケーション状態管理
const state = {
    searchQuery: '',
    selectedCreator: 'all', // 'all', 'isaka', 'others'
    selectedStatus: 'all',  // 'all', '新作', '完結', '連載'
    selectedTags: new Set(), // 複数タグのAND検索用
};

/**
 * 全25作品のアーカイブデータ
 */
const NOVEL_DATA = [
    {
        id: 1,
        title: "親ガチャEランクの俺は遺伝子ランクSSRの妹達と禁断の子孫繁栄をする。",
        author: "伊阪 証",
        status: "新作",
        tags: ["異世界", "妹・家族", "禁断", "コンプラ違反", "コメディ", "冒険譚"],
        description: "チート妹×頑張り屋よわよわお兄ちゃんの割と熱血で(アレな)冒険譚。\nAIにコンプラチェックしてもらったら「存在がコンプラ違反だから手遅れ」だと言われた問題作。",
        ethicsLevel: 99,
        stimulation: 98,
        chaosLevel: 95,
        complianceRisk: "SSR",
        aiVerdict: "警告：存在自体が深刻なコンプライアンス違反です。検閲プログラムが作動する前に直ちに読了してください。",
        url: "https://kakuyomu.jp/works/2912051601972870741"
    },
    {
        id: 2,
        title: "メンヘラ×カリスマ",
        author: "伊阪 証",
        status: "連載中",
        tags: ["ファンタジー", "心理学", "SF", "メンヘラ", "王道"],
        description: "異色の王道、メンヘラ×カリスマの心理学SF×ファンタジー。\n他者の瞳を射抜き、判断を狂わせる「視線の圧力」を持つ第一王女の物語。",
        ethicsLevel: 75,
        stimulation: 82,
        chaosLevel: 68,
        complianceRisk: "SR",
        aiVerdict: "王女の精神汚染パラメータが危険域に達しています。読者の心理的安全性は保証されません。",
        url: "https://kakuyomu.jp/works/2912051597669296069"
    },
    {
        id: 3,
        title: "追放者ギルドから追放されました。",
        author: "伊阪 証",
        status: "連載中",
        tags: ["ファンタジー", "追放", "ロジカル", "ざまぁ無効"],
        description: "勇者パーティを「足手まとい」として追放された男が、寄る辺なき者が集う「追放者ギルド」からも二度目の追放を受ける、極限 of ロジカル・ファンタジー。",
        ethicsLevel: 62,
        stimulation: 70,
        chaosLevel: 55,
        complianceRisk: "R",
        aiVerdict: "二重の追放による論理的矛盾は検知されませんでした。過酷な現実に対する不快感耐性が必要です。",
        url: "https://kakuyomu.jp/works/2912051601211056601"
    },
    {
        id: 4,
        title: "俺だけレベルダウンな件",
        author: "伊阪 証",
        status: "連載中",
        tags: ["ファンタジー", "ダーク", "残酷", "肉体損耗"],
        description: "人を見殺しにする程、魔王の首に刃は届く。\n「戦えば戦うほどレベルが下がり、肉体が損耗していく」残酷な世界で、誰かが逃げる時間を稼ぐために立ち続ける男の物語。",
        ethicsLevel: 80,
        stimulation: 88,
        chaosLevel: 60,
        complianceRisk: "SR",
        aiVerdict: "自己犠牲と人道崩壊のバランスが著しく偏っています。読むと精神的HPが削られます。",
        url: "https://kakuyomu.jp/works/2912051601206460966"
    },
    {
        id: 5,
        title: "代行少女は愉悦を浴びる",
        author: "堀乃す",
        status: "完結済",
        tags: ["ダークファンタジー", "愉悦", "少女", "運命否定"],
        description: "ダークファンタジーの【最悪】に魅せられて――。\n『退屈な運命を否定せよ。世界を彩り、人生を変えたいなら。』変化のない毎日に退屈していた少女の物語。",
        ethicsLevel: 85,
        stimulation: 78,
        chaosLevel: 72,
        complianceRisk: "SR",
        aiVerdict: "「愉悦」の定義が一般的な倫理範囲を超過しています。道徳的満足感は得られません。",
        url: "https://kakuyomu.jp/works/16818792438327230123"
    },
    {
        id: 6,
        title: "天界を追放されたので辺境国家で内政します ～崩壊寸前の流刑地を見捨てられた犯罪者たちの才能と時間遡行スキルで内政してたら、いつの間にか最強国家になってました～",
        author: "しぐま",
        status: "完結",
        tags: ["異世界", "内政", "時間遡行", "犯罪者", "最強国家"],
        description: "知識と謀略と犯罪者どもの才能で、滅亡寸前の辺境の地を最強国家に！\n転生者に与えるはずの時間遡行能力を下界に持ってきてしまった元・神の物語。",
        ethicsLevel: 82,
        stimulation: 84,
        chaosLevel: 75,
        complianceRisk: "SR",
        aiVerdict: "犯罪者の更生ではなく「犯罪スキルの国家規模での有効活用」が確認されました。国家保安上の危険度高。",
        url: "https://kakuyomu.jp/works/2912051595863047391"
    },
    {
        id: 7,
        title: "メスガキくえすと♡２～あくどいメスガキども～",
        author: "伊勢池ヨシヲ",
        status: "連載中",
        tags: ["コメディ", "メスガキ", "わからせ", "おじさん", "紳士向け"],
        description: "氷河期おじさんの夢、希望、そして願望がふたたび……。\n世界征服を目論む大司教を倒す名目で、世界各地のメスガキどもをわからせる旅に出る。",
        ethicsLevel: 94,
        stimulation: 95,
        chaosLevel: 92,
        complianceRisk: "SSR",
        aiVerdict: "全年齢対象の限界を容易に突破しています。コンプライアンスチェックAIはこの作品を直視できません。",
        url: "https://kakuyomu.jp/works/16818023213689907598"
    },
    {
        id: 8,
        title: "不死の国のアリス",
        author: "幽幻乃 紫",
        status: "連載中",
        tags: ["ダークメルヘン", "不死", "狂気", "異世界"],
        description: "「この国では、“死”は救いにならない。」\n白兎を追いかけて、死んでも蘇る狂気が支配する不死の国に迷い込んだアリスのダークメルヘン。",
        ethicsLevel: 88,
        stimulation: 85,
        chaosLevel: 80,
        complianceRisk: "SR",
        aiVerdict: "狂気と反復する死が描かれています。読者の正気度（SAN値）に回復不能なダメージを与える恐れがあります。",
        url: "https://kakuyomu.jp/works/2912051600471596933"
    },
    {
        id: 9,
        title: "最終ファンタジー",
        author: "攻撃",
        status: "連載中",
        tags: ["ファンタジー", "不条理", "ギャグ", "超展開"],
        description: "魔王は走っていた。マンホールに落ちた。死んだ。復活した。\nツッコミ不在の予測不能な超展開・不条理ギャグファンタジー。",
        ethicsLevel: 40,
        stimulation: 90,
        chaosLevel: 99,
        complianceRisk: "R",
        aiVerdict: "倫理の問題ではなく、純粋な論理崩壊とカオスが検知されました。脳細胞への直接の刺激に注意してください。",
        url: "https://kakuyomu.jp/works/2912051598106597530"
    },
    {
        id: 10,
        title: "異世界転生したら、世界の敵になりました。",
        author: "篠原 凛翔",
        status: "連載中",
        tags: ["異世界", "復讐", "世界の敵", "悪魔契約"],
        description: "その契約 of 代償は”世界の敵”となること。\n里を滅ぼされ、悪魔に魂を売ってでも復讐を誓う、勇者も魔王もいないロクデモナイ復讐譚。",
        ethicsLevel: 85,
        stimulation: 88,
        chaosLevel: 65,
        complianceRisk: "SR",
        aiVerdict: "復讐に伴う付随的被害および人道的違反が多数記録されています。救いのない展開を好む方にのみ推奨。",
        url: "https://kakuyomu.jp/works/2912051598702153106"
    },
    {
        id: 11,
        title: "婚約者といちゃつく奴を注意したら決闘となり敗北～すべてを失った男の物語",
        author: "@boss0327",
        status: "連載中",
        tags: ["ファンタジー", "国外追放", "武芸", "サバイバル"],
        description: "チート能力に敗れた男の物語。\nすべてを失い国外追放された主人公が、己の肉体と武の技術だけを武器に辺境の地で必死に生きる。",
        ethicsLevel: 35,
        stimulation: 68,
        chaosLevel: 45,
        complianceRisk: "E",
        aiVerdict: "比較的現実的でストイックな生存闘争です。本作は本棚の中では極めて健全（SAFE）な部類に属します。",
        url: "https://kakuyomu.jp/works/2912051601883355931"
    },
    {
        id: 12,
        title: "愛するおばあちゃんが死んで以来、何度殺しても死ねないボクは、毒魔法とかいろいろ強過ぎて向こうが死にまくるけど、死ねない理由が知りたい！〜『トリプルマジックストリート 第一部』外伝",
        author: "霜月二十三",
        status: "連載中",
        tags: ["ファンタジー", "不死", "毒魔法", "死にたがり", "殺劇"],
        description: "人や己を殺しても死ねず、死にたがりと化した彼の、故郷に戻る前の冒険殺劇。",
        ethicsLevel: 88,
        stimulation: 90,
        chaosLevel: 80,
        complianceRisk: "SR",
        aiVerdict: "自傷行為及び無差別な有毒魔法使用が検出されました。精神衛生上、非常に強力な刺激を含みます。",
        url: "https://kakuyomu.jp/works/16817330654478632679"
    },
    {
        id: 13,
        title: "いっそ私が虎ならば",
        author: "鷹丘 文京",
        status: "連載中",
        tags: ["異世界", "TS/性転換", "闘争", "女性化"],
        description: "持たざる者の、持たざる者による、持たざる者のための闘争。\n異世界の惑星テオスペラにて、女性の体を得て蘇生してしまった転移者の物語。",
        ethicsLevel: 60,
        stimulation: 75,
        chaosLevel: 68,
        complianceRisk: "R",
        aiVerdict: "アイデンティティの喪失と実存的闘争が描かれています。精神的葛藤レベル高。",
        url: "https://kakuyomu.jp/works/2912051596709629758"
    },
    {
        id: 14,
        title: "役立たずアラサーおじさん、探偵の凄みで異世界無双する",
        author: "馬です",
        status: "連載中",
        tags: ["異世界", "コメディ", "過激表現", "下ネタ", "おじさん"],
        description: "アラサー主人公が活躍する、過激表現・下ネタ有りのコメディ作品。",
        ethicsLevel: 85,
        stimulation: 80,
        chaosLevel: 85,
        complianceRisk: "SR",
        aiVerdict: "低俗なユーモアと下品な表現の密度がコンプラ許容範囲を超過しています。インテリジェンス低下の恐れ。",
        url: "https://kakuyomu.jp/works/2912051599306801962"
    },
    {
        id: 15,
        title: "シドの国",
        author: "×90",
        status: "連載中",
        tags: ["ダーク", "人造人間", "狂気", "悪党殺戮", "性奴隷"],
        description: "殺意よりも、悪意よりも、正気の狂気が恐ろしい。\n性奴隷用人造人間が、自由を手に入れた後に悪を手当たり次第に殺しまくる話。",
        ethicsLevel: 96,
        stimulation: 94,
        chaosLevel: 85,
        complianceRisk: "SSR",
        aiVerdict: "非常に過激なダーク描写と、冷酷な正義の暴走が検出されました。コンプラ違反の塊です。",
        url: "https://kakuyomu.jp/works/1177354055263931789"
    },
    {
        id: 16,
        title: "世説新鬼 —神のゴミを拾う男—",
        author: "仔猫（コネコ）",
        status: "連載中",
        tags: ["ダーク", "退廃", "自己犠牲", "身体崩壊"],
        description: "神のゴミを拾い、琉璃に変える仕事。\n代償として肉体が静かに壊れ、血はガラスに変わり肉は冷たい金へと沈んでいく男の物語。",
        ethicsLevel: 55,
        stimulation: 70,
        chaosLevel: 60,
        complianceRisk: "R",
        aiVerdict: "退廃的で美的な身体欠損描写が含まれています。陰鬱な美学を好むユーザー向け。",
        url: "https://kakuyomu.jp/works/822139844796971423"
    },
    {
        id: 17,
        title: "召喚事故ったから相談乗って！",
        author: "味噌煮込みポン酢",
        status: "連載中",
        tags: ["コメディ", "掲示板風", "召喚事故", "責任転嫁"],
        description: "こんなことになるとは思わなかったの！\n神階専門掲示板に並ぶのは、召喚事故の愚痴と反省と責任転嫁ばかり。",
        ethicsLevel: 45,
        stimulation: 60,
        chaosLevel: 75,
        complianceRisk: "E",
        aiVerdict: "神話的存在による無責任な責任転嫁がログに記録されています。コンプライアンス的には「業務上の怠慢」に分類。",
        url: "https://kakuyomu.jp/works/2912051601237676141"
    },
    {
        id: 18,
        title: "常闇（とこやみ）の女神 ー目指せ、俺の大神殿！ー",
        author: "山口遊子",
        status: "連載中",
        tags: ["ダーク", "邪神/魔王", "勧善しない", "懲悪"],
        description: "闇よ集え！進化の頂点を極めた主人公ダークンが、眷属と共に勧善せずに懲悪しつつ、大神殿を建設する物語。",
        ethicsLevel: 78,
        stimulation: 72,
        chaosLevel: 68,
        complianceRisk: "SR",
        aiVerdict: "勧善懲悪の「勧善」プロセスが完全にスキップされています。純粋な懲悪カタルシスのみを抽出。",
        url: "https://kakuyomu.jp/works/1177354055372628058"
    },
    {
        id: 19,
        title: "アンチヒーロー・ディストラクション -成り代わりシリアルキラーは異世界でも愉しみたい-",
        author: "ゆつみ かける",
        status: "連載中",
        tags: ["異世界", "シリアルキラー", "ダーク", "愉悦", "血塗られた特典"],
        description: "愉しく殺して守りたいものだけ守る。\n人を殺すことでしか生きている実感を得られないシリアルキラーが異世界で紡ぐ血塗られたボーナスステージ。",
        ethicsLevel: 98,
        stimulation: 95,
        chaosLevel: 88,
        complianceRisk: "SSR",
        aiVerdict: "主観的な快楽殺人が美化されています。倫理・道徳エンジンはこの作品の存在を断固として否定します。",
        url: "https://kakuyomu.jp/works/16818792436069960405"
    },
    {
        id: 20,
        title: "前世が地獄過ぎた善良凡人、女尊男卑な貞操逆転異世界で成り上がり無双＆愛が重い美少女達との種馬生活というご褒美が待っていた。",
        author: "下等妙人",
        status: "連載中",
        tags: ["異世界", "貞操逆転", "種馬", "ハーレム", "ご褒美"],
        description: "女は兵士、男は種馬か奴隷という貞操逆転異世界で、魔力を持つ唯一の男として転生し、ただひたすらに幸福な人生を勝ち取っていく。",
        ethicsLevel: 92,
        stimulation: 96,
        chaosLevel: 85,
        complianceRisk: "SSR",
        aiVerdict: "ジェンダーロールの極端な逆転と性衝動優先の社会構造です。倫理的タガは完全に喪失しています。",
        url: "https://kakuyomu.jp/works/2912051600874440454"
    },
    {
        id: 21,
        title: "死にモブが生き残るためのヤンデレ理論 〜好意を搾取して最強になったはいいが、ヤンデレたちの狂気が常に俺の背後で火花を散らしている〜",
        author: "マッソー！",
        status: "毎日更新中！",
        tags: ["ヤンデレ", "モブ転生", "狂愛", "搾取"],
        description: "破滅フラグから生き残るために必要なのは狂愛でした。\n死にモブに転生した主人公が、ヒロインたちを甘やかし好意を搾取するが、愛が重くなりすぎる。",
        ethicsLevel: 88,
        stimulation: 92,
        chaosLevel: 90,
        complianceRisk: "SR",
        aiVerdict: "危険度の高い複数のヤンデレ検体が相互に干渉しています。爆発の危険があるため、背後には十分注意してください。",
        url: "https://kakuyomu.jp/works/2912051600703642492"
    },
    {
        id: 22,
        title: "No More 社畜人生！ドアマット聖女ヒロインなんてお断りです",
        author: "志熊みゅう",
        status: "連載中",
        tags: ["ファンタジー", "聖女", "スローライフ", "憑依", "脱社畜"],
        description: "俺様王子の溺愛より、正当な対価と自由がほしい！\n『ドアマット聖女』に憑依した元社畜が、王都も回避して領地で平穏＆健全なスローライフを目指す。",
        ethicsLevel: 30,
        stimulation: 55,
        chaosLevel: 40,
        complianceRisk: "E",
        aiVerdict: "労働環境の健全化およびスローライフの探求。本アーカイブ内で最も無害で人道的なログです。",
        url: "https://kakuyomu.jp/works/2912051601660426641"
    },
    {
        id: 23,
        title: "開始５分でサービス終了した伝説 of バグゲーに転生したんだが攻略できない！",
        author: "那須儒一",
        status: "連載中",
        tags: ["異世界", "バグゲー", "クソゲー", "サバイバル"],
        description: "クソゲーに転生したら、まず家から出る方法を探すところから始まった。\n誰も攻略できなかった伝説のバグゲー世界での手探りサバイバル。",
        ethicsLevel: 42,
        stimulation: 82,
        chaosLevel: 88,
        complianceRisk: "R",
        aiVerdict: "システムバグによる物理法則および論理的動作の破綻が確認されました。プレイヤーのSAN値低下を検知。",
        url: "https://kakuyomu.jp/works/2912051601335714573"
    },
    {
        id: 24,
        title: "厄災の魔法少女",
        author: "キムオタ",
        status: "連載中",
        tags: ["現代", "魔法少女", "狂気", "世界の終焉", "独特世界観"],
        description: "世界が滅びに向かう今、愛と厄災を背に受けて魔法少女は立ち上がる！\n狂気と日常が混ざり合った独特すぎる世界観で描かれる魔法少女たちの物語。",
        ethicsLevel: 85,
        stimulation: 88,
        chaosLevel: 82,
        complianceRisk: "SR",
        aiVerdict: "愛と厄災の混和による世界崩壊シミュレーション。極度のダークファンタジー描写を含みます。",
        url: "https://kakuyomu.jp/works/16818792439433125980"
    },
    {
        id: 25,
        title: "不良債権ダンジョンと借金三千億年から始まる魔王討伐記",
        author: "伊阪 証",
        status: "連載中",
        tags: ["ファンタジー", "ダンジョン", "メイド", "コメディ", "借金返済", "税務"],
        description: "ダンジョンは不良債権で相続税と贈与税は発生します。\n残骸となった勇者が、一般人の年収三千億年分の借金返済のためにメイドとして飼われる。",
        ethicsLevel: 70,
        stimulation: 78,
        chaosLevel: 80,
        complianceRisk: "R",
        aiVerdict: "労働法および金融取引の概念を激しく逸脱したメイド使役。しかしギャグ要素で中和されています。",
        url: "https://kakuyomu.jp/works/2912051596599981557"
    }
];

/**
 * 初期化関数
 */
function initApp() {
    // タグの動的生成
    generateTagFilters();

    // 初期本棚レンダリング
    renderBookshelf();

    // イベントリスナー設定
    setupEventListeners();

    // 定期的なバグ・グリッチ風エフェクトの開始
    startRandomGlitches();
}

/**
 * ユニークな特徴タグを抽出してフィルターに挿入する
 */
function generateTagFilters() {
    const container = document.getElementById('tags-container');
    if (!container) return;

    // 全ての作品からタグを平坦化して収集
    const allTags = new Set();
    NOVEL_DATA.forEach(novel => {
        novel.tags.forEach(tag => allTags.add(tag));
    });

    // タグのボタンを生成
    container.innerHTML = '';
    allTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-btn';
        btn.textContent = `#${tag}`;
        btn.setAttribute('data-tag', tag);
        btn.addEventListener('click', () => toggleTagFilter(tag, btn));
        container.appendChild(btn);
    });
}

/**
 * タグフィルターのトグル処理
 */
function toggleTagFilter(tag, buttonElement) {
    if (state.selectedTags.has(tag)) {
        state.selectedTags.delete(tag);
        buttonElement.classList.remove('active');
    } else {
        state.selectedTags.add(tag);
        buttonElement.classList.add('active');
    }
    renderBookshelf();
}

/**
 * 本棚グリッドのレンダリング
 */
function renderBookshelf() {
    const grid = document.getElementById('bookshelf-grid');
    const resultCount = document.getElementById('result-count');
    if (!grid) return;

    // フィルタリング処理
    const filteredNovels = NOVEL_DATA.filter(novel => {
        // 検索クエリマッチ (作品名 or 著者名)
        const matchesQuery = novel.title.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                             novel.author.toLowerCase().includes(state.searchQuery.toLowerCase());
        
        // クリエイターフィルタ
        let matchesCreator = true;
        if (state.selectedCreator === 'isaka') {
            matchesCreator = (novel.author === '伊阪 証');
        } else if (state.selectedCreator === 'others') {
            matchesCreator = (novel.author !== '伊阪 証');
        }

        // ステータスフィルタ
        let matchesStatus = true;
        if (state.selectedStatus !== 'all') {
            matchesStatus = novel.status.includes(state.selectedStatus);
        }

        // タグフィルタ (AND検索: 選択されたすべてのタグを持っている必要がある)
        let matchesTags = true;
        if (state.selectedTags.size > 0) {
            matchesTags = Array.from(state.selectedTags).every(tag => novel.tags.includes(tag));
        }

        return matchesQuery && matchesCreator && matchesStatus && matchesTags;
    });

    // カウントの更新
    if (resultCount) {
        resultCount.textContent = filteredNovels.length;
    }

    // HTML生成
    grid.innerHTML = '';
    
    if (filteredNovels.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <p>検索条件に合致する作品は見つかりませんでした。</p>
            </div>
        `;
        return;
    }

    filteredNovels.forEach(novel => {
        const card = document.createElement('article');
        card.className = `novel-card`;
        
        // タグHTML
        const tagsHtml = novel.tags.map(tag => `<span class="card-tag">#${tag}</span>`).join('');

        card.innerHTML = `
            <div class="card-header-accent"></div>
            <div class="card-header-meta">
                <span class="card-status-badge">${novel.status}</span>
            </div>
            <div class="card-body">
                <h2 class="card-title">${novel.title}</h2>
                <div class="card-author"><i class="fa-solid fa-pen-nib"></i> ${novel.author}</div>
                <p class="card-description">${novel.description.replace(/\n/g, ' ')}</p>
            </div>
            <div class="card-footer">
                ${tagsHtml}
            </div>
        `;

        card.addEventListener('click', () => openNovelModal(novel));
        grid.appendChild(card);
    });
}

/**
 * イベントリスナーの設定
 */
function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const clearSearch = document.getElementById('clear-search');
    
    // 検索入力
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value.trim();
            if (state.searchQuery.length > 0) {
                clearSearch.style.display = 'block';
            } else {
                clearSearch.style.display = 'none';
            }
            renderBookshelf();
        });
    }

    // 検索クリア
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            state.searchQuery = '';
            clearSearch.style.display = 'none';
            searchInput.focus();
            renderBookshelf();
        });
    }

    // クリエイターフィルターボタン
    const creatorFilters = document.querySelectorAll('#creator-filters .filter-btn');
    creatorFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            creatorFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedCreator = btn.getAttribute('data-filter');
            renderBookshelf();
        });
    });

    // ステータスフィルターボタン
    const statusFilters = document.querySelectorAll('#status-filters .filter-btn');
    statusFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            statusFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedStatus = btn.getAttribute('data-filter');
            renderBookshelf();
        });
    });

    // モーダルクローズ
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('detail-modal');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeNovelModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeNovelModal();
            }
        });
    }

    // ESCキーでのモーダルクローズ
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeNovelModal();
        }
    });
}

/**
 * 詳細モーダルを開く
 */
function openNovelModal(novel) {
    const modal = document.getElementById('detail-modal');
    if (!modal) return;

    // データ設定
    document.getElementById('modal-title').textContent = novel.title;
    document.getElementById('modal-author').innerHTML = `<i class="fa-solid fa-pen-nib"></i> 作者: ${novel.author}`;
    document.getElementById('modal-status-badge').textContent = novel.status;
    document.getElementById('modal-description').textContent = novel.description;
    
    // ホログラム本の設定
    document.getElementById('modal-book-title-cover').textContent = novel.title;
    document.getElementById('modal-book-author-cover').textContent = novel.author;

    // タグのレンダリング
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = novel.tags.map(tag => `<span class="mini-tag">#${tag}</span>`).join('');

    // 外部リンクボタンの設定
    const linkSection = document.getElementById('modal-link-section');
    const readBtn = document.getElementById('modal-read-btn');
    const reviewBtn = document.getElementById('modal-review-btn');
    
    if (linkSection) {
        linkSection.style.display = 'flex';
        linkSection.style.flexDirection = 'column';
        linkSection.style.gap = '10px';
        
        // カクヨムで読むボタン
        if (readBtn) {
            if (novel.url) {
                readBtn.href = novel.url;
                readBtn.style.display = 'flex';
            } else {
                readBtn.removeAttribute('href');
                readBtn.style.display = 'none';
            }
        }
        
        // 詳細レビュー報告書ボタン (特設詳細ページがあるIDに対応)
        if (reviewBtn) {
            if (novel.id === 25) {
                reviewBtn.href = './debt_dungeon/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 24) {
                reviewBtn.href = './disaster_girl/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 23) {
                reviewBtn.href = './bug_game/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 22) {
                reviewBtn.href = './shachiku_saint/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 21) {
                reviewBtn.href = './yandere_theory/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 20) {
                reviewBtn.href = './reverse_harem/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 19) {
                reviewBtn.href = './anti_hero/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 18) {
                reviewBtn.href = './dark_goddess/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 17) {
                reviewBtn.href = './summon_accident/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 16) {
                reviewBtn.href = './shinsetsu_shinki/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 15) {
                reviewBtn.href = './sido_country/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 14) {
                reviewBtn.href = './detective_uncle/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 13) {
                reviewBtn.href = './if_tiger/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 12) {
                reviewBtn.href = './immortal_doctor/index.html';
                reviewBtn.style.display = 'flex';
            } else if (novel.id === 11) {
                reviewBtn.href = './lost_everything/index.html';
                reviewBtn.style.display = 'flex';
            } else {
                reviewBtn.removeAttribute('href');
                reviewBtn.style.display = 'none';
            }
        }
    }

    // モーダル表示
    modal.style.display = 'flex';
    // リフローを強制してからアクティブクラスを追加（アニメーション用）
    modal.offsetHeight; 
    modal.classList.add('active');


}

/**
 * 詳細モーダルを閉じる
 */
function closeNovelModal() {
    const modal = document.getElementById('detail-modal');
    if (!modal) return;

    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // CSSトランジション時間に合わせる
}

/**
 * 偶発的に画面全体に一瞬ノイズ・グリッチを走らせる
 */
function startRandomGlitches() {
    // 演出を削除
}

/**
 * 画面を一瞬赤くし、ログに警告を表示するグリッチ効果
 */
function triggerGlitchEffect() {
    // 演出を削除
}
