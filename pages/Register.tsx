
import React, { useState, useRef } from 'react';

interface RegisterProps {
  onBack: () => void;
  onComplete: (data: any) => void;
}

const Register: React.FC<RegisterProps> = ({ onBack, onComplete }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    vehicle: '',
    city: '',
    language: 'Português (Brasil)',
    tripType: 'UberX'
  });

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
        setProfileImage(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onComplete({ ...formData, profileImage });
    }
  };

  const isFormValid = () => {
    return (
      formData.name.length > 3 &&
      formData.email.includes('@') &&
      formData.password.length >= 6 &&
      formData.vehicle.length > 2 &&
      formData.city.length > 2
    );
  };

  const selectTripType = (type: string) => {
    setFormData(prev => ({ ...prev, tripType: type }));
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden text-gray-900">
      <header className="pt-12 px-6 pb-4 bg-white flex items-center justify-between border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2">
          <i className="fa-solid fa-arrow-left text-xl text-gray-900"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-900">Criar conta</h1>
        <div className="w-8"></div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24">
        <div className="animate-in fade-in duration-500">
          <div className="flex flex-col items-center mb-8">
            <div 
              onClick={handleImageClick}
              className="w-28 h-28 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative cursor-pointer overflow-hidden group shadow-sm"
            >
              {profileImage ? (
                <img src={profileImage} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <>
                  <i className="fa-solid fa-camera text-gray-400 text-xl mb-1"></i>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Adicionar Foto</span>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div className="bg-gray-50 rounded-xl p-3 border-b-2 border-gray-200 focus-within:border-black transition-colors">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Nome Completo</p>
              <input 
                type="text" 
                value={formData.name}
                className="w-full bg-transparent outline-none text-base font-medium text-gray-900"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border-b-2 border-gray-200 focus-within:border-black transition-colors">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">E-mail</p>
              <input 
                type="email" 
                value={formData.email}
                className="w-full bg-transparent outline-none text-base font-medium text-gray-900"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border-b-2 border-gray-200 focus-within:border-black transition-colors">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Senha</p>
              <div className="flex items-center">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  className="w-full bg-transparent outline-none text-base font-medium text-gray-900"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 px-2">
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border-b-2 border-gray-200 focus-within:border-black transition-colors">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Veículo</p>
              <input 
                type="text" 
                value={formData.vehicle}
                className="w-full bg-transparent outline-none text-base font-medium text-gray-900"
                onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border-b-2 border-gray-200 focus-within:border-black transition-colors">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Cidade</p>
              <input 
                type="text" 
                value={formData.city}
                className="w-full bg-transparent outline-none text-base font-medium text-gray-900"
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>

            <div className="pt-4">
              <p className="text-[11px] font-bold text-black uppercase tracking-wider mb-4 px-1">Tipo de Serviço</p>
              <div className="grid grid-cols-2 gap-3 pb-4">
                <button 
                  type="button"
                  onClick={() => selectTripType('UberX')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                    formData.tripType === 'UberX' ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-gray-400 border-gray-100'
                  }`}
                >
                  <i className="fa-solid fa-car text-lg mb-1"></i>
                  <span className="font-bold text-[13px]">UberX</span>
                </button>
                <button 
                  type="button"
                  onClick={() => selectTripType('Comfort')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                    formData.tripType === 'Comfort' ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-gray-400 border-gray-100'
                  }`}
                >
                  <i className="fa-solid fa-couch text-lg mb-1"></i>
                  <span className="font-bold text-[13px]">Comfort</span>
                </button>
                <button 
                  type="button"
                  onClick={() => selectTripType('Black')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                    formData.tripType === 'Black' ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-gray-400 border-gray-100'
                  }`}
                >
                  <i className="fa-solid fa-gem text-lg mb-1"></i>
                  <span className="font-bold text-[13px]">Black</span>
                </button>
                <button 
                  type="button"
                  onClick={() => selectTripType('Moto')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                    formData.tripType === 'Moto' ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-gray-400 border-gray-100'
                  }`}
                >
                  <i className="fa-solid fa-motorcycle text-lg mb-1"></i>
                  <span className="font-bold text-[13px]">Moto</span>
                </button>
                <button 
                  type="button"
                  onClick={() => selectTripType('Bicicleta')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                    formData.tripType === 'Bicicleta' ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-gray-400 border-gray-100'
                  }`}
                >
                  <i className="fa-solid fa-bicycle text-lg mb-1"></i>
                  <span className="font-bold text-[13px]">Bicicleta</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-gray-100">
        <button 
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`w-full py-5 rounded-2xl text-xl font-bold shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            !isFormValid() ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-black text-white hover:bg-gray-900'
          }`}
        >
          <span>Concluir Cadastro</span>
          <i className="fa-solid fa-check text-sm"></i>
        </button>
      </div>
    </div>
  );
};

export default Register;
