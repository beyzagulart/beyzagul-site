/* =====================================================================
   OYUN MOTORU — Bu dosyayı değiştirmene gerek yok.
   İçerik için ayarlar.js dosyasını düzenle.
   ===================================================================== */
(() => {
  "use strict";

  const A = AYARLAR;
  const M = A.metinler;
  const $ = (s, el = document) => el.querySelector(s);
  const YER_TUTUCU = "img/yer-tutucu/";
  const azHareket = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dokunmatik = matchMedia("(hover: none)").matches;

  // İleride stil değiştirme eklenecek: "stil1" = gorsel, "stil2" = stil2
  let aktifStil = "stil1";

  /* ---------------- YARDIMCILAR ---------------- */
  const karakterYolu = (k) => k.karakterGorseli || YER_TUTUCU + k.id + ".svg";
  const rehberYolu = () => A.rehber.gorsel || YER_TUTUCU + "yoldas-kardes.svg";
  const isGorseli = (is) => (aktifStil === "stil2" && is.stil2) ? is.stil2 : is.gorsel;

  function medyaTuru(yol) {
    if (/\.(mp4|webm|mov)$/i.test(yol)) return "video";
    if (/\.gif$/i.test(yol)) return "gif";
    return "resim";
  }

  // Resim yüklenemezse (yanlış yol vb.) geçici çizime dön
  function resimKoy(img, yol, yedek) {
    img.onerror = () => {
      img.onerror = null;
      if (yedek) img.src = yedek;
    };
    img.src = yol;
  }

  // İş görseli boşken gösterilen geçici çizim
  function isYerTutucu(kat, sira) {
    const animasyonlu = kat.id === "animasyon";
    const ikon = animasyonlu
      ? `<circle r="52" fill="#fff"/><path d="M-16 -26 L30 0 L-16 26Z" fill="${kat.renk}"/>`
      : `<rect x="-70" y="-52" width="140" height="104" rx="12" fill="#fff"/>
         <circle cx="-32" cy="-18" r="14" fill="#FFD23F"/>
         <path d="M-62 44 L-22 -2 L8 28 L30 8 L62 44Z" fill="${kat.renk}"/>`;
    const egim = [-6, 4, -3, 5][sira % 4];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <defs><pattern id="p" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="9" cy="9" r="3" fill="#000" opacity=".12"/></pattern></defs>
      <rect width="400" height="300" fill="${kat.renk}"/>
      <rect width="400" height="300" fill="url(#p)"/>
      <g transform="translate(200 125) rotate(${egim})" stroke="#1a1a1a" stroke-width="6" stroke-linejoin="round">${ikon}</g>
      <text x="200" y="255" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900"
        font-size="24" fill="#fff" stroke="#1a1a1a" stroke-width="7" paint-order="stroke" stroke-linejoin="round">ÇİZİM GELECEK</text>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  // Bir iş için <img> ya da <video> üretir
  function medyaOlustur(is, kat, sira, buyuk) {
    const yol = isGorseli(is);
    const yedek = isYerTutucu(kat, sira);
    if (yol && medyaTuru(yol) === "video") {
      const v = document.createElement("video");
      v.src = yol;
      v.muted = !buyuk;
      v.loop = true;
      v.playsInline = true;
      v.autoplay = true;
      v.controls = !!buyuk;
      v.setAttribute("aria-label", is.baslik);
      return v;
    }
    const img = document.createElement("img");
    img.alt = is.baslik;
    img.loading = buyuk ? "eager" : "lazy";
    resimKoy(img, yol || yedek, yedek);
    return img;
  }

  /* ---------------- DAKTİLO EFEKTİ ---------------- */
  function daktilo(el, metin, hiz) {
    const harfler = Array.from(metin);
    let i = 0, zaman = null, yaziyor = true;
    el.classList.remove("bitti");
    el.classList.add("yaziyor");
    el.textContent = "";

    function bitir() {
      clearInterval(zaman);
      el.textContent = metin;
      yaziyor = false;
      el.classList.remove("yaziyor");
      el.classList.add("bitti");
    }
    if (azHareket) bitir();
    else zaman = setInterval(() => {
      i++;
      el.textContent = harfler.slice(0, i).join("");
      if (i >= harfler.length) bitir();
    }, hiz);

    return {
      yaziyorMu: () => yaziyor,
      tamamla: bitir,
      durdur: () => clearInterval(zaman),
    };
  }

  /* ---------------- EKRAN YÖNETİMİ ---------------- */
  let aktifEkran = null;
  function ekranGoster(ad) {
    aktifEkran = ad;
    document.querySelectorAll(".ekran").forEach((e) =>
      e.classList.toggle("aktif", e.id === "ekran-" + ad));
    window.scrollTo(0, 0);
  }

  const kategoriBul = (id) => A.kategoriler.find((k) => k.id === id);

  function rota() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h.startsWith("kategori/")) {
      const k = kategoriBul(h.slice(9));
      if (k) return kategoriAc(k);
    }
    if (h === "secim") return secimAc();
    karsilamaAc();
  }

  /* ---------------- 1) KARŞILAMA ---------------- */
  const kEl = $("#ekran-karsilama");
  const balonYazi = $(".balon-yazi", kEl);
  const btnDevam = $("#btn-devam");
  let satir = 0, aktifYazi = null;

  function karsilamaAc() {
    ekranGoster("karsilama");
    satir = 0;
    satirGoster();
    btnDevam.focus({ preventScroll: true });
  }
  function satirGoster() {
    const son = satir === A.rehber.karsilama.length - 1;
    btnDevam.textContent = son ? M.basla : M.devam;
    if (aktifYazi) aktifYazi.durdur();
    aktifYazi = daktilo(balonYazi, A.rehber.karsilama[satir], A.rehber.yazmaHizi || 28);
  }
  function devam() {
    if (aktifYazi && aktifYazi.yaziyorMu()) return aktifYazi.tamamla();
    satir++;
    if (satir >= A.rehber.karsilama.length) return gec();
    satirGoster();
  }
  function gec() {
    if (aktifYazi) aktifYazi.durdur();
    location.hash = "secim";
  }

  /* ---------------- 2) SEÇİM ---------------- */
  const sEl = $("#ekran-secim");
  const izgara = $(".izgara", sEl);
  const onizleme = $(".onizleme", sEl);
  const onizlemeImg = $(".onizleme-karakter", sEl);
  const onizlemeAd = $(".onizleme-ad", sEl);
  const secildiEl = $(".secildi");
  let odak = 0, seciliyor = false, ipucuYazi = null;

  function izgaraKur() {
    A.kategoriler.forEach((k, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "kart";
      b.setAttribute("role", "option");
      b.style.setProperty("--renk", k.renk);
      const img = document.createElement("img");
      img.alt = "";
      resimKoy(img, karakterYolu(k), YER_TUTUCU + k.id + ".svg");
      const ad = document.createElement("span");
      ad.className = "kart-ad";
      ad.textContent = k.ad;
      b.append(img, ad);

      b.addEventListener("mouseenter", () => { if (!dokunmatik) odakla(i); });
      // Telefonda dokunuş da odak verir; orada önizlemeyi sadece click yönetsin
      b.addEventListener("focus", () => { if (!dokunmatik) odakla(i); });
      b.addEventListener("click", () => {
        if (dokunmatik && odak !== i) return odakla(i);
        sec(i);
      });
      izgara.append(b);
    });
  }

  function odakla(i) {
    if (seciliyor || (i === odak && izgara.children[i].classList.contains("secili"))) return;
    odak = i;
    const k = A.kategoriler[i];
    [...izgara.children].forEach((c, j) => {
      c.classList.toggle("secili", j === i);
      c.setAttribute("aria-selected", j === i);
    });
    onizleme.style.setProperty("--renk", k.renk);
    resimKoy(onizlemeImg, karakterYolu(k), YER_TUTUCU + k.id + ".svg");
    onizlemeAd.textContent = k.ad;
    $(".onizleme-aciklama", sEl).textContent = k.aciklama;
    const statlar = $(".statlar", sEl);
    statlar.innerHTML = "";
    (k.statlar || []).forEach(([ad, puan]) => {
      const li = document.createElement("li");
      li.className = "stat";
      li.innerHTML = `<span></span><span class="stat-bar">${
        [1, 2, 3, 4, 5].map((n) => `<i class="${n <= puan ? "dolu" : ""}"></i>`).join("")}</span>`;
      li.firstChild.textContent = ad;
      statlar.append(li);
    });
    statlar.hidden = !(k.statlar && k.statlar.length);
    // giriş animasyonunu yeniden başlat
    [onizlemeImg, onizlemeAd].forEach((el) => {
      el.classList.remove("giris");
      void el.offsetWidth;
      el.classList.add("giris");
    });
  }

  function sec(i) {
    if (seciliyor) return;
    seciliyor = true;
    const k = A.kategoriler[i];
    $(".secildi-yazi").textContent = M.secildi;
    $(".secildi-ad").textContent = k.ad;
    secildiEl.classList.add("goster");
    document.body.classList.add("titre");
    setTimeout(() => {
      secildiEl.classList.remove("goster");
      document.body.classList.remove("titre");
      seciliyor = false;
      location.hash = "kategori/" + k.id;
    }, azHareket ? 400 : 1300);
  }

  function secimAc() {
    ekranGoster("secim");
    const secili = izgara.children[odak];
    izgara.querySelectorAll(".secili").forEach((c) => c.classList.remove("secili"));
    odakla(odak);
    secili.focus({ preventScroll: true });
    if (ipucuYazi) ipucuYazi.durdur();
    const ipucu = dokunmatik ? A.rehber.secimIpucu.mobil : A.rehber.secimIpucu.masaustu;
    ipucuYazi = daktilo($(".balon-mini p", sEl), ipucu, A.rehber.yazmaHizi || 28);
  }

  function izgaraSutun() {
    return getComputedStyle(izgara).gridTemplateColumns.split(" ").length || 3;
  }

  /* ---------------- 3) KATEGORİ ---------------- */
  const katEl = $("#ekran-kategori");
  const galeri = $(".galeri", katEl);
  let aktifKategori = null;

  function kategoriAc(k) {
    aktifKategori = k;
    ekranGoster("kategori");
    document.title = `${k.ad} · ${A.site.isim}`;
    $(".kategori-ust", katEl).style.setProperty("--renk", k.renk);
    const img = $(".kategori-karakter", katEl);
    img.alt = k.ad;
    resimKoy(img, karakterYolu(k), YER_TUTUCU + k.id + ".svg");
    $(".kategori-ad", katEl).textContent = k.ad;
    $(".kategori-aciklama", katEl).textContent = k.aciklama;

    galeri.innerHTML = "";
    if (!k.isler || !k.isler.length) {
      const bos = document.createElement("p");
      bos.className = "bos-galeri";
      bos.textContent = M.bosGaleri;
      galeri.append(bos);
    }
    (k.isler || []).forEach((is, i) => {
      const kart = document.createElement("article");
      kart.className = "is-kart";
      kart.style.setProperty("--sira", i);
      kart.style.setProperty("--egim", ["-1deg", "1deg", "-.5deg", ".8deg"][i % 4]);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "is-gorsel";
      btn.setAttribute("aria-label", is.baslik + " — büyüt");
      btn.append(medyaOlustur(is, k, i, false));
      const yol = isGorseli(is);
      const tur = yol ? medyaTuru(yol) : "";
      if (tur === "gif" || tur === "video") {
        const r = document.createElement("span");
        r.className = "rozet";
        r.textContent = tur === "gif" ? "GIF" : "VİDEO";
        btn.append(r);
      }
      btn.addEventListener("click", () => lightboxAc(i));

      const bilgi = document.createElement("div");
      bilgi.className = "is-bilgi";
      const h = document.createElement("h3");
      h.textContent = is.baslik;
      const p = document.createElement("p");
      p.textContent = is.aciklama || "";
      bilgi.append(h, p);
      if (is.link) bilgi.append(oynaLinki(is.link));

      kart.append(btn, bilgi);
      galeri.append(kart);
    });
  }

  function oynaLinki(href) {
    const a = document.createElement("a");
    a.className = "btn btn-oyna";
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = M.oyna;
    return a;
  }

  /* ---------------- BÜYÜK GÖRSEL PENCERESİ ---------------- */
  const lb = $(".lightbox");
  const lbMedya = $(".lightbox-medya", lb);
  let lbSira = 0, lbOnceki = null;

  function lightboxAc(i) {
    if (lb.hidden) lbOnceki = document.activeElement;
    const isler = aktifKategori.isler;
    lbSira = (i + isler.length) % isler.length;
    const is = isler[lbSira];
    lbMedya.innerHTML = "";
    lbMedya.append(medyaOlustur(is, aktifKategori, lbSira, true));
    $("h3", lb).textContent = is.baslik;
    $(".lightbox-bilgi p", lb).textContent = is.aciklama || "";
    const link = $(".lightbox-link", lb);
    link.innerHTML = "";
    if (is.link) link.append(oynaLinki(is.link));
    const tek = isler.length < 2;
    lb.querySelectorAll(".lightbox-ok").forEach((b) => (b.hidden = tek));
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    $(".lightbox-kapat", lb).focus();
  }
  function lightboxKapat() {
    lb.hidden = true;
    lbMedya.innerHTML = "";
    document.body.style.overflow = "";
    if (lbOnceki) lbOnceki.focus({ preventScroll: true });
  }

  /* ---------------- KLAVYE ---------------- */
  document.addEventListener("keydown", (e) => {
    if (!lb.hidden) {
      if (e.key === "Escape") lightboxKapat();
      else if (e.key === "ArrowRight") lightboxAc(lbSira + 1);
      else if (e.key === "ArrowLeft") lightboxAc(lbSira - 1);
      return;
    }
    if (aktifEkran === "karsilama") {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); devam(); }
      else if (e.key === "Escape") gec();
    } else if (aktifEkran === "secim") {
      const n = A.kategoriler.length, sutun = izgaraSutun();
      const hareket = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: sutun, ArrowUp: -sutun }[e.key];
      if (hareket) {
        e.preventDefault();
        const yeni = (odak + hareket + n) % n;
        izgara.children[yeni].focus({ preventScroll: true });
        odakla(yeni);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        sec(odak);
      }
    } else if (aktifEkran === "kategori" && e.key === "Escape") {
      location.hash = "secim";
    }
  });

  /* ---------------- BAŞLAT ---------------- */
  function baslat() {
    document.title = `${A.site.isim} · ${A.site.unvan}`;
    $(".logo-isim").textContent = A.site.isim;
    $(".logo-unvan").textContent = A.site.unvan;
    $(".balon-isim").textContent = A.rehber.isim;
    $("#btn-gec").textContent = M.gec;
    $(".ekran-baslik").textContent = M.secimBaslik;
    $(".btn-sec").textContent = M.secButonu;
    $(".btn-geri").textContent = M.geri;

    const rehberYedek = YER_TUTUCU + "yoldas-kardes.svg";
    resimKoy($(".rehber-buyuk"), rehberYolu(), rehberYedek);
    $(".rehber-buyuk").alt = A.rehber.isim;
    resimKoy($(".mini-rehber img"), rehberYolu(), rehberYedek);

    btnDevam.addEventListener("click", devam);
    balonYazi.addEventListener("click", devam);
    $("#btn-gec").addEventListener("click", gec);
    $(".btn-sec").addEventListener("click", () => sec(odak));
    $(".btn-geri").addEventListener("click", () => { location.hash = "secim"; });
    $(".lightbox-kapat").addEventListener("click", lightboxKapat);
    $(".lightbox-onceki").addEventListener("click", () => lightboxAc(lbSira - 1));
    $(".lightbox-sonraki").addEventListener("click", () => lightboxAc(lbSira + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) lightboxKapat(); });

    izgaraKur();
    window.addEventListener("hashchange", () => {
      if (!lb.hidden) lightboxKapat();
      if (aktifEkran === "karsilama" && aktifYazi) aktifYazi.durdur();
      if (!location.hash.startsWith("#kategori/")) document.title = `${A.site.isim} · ${A.site.unvan}`;
      rota();
    });
    rota();
  }

  baslat();
})();
