/*!
 * トリイク よくある質問チャットボット（キーワードマッチ式・依存ライブラリなし）
 * -------------------------------------------------------------
 * 使い方：
 *   1. このファイルを toriiku-chatbot.js としてサイトのリポジトリに追加
 *   2. 各ページの </body> 直前に以下を追加
 *      <script src="/toriiku-chatbot.js" defer></script>
 *   3. これだけで画面右下にチャットボタンが表示されます
 *
 * 中身のFAQを増やしたい／直したいときは、下の FAQ_DATA 配列を編集するだけでOKです。
 * サーバーもAPIキーも不要、すべてブラウザ内で完結します。
 */
(function () {
  "use strict";

  /* =========================================================
   * 1. FAQデータ
   *    - question : 想定する質問文（表示用）
   *    - answer   : 回答（HTML可。改行は<br>、リンクは<a>タグでOK）
   *    - keywords : マッチ用キーワード（ユーザーの入力に含まれていたらヒット）
   *    - category : グルーピング用（未使用でも可、将来の拡張用）
   * ========================================================= */
  var FAQ_DATA = [
    {
      category: "料金・登録",
      question: "利用料金はかかりますか？",
      answer: "会員登録・利用ともに無料です。受け取るたびにポイントが貯まるお得な仕組みです。",
      keywords: ["料金", "お金", "有料", "無料", "費用", "コスト"]
    },
    {
      category: "料金・登録",
      question: "会員登録の方法を教えてください",
      answer: "公式LINEから無料で会員登録できます。会員登録時にはデジタル庁の仕組みも導入しているので安心です。<br><a href=\"https://lin.ee/TZGo9WHf\" target=\"_blank\" rel=\"noopener\">→ 公式LINEで登録する</a><br><a href=\"register.html\">→ 会員登録・使い方の詳細</a>",
      keywords: ["登録", "会員登録", "入会", "始め方", "はじめ方", "サインアップ", "register"]
    },
    {
      category: "料金・登録",
      question: "会員登録には何が必要ですか？",
      answer: "公式LINEから、お名前・ご住所などの登録とeKYC（本人確認書類によるオンライン本人確認）が必要です。会員登録時にはデジタル庁の仕組みも導入しているので安心です。<br><a href=\"register.html\">→ 会員登録・使い方の詳細</a>",
      keywords: ["登録に必要なもの", "ekyc", "本人確認書類", "免許証", "必要なもの", "必要書類"]
    },
    {
      category: "料金・登録",
      question: "退会したあと、もう一度登録し直せますか？",
      answer: "退会済みの場合の再登録については、個別確認が必要です。お手数ですが公式LINEまたはお問い合わせフォームからご連絡ください。",
      keywords: ["退会", "再登録", "やめた", "解約", "もう一度"]
    },
    {
      category: "安心・セキュリティ",
      question: "荷物は盗まれませんか？",
      answer: "スポットは24時間365日のカメラ監視で管理しております。また入室には本人確認＋認証デバイスが必要なので、第三者が荷物を持っていく心配もございません。",
      keywords: ["盗まれ", "盗難", "いたずら", "防犯", "安全", "カメラ", "監視", "セキュリティ"]
    },
    {
      category: "安心・セキュリティ",
      question: "自宅の置き配と比べて、防犯メリットはありますか？",
      answer: "自宅前への放置による留守バレ犯罪リスクを防ぎます。さらに申請した荷物の宛名名でも配送可能なので、個人情報も守られます。",
      keywords: ["置き配", "留守バレ", "防犯メリット", "宛名","仮名","ニックネーム","名前変えたい"]
    },
    {
      category: "安心・セキュリティ",
      question: "荷物が盗難や破損にあった場合、補償はありますか？",
      answer: "荷物は24時間365日管理しており、盗難や破損などイレギュラー時には保証があります。詳細は利用規約をご確認ください。<br><a href=\"terms.html\">→ 利用規約</a>",
      keywords: ["補償", "保証", "破損", "壊れ", "弁償"]
    },
    {
      category: "安心・セキュリティ",
      question: "スポットで個人情報は他の人に見られませんか？（ニックネーム配送）",
      answer: "荷物には荷物の宛名名のみ表示され、伝票シールには本名と本人の住所は表示されません。本人確認＋認証デバイスによる解錠のため、第三者が荷物に触れることもできません。<br><a href=\"alias.html\">→ 荷物の宛名先申請の詳細ページはこちら</a>",
      keywords: ["個人情報", "ニックネーム", "仮名", "本名", "宛名", "伝票"]
    },
    {
      category: "安心・セキュリティ",
      question: "本人以外が荷物を引き取ることはできますか？",
      answer: "利用規約上、会員本人以外の引き取り（代理での引き取りや第三者による利用）は認めておりません。<br><a href=\"terms.html\">→ 利用規約</a>",
      keywords: ["本人以外", "代理", "第三者", "家族が受け取", "代わりに受け取"]
    },
    {
      category: "使い方",
      question: "使い方の流れを教えてください",
      answer: "①無料で会員登録 → ②ネットショッピング時に受取場所としてトリイクスポットを指定 → ③スポットで受取・伝票を撮影 → ④写真提出とアンケート回答でポイントGET、の4ステップです。<br><a href=\"register.html\">→ もっと詳しく見る</a>",
      keywords: ["使い方", "流れ", "手順", "やり方", "ステップ"]
    },
    {
      category: "使い方",
      question: "楽天市場やAmazonでの配送先指定の方法は？",
      answer: "いつものECサイトで購入時に、配送先として近くのトリイクスポットを指定するだけです。<br><a href=\"ec.html\">→ 楽天市場・Amazon等の入力方法</a>",
      keywords: ["楽天", "amazon", "アマゾン", "配送先", "指定方法", "住所", "ネットショップ", "ec"]
    },
    {
      category: "使い方",
      question: "スポットでの受け取り方法を教えてください",
      answer: "仕事帰りやお出かけのついでにスポットへ立ち寄り、認証デバイスで解錠します。荷物の伝票をスマートフォンで撮影し、写真提出とアンケート回答をすれば申請完了です。<br><a href=\"photo.html\">→ スポット入室・写真を送る方法</a>",
      keywords: ["受け取り方法", "手順", "解錠", "伝票撮影", "スポット入室", "受取方法"]
    },
    {
      category: "使い方",
      question: "受け取ったあとの申請（写真提出）はどうやりますか？",
      answer: "荷物受け取り後、伝票の写真提出とアンケート回答で申請完了です。提出日の翌日から原則2日以内にポイントが付与されます。<br><a href=\"photo.html\">→ スポット入室・写真を送る方法</a>",
      keywords: ["申請方法", "写真提出", "アンケート", "申請忘れ", "申請のやり方"]
    },
    {
      category: "使い方",
      question: "荷物のサイズに制限はありますか？",
      answer: "スポットによって異なります。詳細は各拠点ページをご確認ください。",
      keywords: ["サイズ", "大きさ", "制限", "大きい荷物"]
    },
    {
      category: "使い方",
      question: "どのくらいの期間、預かってもらえますか？",
      answer: "基本の保管期間は、荷物が届いた翌日から7日間です。保管期限が切れる前に公式LINEまたはメールでご連絡いただければ、1回のみ・最大7日間の延長が可能です（延長には1日あたり税別500円の追加料金がかかります）。期限を過ぎても受け取りがない場合は、登録住所への着払い発送や、規約違反として違約金（上限10万円・税別）が発生することがあります。<br><a href=\"terms.html\">→ 利用規約（保管期間の詳細）</a>",
      keywords: ["保管期間", "何日", "預かって", "取りに来られ", "延長", "着払い", "違約金", "期限"]
    },
    {
      category: "使い方",
      question: "近くのスポットはどこにありますか？対応エリアは？",
      answer: "対応スポットの一覧は公式サイトのスポット一覧ページでご確認いただけます。順次エリアを拡大中です。<br><a href=\"spot.html\">→ スポット一覧を見る</a>",
      keywords: ["スポット", "近く", "エリア", "場所", "どこにある", "対応エリア"]
    },
    {
      category: "使い方",
      question: "荷物を受け取れる時間帯はいつですか？",
      answer: "営業時間はスポットごとに異なります。各スポットのページでご確認ください。",
      keywords: ["営業時間", "何時から", "何時まで", "時間帯", "深夜", "受け取れる時間"]
    },
    {
      category: "スポット・入室",
      question: "QRコードを読み込んでも解錠されません",
      answer: "ご不便をおかけして申し訳ございません。以下をご確認ください。<br>①会員ランクが審査中の場合、手続き完了まで入室画面は開きません。公式LINEのメニュー＞マイページからご確認ください。<br>②通信環境が悪い場合は入室できないことがあります。Wi-Fiを一旦オフにし、キャリア回線（4G/5G）に切り替えてお試しください。<br>それでも解決しない場合や緊急の場合は、LINEのチャットまたはスポットにある緊急連絡先までご連絡ください。",
      keywords: ["qr", "解錠", "開かない", "エラー", "入室できない", "鍵が開かない"]
    },
    {
      category: "ポイント",
      question: "ポイントはいつ付与されますか？",
      answer: "送り状写真の提出後、原則2日以内に付与されます。ただし、システム状況やポイント提供事業者の事情により遅れる場合があります。",
      keywords: ["ポイント", "付与", "いつもらえる", "反映されない"]
    },
    {
      category: "ポイント",
      question: "ポイントの有効期限はありますか？",
      answer: "トリイクポイントの有効期限は、当該ポイントを獲得した月を1ヶ月目として起算し、6ヶ月目の月末日までです。",
      keywords: ["有効期限", "ポイント 期限", "失効"]
    },
    {
      category: "ポイント",
      question: "会員ランクはどう判定されますか？",
      answer: "会員ランクは直近6ヶ月間の累積利用回数で判定されます。月を跨いでもリセットされず、過去6ヶ月以内の累積利用回数に応じてランクアップしていきます。<br><a href=\"point.html\">→ ランク別の付与ポイント詳細はこちら</a>",
      keywords: ["ランク", "会員ランク", "ゴールド", "プラチナ", "シルバー", "ブロンズ"]
    },
    {
      category: "ポイント",
      question: "自分のランクはどこで確認できますか？",
      answer: "会員ページで、現在のランクを確認できます。トリイク公式LINEのメニュー欄、左上のボタンより会員ページへアクセスいただけます。<br><a href=\"status.html\">→ 会員情報の確認方法</a>",
      keywords: ["ランク確認", "会員ページ", "自分のランク", "ステータス確認"]
    },
    {
      category: "ポイント",
      question: "1回の来訪で複数荷物を受け取った場合は何カウントですか？",
      answer: "荷物の個数にかかわらず、1回の来訪＝1カウントです。",
      keywords: ["複数荷物", "何カウント", "まとめて受け取"]
    },
    {
      category: "ポイント",
      question: "月利用回数のボーナスはありますか？",
      answer: "単月で8回利用時に300pt、15回利用時に500ptのボーナスポイントが付与されます。<br><a href=\"point.html\">→ ボーナスの詳細はこちら</a>",
      keywords: ["ボーナス", "8回", "15回", "月利用"]
    },
    {
      category: "その他",
      question: "友だち紹介キャンペーンはありますか？",
      answer: "あります。トリイクをお友だちに紹介すると、紹介したあなたにも、紹介されたお友だちにもお得なポイントをプレゼントします。<br><a href=\"friend.html\">→ キャンペーン詳細を見る</a>",
      keywords: ["紹介", "キャンペーン", "友達紹介", "招待", "紹介コード"]
    },
    {
      category: "その他",
      question: "配送ドライバー向けの案内はありますか？",
      answer: "宅配ドライバーの皆様向けに、スポットへの入室手順や荷物の置き方ルール、緊急連絡先などをまとめた案内ページがございます。<br><a href=\"driver.html\">→ 配送ドライバー様へのご案内・配達方法はこちら</a>",
      keywords: ["ドライバー", "配達員", "配送員", "置き方"]
    }
  ];

  var FALLBACK_ANSWER =
    "ごめんなさい、その質問にはまだうまくお答えできませんでした🙏<br>" +
    "お手数ですが、下記からLINEでご質問ください。担当者が確認してお答えします。<br>" +
    '<a href="https://page.line.me/301wzhhp?oat__id=6771964&openQrModal=true" target="_blank" rel="noopener">→ LINEで質問する</a>';

  var STARTER_QUESTIONS = [
    "利用料金はかかりますか？",
    "盗まれたりしませんか？",
    "使い方の流れを教えてください",
    "ポイントはいつ付与されますか？"
  ];

  /* =========================================================
   * 2. かんたんキーワードマッチ検索
   * ========================================================= */
  function normalize(str) {
    return String(str || "")
      .toLowerCase()
      .replace(/[\s　!！?？。、,.]/g, "");
  }

  function scoreItem(item, normQuery) {
    var score = 0;
    for (var i = 0; i < item.keywords.length; i++) {
      var kw = normalize(item.keywords[i]);
      if (!kw) continue;
      if (normQuery.indexOf(kw) !== -1) {
        score += kw.length >= 2 ? 3 : 1; // 長いキーワード一致ほど信頼度が高い
      }
    }
    var normQuestion = normalize(item.question);
    if (normQuestion && (normQuery.indexOf(normQuestion) !== -1 || normQuestion.indexOf(normQuery) !== -1)) {
      score += 2;
    }
    return score;
  }

  function findAnswer(query) {
    var normQuery = normalize(query);
    if (!normQuery) return null;
    var best = null;
    var bestScore = 0;
    for (var i = 0; i < FAQ_DATA.length; i++) {
      var s = scoreItem(FAQ_DATA[i], normQuery);
      if (s > bestScore) {
        bestScore = s;
        best = FAQ_DATA[i];
      }
    }
    return bestScore > 0 ? best : null;
  }

  /* =========================================================
   * 3. スタイル
   * ========================================================= */
  var CSS = "\
  .trk-chat-btn{position:fixed;right:20px;bottom:20px;width:60px;height:60px;border-radius:50%;\
    background:#F2731C;color:#fff;border:none;box-shadow:0 6px 20px rgba(178,74,10,.32);\
    cursor:pointer;z-index:999999;display:flex;align-items:center;justify-content:center;\
    transition:transform .15s ease;}\
  .trk-chat-btn:hover{transform:translateY(-2px) scale(1.03);}\
  .trk-chat-btn svg{width:28px;height:28px;}\
  .trk-chat-panel{position:fixed;right:20px;bottom:92px;width:340px;max-width:calc(100vw - 32px);\
    height:480px;max-height:calc(100vh - 140px);background:#FFF8F1;border-radius:16px;\
    box-shadow:0 12px 40px rgba(178,74,10,.24);display:none;flex-direction:column;overflow:hidden;\
    z-index:999999;font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',-apple-system,BlinkMacSystemFont,sans-serif;}\
  .trk-chat-panel.trk-open{display:flex;}\
  .trk-chat-header{background:#F2731C;color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;}\
  .trk-chat-header img{width:26px;height:26px;border-radius:6px;background:#fff;object-fit:contain;padding:2px;}\
  .trk-chat-header .trk-title{font-weight:700;font-size:14px;line-height:1.3;}\
  .trk-chat-header .trk-sub{font-size:11px;opacity:.85;}\
  .trk-chat-close{margin-left:auto;background:none;border:none;color:#fff;opacity:.85;cursor:pointer;font-size:18px;line-height:1;padding:4px;}\
  .trk-chat-close:hover{opacity:1;}\
  .trk-chat-body{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#FFF8F1;}\
  .trk-msg{max-width:86%;font-size:13.5px;line-height:1.6;padding:9px 12px;border-radius:14px;word-break:break-word;}\
  .trk-msg a{color:inherit;text-decoration:underline;}\
  .trk-msg.trk-bot{align-self:flex-start;background:#FFEBDA;color:#4A2A12;border-bottom-left-radius:4px;}\
  .trk-msg.trk-user{align-self:flex-end;background:#F2731C;color:#fff;border-bottom-right-radius:4px;}\
  .trk-chips{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start;max-width:100%;}\
  .trk-chip{background:#fff;border:1px solid #F4C89A;color:#B2490A;border-radius:999px;\
    padding:6px 12px;font-size:12px;cursor:pointer;transition:background .15s ease;}\
  .trk-chip:hover{background:#FFEBDA;border-color:#F2731C;}\
  .trk-chat-inputrow{display:flex;gap:8px;padding:10px;border-top:1px solid #F4E3D3;background:#fff;flex-shrink:0;}\
  .trk-chat-input{flex:1;border:1px solid #F0D6BC;border-radius:20px;padding:9px 14px;font-size:13.5px;outline:none;}\
  .trk-chat-input:focus{border-color:#F2731C;}\
  .trk-chat-send{background:#F2731C;color:#fff;border:none;border-radius:50%;width:36px;height:36px;\
    flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;}\
  .trk-chat-send:hover{background:#D9640F;}\
  .trk-chat-send svg{width:16px;height:16px;}\
  @media (max-width:400px){.trk-chat-panel{right:16px;left:16px;width:auto;bottom:88px;}}\
  ";

  function injectCSS() {
    var style = document.createElement("style");
    style.setAttribute("data-trk-chatbot", "true");
    style.appendChild(document.createTextNode(CSS));
    document.head.appendChild(style);
  }

  /* =========================================================
   * 4. DOM構築
   * ========================================================= */
  var BOX_ICON =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 3C6.9 3 2.75 6.58 2.75 11c0 2.42 1.26 4.6 3.25 6.08V21l3.42-1.9c.82.18 1.68.28 2.58.28 5.1 0 9.25-3.58 9.25-8s-4.15-8-9.25-8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M12 8.7c-1.24 0-2.05.6-2.05 1.55 0 .3.09.53.09.53" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>' +
    '<text x="12" y="14.2" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" font-weight="700" fill="currentColor">?</text>' +
    "</svg>";

  var SEND_ICON =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M3 12 L21 4 L13 21 L11 13 L3 12Z" fill="currentColor"/>' +
    "</svg>";

  var CLOSE_ICON = "&times;";

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    }
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function buildWidget() {
    var btn = el(
      "button",
      { class: "trk-chat-btn", type: "button", "aria-label": "トリイクに質問する" },
      BOX_ICON
    );

    var panel = el("div", { class: "trk-chat-panel", role: "dialog", "aria-label": "トリイクよくある質問チャット" });

    var header = el(
      "div",
      { class: "trk-chat-header" },
      '<img src="https://toriiku-jp.com/img/favicon.webp" alt=""/>' +
        '<div><div class="trk-title">トリイク よくある質問</div>' +
        '<div class="trk-sub">気になることをきいてみてください</div></div>'
    );
    var closeBtn = el("button", { class: "trk-chat-close", type: "button", "aria-label": "閉じる" }, CLOSE_ICON);
    header.appendChild(closeBtn);

    var body = el("div", { class: "trk-chat-body" });

    var inputRow = el("div", { class: "trk-chat-inputrow" });
    var input = el("input", {
      class: "trk-chat-input",
      type: "text",
      placeholder: "質問を入力…",
      "aria-label": "質問を入力"
    });
    var sendBtn = el("button", { class: "trk-chat-send", type: "button", "aria-label": "送信" }, SEND_ICON);
    inputRow.appendChild(input);
    inputRow.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(inputRow);

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    function addMsg(text, who) {
      var msg = el("div", { class: "trk-msg trk-" + who }, text);
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
      return msg;
    }

    function addChips(questions) {
      var wrap = el("div", { class: "trk-chips" });
      questions.forEach(function (q) {
        var chip = el("button", { class: "trk-chip", type: "button" }, q);
        chip.addEventListener("click", function () {
          handleUserMessage(q);
        });
        wrap.appendChild(chip);
      });
      body.appendChild(wrap);
      body.scrollTop = body.scrollHeight;
    }

    function showWelcome() {
      body.innerHTML = "";
      addMsg("こんにちは！トリイクのよくある質問チャットです😊 気になることを選ぶか、下に入力して聞いてください。", "bot");
      addChips(STARTER_QUESTIONS);
    }

    function handleUserMessage(text) {
      text = (text || "").trim();
      if (!text) return;
      addMsg(escapeHtml(text), "user");
      input.value = "";
      var match = findAnswer(text);
      if (match) {
        addMsg(match.answer, "bot");
        addChips(pickRelated(match));
      } else {
        addMsg(FALLBACK_ANSWER, "bot");
      }
    }

    function pickRelated(current) {
      // 直前の回答と同じカテゴリから、まだ聞いていない質問を2つ提案
      var related = FAQ_DATA.filter(function (item) {
        return item.category === current.category && item.question !== current.question;
      }).slice(0, 2);
      if (related.length === 0) return STARTER_QUESTIONS.slice(0, 2);
      return related.map(function (r) {
        return r.question;
      });
    }

    function escapeHtml(str) {
      var d = document.createElement("div");
      d.textContent = str;
      return d.innerHTML;
    }

    function openPanel() {
      panel.classList.add("trk-open");
      if (!body.hasChildNodes()) showWelcome();
      input.focus();
    }
    function closePanel() {
      panel.classList.remove("trk-open");
    }

    btn.addEventListener("click", function () {
      panel.classList.contains("trk-open") ? closePanel() : openPanel();
    });
    closeBtn.addEventListener("click", closePanel);
    sendBtn.addEventListener("click", function () {
      handleUserMessage(input.value);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") handleUserMessage(input.value);
    });
  }

  function init() {
    injectCSS();
    buildWidget();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
