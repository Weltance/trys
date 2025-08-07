// Translation strings for EN & TR
const translations = {
  en: {
    home: "Home",
    about: "About",
    contact: "Contact",
    hero_title: "Where Ideas Thrive",
    hero_subtitle: "Build your digital empire with clarity and confidence.",
    chip_actionable: "Actionable",
    chip_nofluff: "No Fluff",
    chip_global: "Global-Ready",
    hero_cta_primary: "Explore the Pack",
    hero_cta_secondary: "Why Weltance",
    highlights_title: "Built for momentum",
    highlight_1_t: "Start fast",
    highlight_1_d: "Zero-to-one guidance you can apply today.",
    highlight_2_t: "Clarity first",
    highlight_2_d: "No noise. Only what moves the needle.",
    highlight_3_t: "Global scale",
    highlight_3_d: "Structure that grows with your brand.",
    product_desc: "From Nobody to Brand. A powerful starter kit for creators who want to build authority from zero.",
    view_product: "View on Fourthwall",
    cta_title: "Ready to start your journey?",
    cta_button: "Start Now"
  },
  tr: {
    home: "Ana Sayfa",
    about: "Hakkımızda",
    contact: "İletişim",
    hero_title: "Fikirlerin Büyüdüğü Yer",
    hero_subtitle: "Dijital imparatorluğunu netlik ve güvenle inşa et.",
    chip_actionable: "Uygulanabilir",
    chip_nofluff: "Gereksiz Yok",
    chip_global: "Global Hazır",
    hero_cta_primary: "Paketi Keşfet",
    hero_cta_secondary: "Neden Weltance",
    highlights_title: "Momentum için üretildi",
    highlight_1_t: "Hızlı başla",
    highlight_1_d: "Bugün uygulayabileceğin sıfırdan-bire rehberlik.",
    highlight_2_t: "Önce netlik",
    highlight_2_d: "Gürültü yok. Sadece işe yarayan adımlar.",
    highlight_3_t: "Küresel ölçek",
    highlight_3_d: "Markanla birlikte büyüyen yapı.",
    product_desc: "Hiçlikten markaya. Sıfırdan otorite kurmak isteyenler için güçlü bir başlangıç paketi.",
    view_product: "Fourthwall'da Görüntüle",
    cta_title: "Yolculuğuna başlamak ister misin?",
    cta_button: "Hemen Başla"
  }
};

function changeLanguage(lang){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const text = translations?.[lang]?.[key];
    if(text!==undefined){ el.textContent = text; }
  });
}

window.addEventListener('DOMContentLoaded',()=>{
  const select = document.getElementById('language-switcher');
  if(select){
    select.addEventListener('change', e=> changeLanguage(e.target.value));
    changeLanguage(select.value || 'en');
  }
});
