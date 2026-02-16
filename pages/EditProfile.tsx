
import React, { useState, useRef } from 'react';

interface EditProfileProps {
  userData: any;
  onSave: (data: any) => void;
  onBack: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ userData, onSave, onBack }) => {
  // Inicializa o formulário com dados existentes
  const [formData, setFormData] = useState({
    name: userData.name || '',
    city: userData.city || '',
    vehicle: (userData.vehicle || '').replace(/\s*-\s*UberX/i, ''),
    licensePlate: userData.licensePlate || '',
    language: userData.language || 'Português (Brasil)',
    profileImage: userData.profileImage || '',
    tripType: userData.tripType || 'UberX'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800; 
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await resizeImage(reader.result as string);
        setFormData(prev => ({ ...prev, profileImage: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);
    
    setTimeout(() => {
      onSave(formData);
      setSavedSuccess(true);
      setIsSaving(false);
    }, 400);
  };

  const selectTripType = (type: string) => {
    setFormData(prev => ({ ...prev, tripType: type }));
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto pb-40 select-none animate-in fade-in slide-in-from-right duration-300">
      <div className="pt-10 px-6 pb-4 flex items-center border-b border-gray-100 bg-white sticky top-0 z-50">
        <button onClick={onBack} className="p-2 -ml-3 active:opacity-40 transition-opacity">
          <i className="fa-solid fa-arrow-left text-2xl text-black"></i>
        </button>
        <h1 className="flex-1 text-center pr-6 text-[18px] font-black text-black tracking-tight">Editar Perfil</h1>
      </div>

      <div className="px-6 pt-8 space-y-8">
        <div className="flex flex-col items-center">
          <div 
            onClick={handleImageClick}
            className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md group cursor-pointer active:scale-95 transition-transform"
          >
            <img 
              src={formData.profileImage} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/uber/300/300";
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="fa-solid fa-camera text-white text-2xl"></i>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          <button onClick={handleImageClick} className="mt-3 text-[13px] font-black text-[#276EF1] uppercase tracking-wider">Alterar foto</button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4 border border-transparent focus-within:border-black focus-within:bg-white transition-all shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Nome Completo</p>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-transparent outline-none font-bold text-[17px] text-black"
            />
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-transparent focus-within:border-black focus-within:bg-white transition-all shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Cidade</p>
            <input 
              type="text" 
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="w-full bg-transparent outline-none font-bold text-[17px] text-black"
            />
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-transparent focus-within:border-black focus-within:bg-white transition-all shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Veículo</p>
            <input 
              type="text" 
              value={formData.vehicle}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
              className="w-full bg-transparent outline-none font-bold text-[17px] text-black"
            />
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-transparent focus-within:border-black focus-within:bg-white transition-all shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Placa</p>
            <input 
              type="text" 
              value={formData.licensePlate}
              onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
              className="w-full bg-transparent outline-none font-bold text-[17px] text-black"
              placeholder="ABC1D23"
            />
          </div>

          <div className="space-y-3 pt-4">
            <p className="text-[13px] font-black text-black uppercase tracking-widest px-1">Tipo de Serviço</p>
            <div className="grid grid-cols-2 gap-3 pb-8">
              <button 
                type="button"
                onClick={() => selectTripType('UberX')}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all active:scale-95 ${
                  formData.tripType === 'UberX' ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-gray-400 border-gray-100'
                }`}
              >
                <i className="fa-solid fa-car text-xl mb-1"></i>
                <span className="font-bold text-[14px]">UberX</span>
              </button>
              <button 
                type="button"
                onClick={() => selectTripType('Comfort')}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all active:scale-95 ${
                  formData.tripType === 'Comfort' ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-gray-400 border-gray-100'
                }`}
              >
                <i className="fa-solid fa-couch text-xl mb-1"></i>
                <span className="font-bold text-[14px]">Comfort</span>
              </button>
              <button 
                type="button"
                onClick={() => selectTripType('Black')}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all active:scale-95 ${
                  formData.tripType === 'Black' ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-gray-400 border-gray-100'
                }`}
              >
                <i className="fa-solid fa-gem text-xl mb-1"></i>
                <span className="font-bold text-[14px]">Black</span>
              </button>
              <button 
                type="button"
                onClick={() => selectTripType('Moto')}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all active:scale-95 ${
                  formData.tripType === 'Moto' ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-gray-400 border-gray-100'
                }`}
              >
                <i className="fa-solid fa-motorcycle text-xl mb-1"></i>
                <span className="font-bold text-[14px]">Moto</span>
              </button>
              <button 
                type="button"
                onClick={() => selectTripType('Bicicleta')}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all active:scale-95 ${
                  formData.tripType === 'Bicicleta' ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-gray-400 border-gray-100'
                }`}
              >
                <i className="fa-solid fa-bicycle text-xl mb-1"></i>
                <span className="font-bold text-[14px]">Bicicleta</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 z-[100] shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <button 
          onClick={handleSave}
          disabled={isSaving || savedSuccess}
          className={`w-full py-5 rounded-2xl text-[20px] font-black shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${
            savedSuccess ? 'bg-green-600 text-white' : isSaving ? 'bg-gray-800 text-gray-400' : 'bg-black text-white'
          }`}
        >
          {isSaving ? (
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : savedSuccess ? (
            <><i className="fa-solid fa-check"></i><span>Salvo com sucesso!</span></>
          ) : (
            <>
              <i className="fa-solid fa-floppy-disk"></i>
              <span>Salvar Alterações</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
