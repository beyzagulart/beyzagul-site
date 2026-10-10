/* =====================================================================
   🎮  AYARLAR — SİTENİN BÜTÜN İÇERİĞİ BURADA
   =====================================================================
   Sadece bu dosyayı değiştirerek yazıları, kategorileri ve işleri
   güncelleyebilirsin. Diğer dosyalara dokunmana gerek yok.

   KURALLAR (bozulmasın diye):
   • Yazılar her zaman "çift tırnak" içinde olur.
   • Her satırın sonundaki virgülü silme.
   • Görsel yolu boş bırakılırsa ( "" ) geçici çizim gösterilir.
   • Görsel eklemek için: dosyayı img/ klasörüne koy, yolunu yaz.
       Örnek:  gorsel: "img/karakter/ejderha.png",

   GÖRSEL TÜRLERİ:
   • Resim: .png  .jpg  .webp
   • GIF:   .gif
   • Video: .mp4  .webm   (site bunu kendisi anlar)
   ===================================================================== */

const AYARLAR = {

  /* ---------- SİTE ---------- */
  site: {
    isim: "Beyzagül",
    unvan: "2D Oyun Sanatçısı",
  },

  /* ---------- REHBER: YOLDAŞ KARDEŞ ---------- */
  rehber: {
    isim: "Yoldaş Kardeş",
    gorsel: "",          // Boşsa geçici çizim. Örnek: "img/rehber/yoldas.png"
    yazmaHizi: 28,       // Harf başına milisaniye. Küçük sayı = daha hızlı.

    // Karşılama ekranındaki konuşma. İstediğin kadar satır ekleyebilirsin.
    karsilama: [
      "Ooo, yeni bir maceracı! Hoş geldin yolcu! Ben Yoldaş Kardeş, bu diyarın resmi rehberiyim.",
      "Burası Beyzagül'ün dünyası. Kendisi 2D oyun sanatçısıdır: karakterler çizer, eşyalar tasarlar, koca koca dünyalar kurar... hatta onları hareket ettirir!",
      "Birazdan karşına bir seçim ekranı çıkacak. Tıpkı dövüş oyunlarındaki gibi! Ama merak etme, burada kimse dövüşmüyor. Söz.",
      "Her karakter bir kategoriyi temsil ediyor. Birini seç, o dünyanın kapıları sana açılsın.",
      "Hazırsan başlayalım. Bas bakalım şu tuşa!",
    ],

    // Seçim ekranında köşede söylediği ipucu
    secimIpucu: {
      masaustu: "Fareyle karakterlerin üstüne gel ya da ok tuşlarıyla gez. Beğendiğine tıkla veya Enter'a bas!",
      mobil: "Bir karaktere dokun, tanış. Beğendiysen bir daha dokun ya da SEÇ'e bas!",
    },
  },

  /* ---------- EKRAN YAZILARI ---------- */
  metinler: {
    devam: "Devam ▶",
    basla: "Başla! ▶",
    gec: "Konuşmayı geç ⏭",
    secimBaslik: "Kategorini Seç!",
    secButonu: "SEÇ!",
    secildi: "SEÇİLDİ!",
    geri: "◀ Seçim ekranına dön",
    oyna: "OYNA ▶",
    bosGaleri: "Burası henüz boş... ama çok yakında dolacak!",
  },

  /* ---------- KATEGORİLER ----------
     Her kategori:
       id            → adres çubuğunda görünen kısa ad (Türkçe harf ve boşluk kullanma)
       ad            → ekranda görünen ad
       aciklama      → kısa açıklama
       renk          → kategorinin ana rengi
       karakterGorseli → bu kategorinin karakter çizimi ("" ise geçici çizim)
       statlar       → oyun havası için puanlar (1 ile 5 arası)
       isler         → galerideki işler

     Her iş:
       baslik, aciklama
       gorsel  → işin görseli / GIF'i / videosu ("" ise geçici çizim)
       stil2   → İLERİDE: ikinci çizim stilindeki hali. Şimdilik boş bırak.
       link    → (isteğe bağlı) "Oyna" butonunun gideceği adres
  */
  kategoriler: [
    {
      id: "karakter-tasarimi",
      ad: "Karakter Tasarımı",
      aciklama: "Kalemiyle kahramanlara can veren usta. Kahramanlar, kötüler ve sevimli yan karakterler burada doğar.",
      renk: "#4CC9F0",
      karakterGorseli: "",
      statlar: [["Hayal Gücü", 5], ["Detay", 4], ["Sevimlilik", 5]],
      isler: [
        { baslik: "Orman Büyücüsü", aciklama: "Match oyunu için ana karakter tasarımı.", gorsel: "", stil2: "" },
        { baslik: "Huysuz Cüce", aciklama: "Yan karakter, ifade çalışmalarıyla birlikte.", gorsel: "", stil2: "" },
        { baslik: "Kedi Şövalye", aciklama: "Karikatür stilinde kahraman konsepti.", gorsel: "", stil2: "" },
        { baslik: "Kötü Patron", aciklama: "Bölüm sonu canavarı için eskizler.", gorsel: "", stil2: "" },
      ],
    },
    {
      id: "prop-tasarimi",
      ad: "Prop Tasarımı",
      aciklama: "Sandıklar, iksirler, kılıçlar... Oyun dünyasındaki her eşyanın bir hikâyesi var.",
      renk: "#9B5DE5",
      karakterGorseli: "",
      statlar: [["Detay", 5], ["Işıltı", 5], ["Ağırlık", 3]],
      isler: [
        { baslik: "Hazine Sandığı", aciklama: "Açılma animasyonuna uygun katmanlı tasarım.", gorsel: "", stil2: "" },
        { baslik: "İksir Şişeleri", aciklama: "Farklı güçler için renkli şişe seti.", gorsel: "", stil2: "" },
        { baslik: "Silah Seti", aciklama: "Seviyeye göre güçlenen kılıç tasarımları.", gorsel: "", stil2: "" },
      ],
    },
    {
      id: "environment",
      ad: "Environment",
      aciklama: "Koca dünyaları sırtında taşıyan bina. Ormanlar, kasabalar ve zindanlar onun eseri.",
      renk: "#F4A261",
      karakterGorseli: "",
      statlar: [["Atmosfer", 5], ["Boyut", 5], ["Sabır", 4]],
      isler: [
        { baslik: "Büyülü Kasaba", aciklama: "Ana menü arka planı.", gorsel: "", stil2: "" },
        { baslik: "Mantar Ormanı", aciklama: "Seviye 3 için oyun alanı.", gorsel: "", stil2: "" },
        { baslik: "Zindan Girişi", aciklama: "Karanlık bölüm için atmosfer çalışması.", gorsel: "", stil2: "" },
      ],
    },
    {
      id: "animasyon",
      ad: "Animasyon",
      aciklama: "Kemikler, pinler, rig'ler! Çizimleri yerinden kaldırıp hareket ettiren sihirbaz.",
      renk: "#00C9A7",
      karakterGorseli: "",
      statlar: [["Akıcılık", 5], ["Zamanlama", 4], ["Enerji", 5]],
      isler: [
        { baslik: "Yürüme Döngüsü", aciklama: "İskelet (rig) animasyonu ile yürüme.", gorsel: "", stil2: "" },
        { baslik: "Saldırı Animasyonu", aciklama: "Kılıç savurma, GIF olarak.", gorsel: "", stil2: "" },
        { baslik: "Rig Kurulumu", aciklama: "Karakterin kemik yapısını gösteren video.", gorsel: "", stil2: "" },
      ],
    },
    {
      id: "ui-ux",
      ad: "UI / UX",
      aciklama: "Butonlar, menüler, ikonlar. Oyuncunun parmağının değdiği her yer onun işi.",
      renk: "#FEE440",
      karakterGorseli: "",
      statlar: [["Netlik", 5], ["Düzen", 5], ["Tıklanabilirlik", 5]],
      isler: [
        { baslik: "Ana Menü", aciklama: "Mobil oyun ana ekran tasarımı.", gorsel: "", stil2: "" },
        { baslik: "Mağaza Ekranı", aciklama: "Oyun içi mağaza ve ödül ekranları.", gorsel: "", stil2: "" },
        { baslik: "İkon Seti", aciklama: "Yetenek ve eşya ikonları.", gorsel: "", stil2: "" },
      ],
    },
    {
      id: "oyunlarim",
      ad: "Oyunlarım",
      aciklama: "Elinde oyun kolu, gözünde ateş. Sanatını yaptığım oyunlar burada, hemen oynayabilirsin!",
      renk: "#FF5D5D",
      karakterGorseli: "",
      statlar: [["Eğlence", 5], ["Bağımlılık", 4], ["Kahkaha", 5]],
      isler: [
        { baslik: "Potion Hustle", aciklama: "İksir sıralama bulmaca oyunu. Yapım aşamasında!", gorsel: "", stil2: "", link: "https://itch.io/" },
        { baslik: "Deneme Oyunu", aciklama: "Game jam için 48 saatte yapılmış küçük bir oyun.", gorsel: "", stil2: "", link: "https://itch.io/" },
      ],
    },
  ],
};
