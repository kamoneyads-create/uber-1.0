
import React from 'react';

interface VehiclesProps {
  onBack: () => void;
  vehicleName: string;
  licensePlate: string;
}

const Vehicles: React.FC<VehiclesProps> = ({ onBack, vehicleName, licensePlate }) => {
  // Extrai apenas o modelo se houver ano (caso o dado venha com ano, removemos conforme solicitado)
  const displayVehicle = vehicleName.replace(/^\d{4}\s+/, '');

  return (
    <div className="h-full bg-white flex flex-col select-none animate-in fade-in slide-in-from-right duration-300 overflow-hidden">
      {/* Header - Escala reduzida, ícone da direita removido */}
      <div className="pt-10 px-6 flex items-center justify-between bg-white">
        <button onClick={onBack} className="p-2 -ml-4 active:opacity-40 transition-opacity">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Espaçador para manter o título/alinhamento caso houvesse algo centralizado */}
        <div className="w-[24px]"></div>
      </div>

      <div className="px-6 pt-4">
        <h1 className="text-[28px] font-bold text-black tracking-tight leading-tight mb-6">
          Seus veículos
        </h1>

        {/* Vehicle Card - Ajustado para remover espaço em branco e reduzir escala */}
        <div className="w-full border-[2px] border-black rounded-[14px] p-5 flex items-center justify-between relative bg-white">
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-[18px] font-bold text-black leading-tight">
              {displayVehicle || "Volkswagen Polo"}
            </h2>
            <p className="text-[14px] font-medium text-[#545454] mt-0.5">
              {licensePlate || "SHX2H74"} • Viagens + Entrega
            </p>
          </div>

          <div className="shrink-0 ml-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Button - Escala ajustada */}
      <div className="mt-auto p-6 pb-12 bg-white">
        <button 
          onClick={onBack}
          className="w-full bg-black text-white font-bold py-[16px] rounded-[12px] text-[17px] active:scale-[0.98] transition-all shadow-sm"
        >
          Usar este veículo
        </button>
      </div>
    </div>
  );
};

export default Vehicles;
