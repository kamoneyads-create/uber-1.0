
import React, { useEffect, useRef, useState } from 'react';
import { TripRequest, AppView } from '../types';
import { getCityCoords } from '../services/geminiService';

declare var L: any;

interface DashboardProps {
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
  activeRequest: TripRequest | null;
  onAccept: () => void;
  onDecline: () => void;
  userCity: string;
  currentView: AppView;
}

// Cache expandido com Capitais e Grandes Cidades (Cobertura Brasil)
const CITY_COORDS_CACHE: Record<string, [number, number]> = {
  // Sudeste
  'São Paulo': [-23.5505, -46.6333],
  'Rio de Janeiro': [-22.9068, -43.1729],
  'Belo Horizonte': [-19.9167, -43.9345],
  'Vitória': [-20.3155, -40.3128],
  'Guarulhos': [-23.4542, -46.5333],
  'Campinas': [-22.9071, -47.0632],
  'São Bernardo do Campo': [-23.6939, -46.565],
  'Santo André': [-23.6666, -46.5333],
  'Osasco': [-23.5325, -46.7917],
  'Ribeirão Preto': [-21.1704, -47.8103],
  'Sorocaba': [-23.5017, -47.4581],
  'Santos': [-23.9608, -46.3339],
  'Niterói': [-22.8858, -43.1153],
  'Duque de Caxias': [-22.7856, -43.3117],
  'São Gonçalo': [-22.8269, -43.0639],
  'Uberlândia': [-18.9113, -48.2622],
  'Juiz de Fora': [-21.7642, -43.3496],

  // Nordeste
  'Salvador': [-12.9714, -38.5014],
  'Fortaleza': [-3.7172, -38.5431],
  'Recife': [-8.0543, -34.8813],
  'São Luís': [-2.5307, -44.3068],
  'Maceió': [-9.6658, -35.7353],
  'Natal': [-5.7945, -35.211],
  'Teresina': [-5.0919, -42.8034],
  'João Pessoa': [-7.115, -34.8631],
  'Aracaju': [-10.9472, -37.0731],
  'Jaboatão dos Guararapes': [-8.1147, -35.0117],
  'Feira de Santana': [-12.2733, -38.9556],

  // Sul
  'Curitiba': [-25.4297, -49.2719],
  'Porto Alegre': [-30.0331, -51.23],
  'Florianópolis': [-27.5945, -48.5477],
  'Londrina': [-23.3103, -51.1628],
  'Joinville': [-26.3044, -48.8456],
  'Caxias do Sul': [-29.1678, -51.1794],

  // Centro-Oeste
  'Brasília': [-15.7939, -47.8828],
  'Goiânia': [-16.6869, -49.2648],
  'Campo Grande': [-20.4428, -54.6464],
  'Cuiabá': [-15.601, -56.0974],
  'Aparecida de Goiânia': [-16.8228, -49.2478],

  // Norte
  'Manaus': [-3.119, -60.0217],
  'Belém': [-1.4558, -48.4902],
  'Porto Velho': [-8.7612, -63.9039],
  'Ananindeua': [-1.3658, -48.3744],
  'Macapá': [0.034, -51.0694],
  'Rio Branco': [-9.9747, -67.8076],
  'Boa Vista': [2.8235, -60.6758],
  'Palmas': [-10.1675, -48.3277]
};

const UberSteeringWheelIcon = ({ size = 24, color = "white" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.2" />
    <circle cx="12" cy="12" r="2.5" fill={color} />
    <path d="M12 5V9.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M5.5 15.5L9.5 13" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M18.5 15.5L14.5 13" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const HomeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" />
  </svg>
);

const SearchIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FilterIconSliders = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H20M4 12H20M4 18H20" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="7" cy="6" r="2.5" fill="black" />
    <circle cx="17" cy="12" r="2.5" fill="black" />
    <circle cx="10" cy="18" r="2.5" fill="black" />
  </svg>
);

const BlueShieldIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 5V11C4 16.52 7.41 21.62 12 23C16.59 21.62 20 16.52 20 11V5L12 2Z" fill="#276EF1" />
    <path d="M12 4.5L6 6.75V11C6 15.25 8.56 19.17 12 20.35C15.44 19.17 18 15.25 18 11V5L12 4.5Z" fill="white" fillOpacity="0.2" />
    <path d="M12 6.5L16 8V11C16 14.12 14.29 17.02 12 18.06C9.71 17.02 8 14.12 8 11V8L12 6.5Z" fill="white" />
  </svg>
);

const SurgeOpportunityIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4.5 20.5H9.5L10.5 17.5H16.5L17.5 20.5H22.5L15 2V2ZM11.5 14.5L13.5 9L15.5 14.5H11.5Z" fill="#E35205" />
    <rect x="15" y="13" width="7" height="3" fill="#E35205" />
    <rect x="17" y="11" width="3" height="7" fill="#E35205" />
  </svg>
);

const TrendsChartIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3V21H21V18H6V3H3Z" fill="black" />
    <rect x="8" y="10" width="3" height="8" fill="black" />
    <rect x="13" y="13" width="3" height="5" fill="black" />
    <rect x="18" y="7" width="3" height="11" fill="black" />
  </svg>
);

const Dashboard: React.FC<DashboardProps> = ({ isOnline, setIsOnline, activeRequest, onAccept, onDecline, userCity, currentView }) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [statusPhrase, setStatusPhrase] = useState("Você está online");
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);

  const ZOOM_LEVEL = 16;

  // Sincronização de coordenadas instantânea com cache robusto
  useEffect(() => {
    // Tenta cache primeiro para resposta síncrona (instantânea)
    const cached = CITY_COORDS_CACHE[userCity];
    if (cached) {
      setCurrentCoords(cached);
      return;
    }

    const fetchCoords = async () => {
      try {
        const coords = await getCityCoords(userCity);
        if (coords) {
          CITY_COORDS_CACHE[userCity] = coords;
          setCurrentCoords(coords);
        }
      } catch (e) {
        // Fallback global caso falhe
        setCurrentCoords([-23.5505, -46.6333]);
      }
    };
    fetchCoords();
  }, [userCity]);

  // Inicialização e atualização do mapa
  useEffect(() => {
    if (!mapContainerRef.current || !currentCoords || typeof L === 'undefined') return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, { 
        zoomControl: false, 
        attributionControl: false,
        dragging: true,
        touchZoom: true
      }).setView(currentCoords, ZOOM_LEVEL);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { 
        maxZoom: 19
      }).addTo(mapRef.current);

      markerRef.current = L.marker(currentCoords, {
        icon: L.divIcon({
          className: 'uber-gps-marker',
          html: `<div class="relative w-12 h-12 flex items-center justify-center"><div class="absolute w-full h-full bg-[#276EF1] rounded-full animate-gps-pulse opacity-0"></div><div class="absolute inset-0 bg-white rounded-full border-[5px] border-black shadow-lg z-10"></div><div class="relative z-20 flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3L19 21L12 17.5L5 21L12 3Z" fill="black" /></svg></div></div>`,
          iconSize: [48, 48],
          iconAnchor: [24, 24]
        })
      }).addTo(mapRef.current);
    } else {
      // Salto imediato para nova localização (otimizado para troca de cidade no perfil)
      mapRef.current.setView(currentCoords, ZOOM_LEVEL, { animate: false });
      if (markerRef.current) {
        markerRef.current.setLatLng(currentCoords);
      }
    }
  }, [currentCoords]);

  // Ajuste de tamanho otimizado
  useEffect(() => {
    if (currentView === AppView.DASHBOARD && mapRef.current) {
      const timer = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
          if (currentCoords) {
             mapRef.current.setView(currentCoords, ZOOM_LEVEL, { animate: false });
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentView, currentCoords, isOnline]);

  useEffect(() => {
    let interval: any;
    if (isOnline) {
      interval = setInterval(() => {
        setStatusPhrase(prev => prev === "Você está online" ? "Procurando viagens" : "Você está online");
      }, 3500);
    } else {
      setStatusPhrase("Você está online");
    }
    return () => clearInterval(interval);
  }, [isOnline]);

  const handleOnlineToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isConnecting || isDisconnecting) return;
    if (!isOnline) {
      setIsConnecting(true);
      setTimeout(() => { setIsConnecting(false); setIsOnline(true); }, 2500);
    } else {
      setIsDisconnecting(true);
      setTimeout(() => { setIsDisconnecting(false); setIsOnline(false); setIsDrawerExpanded(false); }, 2500);
    }
  };

  const bars = [
    { h: 25, active: false }, { h: 25, active: false }, { h: 45, active: false }, { h: 65, active: false }, 
    { h: 65, active: false }, { h: 45, active: false }, { h: 45, active: false }, { h: 65, active: false }, 
    { h: 65, active: false }, { h: 65, active: false }, { h: 45, active: false }, { h: 100, active: true }, 
    { h: 65, active: false }, { h: 85, active: false }, { h: 85, active: false }, { h: 65, active: false }, 
    { h: 65, active: false }, { h: 85, active: false }, { h: 65, active: false }, { h: 85, active: false }, 
    { h: 45, active: false }, { h: 25, active: false }, { h: 25, active: false }
  ];

  return (
    <div className="h-full w-full flex flex-col relative bg-white overflow-hidden">
      <style>{`
        @keyframes gps-pulse { 0% { transform: scale(0.8); opacity: 0.6; } 50% { transform: scale(1.4); opacity: 0.2; } 100% { transform: scale(1.8); opacity: 0; } }
        .animate-gps-pulse { animation: gps-pulse 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; }
        @keyframes scan-line-full-width { 0% { left: 0%; transform: translateX(0%); } 50% { left: 100%; transform: translateX(-100%); } 100% { left: 0%; transform: translateX(0%); } }
        .animate-scan-line-full { animation: scan-line-full-width 3.5s ease-in-out infinite; }
      `}</style>
      
      <div className={`flex-1 flex flex-col relative ${!isOnline ? 'overflow-y-auto scrollbar-hide' : 'overflow-hidden'}`}>
        {!isOnline && (
          <div className="pt-10 px-6 pb-6 bg-white flex-shrink-0 z-10">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h1 className="text-[32px] font-black text-black leading-tight tracking-tight mb-1">Preço dinâmico vigente</h1>
                <p className="text-[15px] font-medium text-black leading-snug">Os motoristas parceiros próximos têm maior probabilidade de ganhar mais por viagem.</p>
              </div>
              <div className="flex flex-col gap-3 items-end pt-1">
                <button className="w-12 h-12 bg-[#F3F3F7] rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"><i className="fa-solid fa-shield-halved text-[#276EF1] text-xl"></i></button>
                <button className="w-12 h-12 bg-[#F3F3F7] rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"><i className="fa-solid fa-sliders text-black text-xl"></i></button>
              </div>
            </div>
          </div>
        )}

        <div className={`transition-all duration-500 overflow-hidden shrink-0 ${isOnline ? 'absolute inset-0 z-10 h-full w-full' : 'relative mx-4 mb-8 rounded-[32px] shadow-sm border border-gray-100 h-[324px]'}`}>
          <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-[#F3F3F7]"></div>
          
          {isOnline && (
            <div className="absolute inset-0 pointer-events-none flex flex-col z-20">
              <div className="absolute top-12 left-6 z-50 pointer-events-none">
                <button onClick={() => setIsOnline(false)} className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center pointer-events-auto active:scale-90 transition-transform text-black"><HomeIcon /></button>
              </div>
              <div className="absolute top-12 left-0 right-0 flex justify-center z-50 pointer-events-none">
                <div className="bg-black rounded-full px-6 py-4 flex items-center gap-2 shadow-2xl border border-white/5 pointer-events-auto cursor-pointer active:scale-95 transition-transform">
                  <span className="text-[#0E8345] text-[24px] font-black tracking-tight">R$</span>
                  <span className="text-white text-[24px] font-bold tracking-tight">0,00</span>
                </div>
              </div>
              <div className="absolute top-12 right-6 z-50 pointer-events-none">
                <button className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center pointer-events-auto active:scale-90 transition-transform text-black"><SearchIcon size={28} /></button>
              </div>

              <div className={`absolute bottom-[100px] left-6 z-40 pointer-events-none transition-all duration-300 ${isDrawerExpanded ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <button className="w-14 h-14 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex items-center justify-center pointer-events-auto active:scale-90 transition-transform">
                  <BlueShieldIcon size={34} />
                </button>
              </div>

              <div className={`absolute bottom-[100px] right-6 z-40 flex flex-col gap-3.5 pointer-events-none transition-all duration-300 ${isDrawerExpanded ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <button className="w-14 h-14 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex items-center justify-center pointer-events-auto active:scale-90 transition-transform">
                  <SurgeOpportunityIcon size={32} />
                </button>
                <button className="w-14 h-14 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex items-center justify-center pointer-events-auto active:scale-90 transition-transform">
                  <TrendsChartIcon size={28} />
                </button>
              </div>
              
              <div 
                className={`mt-auto w-full bg-[#FDFDFD] shadow-[0_-8px_40px_rgba(0,0,0,0.25)] pointer-events-auto flex flex-col overflow-hidden rounded-t-[32px] transition-all duration-500 ease-in-out ${isDrawerExpanded ? 'h-[52vh] z-[100] translate-y-0' : 'h-[74px] z-30 translate-y-0'}`} 
                onClick={() => setIsDrawerExpanded(!isDrawerExpanded)}
              >
                <div className="px-6 pt-2 pb-3 flex flex-col items-center flex-shrink-0 bg-[#FDFDFD] border-b border-gray-50/50">
                   <div className="w-10 h-1.5 bg-gray-200 rounded-full mb-3"></div>
                   <div className="flex items-center justify-between w-full">
                      <div className={`transition-opacity duration-300 ${isDrawerExpanded ? 'opacity-20' : 'opacity-100'}`}>
                        <button className="p-1" onClick={(e) => e.stopPropagation()}><FilterIconSliders /></button>
                      </div>

                      <div className="flex flex-col items-center flex-1 px-4">
                        <h2 className="text-[16px] font-bold text-black tracking-tight uppercase text-center leading-none mb-2.5">{statusPhrase}</h2>
                        <div className="w-full max-w-[140px] h-[2px] bg-gray-100 rounded-full overflow-hidden relative">
                           <div className="absolute top-0 left-0 w-[30px] h-full bg-[#276EF1] rounded-full animate-scan-line-full"></div>
                        </div>
                      </div>

                      <div className={`transition-opacity duration-300 ${isDrawerExpanded ? 'opacity-20' : 'opacity-100'}`}>
                        <button className="p-1" onClick={(e) => e.stopPropagation()}><i className="fa-solid fa-list-ul text-black text-2xl"></i></button>
                      </div>
                   </div>
                </div>

                <div className={`flex-1 flex flex-col overflow-y-auto scrollbar-hide transition-opacity duration-300 pb-12 ${isDrawerExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <div className="flex items-center justify-between px-6 py-6 cursor-pointer active:bg-gray-50 border-b border-gray-50" onClick={(e) => e.stopPropagation()}>
                     <div className="flex items-center gap-4">
                        <div className="w-4 h-4 bg-[#4CAF50] rounded-full shadow-[0_0_10px_rgba(76,175,80,0.4)]"></div>
                        <div className="flex flex-col">
                          <span className="text-[18px] font-bold text-black tracking-tight">Missão</span>
                          <span className="text-[14px] font-medium text-gray-500">R$ 220,00 a mais por 30 viagens</span>
                        </div>
                     </div>
                     <div className="text-[16px] font-bold text-gray-400">0/30</div>
                  </div>

                  <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-6 px-6 py-7 active:bg-gray-50 cursor-pointer border-b border-gray-50">
                       <div className="w-8 flex justify-center"><i className="fa-solid fa-chart-column text-[22px] text-black"></i></div>
                       <span className="text-[19.5px] font-bold text-black tracking-tight">Confira as tendências de ganhos</span>
                    </div>
                    <div className="flex items-center gap-6 px-6 py-7 active:bg-gray-50 cursor-pointer border-b border-gray-50">
                       <div className="w-8 flex justify-center"><i className="fa-solid fa-certificate text-[22px] text-black"></i></div>
                       <span className="text-[19.5px] font-bold text-black tracking-tight">Ver as promoções futuras</span>
                    </div>
                    <div className="flex items-center gap-6 px-6 py-7 active:bg-gray-50 cursor-pointer border-b border-gray-50">
                       <div className="w-8 flex justify-center"><UberSteeringWheelIcon size={26} color="black" /></div>
                       <span className="text-[19.5px] font-bold text-black tracking-tight">Veja o tempo ao volante</span>
                    </div>
                  </div>

                  <div className="mt-4 px-8 pb-10 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <button className="p-4"><FilterIconSliders /></button>
                    <div className="flex flex-col items-center gap-3">
                      <button 
                        onClick={handleOnlineToggle}
                        disabled={isDisconnecting}
                        className="w-24 h-24 rounded-full border-[6px] border-[#F3F3F7] flex items-center justify-center active:scale-95 bg-[#E31D1C] shadow-[0_15px_40_rgba(227,29,28,0.2)]"
                      >
                        {isDisconnecting ? (
                          <div className="w-9 h-9 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <i className="fa-solid fa-hand text-white text-[42px]"></i>
                        )}
                      </button>
                      <span className="text-[#E31D1C] text-[14px] font-black tracking-tight uppercase">FICAR OFFLINE</span>
                    </div>
                    <button className="p-4 text-black"><SearchIcon size={32} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isOnline && (
          <div className="px-6 pb-40">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[34px] font-black text-black tracking-tighter">Oportunidades</h2>
              <div className="w-11 h-11 bg-[#F3F3F7] rounded-full flex items-center justify-center"><i className="fa-solid fa-arrow-right text-black"></i></div>
            </div>
            <div className="flex items-center gap-2 mb-4 text-[#545454]"><i className="fa-solid fa-chart-simple text-[14px]"></i><span className="text-[18px] font-bold">Ganhos</span></div>
            <h3 className="text-[28px] font-black text-black leading-[34px] mb-3 tracking-tighter">Os ganhos das viagens são altos em {userCity}</h3>
            <p className="text-[18px] font-bold text-[#545454] mb-8">Veja quais são os melhores horários e regiões para aceitar solicitações hoje.</p>
            <div className="mb-4">
              <div className="flex items-end justify-between h-20 mb-4 gap-[2px]">
                {bars.map((bar, idx) => (
                  <div key={idx} className={`flex-1 rounded-sm ${bar.active ? 'bg-[#FF5B00]' : 'bg-[#545454]'}`} style={{ height: `${bar.h}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between items-center text-[14px] font-bold text-[#545454]"><span>4h</span><span>12h</span><span className="text-black font-black">Ativo</span><span>20h</span><span>3h</span></div>
            </div>
          </div>
        )}
      </div>

      {(!isOnline || isConnecting) && (
        <div className="absolute bottom-1 left-0 right-0 px-6 pb-1 z-[500] pointer-events-none">
          <button 
            onClick={handleOnlineToggle} 
            disabled={isConnecting} 
            className="w-full py-[14px] rounded-full flex items-center justify-center gap-3 bg-[#276EF1] text-white shadow-[0_12px_30px_rgba(39,110,241,0.3)] pointer-events-auto active:scale-[0.98] transition-all"
          >
            {isConnecting ? (
              <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <UberSteeringWheelIcon size={24} color="white" />
                <span className="text-[18px] font-bold tracking-tight">Ficar online</span>
              </>
            )}
          </button>
        </div>
      )}

      {isOnline && activeRequest && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center px-6 py-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onDecline}></div>
          <div className="relative w-full max-w-[380px] bg-white rounded-2xl shadow-2xl flex flex-col pt-5 pb-6 px-6 overflow-hidden animate-in slide-in-from-bottom duration-300 border border-gray-100">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <div className="bg-black rounded-md px-2.5 py-1 flex items-center gap-1.5">
                <i className="fa-solid fa-user text-white text-[10px]"></i>
                <span className="text-white text-[14px] font-bold tracking-tight">{activeRequest.type}</span>
              </div>
              <button onClick={onDecline} className="w-10 h-10 bg-[#F3F3F7] rounded-lg flex items-center justify-center active:scale-90 transition-all">
                <i className="fa-solid fa-xmark text-[24px] text-black"></i>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
               <h2 className="text-[34px] font-black text-black leading-tight tracking-tight">
                R$ {(Number(activeRequest.price) || 0).toFixed(2).replace('.', ',')}
              </h2>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <div className="bg-[#F3F3F7] rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-star text-black text-[11px]"></i>
                <span className="text-[13px] font-bold text-black">{(Number(activeRequest.rating) || 0).toFixed(2).replace('.', ',')} ({activeRequest.ratingCount})</span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-gray-100 mb-5"></div>

            <div className="flex gap-4 mb-6">
              <div className="flex flex-col items-center py-1.5 shrink-0">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-[1.5px] flex-1 bg-black my-1"></div>
                <div className="w-2.5 h-2.5 bg-black"></div>
              </div>
              
              <div className="flex flex-col gap-6 flex-1">
                <div className="flex flex-col">
                  <p className="text-[15px] font-bold text-black leading-tight mb-1">{activeRequest.timeToPickup} ({activeRequest.distanceToPickup})</p>
                  <p className="text-[13px] font-medium text-[#545454] leading-snug">{activeRequest.pickup}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[15px] font-bold text-black leading-tight mb-1">Viagem de {activeRequest.duration} ({activeRequest.tripDistance})</p>
                  <p className="text-[13px] font-medium text-[#545454] leading-snug">{activeRequest.destination}</p>
                </div>
              </div>
            </div>

            <button onClick={onAccept} className="w-full bg-black text-white font-bold py-4 rounded-xl text-[19px] active:scale-[0.98] transition-all shadow-md mt-2">
              Selecionar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
