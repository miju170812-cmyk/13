/* ===== 공통 레이아웃 (메뉴 · 푸터 · 문의 버튼) ===== */
(function () {
  const S = SITE;
  const page = document.body.dataset.page || "";
  const icon = {
    chat: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1"/><path d="M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/></svg>'
  };
  window.ICON = icon;

  // 대표 문의 수단: 전화 > 카카오 > 이메일 > 문의 페이지
  const primary = S.phone
    ? { href: "tel:" + S.phone.replace(/[^0-9+]/g, ""), label: "전화로 상담 문의하기", ext: false }
    : S.kakao
    ? { href: S.kakao, label: "카카오톡으로 상담하기", ext: true }
    : S.email
    ? { href: "mailto:" + S.email, label: "이메일로 상담 문의하기", ext: false }
    : { href: "contact.html", label: "상담 방법 확인하기", ext: false };
  window.PRIMARY = primary;
  const ext = (p) => (p.ext ? ' target="_blank" rel="noopener"' : "");

  // 페이지 안의 문의 버튼 연결
  document.querySelectorAll("[data-cta]").forEach((a) => {
    a.href = primary.href;
    if (primary.ext) { a.target = "_blank"; a.rel = "noopener"; }
    if (!a.dataset.keep) a.textContent = primary.label;
  });

  const menu = [
    ["index.html", "홈", "home"],
    ["about.html", "센터 소개", "about"],
    ["programs.html", "발달 프로그램", "programs"],
    ["faq.html", "자주 묻는 질문", "faq"],
    ["contact.html", "상담·위치", "contact"]
  ];

  document.getElementById("site-header").innerHTML = `
    <div class="container header-inner">
      <a class="logo" href="index.html"><span class="logo-mark"></span>${S.name}</a>
      <nav class="nav" id="nav">
        ${menu.map(([h, t, k]) => `<a href="${h}" ${k === page ? 'aria-current="page"' : ""}>${t}</a>`).join("")}
      </nav>
      <a class="btn btn-primary btn-sm header-cta" href="${primary.href}"${ext(primary)}>상담 문의</a>
      <button class="menu-btn" id="menuBtn" aria-label="메뉴 열기"><span></span><span></span></button>
    </div>`;

  const channels = [
    [S.instagram, "인스타그램"],
    [S.blog, "블로그"],
    [S.naverPlace, "네이버 플레이스"],
    [S.kakao, "카카오톡 채널"]
  ].filter((c) => c[0]);

  document.getElementById("site-footer").innerHTML = `
    <div class="footer-cta">
      <div class="container">
        <p class="overline light">CONTACT</p>
        <h2>우리 아이의 다음 한 걸음,<br />편하게 먼저 물어보세요.</h2>
        <a class="btn btn-primary btn-lg" href="${primary.href}"${ext(primary)}>${primary.label}</a>
      </div>
    </div>
    <div class="container footer-inner">
      <div>
        <p class="footer-name">${S.name}</p>
        <p class="footer-meta">${S.region} 아이 운동발달센터</p>
        ${S.address ? `<p class="footer-meta">${S.address}</p>` : ""}
        ${S.email ? `<p class="footer-meta"><a href="mailto:${S.email}">${S.email}</a></p>` : ""}
        ${S.phone ? `<p class="footer-meta">${S.phone}</p>` : ""}
        ${S.hours ? `<p class="footer-meta">상담 가능 시간 · ${S.hours}</p>` : ""}
        ${channels.length ? `<div class="channels">${channels.map(([u, t]) => `<a href="${u}" target="_blank" rel="noopener">${icon.link}${t}</a>`).join("")}</div>` : ""}
      </div>
      <nav class="footer-nav">${menu.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}</nav>
    </div>
    <div class="container"><p class="copy">© ${new Date().getFullYear()} ${S.name}</p></div>
    <div class="giant" aria-hidden="true">KUMI</div>`;

  // 모바일 하단 고정 문의 바
  const bar = document.createElement("div");
  bar.className = "mobile-bar";
  bar.innerHTML = `<a href="${primary.href}"${ext(primary)} class="btn btn-primary">${icon.chat}${primary.label}</a>`;
  document.body.appendChild(bar);

  // 메뉴 열기/닫기, 스크롤 시 헤더 유리 배경
  const header = document.getElementById("site-header");
  document.getElementById("menuBtn").addEventListener("click", () => header.classList.toggle("open"));
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // 사진 자리: 파일이 없으면 빈 자리 틀 표시
  document.querySelectorAll(".ph img").forEach((img) => {
    const fail = () => img.parentElement.classList.add("empty");
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail);
  });

  // 스크롤 등장 효과
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    items.forEach((el, i) => {
      const sib = el.parentElement.querySelectorAll(":scope > .reveal");
      el.style.transitionDelay = Math.min([...sib].indexOf(el), 6) * 0.08 + "s";
      io.observe(el);
    });
  }
})();
