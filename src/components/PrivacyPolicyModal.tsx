import React, { useState } from 'react';
import { 
  X, ShieldCheck, Lock, Trash2, Eye, Server, 
  Sparkles, CheckCircle2, Globe, FileText, ChevronRight,
  Download, Printer, AlertTriangle
} from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAccountSettings?: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  onOpenAccountSettings
}) => {
  const [activeTab, setActiveTab] = useState<'policy' | 'datasafety' | 'deletion'>('policy');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Gizlilik Politikası & Veri Güvenliği
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                glotvia • Son Güncelleme: 20 Ağustos 2026 • Google Play Uyumlu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('policy')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'policy'
                ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500 border-x border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Gizlilik Sözleşmesi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('datasafety')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'datasafety'
                ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-500 border-x border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Play Store Data Safety
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deletion')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'deletion'
                ? 'bg-slate-900 text-rose-400 border-t-2 border-rose-500 border-x border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Hesap ve Veri Silme
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed custom-scrollbar">
          
          {activeTab === 'policy' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-indigo-200">
                  <strong>glotvia</strong> ("Uygulama"), kullanıcılarının gizliliğine ve kişisel verilerinin korunmasına azami derecede önem verir. Bu metin, 6698 sayılı KVKK ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) ile Google Play Store Politikaları gereğince hazırlanmıştır.
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  1. Hangi Verileri Topluyoruz ve Neden?
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc pl-5">
                  <li><strong>Hesap Bilgileri:</strong> Kayıt ve giriş için kullanılan e-posta adresi, ad/rumuz ve seçilen profil avatarı.</li>
                  <li><strong>Öğrenme İlerlemesi:</strong> Tamamlanan dersler, öğrenilen kelime kartları, çözülen sınavlar, XP puanları, streak (günlük seri) ve kazanılan jetonlar.</li>
                  <li><strong>Ses Verileri (Mikrofon):</strong> AI Telaffuz Koçu özelliğini kullandığınızda mikrofonunuzdan alınan ses, <em>yalnızca anlık telaffuz doğruluğunu analiz etmek için</em> işlenir. Ses kayıtlarınız sunucularımızda ASLA kalıcı olarak depolanmaz veya üçüncü taraflara satılmaz.</li>
                  <li><strong>Abonelik ve Ödeme Bilgileri:</strong> Google Play Billing veya ödeme altyapısı üzerinden gerçekleştirilen satın alma planı, sipariş numarası ve son kullanma tarihi. (Kredi kartı detayları doğrudan güvenli ödeme işlemcisi tarafından yönetilir; kart numarası tarafımızca saklanmaz).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  2. Entegre Edilen Üçüncü Taraf Servisler (SDK'lar)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="font-bold text-indigo-400 block mb-1">🔥 Firebase Auth & Firestore</span>
                    Kullanıcı kimlik doğrulaması, şifre sıfırlama ve öğrenme ilerlemesinin güvenli bulut senkronizasyonu için kullanılır.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="font-bold text-indigo-400 block mb-1">🤖 Google Gemini AI</span>
                    Yapay zeka tabanlı dil bilgisi düzeltmeleri, telaffuz analizi ve interaktif dil eğitmeni yanıtları üretmek için kullanılır.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="font-bold text-indigo-400 block mb-1">💳 Google Play Billing</span>
                    Uygulama içi satın alma, PRO üyelik abonelikleri ve satın alımların geri yüklenmesi işlemlerini yürütür.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="font-bold text-indigo-400 block mb-1">🔊 Web Speech API & TTS</span>
                    Almanca telaffuz ve diyalog seslendirmelerinin cihazınızda doğal şekilde çalınması için kullanılır.
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  3. Veri Güvenliği ve Şifreleme
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Tüm veri aktarımları endüstri standardı <strong>HTTPS / TLS 1.3</strong> şifreleme protokolleri ile güvence altına alınır. Firebase Firestore Security Rules kuralları uyarınca bir kullanıcı yalnızca kendi hesabına ait verilere erişebilir; başkalarının verilerini okuyamaz veya değiştiremez.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  4. Çocukların Gizliliği
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Uygulamamız 13 yaş ve üzerindeki kullanıcılara yöneliktir. 13 yaş altındaki bireylerden bilerek kişisel veri toplanmaz.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  5. İletişim ve Veri Sorumlusu
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Gizlilik politikamız veya kişisel verilerinizle ilgili her türlü soru, görüş ve talepleriniz için bize ulaşabilirsiniz:
                  <br />
                  <span className="text-indigo-400 font-mono">E-posta: support@glotvia.app / ufukyildiz999@gmail.com</span>
                </p>
              </div>

            </div>
          )}

          {activeTab === 'datasafety' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs sm:text-sm text-emerald-200">
                <strong>Google Play Data Safety Form Rehberi:</strong> Bu tablo, Google Play Console'daki "Veri Güvenliği" formunu doldururken birebir seçeceğiniz yanıtları içerir.
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>1. Veri Toplama & Paylaşımı:</span>
                    <span className="text-emerald-400">Toplanan Veriler Sadece Uygulama İşlevi İçindir</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    - Üçüncü taraflara reklam veya ticari pazarlama amacıyla veri satışı / paylaşımı <strong>YOKTUR (Hayır)</strong>.
                    <br />
                    - Toplanan tüm veriler yalnızca hesap yönetimi ve dil öğrenme ilerlemesi için gereklidir.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>2. Güvenlik Uygulamaları:</span>
                    <span className="text-emerald-400">Aktarım Sırasında Şifrelenir (Evet)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    - Verileriniz HTTPS şifrelemesiyle iletilir.
                    <br />
                    - Kullanıcıların hesap ve verilerini uygulama içinden tek tıkla silme hakkı mevcuttur <strong>(Evet)</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>3. Toplanan Veri Kategorileri:</span>
                    <span className="text-indigo-400">Kişisel Bilgiler & Uygulama İçi Satın Alma</span>
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc pl-5">
                    <li><strong>Kişisel Bilgiler:</strong> İsim ve E-posta (Hesap yönetimi ve giriş için).</li>
                    <li><strong>Finansal Bilgiler:</strong> Satın alma geçmişi (Google Play Billing / Sipariş takibi).</li>
                    <li><strong>Ses Kayıtları:</strong> Mikrofon (Sadece anlık telaffuz puanlaması için, saklanmaz).</li>
                    <li><strong>Uygulama Etkinliği:</strong> Ders tamamlama, sınav puanları ve XP ilerlemesi.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deletion' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs sm:text-sm text-rose-200">
                <strong>Google Play Hesap Silme Politikası Uyarınca:</strong> Kullanıcılar istedikleri an hesaplarını ve buna bağlı tüm verilerini uygulama içerisinden veya web üzerinden kalıcı olarak silebilirler.
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <h4 className="font-bold text-white">Hesabınızı Sildiğinizde Ne Olur?</h4>
                <ul className="space-y-1.5 list-disc pl-5 text-slate-400">
                  <li>Firebase Authentication kimlik kaydınız tamamen silinir.</li>
                  <li>Cloud Firestore veritabanındaki tüm ilerleme verileriniz (XP, streak, çözülen dersler) kalıcı olarak silinir.</li>
                  <li>Cihazınızdaki tüm önbellek ve kullanıcı oturumu temizlenir.</li>
                  <li>Bu işlem geri alınamaz.</li>
                </ul>

                {onOpenAccountSettings && (
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAccountSettings();
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hesap ve Veri Silme Paneline Git
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            © 2026 glotvia. Tüm hakları saklıdır.
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Yazdır / PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Anladım
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
