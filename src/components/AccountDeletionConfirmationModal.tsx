import React, { useState, useEffect } from 'react';
import { validateDeletionToken, executeAccountDeletion, AccountDeletionTokenData } from '../services/accountDeletionService';
import { ShieldAlert, Trash2, CheckCircle2, AlertCircle, RefreshCw, X, ArrowLeft, ShieldCheck } from 'lucide-react';

interface AccountDeletionConfirmationModalProps {
  isOpen: boolean;
  token: string;
  tokenId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AccountDeletionConfirmationModal: React.FC<AccountDeletionConfirmationModalProps> = ({
  isOpen,
  token,
  tokenId,
  onClose,
  onSuccess
}) => {
  const [isValidating, setIsValidating] = useState(true);
  const [tokenData, setTokenData] = useState<AccountDeletionTokenData | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const [deletionError, setDeletionError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !token) return;

    let mounted = true;
    setIsValidating(true);
    setValidationError(null);

    validateDeletionToken(token, tokenId).then((res) => {
      if (!mounted) return;
      setIsValidating(false);
      if (res.valid && res.tokenData) {
        setTokenData(res.tokenData);
      } else {
        setValidationError(res.message || 'Geçersiz veya süresi dolmuş hesap silme bağlantısı.');
      }
    }).catch((err) => {
      if (!mounted) return;
      setIsValidating(false);
      setValidationError(err?.message || 'Doğrulama sırasında bir hata oluştu.');
    });

    return () => {
      mounted = false;
    };
  }, [isOpen, token, tokenId]);

  if (!isOpen) return null;

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeletionError(null);

    const res = await executeAccountDeletion(token, tokenId);
    setIsDeleting(false);

    if (res.success) {
      setDeletionSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2500);
    } else {
      setDeletionError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Hesap Silme Onayı
              </h2>
              <p className="text-xs text-rose-300/80 font-medium">
                Güvenli Kalıcı Silme İşlemi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-slate-300 text-sm">
          
          {isValidating && (
            <div className="py-8 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">
                Silme anahtarı ve güvenlik sertifikası kontrol ediliyor...
              </p>
            </div>
          )}

          {!isValidating && validationError && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">İşlem Gerçekleştirilemiyor</strong>
                  <span className="mt-1 block text-rose-200/90">{validationError}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-all"
              >
                Kapat ve Uygulamaya Dön
              </button>
            </div>
          )}

          {!isValidating && !validationError && deletionSuccess && (
            <div className="py-6 text-center space-y-3 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Hesabınız Başarıyla Silindi
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Hesabınıza ve öğrenme geçmişinize ait tüm veriler veritabanımızdan kalıcı olarak temizlendi.
              </p>
            </div>
          )}

          {!isValidating && !validationError && !deletionSuccess && tokenData && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400">Silinecek Hesap:</div>
                <div className="text-sm font-bold text-white break-all">
                  {tokenData.userEmail}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-200 text-xs leading-relaxed space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-rose-300">
                  <ShieldAlert className="w-4 h-4" />
                  Bu hesabı kalıcı olarak silmek istediğinize emin misiniz?
                </div>
                <p className="text-rose-300/80">
                  Onayladığınızda Firebase ve sunuculardaki tüm XP, quiz sonuçları, kelime ilerlemeleri ve hesap ayarlarınız derhal silinecektir. Bu işlem geri alınamaz.
                </p>
              </div>

              {deletionError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{deletionError}</span>
                </div>
              )}

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-spin' : ''}`} />
                  {isDeleting ? 'Hesap Kalıcı Olarak Siliniyor...' : 'EVET, HESABIMI SİL'}
                </button>
                
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                >
                  VAZGEÇ
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
