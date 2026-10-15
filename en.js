(() => {
  const LANG = localStorage.getItem('lang') || 'ko';
  chrome.storage.local.set({ lang: LANG });
  const btn = document.createElement('button');
  btn.className = 'mute';
  btn.style.fontFamily = 'Gaegu';
  btn.style.fontSize = '17px';
  btn.style.fontWeight = '700';
  btn.textContent = LANG === 'en' ? '한' : 'EN';
  btn.title = LANG === 'en' ? '한국어' : 'English';
  $('#muteBtn').after(btn);
  btn.addEventListener('click', () => {
    const next = LANG === 'en' ? 'ko' : 'en';
    localStorage.setItem('lang', next);
    chrome.storage.local.set({ lang: next }).finally(() => location.reload());
  });
  const pickBtnEl = $('.paper-pick');
  if (pickBtnEl && !pickBtnEl.querySelector('.pick-lbl')) {
    const lbl = document.createElement('b');
    lbl.className = 'pick-lbl';
    lbl.textContent = '서랍에서 편지지 고르기';
    pickBtnEl.append(lbl);
  }
  if (LANG !== 'en') return;

  const DICT =
   {'컵케이크를 콕 눌러서 담아요 🧁': 'Tap a cupcake to pack it 🧁',
    '담을 컵케이크를 콕 눌러요 🧁': 'Tap the cupcakes you want to pack 🧁',
    '서랍에서 편지지 고르기': 'Pick paper',
    '느린 우체통 📮': 'Slow Mailbox 📮',
    '✍️ 편지': '✍️ Letter', '🖼️ 사진·그림': '🖼️ Photo', '🍪 선물': '🍪 Gift', '🕯️ 실링': '🕯️ Seal', '📦 상자': '📦 Box',
    '미래의 나에게 하고 싶은 말을 적어보세요...': 'Write to your future self...',
    '✍️ 편지 쓰기': '✍️ Write a Letter', '🖼️ 사진 · 그림': '🖼️ Photo · Drawing', '🍪 작은 선물': '🍪 A Little Gift',
    '🕯️ 실링 왁스': '🕯️ Wax Seal', '📦 상자에 담기': '📦 Pack the Box',
    '다음 →': 'Next →', '📷 사진 올리기': '📷 Upload photo', '떼어내기': 'Remove', '굵기': 'Size', '지우기': 'Clear',
    '✨ 이 그림 붙이기': '✨ Pin this drawing', '리본 색': 'Ribbon', '비닐로 포장하기 🎀': 'Wrap it up 🎀', '포장 풀기': 'Unwrap',
    '촛불 켜기': 'Light the candle', '🔥 성냥 긋기': '🔥 Strike a match', '왁스 고르고 녹이기': 'Pick & melt wax',
    '꾹 누르고 있으면 녹아요 🫗': 'Hold to melt 🫗', '도장 고르고 찍기': 'Pick & press a stamp', '또는 이니셜 (예: C)': 'or an initial (e.g. C)',
    '🔏 꾹! 도장 찍기': '🔏 Press!', '💨 촛불 끄기': '💨 Blow out', '다시 하기': 'Redo',
    '한 달 뒤': 'In a month', '100일 뒤': 'In 100 days', '1년 뒤': 'In a year', '오늘(테스트)': 'Today (test)',
    '📦 상자에 담아 밀봉하기': '📦 Seal the box',
    '크라프트': 'Kraft', '핑크 도트': 'Pink Dots', '체크 피크닉': 'Picnic Check', '민트 도트': 'Mint Dots', '별밤': 'Starry Night',
    '폴라로이드를 붙였어요 📷': 'Photo pinned 📷', '그림을 붙였어요 🎨': 'Drawing pinned 🎨',
    '포장을 풀어야 더 넣을 수 있어요 🎀': 'Unwrap first to add more 🎀', '봉지가 꽉 찼어요!': 'The bag is full!',
    '먼저 선물을 골라주세요 🍪': 'Pick a treat first 🍪', '바스락… 포장 완료! 🎀': 'Crinkle… all wrapped! 🎀',
    '편지를 먼저 써주세요 ✍️': 'Write your letter first ✍️', '꾹! 🔴': 'Press! 🔴',
    '이미 촛불이 켜져 있어요 🕯️': 'The candle is already lit 🕯️', '촛불이 이미 꺼져 있어요': 'The candle is already out',
    '이미 도장을 찍었어요. "다시 하기"로 새로 할 수 있어요': 'Already stamped. Use "Redo" to start over',
    '먼저 촛불을 켜주세요 🔥': 'Light the candle first 🔥', '충분히 녹았어요! 도장을 찍어요 🔏': 'Melted! Time to stamp 🔏',
    '왁스가 충분히 녹았어요! 이제 도장을 찍어요 🔏': 'Melted! Time to stamp 🔏', '이미 찍었어요! 💮': 'Already stamped! 💮',
    '왁스를 먼저 충분히 녹여주세요 🫗': 'Melt the wax first 🫗', '꾹! 예쁘게 찍혔어요 💌': 'Pressed! Looks lovely 💌',
    '실링 왁스를 먼저 찍어주세요 🕯️': 'Seal it with wax first 🕯️', '도착할 날짜를 골라주세요 📅': 'Pick an arrival date 📅',
    '과거로는 보낼 수 없어요 😅': "Can't send to the past 😅",
    '이미 봉인했어요. 고치려면 실링 단계에서 "다시 하기"를 눌러요': 'Already sealed. Press "Redo" in the Seal step to edit',
    '편지를 먼저 써야 봉투에 넣을 수 있어요 ✍️': 'Write the letter before folding it ✍️',
    '과거의 내가 준 선물이에요 🎁': 'A gift from past you 🎁', '눌러서 포장 풀기': 'Tap to unwrap',
    '도착!': 'Arrived!', '열어봄': 'Opened', '보관함이 비어 있어요': 'Archive is empty',
    '상자에 차곡차곡 담는 중...': 'Packing everything in...', '뚜껑 닫고...': 'Closing the lid...',
    '리본으로 꼭꼭 묶기 🎀': 'Tying the ribbon 🎀', '찌이익— 테이프로 밀봉!': 'Rrrip— taped shut!',
    '테이프를 뜯어볼까요?': 'Shall we rip the tape?', '실링을 톡 눌러서 열어보세요': 'Tap the seal to open',
    'To. 미래의 나': 'To. Future me', 'From. 지금의 나': 'From. Me now',

    '얼그레이': 'Earl Grey', '캐모마일': 'Chamomile', '페퍼민트': 'Peppermint', '히비스커스': 'Hibiscus', '보리차': 'Barley Tea', '루이보스': 'Rooibos',
    '베르가못 향이 은은해요': 'Soft bergamot', '마음이 포근해지는 꽃차': 'A cozy flower tea', '머리가 맑아지는 화한 맛': 'Fresh and minty',
    '새콤하고 예쁜 루비색': 'Tart and ruby red', '구수하고 편안한 맛': 'Nutty and calming', '카페인 없이 달큰해요': 'Sweet, caffeine-free',
    '🍵 유리 찻잔': '🍵 Glass Teacup', '투명하고 우아한 잔': 'Clear and elegant', '🩷 핑크 머그': '🩷 Pink Mug', '두툼하고 포근한 머그': 'Thick and cozy',
    '🥛 키 큰 유리컵': '🥛 Tall Glass', '아이스에 딱!': 'Perfect for iced!', '🌸 빈티지 찻잔': '🌸 Vintage Cup', '금테 두른 꽃무늬 잔': 'Floral with a gold rim',
    '🍯 꿀 한 스푼': '🍯 Spoon of honey', '🍋 레몬 한 조각': '🍋 Slice of lemon', '🧊 각설탕': '🧊 Sugar cube',
    '잔 고르기': 'Cup', '물 끓이기': 'Boil', '차 고르기': 'Tea', '물 붓기': 'Pour', '우리기': 'Steep', '마시기': 'Sip',
    '후— 따뜻해 ☺️': 'Ahh— so warm ☺️', '마음이 차분해졌어요': 'Feeling calm now', '이제 편지 쓸 기분이 나요 ✍️': 'Ready to write ✍️',
    '향이 참 좋다…': 'Smells lovely…', '한 모금의 여유 🍃': 'A sip of calm 🍃', '시원하다~ 🧊': 'So refreshing~ 🧊',
    '얼음이 달그락달그락': 'Ice clinking', '머리까지 상쾌해요 ✨': 'Crisp and clear ✨', '꿀꺽, 한 모금 더!': 'Gulp, one more!',
    '🍵 잔 고르기': '🍵 Pick a Cup', '오늘은 어떤 잔에 마실까요?': 'Which cup today?', '온도': 'Temperature',
    '☕ 따뜻하게': '☕ Hot', '🧊 시원하게': '🧊 Iced', '🔥 물 끓이기': '🔥 Boil Water',
    '주전자를 불에 올려요. 보글보글 끓으면 주전자가 삐익~ 울어요.': 'Put the kettle on. It whistles when it boils.',
    '🔥 불 켜기': '🔥 Turn on', '🧯 불 끄기': '🧯 Turn off', '불을 켜서 물을 끓여요': 'Turn on the heat',
    '물이 다 끓었어요! 불을 끄고 다음으로 가요': 'Boiled! Turn it off and go next', '🍵 차 고르기': '🍵 Pick a Tea',
    '오늘 기분에 어울리는 티백을 골라요.': 'Pick a tea bag for your mood.', '🫖 물 붓기': '🫖 Pour',
    '주전자를 기울여 잔에 물을 부어요. 차오를수록 소리가 높아져요.': 'Tilt the kettle. The sound rises as it fills.',
    '꾹 누르고 있으면 쪼르륵 부어져요 🫖': 'Hold to pour 🫖', '⏳ 우리기': '⏳ Steep',
    '차가 우러나는 걸 기다려요. 티백을 콩콩 흔들면 더 빨리 우러나요.': 'Wait while it steeps. Dunk to speed it up.',
    '연하게': 'Light', '적당히': 'Just right', '진하게': 'Strong', '🫖 티백 콩콩 흔들기': '🫖 Dunk the bag', '티백 꺼내기': 'Take out bag',
    '☕ 마시기': '☕ Sip', '취향대로 넣고, 호로록 마셔요.': 'Add what you like and sip.', '☕ 호로록 마시기': '☕ Sip',
    '🫖 처음부터 다시': '🫖 Start over', '책상으로 가져가기 →': 'Take it to the desk →',
    '물이 아직 안 끓었어요 🫖': 'Not boiling yet 🫖', '티백을 하나 골라주세요': 'Pick a tea bag', '물을 조금 더 부어주세요': 'Pour a bit more',
    '삐익~ 물이 끓었어요! 불을 꺼주세요 🔥': "Wheee~ it's boiling! Turn off the heat 🔥", '잔이 가득 찼어요 ☕': 'The cup is full ☕',
    '가득 찼어요! ☕': 'Full! ☕', '티백을 이미 꺼냈어요': 'The bag is already out', '다 마셨어요! 한 잔 더 끓여볼까요? 🫖': 'All gone! Another cup? 🫖',
    '잘 마셨습니다 🍵': 'That was lovely 🍵', '잔이 비었어요': 'The cup is empty', '얼음이 가득해요!': 'Full of ice!', '이미 넣었어요!': 'Already added!',
    '🧊 얼음을 넣어 시원하게 만들어요!': '🧊 Add ice to chill it!', '아이스는 키 큰 유리컵이나 머그가 잘 어울려요 🥛': 'Iced drinks suit the tall glass or mug 🥛',
    '잔을 책상에 올려뒀어요 ☕': 'Cup placed on the desk ☕', '잔이 비었어요. 위의 ☕ 버튼으로 한 잔 더!': 'Empty! Use ☕ above for another',
    '누르면 호로록, 끌면 옮기기': 'Tap to sip, drag to move',

    '🎨 책상 꾸미기': '🎨 Decorate Desk', '찻잔은 책상 위에서 끌어서 옮길 수 있어요.': 'Drag the cup to move it.',
    '스탠드 조명': 'Desk lamp', '빗소리': 'Rain', '책상 나무': 'Desk wood', '깔개': 'Desk mat', '찻잔 보기': 'Cup view',
    '끄기': 'Off', '🕯 따뜻한 빛': '🕯 Warm', '💡 하얀 빛': '💡 White', '🌸 분홍 빛': '🌸 Pink', '🌧 켜기': '🌧 On',
    '월넛': 'Walnut', '오크': 'Oak', '화이트': 'White', '체리': 'Cherry', '없음': 'None', '체크 테이블보': 'Gingham cloth',
    '레이스 도일리': 'Lace doily', '펠트 매트': 'Felt mat', '옆에서': 'Side', '위에서': 'Top', '책상 꾸미기': 'Decorate desk', '빗소리 크기': 'Rain volume',
    '📚 편지 보관함': '📚 Letter Archive', '전체': 'All', '⏳ 기다리는 중': '⏳ Waiting', '📬 도착': '📬 Arrived', '💌 열어본 편지': '💌 Opened',
    '열어본 편지 내용으로 찾기 🔍': 'Search opened letters 🔍', '찾는 편지가 없어요. 아직 안 연 편지는 비밀이라 검색되지 않아요 🤫': 'No matches. Unopened letters stay secret 🤫',
    '여기는 아직 비어 있어요': 'Nothing here yet', '이 편지를 보관함에서 지울까요? 되돌릴 수 없어요.': "Delete this letter? This can't be undone.",

    '크림 줄노트': 'Cream Lined', '핑크 줄노트': 'Pink Lined', '하늘 모눈': 'Sky Grid', '민트 도트': 'Mint Dots', '크라프트 무지': 'Kraft Plain',
    '꽃무늬 편지지': 'Floral', '에어메일': 'Airmail', '밤하늘': 'Night Sky', '✉️ 편지지': '✉️ Paper', '📒 공책': '📒 Notebook', '새 공책': 'New notebook',
    '📌 책상 위': '📌 On desk', '서랍 열기': 'Open drawer', '서랍': 'Drawer', '부엌': 'Kitchen', '펼치기': 'Expand', '접기': 'Collapse',
    '이미 봉인한 편지예요. 실링 단계에서 "다시 하기"를 먼저 눌러주세요': 'Already sealed. Press "Redo" in the Seal step first',
    '표지': 'Cover', '속지': 'Pages', '도구': 'Tools', '넘기기': 'Turn', '‹ 이전': '‹ Prev', '다음 ›': 'Next ›', '＋ 새 장': '＋ New page',
    '🔖 여기 꽂기': '🔖 Bookmark here', '🔖 책갈피 빼기': '🔖 Remove bookmark', '🔖 책갈피로': '🔖 Go to bookmark',
    '📥 덮으면 서랍에': '📥 Store in drawer', '📌 덮으면 책상 위에': '📌 Keep on desk', '공책 버리기': 'Delete notebook', '📕 공책 덮기': '📕 Close notebook',
    '줄': 'Lined', '모눈': 'Grid', '도트': 'Dots', '무지': 'Plain', '🖍 그림일기': '🖍 Picture diary',
    '✏️ 쓰기': '✏️ Write', '🖍 형광펜': '🖍 Highlighter', '⭐ 스티커': '⭐ Stickers', '🎨 그림': '🎨 Draw', '🧽 지우개': '🧽 Eraser',
    '여기에 메모해요...': 'Jot something...', '✉️ 편지로 옮기기': '✉️ Copy to letter', '🧹 페이지 비우기': '🧹 Clear page', '↩ 되돌리기': '↩ Undo',
    '🗑 형광펜 다 지우기': '🗑 Clear highlights', '🗑 스티커 다 떼기': '🗑 Remove stickers', '🗑 그림 지우기': '🗑 Clear drawing',
    '날씨': 'Weather', '제목:': 'Title:', '이 페이지가 꽉 찼어요. 다음 장에 이어서 써요 📄': 'Page full. Continue on the next 📄',
    '칸이 다 찼어요! 다음 장에 이어서 써요 📄': 'Boxes full! Continue on the next 📄', '빈 페이지예요': 'Empty page', '이미 봉인한 편지예요': 'Already sealed',
    '편지에 옮겨 적었어요 ✍️ (공책을 덮으면 보여요)': 'Copied to letter ✍️ (close the notebook to see)', '새 장을 펼쳤어요 📄': 'New page 📄',
    '🔖 책갈피를 꽂았어요': '🔖 Bookmarked', '책갈피를 뺐어요': 'Bookmark removed', '아직 책갈피가 없어요': 'No bookmark yet',
    '여기가 책갈피 자리예요 🔖': "You're at the bookmark 🔖", '덮으면 책상 위에 둘게요 📌': 'Will stay on the desk 📌', '덮으면 서랍에 넣을게요 🗄': 'Will go in the drawer 🗄',
    '되돌릴 게 없어요': 'Nothing to undo', '↩ 되돌렸어요': '↩ Undone', '지울 게 없어요': 'Nothing to clear', '지울 그림이 없어요': 'No drawing to clear',
    '그림을 지웠어요 (↩ 되돌리기 가능)': 'Drawing cleared (↩ to undo)', '페이지를 비웠어요': 'Page cleared', '이름 없는 공책': 'Untitled',
    '이 페이지를 깨끗하게 비울까요? (↩ 되돌리기로 살릴 수 있어요)': 'Clear this page? (↩ to undo)',

    '📖 베이킹 레시피북': '📖 Baking Recipe Book', '곰돌이 쿠키': 'Bear Cookies', '컵케이크': 'Cupcakes', '케이크': 'Cake',
    '재료': 'Ingredients', '순서': 'Steps', '이거 만들래요!': "Let's make this!",
    '밀가루': 'Flour', '버터': 'Butter', '달걀': 'Egg', '설탕': 'Sugar', '우유': 'Milk',
    '🌾 밀가루': '🌾 Flour', '🧈 버터': '🧈 Butter', '🥚 달걀': '🥚 Egg', '🍯 설탕': '🍯 Sugar',
    '반죽': 'Dough', '밀기': 'Roll', '모양': 'Cut', '모양 찍기': 'Cut shapes', '굽기': 'Bake', '꾸미기': 'Decorate', '담기': 'Pack',
    '붓기': 'Pour', '크림': 'Cream', '완성': 'Done', '컵에 붓기': 'Fill cups', '크림 짜기': 'Pipe cream', '틀에 붓기': 'Fill pan', '크림 바르기': 'Frost',
    '플레인': 'Plain', '코코아': 'Cocoa', '말차': 'Matcha', '딸기': 'Strawberry', '바닐라': 'Vanilla', '초코': 'Choco',
    '🐻 곰': '🐻 Bear', '🐰 토끼': '🐰 Bunny', '🐱 고양이': '🐱 Cat', '♥ 하트': '♥ Heart', '★ 별': '★ Star', '● 동글': '● Round',
    '🍫 초코펜': '🍫 Choco pen', '🍓 딸기펜': '🍓 Berry pen', '🤍 아이싱': '🤍 Icing', '🌈 스프링클': '🌈 Sprinkles',
    '🥣 반죽 만들기': '🥣 Make Dough', '🪵 밀대로 밀기': '🪵 Roll It Out', '🐻 모양 찍기': '🐻 Cut Shapes', '🔥 오븐에 굽기': '🔥 Bake',
    '🎨 꾸미기': '🎨 Decorate', '🎁 선물 봉지에 담기': '🎁 Bag Them',
    '탁자 위 재료를 눌러 그릇에 넣고, 반죽 맛을 골라요.': 'Tap ingredients to add them and pick a flavor.',
    '반죽을 넓~게 펴요.': 'Roll it nice and wide.', '모양틀을 고르고 반죽 위를 콕콕 눌러 찍어요.': 'Pick a cutter and tap to cut.',
    '남은 반죽은 걷어내고 쿠키만 쟁반에 올렸어요.': 'Scraps removed, cookies on the tray.',
    '초코펜으로 눈코입을 그리고, 볼터치랑 스프링클도 뿌려요.': 'Draw faces with choco, add blush and sprinkles.',
    '재료 (탁자 위를 눌러도 돼요)': 'Ingredients (or tap the table)', '반죽 맛': 'Flavor',
    '재료를 다 넣으면 그릇 안을 누른 채 빙글빙글 저어요 🥄': 'Then press and stir in the bowl 🥄',
    '반죽 위를 누른 채로 위아래로 쓱쓱 밀어요': 'Press and roll up and down', '모양틀': 'Cutters', '↩ 하나 되돌리기': '↩ Undo one',
    '초록 점선 구간에서 꺼내면 딱 좋아요!': 'Take it out in the green zone!', '말랑': 'Soft', '노릇노릇': 'Golden', '탐': 'Burnt',
    '🔥 굽기 시작': '🔥 Start baking', '🧤 꺼내기': '🧤 Take out', '🧽 다 지우기': '🧽 Clear all', '🔄 새로 굽기': '🔄 Bake again',
    '다 됐어요! 책상으로 →': 'Done! Back to desk →', '🎁 봉지': '🎁 Bag', '🍽 접시': '🍽 Plate',
    '선물 봉지에 넣을 쿠키를 콕 눌러요. 봉지에는 간식까지 합쳐 최대 6개가 들어가요.': 'Tap cookies to pack them (6 max, snacks included).',
    '이미 섞기 시작했어요': 'Already mixing', '재료를 먼저 다 넣어주세요 🧈🥚': 'Add all ingredients first 🧈🥚', '반죽 완성! 말랑말랑 🍪': 'Dough ready! 🍪',
    '넓~게 잘 폈어요! 🪵': 'Nicely rolled! 🪵', '반죽을 끝까지 섞어주세요 🥄': 'Keep mixing 🥄', '반죽을 조금 더 밀어주세요': 'Roll a bit more',
    '쿠키를 하나 이상 찍어주세요': 'Cut at least one cookie', '먼저 구워주세요 🔥': 'Bake first 🔥', '반죽 안쪽에 찍어주세요': 'Cut inside the dough',
    '너무 붙었어요! 조금 떨어뜨려 찍어요': 'Too close! Space them out', '앗, 조금 탔어요 😅 그래도 정성 가득!': 'Oops, a bit burnt 😅 Still made with love!',
    '앗, 아직 말랑말랑해요… 그래도 귀여워요 😋': 'Still soft… but cute 😋', '살짝 연한 쿠키가 됐어요 🍪': 'A little pale 🍪', '완벽해요! 노릇노릇 🎉': 'Perfect! Golden 🎉',
    '띵! 지금이 딱 좋아요 🍪': 'Ding! Perfect timing 🍪', '이미 구웠어요! 다음 단계로 가요': 'Already baked! Go next', '이미 꺼냈어요': 'Already out',
    '먼저 굽기를 시작해요': 'Start baking first', '다 구웠어요! 다음 단계로 가요': 'Done baking! Go next',
    '쿠키를 누르면 냠, 접시를 끌면 옮기기': 'Tap to eat, drag the plate to move', '바삭! 🍪': 'Crunch! 🍪', '음~ 고소해': 'Mmm, nutty',
    '차랑 찰떡궁합 ☕': 'Perfect with tea ☕', '하나만 더…?': 'Just one more…?', '냠, 다 먹었다! 😋': 'Yum, all gone! 😋',
    '접시에 쏙! 🍽': 'On the plate! 🍽', '접시가 꽉 찼어요!': 'The plate is full!', '접시에 더 못 담아요': "Can't fit any more",
    '봉지에 쏙! 🍪': 'In the bag! 🍪', '봉지에 쏙! 🎁': 'In the bag! 🎁', '봉지 포장을 먼저 풀어주세요 🎀': 'Unwrap the bag first 🎀',
    '🥣 반죽': '🥣 Dough', '🧁 붓기': '🧁 Pour', '🎂 붓기': '🎂 Pour', '🔥 굽기': '🔥 Bake', '🍦 크림': '🍦 Cream', '🎁 담기': '🎁 Pack', '✨ 완성': '✨ Done',
    '🌀 테두리': '🌀 Border', '얇게': 'Thin', '보통': 'Medium', '굵게': 'Thick', '🎂 책상에 올리기': '🎂 Put on desk', '🔄 새로 만들기': '🔄 Make another',
    '다 됐어요 →': 'Done →', '끝까지 섞어주세요 🥄': 'Keep mixing 🥄', '조금 더 부어주세요': 'Pour a bit more', '먼저 구워주세요': 'Bake first',
    '크림을 발라주세요': 'Add cream first', '재료를 먼저 다 넣어주세요': 'Add all ingredients first', '반죽 완성! 🥣': 'Batter ready! 🥣',
    '가득 찼어요!': 'Full!', '넘칠 것 같아요!': 'About to overflow!', '살짝 탔어요 😅': 'A bit burnt 😅', '덜 익었어요… 그래도 귀여워 😋': 'Underbaked… still cute 😋',
    '조금 연하게 구워졌어요': 'A little pale', '완벽해요! 🎉': 'Perfect! 🎉', '띵! 지금이 딱 좋아요': 'Ding! Perfect timing', '이미 구웠어요!': 'Already baked!',
    '매끈하게 발랐어요 ✨': 'Smoothly frosted ✨', '크림을 먼저 다 발라요': 'Frost it first', '초코판은 2개까지!': 'Max 2 plaques!', '초는 12개까지!': 'Max 12 candles!',
    '🎂 책상에 올려뒀어요': '🎂 Placed on the desk', '케이크를 못 올렸어요': "Couldn't place the cake", '🎉 후~ 소원 빌었어요?': '🎉 Whoosh~ made a wish?',
    '케이크 다 먹었다! 🎂': 'Cake all gone! 🎂', '냠! 🍰': 'Yum! 🍰', '음~ 달콤해': 'Mmm, sweet', '한 입만 더…': 'One more bite…',
    '누르면 냠, 끌면 옮기기': 'Tap to eat, drag to move'
  };
  const DAY = { '일': 'Sun', '월': 'Mon', '화': 'Tue', '수': 'Wed', '목': 'Thu', '금': 'Fri', '토': 'Sat' };
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const RULES = [
    [/^느린 우체통(.*)$/, (m, a) => `Slow Mailbox${a}`],
    [/^.*하고 싶은 말을 적어보세요.*$/, () => 'Write to your future self...'],
    [/^(\d+)년 (\d+)월 (\d+)일 (.)요일$/, (m, y, mo, d, w) => `${DAY[w]}, ${MON[mo - 1]} ${d}, ${y}`],
    [/^(.+)의 내가 보낸 상자예요\.$/, (m, a) => `A box from you, ${a}.`],
    [/^(.+)의 내가 보낸 편지 💌$/, (m, a) => `A letter from you, ${a} 💌`],
    [/^From\. (.+)의 나$/, (m, a) => `From. me, ${a}`],
    [/^📦 (.+)에 도착할 거예요\. 그때 만나요!$/, (m, a) => `📦 Arrives ${a}. See you then!`],
    [/^아직 열 수 없어요 🔒 (\d+)일 남았어요$/, (m, a) => `Not yet 🔒 ${a} days to go`],
    [/^보관함 (\d+)$/, (m, a) => `Archive ${a}`],
    [/^(.+)에 보냄 · (.+) 도착$/, (m, a, b) => `Sent ${a} · Arrives ${b}`],
    [/^(\d+)년에 도착 \((\d+)\)$/, (m, a, b) => `Arriving ${a} (${b})`],
    [/^지금까지 보낸 편지 (\d+)통 · 기다리는 상자 (\d+)개 · 도착 (\d+)개 · 열어본 편지 (\d+)통$/, (m, a, b, c, d) => `Sent ${a} · Waiting ${b} · Arrived ${c} · Opened ${d}`],
    [/^찍은 쿠키 (\d+) \/ (\d+)개$/, (m, a, b) => `Cookies ${a} / ${b}`],
    [/^쟁반에 남은 쿠키 (\d+)개 · 봉지 (\d+)\/6$/, (m, a, b) => `${a} left on tray · bag ${b}/6`],
    [/^쟁반에 남은 쿠키 (\d+)개$/, (m, a) => `${a} left on tray`],
    [/^쟁반이 꽉 찼어요! \(최대 (\d+)개\)$/, (m, a) => `Tray is full! (max ${a})`],
    [/^물 데우는 중… (\d+)°C$/, (m, a) => `Heating… ${a}°C`],
    [/^우린 지 ([\d.]+)분 · (.+)$/, (m, a, b) => `Steeped ${a} min · ${DICT[b] || b}`],
    [/^티백을 꺼냈어요 · (.+)$/, (m, a) => `Bag out · ${DICT[a] || a}`],
    [/^🧊 얼음 넣기 \((\d)\/5\)$/, (m, a) => `🧊 Add ice (${a}/5)`],
    [/^적은 날 (.+)$/, (m, a) => `Written ${a}`],
    [/^(\d+)쪽 씀$/, (m, a) => `${a} pages`],
    [/^새 공책 (\d+)$/, (m, a) => `Notebook ${a}`],
    [/^(\d)개$/, (m, a) => `×${a}`],
    [/^✉️ 새 편지지: (.+)$/, (m, a) => `✉️ New paper: ${DICT[a] || a}`],
    [/^📒 "(.+)"를 서랍에 넣었어요$/, (m, a) => `📒 "${a}" is back in the drawer`],
    [/^🗑 (.+) 정리 완료! \(↩ 되돌리기 가능\)$/, () => '🗑 Cleared! (↩ to undo)'],
    [/^"(.+)" 공책을 버릴까요\? 안에 적은 내용도 모두 사라져요\.$/, (m, a) => `Throw away "${a}"? Everything inside will be lost.`],
    [/^(.+) · 누르면 펼치기, 끌면 옮기기$/, (m, a) => `${a} · tap to open, drag to move`],
    [/^(\S+) 개봉$/, (m, a) => `Open ${a}`]
  ];
  const HANGUL = /[ㄱ-ㅎ가-힣]/;
  function tr(s) {
    if (!s) return null;
    const t = s.trim();
    if (!t || !HANGUL.test(t)) return null;
    if (DICT[t]) return s.replace(t, () => DICT[t]);
    for (const [re, rep] of RULES) {
      if (re.test(t)) return s.replace(t, () => t.replace(re, rep));
    }
    return null;
  }
  const SKIP = '.read-text, .dy-grid, .arc-item small, script, style, textarea, [hidden]';
  function doText(n) {
    const p = n.parentElement;
    if (!p || p.closest(SKIP)) return;
    const r = tr(n.nodeValue);
    if (r !== null && r !== n.nodeValue) n.nodeValue = r;
  }
  function doAttrs(el) {
    ['placeholder', 'title'].forEach(a => {
      const v = el.getAttribute && el.getAttribute(a);
      const r = tr(v);
      if (r !== null && r !== v) el.setAttribute(a, r);
    });
  }
  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1) return;
    doAttrs(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n = w.nextNode();
    while (n) {
      if (n.nodeType === 3) doText(n);
      else doAttrs(n);
      n = w.nextNode();
    }
  }
  document.documentElement.lang = 'en';
  document.title = tr(document.title) || document.title;
  walk(document.body);
  new MutationObserver(list => {
    list.forEach(m => {
      if (m.type === 'characterData') doText(m.target);
      else if (m.type === 'attributes') doAttrs(m.target);
      else m.addedNodes.forEach(walk);
    });
  }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'title'] });
  const nativeConfirm = window.confirm.bind(window);
  window.confirm = m => nativeConfirm(tr(m) || m);
  console.log('✅ en.js ready!');
})();