
import React, { useState, useEffect } from 'react';

interface VerificationProps {
  onContinue: () => void;
  onCancel: () => void;
  profileImage?: string;
}

const Verification: React.FC<VerificationProps> = ({ onContinue, onCancel, profileImage }) => {
  const [stage, setStage] = useState<'intro' | 'scanning_ui' | 'scanning' | 'verified' | 'success'>('intro');
  const [progress, setProgress] = useState(0);

  // Imagem de perfil padrão caso não exista
  const displayImage = profileImage || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300&h=300&fit=crop";

  const handleStartScanning = () => {
    setStage('scanning_ui');
  };

  const handleCapture = () => {
    if (stage !== 'scanning_ui') return;
    setStage('scanning');
    
    let p = 0;
    const duration = 5000; // 5 segundos de escaneamento
    const intervalTime = 20; 
    const increment = 100 / (duration / intervalTime);
    
    const interval = setInterval(() => {
      p += increment;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        // Transiciona para o primeiro ícone (Verificado - Círculo com check)
        setStage('verified');
        
        // Após 1.2 segundos, transiciona para o segundo ícone (Cápsula de agradecimento)
        setTimeout(() => {
          setStage('success');
          // Finaliza e volta para o dashboard
          setTimeout(onContinue, 2500);
        }, 1200);
      }
    }, intervalTime);
  };

  if (stage === 'intro') {
    return (
      <div className="h-full w-full bg-white flex flex-col text-black animate-in fade-in duration-300 overflow-hidden">
        {/* Header Superior */}
        <div className="flex justify-between items-center pt-[50px] px-6 pb-2 bg-white sticky top-0 z-50">
          <button onClick={onCancel} className="p-2 -ml-2 active:opacity-40 transition-opacity">
            <i className="fa-solid fa-xmark text-[24px] text-black"></i>
          </button>
          <button className="text-[14px] font-bold text-black tracking-tight">Saiba mais</button>
        </div>

        <div className="flex-1 flex flex-col items-center px-8 pt-0 overflow-y-auto scrollbar-hide">
          {/* Ilustração Centralizada - Escala Reduzida */}
          <div className="relative w-full flex justify-center mb-4 mt-2">
            <div className="relative w-[200px] h-[200px] flex items-center justify-center">
              {/* Círculo de fundo lilás claro */}
              <div className="absolute w-[160px] h-[160px] bg-[#E8EDFF] rounded-full z-0"></div>
              
              {/* Celular (SVG sem a mão) */}
              <svg width="180" height="180" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                {/* Celular centralizado */}
                <rect x="74" y="44" width="92" height="154" rx="10" fill="black"/>
                <rect x="78" y="48" width="84" height="146" rx="8" fill="white"/>
                <rect x="78" y="48" width="84" height="22" rx="0" fill="black" /> {/* Notch superior */}
                <rect x="78" y="176" width="84" height="18" rx="0" fill="black" /> {/* Barra inferior */}
                
                {/* Conteúdo da tela do celular */}
                <circle cx="120" cy="110" r="30" fill="#4CAF50"/> {/* Círculo verde do perfil */}
                <circle cx="106" cy="110" r="3" fill="white"/>
                <circle cx="120" cy="110" r="3" fill="white"/>
                <circle cx="134" cy="110" r="3" fill="white"/>
                
                <circle cx="120" cy="162" r="8" stroke="#276EF1" strokeWidth="2.5" /> {/* Botão de captura */}
                <circle cx="120" cy="162" r="3" fill="#276EF1" />
              </svg>
            </div>
          </div>

          {/* Título - Reduzido de 28px para 22px */}
          <h1 className="text-[22px] font-black leading-tight text-center mb-6 tracking-tight text-black px-4">
            Tire uma foto do seu rosto para confirmar que esta é a sua conta
          </h1>
          
          {/* Disclaimer - Reduzido de 15px para 13px */}
          <div className="flex-1 flex flex-col justify-end pb-8">
            <p className="text-[#545454] text-[13px] font-medium leading-[20px] text-center px-4 opacity-90">
              Ao enviar uma foto, você concorda em tirar uma foto sua em tempo real e não usar uma imagem pré-existente. Lembre-se de que a Uber nunca pedirá sua senha, seus códigos de autenticação ou para alterar sua conta bancária.
            </p>
          </div>
        </div>

        {/* Rodapé com Botão - pb aumentado de [32px] para [72px] para subir o botão em ~5% */}
        <div className="p-6 pb-[72px] bg-white flex-shrink-0">
          <button 
            onClick={handleStartScanning}
            className="w-full bg-[#332D3B] text-white font-bold py-[15px] rounded-xl text-[16px] active:scale-[0.98] transition-transform shadow-md"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white flex flex-col relative overflow-hidden select-none animate-in fade-in duration-500">
      <style>{`
        @keyframes scanline-enhanced {
          0% { top: -20%; opacity: 0; }
          15% { opacity: 0.8; }
          50% { opacity: 1; }
          85% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        .scan-line {
          position: absolute;
          width: 100%;
          height: 120px;
          background: linear-gradient(to bottom, transparent, rgba(39, 110, 241, 0.4) 50%, #276EF1 95%, #ffffff 100%);
          box-shadow: 0 4px 15px rgba(39, 110, 241, 0.3);
          z-index: 60;
          animation: scanline-enhanced 2.5s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
        }
        .scan-line::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: #276EF1;
          box-shadow: 0 0 20px 2px #276EF1;
        }
        @keyframes wave {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.6); opacity: 1; }
        }
        .dot-wave {
          animation: wave 1s ease-in-out infinite;
        }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        @keyframes pill-expand {
          0% { width: 84px; height: 84px; border-radius: 9999px; }
          100% { width: 360px; height: 68px; border-radius: 9999px; }
        }
        .animate-pill-expand {
          animation: pill-expand 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes check-pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-check-pop {
          animation: check-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      {/* Botão de Voltar */}
      <div className="absolute top-14 left-4 z-[100]">
        <button onClick={() => setStage('intro')} className="p-3 active:opacity-40 transition-opacity">
          <i className="fa-solid fa-arrow-left text-[24px] text-black"></i>
        </button>
      </div>

      <div className="flex-1 relative flex flex-col items-center justify-center pt-10">
        <div className="absolute inset-0 z-0 bg-white"></div>

        <div className="relative w-full flex flex-col items-center justify-center px-10 scale-[1.05]">
          <div className="relative w-full aspect-square max-w-[340px] flex items-center justify-center">
            {/* Ring de foto */}
            <div className="absolute w-[88%] h-[88%] rounded-full overflow-hidden bg-white flex items-center justify-center shadow-inner border border-gray-100">
                <img 
                    src={displayImage} 
                    className={`w-full h-full object-cover transition-all duration-1000 ${stage === 'scanning' || stage === 'verified' || stage === 'success' ? 'brightness-110 contrast-105 scale-105' : 'brightness-100 opacity-90'}`}
                    alt="Perfil" 
                />
                {stage === 'scanning' && <div className="scan-line"></div>}
            </div>

            {/* Silhouette Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 0H400V400H0V0ZM200 370C293.888 370 370 293.888 370 200C370 106.112 293.888 30 200 30C106.112 30 30 106.112 30 200C30 293.888 106.112 370 200 370Z" fill="white" fillOpacity="1" />
                    <path d="M200 75C145 75 105 130 105 195C105 235 115 275 140 305V335C140 350 155 360 170 360H230C245 360 260 350 260 335V305C285 275 295 235 295 195C295 130 255 75 200 75Z" stroke="#F3F3F7" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="160" cy="185" r="14" fill="#F3F3F7" />
                    <circle cx="240" cy="185" r="14" fill="#F3F3F7" />
                    <path d="M155 245C155 245 185 285 245 245" stroke="#F3F3F7" strokeWidth="3" strokeLinecap="round" />
                </svg>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div className="mt-12 w-full px-8 flex justify-center z-40">
          <div className="bg-black rounded-full h-[58px] pl-8 pr-4 flex items-center justify-between w-full max-w-[340px] shadow-xl">
             <span className="text-white text-[15px] font-medium tracking-tight">Enquadre o rosto na área marcada</span>
             <div className="w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center ml-4 shrink-0">
               <span className="text-black text-[17px] font-black">?</span>
             </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-[200px] bg-white flex flex-col items-center justify-start flex-shrink-0 z-50 pt-4">
        <div className="relative">
          {stage === 'scanning' && (
            <svg className="absolute inset-[-15px] w-[114px] h-[114px] -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#276EF1"
                strokeWidth="4"
                strokeDasharray="289"
                strokeDashoffset={289 - (289 * progress) / 100}
                strokeLinecap="round"
                className="transition-all duration-75 ease-linear"
              />
            </svg>
          )}
          
          <button 
            onClick={handleCapture}
            disabled={stage !== 'scanning_ui'}
            className={`flex items-center justify-center transition-all duration-500 shadow-2xl overflow-hidden ${
              stage === 'success' 
              ? 'animate-pill-expand bg-black border-none' 
              : (stage === 'scanning' || stage === 'verified')
                ? 'w-[84px] h-[84px] rounded-full bg-black border-[4px] border-black'
                : 'w-[84px] h-[84px] rounded-full bg-white border-[8px] border-black active:scale-90'
            }`}
          >
            {/* ONDAS DE 3 PONTOS */}
            {stage === 'scanning' && (
              <div className="flex gap-1.5 items-center">
                <div className="w-[7px] h-[7px] bg-white rounded-full dot-wave"></div>
                <div className="w-[7px] h-[7px] bg-white rounded-full dot-wave delay-1"></div>
                <div className="w-[7px] h-[7px] bg-white rounded-full dot-wave delay-2"></div>
              </div>
            )}
            
            {/* PRIMEIRO ÍCONE: CHECK EM CÍRCULO */}
            {stage === 'verified' && (
              <div className="w-[42px] h-[42px] rounded-full border-2 border-white flex items-center justify-center animate-check-pop">
                 <i className="fa-solid fa-check text-white text-[20px]"></i>
              </div>
            )}

            {/* SEGUNDO ÍCONE: CÁPSULA COM TEXTO FINAL */}
            {stage === 'success' && (
              <div className="flex items-center justify-center w-full px-5 animate-check-pop">
                 <div className="w-[34px] h-[34px] rounded-full border border-white/50 flex items-center justify-center mr-4 shrink-0">
                    <i className="fa-solid fa-check text-white text-[16px]"></i>
                 </div>
                 <span className="text-white text-[16px] font-bold tracking-tight whitespace-nowrap">Agradecemos pela confirmação</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verification;
