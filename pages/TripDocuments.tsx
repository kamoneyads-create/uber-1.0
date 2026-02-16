
import React from 'react';

interface TripDocumentsProps {
  onBack: () => void;
}

const TripDocuments: React.FC<TripDocumentsProps> = ({ onBack }) => {
  const documents = [
    { title: "Verificação de segurança", status: "Concluída" },
    { title: "CNH - Carteira de motorista", status: "Concluída" },
    { title: "Foto do perfil", status: "Concluída" },
    { title: "Termos e condições", status: "Concluída" },
    { title: "CRLV - Documento do veículo", status: "Concluída" }
  ];

  return (
    <div className="h-full bg-white flex flex-col select-none animate-in fade-in slide-in-from-right duration-300 overflow-y-auto overflow-x-hidden">
      {/* Header - Native iOS/Android App Style */}
      <div className="flex items-center justify-between px-5 pt-8 pb-2 sticky top-0 bg-white z-50">
        <button onClick={onBack} className="p-2 -ml-2 active:opacity-40 transition-opacity">
          <i className="fa-solid fa-arrow-left text-[20px] text-black"></i>
        </button>
        <span className="text-[16px] font-bold text-black tracking-tight">Uber</span>
        <button className="bg-[#F3F3F7] px-4 py-1.5 rounded-full text-[13px] font-bold text-black active:opacity-60 transition-opacity">
          Ajuda
        </button>
      </div>

      <div className="px-6 pt-4 pb-20">
        {/* Main Title - Reduced from 44px to 28px for scale consistency */}
        <h1 className="text-[28px] font-bold text-black tracking-tight leading-none mb-6">
          Viagens
        </h1>

        {/* Document List - More compact padding and smaller fonts */}
        <div className="flex flex-col">
          {documents.map((doc, index) => (
            <React.Fragment key={index}>
              <div className="py-4 active:bg-gray-50 transition-colors cursor-pointer flex flex-col gap-0.5">
                <span className="text-[17px] font-bold text-black tracking-tight leading-tight">
                  {doc.title}
                </span>
                <span className="text-[14px] font-bold text-[#0E8345] tracking-tight">
                  {doc.status}
                </span>
              </div>
              {/* Divider - thin and subtle */}
              <div className="w-full h-[1px] bg-gray-50"></div>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Bottom spacer for safe area */}
      <div className="h-10 flex-shrink-0"></div>
    </div>
  );
};

export default TripDocuments;
