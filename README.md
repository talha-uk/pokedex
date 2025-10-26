# ⚡ Pokédex

Modern ve interaktif bir Pokédex uygulaması. Tüm Pokemon'ları keşfedin, türlerine göre filtreleyin ve detaylı bilgilerini inceleyin.

![Pokédex](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ Özellikler

### 🎮 **Kapsamlı Pokemon Koleksiyonu**
- **Tüm Pokemon'lar**: 1000+ Pokemon verisi
- **Gerçek Zamanlı Yükleme**: Progresif veri yükleme
- **Responsive Grid**: Tüm cihazlarda optimize görünüm
- **Animasyonlu Kartlar**: Hover efektleri ve geçişler

### 🔍 **Gelişmiş Arama ve Filtreleme**
- **Akıllı Arama**: İsim ve numara ile arama
- **Tür Filtreleme**: 18 farklı Pokemon türü
- **Çoklu Tür Seçimi**: En fazla 2 tür kombinasyonu
- **Anlık Sonuçlar**: Gerçek zamanlı filtreleme

### 🎨 **Görsel Deneyim**
- **Animasyon Modu**: Statik/Animasyonlu sprite geçişi
- **Cyberpunk Tema**: Neon efektler ve modern tasarım
- **Pokeball Logo**: Dönen animasyonlu logo
- **Gradient Efektler**: Dinamik renk geçişleri

### 📱 **Detaylı Pokemon Bilgileri**
- **Modal Görünüm**: Tam ekran detay sayfası
- **İstatistikler**: Görsel stat barları
- **Evrim Zinciri**: Interaktif evrim ağacı
- **Yetenekler**: Pokemon yetenekleri listesi
- **Fiziksel Özellikler**: Boy, kilo ve açıklamalar

### 🌟 **Kullanıcı Deneyimi**
- **Klavye Desteği**: ESC ile modal kapatma
- **Loading Animasyonları**: Smooth yükleme deneyimi
- **Bildirimler**: Kullanıcı geri bildirimleri
- **Responsive Tasarım**: Mobil-first yaklaşım

## 🚀 Kurulum

### Hızlı Başlangıç

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/kullaniciadi/pokedex.git
cd pokedex
```

2. **Tarayıcıda açın:**
```bash
# Basit HTTP sunucusu ile
python -m http.server 8000
# veya
npx serve .
# veya Live Server uzantısı ile
```

3. **http://localhost:8000** adresine gidin

## 📁 Proje Yapısı

```
pokedex/
├── 📄 index.html          # Ana HTML dosyası
├── 📄 script.js           # JavaScript mantığı
├── 📄 styles.css          # Özel CSS stilleri
├── 📄 README.md           # Bu dosya
└── 📁 .git/               # Git repository
```

## ⚙️ Kullanım

### Temel Kullanım

1. **Pokemon Arama**: Üst kısımdaki arama çubuğuna Pokemon adı veya numarası yazın
2. **Tür Filtreleme**: Tür butonlarına tıklayarak filtreleme yapın
3. **Detay Görüntüleme**: Herhangi bir Pokemon kartına tıklayın
4. **Animasyon Modu**: Sağ üstteki toggle ile animasyonlu/statik sprite geçişi yapın

### Gelişmiş Özellikler

#### Çoklu Tür Filtreleme
- En fazla 2 tür seçebilirsiniz
- Seçili türler mavi renkte görünür
- "Tümü" butonu ile tüm filtreleri temizleyebilirsiniz

#### Evrim Zinciri
- Pokemon detay sayfasında evrim zincirini görüntüleyin
- Evrim aşamalarına tıklayarak diğer Pokemon'lara geçiş yapın
- Evrim koşulları ve gereksinimleri görüntülenir


## 📱 Responsive Tasarım

- **Desktop (1200px+)**: 5 kolon grid layout
- **Tablet (768px-1199px)**: 4 kolon layout  
- **Mobil (480px-767px)**: 2 kolon layout
- **Küçük ekranlar (<480px)**: 1 kolon layout

## 🔧 Teknik Detaylar

### Kullanılan Teknolojiler
- **HTML5**: Semantic markup ve modern HTML özellikleri
- **CSS3**: Flexbox, Grid, Animations, Custom Properties
- **Vanilla JavaScript**: ES6+ özellikleri, Async/Await
- **TailwindCSS**: Utility-first CSS framework
- **Font Awesome**: Icon library
- **PokéAPI**: Pokemon verileri için RESTful API

### API Entegrasyonu
```javascript
// Pokemon verilerini çekme
const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50&offset=0');
const data = await response.json();

// Detaylı Pokemon bilgileri
const pokemonDetails = await fetch(pokemon.url);
const pokemonData = await pokemonDetails.json();
```

### Performans Optimizasyonları
- **Batch Loading**: Pokemon'lar 50'şerli gruplar halinde yüklenir
- **Caching**: Evrim zinciri verileri cache'lenir
- **Lazy Rendering**: Sadece görünür kartlar render edilir
- **Debounced Search**: Arama performansı optimizasyonu
- **CSS Animations**: GPU hızlandırmalı animasyonlar

### Tarayıcı Desteği
- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 13+
- ✅ Edge 79+
- ✅ Mobile Safari 13+
- ✅ Chrome Mobile 70+

## 🎯 Özellik Detayları

### Pokemon Kartları
- **Hover Efektleri**: 3D transform ve glow efektleri
- **Tür Rozetleri**: Renkli tür göstergeleri
- **Pokemon Numarası**: Sağ üst köşede rozet
- **Animasyonlu Sprite**: Opsiyonel hareket eden görseller

### Modal Detay Sayfası
- **Büyük Pokemon Görseli**: Merkezi görsel
- **İstatistik Barları**: Animasyonlu progress barlar
- **Evrim Zinciri**: Interaktif evrim ağacı
- **Yetenekler**: Chip formatında yetenekler
- **Açıklama**: Pokemon hakkında detaylı bilgi

### Filtreleme Sistemi
- **Tür Filtreleri**: 18 farklı Pokemon türü
- **Çoklu Seçim**: En fazla 2 tür kombinasyonu
- **Görsel Geri Bildirim**: Seçili türler için özel stil
- **Akıllı Arama**: İsim ve ID ile arama

## 🤝 Katkıda Bulunma

1. **Fork** edin
2. **Feature branch** oluşturun (`git checkout -b feature/yeni-ozellik`)
3. **Commit** edin (`git commit -m 'Yeni özellik eklendi'`)
4. **Push** edin (`git push origin feature/yeni-ozellik`)
5. **Pull Request** açın

### Geliştirme Rehberi

```bash
# Geliştirme ortamı kurulumu
git clone https://github.com/kullaniciadi/pokedex.git
cd pokedex

# Local server başlatma
python -m http.server 8000

# Test etme
# Tarayıcıda http://localhost:8000 açın
```

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- **PokéAPI** - Kapsamlı Pokemon veritabanı için
- **TailwindCSS** - Modern CSS framework için
- **Font Awesome** - Icon library için
- **Pokemon Company** - Orijinal Pokemon tasarımları için

## 📞 İletişim

- **GitHub**: [@kullaniciadi](https://github.com/kullaniciadi)
- **Email**: email@example.com
- **Website**: [website.com](https://website.com)

---

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

## 🔄 Güncellemeler

### v1.0.0 (2024-10-26)
- ✨ İlk sürüm yayınlandı
- 🎮 1000+ Pokemon desteği
- 🔍 Gelişmiş arama ve filtreleme
- 📱 Tam responsive tasarım
- 🎨 Cyberpunk tema ve animasyonlar
- ⚡ Performans optimizasyonları
- 🧬 Evrim zinciri görüntüleme

---

<div align="center">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red.svg"/>
  <img src="https://img.shields.io/badge/Built%20with-HTML%20CSS%20JS-blue.svg"/>
  <img src="https://img.shields.io/badge/Powered%20by-PokéAPI-yellow.svg"/>
</div>
