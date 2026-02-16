
import React, { useState, useEffect, useRef } from 'react';
import { AppView, TripRequest } from './types';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Earnings from './pages/Earnings';
import Inbox from './pages/Inbox';
import Profile from './pages/Profile';
import ProfileDetail from './pages/ProfileDetail';
import PublicProfile from './pages/PublicProfile';
import EditProfile from './pages/EditProfile';
import Account from './pages/Account';
import Documents from './pages/Documents';
import TripDocuments from './pages/TripDocuments';
import Verification from './pages/Verification';
import Vehicles from './pages/Vehicles';
import BottomNav from './components/BottomNav';
import { generateTripRequest } from './services/geminiService';

const STORAGE_KEYS = {
  USER: 'UBER_V5_USER_DATA',
  ONLINE: 'UBER_V5_ONLINE_STATUS',
  IS_LOGGED_IN: 'UBER_V5_AUTH'
};

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [arrowAnimate, setArrowAnimate] = useState(false);
  const [screenSlide, setScreenSlide] = useState(false);

  useEffect(() => {
    const arrowTimer = setTimeout(() => setArrowAnimate(true), 1500);
    const screenTimer = setTimeout(() => {
      setScreenSlide(true);
      setTimeout(onComplete, 500);
    }, 2500);
    return () => { clearTimeout(arrowTimer); clearTimeout(screenTimer); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center transition-transform duration-700 ease-in-out ${screenSlide ? '-translate-x-full' : 'translate-x-0'}`}>
      <div className="flex flex-col items-start gap-2 overflow-hidden px-4 select-none">
        <h1 className="text-white text-[64px] font-black tracking-tighter leading-none">Uber</h1>
        <div className={`transition-all duration-1000 ease-in-out ${arrowAnimate ? 'translate-x-[400%] opacity-0' : 'translate-x-0 opacity-100'}`}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12H20M20 12L14 6M20 12L14 6M20 12L14 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isOnline, setIsOnline] = useState(() => localStorage.getItem(STORAGE_KEYS.ONLINE) === 'true');
  const [hasVerified, setHasVerified] = useState(false); 
  const [newRequest, setNewRequest] = useState<TripRequest | null>(null);
  const [pendingOnline, setPendingOnline] = useState(false);
  
  const lastRequestIdsRef = useRef<string[]>([]);
  const lastTripIndexRef = useRef<number | undefined>(undefined);
  const isFetchingRef = useRef(false);
  
  const [userData, setUserData] = useState(() => {
    const defaultData = {
      name: 'Motorista Parceiro',
      city: 'São Paulo',
      vehicle: 'Volkswagen Polo',
      licensePlate: 'SHX2H74',
      language: 'Português (Brasil)',
      profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300&h=300&fit=crop',
      tripType: 'UberX',
      rating: 5.00
    };
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : defaultData;
  });

  const persistUserData = (newData: any) => {
    const updated = { ...userData, ...newData };
    setUserData(updated);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    setIsLoggedIn(true);
  };

  const handleLogin = (email: string, pass: string) => {
    setIsLoggedIn(true);
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    setCurrentView(AppView.DASHBOARD);
    return true;
  };

  const handleSetView = (view: AppView) => {
    setCurrentView(view);
  };

  const handleSetOnline = (status: boolean) => {
    if (status) {
      if (hasVerified) {
        setIsOnline(true);
        localStorage.setItem(STORAGE_KEYS.ONLINE, 'true');
      } else {
        setPendingOnline(true);
        handleSetView(AppView.VERIFICATION);
      }
    } else {
      setIsOnline(false);
      localStorage.setItem(STORAGE_KEYS.ONLINE, 'false');
      setNewRequest(null);
    }
  };

  const handleVerificationSuccess = () => {
    setHasVerified(true);
    if (pendingOnline) {
      setIsOnline(true);
      localStorage.setItem(STORAGE_KEYS.ONLINE, 'true');
      setPendingOnline(false);
    }
    handleSetView(AppView.DASHBOARD);
  };

  const handleRequestResolution = () => {
    setNewRequest(null);
  };

  useEffect(() => {
    let timer: any;
    
    const triggerDispatch = async () => {
      if (!isOnline || newRequest || isFetchingRef.current) return;
      
      isFetchingRef.current = true;
      try {
        const generated = await generateTripRequest(userData.city, userData.tripType, lastTripIndexRef.current);
        
        if (isOnline && !newRequest && !lastRequestIdsRef.current.includes(generated.id)) {
          setNewRequest(generated as unknown as TripRequest);
          lastRequestIdsRef.current = [generated.id, ...lastRequestIdsRef.current.slice(0, 10)];
          lastTripIndexRef.current = (generated as any).index;
        }
      } catch (e) {
        console.error("Erro no despacho:", e);
      } finally {
        isFetchingRef.current = false;
      }
    };

    if (isOnline && !newRequest) {
      // Intervalo fixo de 14 segundos solicitado para todas as chamadas (incluindo a primeira)
      timer = setTimeout(triggerDispatch, 14000);
    }
    
    return () => clearTimeout(timer);
  }, [isOnline, newRequest, userData.city, userData.tripType]);

  const renderView = () => {
    if (!isLoggedIn) {
        if (currentView === AppView.REGISTER) {
            return <Register onBack={() => handleSetView(AppView.LOGIN)} onComplete={(data) => { persistUserData(data); handleSetView(AppView.DASHBOARD); }} />;
        }
        return <Login onLogin={handleLogin} onRegister={() => handleSetView(AppView.REGISTER)} />;
    }

    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard isOnline={isOnline} setIsOnline={handleSetOnline} activeRequest={newRequest} onAccept={handleRequestResolution} onDecline={handleRequestResolution} userCity={userData.city} currentView={currentView} />;
      case AppView.EARNINGS: return <Earnings />;
      case AppView.INBOX: return <Inbox />;
      case AppView.PROFILE: return <Profile userName={userData.name} profileImage={userData.profileImage} onLogout={() => { localStorage.clear(); setIsLoggedIn(false); setCurrentView(AppView.LOGIN); }} onDetail={() => handleSetView(AppView.PROFILE_DETAIL)} onEdit={() => handleSetView(AppView.EDIT_PROFILE)} onAccount={() => handleSetView(AppView.ACCOUNT)} onBack={() => handleSetView(AppView.DASHBOARD)} />;
      case AppView.VERIFICATION: return <Verification onContinue={handleVerificationSuccess} onCancel={() => handleSetView(AppView.DASHBOARD)} profileImage={userData.profileImage} />;
      case AppView.PROFILE_DETAIL: return <ProfileDetail userName={userData.name} profileImage={userData.profileImage} onBack={() => handleSetView(AppView.PROFILE)} onPublicProfile={() => handleSetView(AppView.PUBLIC_PROFILE)} />;
      case AppView.PUBLIC_PROFILE: return <PublicProfile userName={userData.name} profileImage={userData.profileImage} city={userData.city} vehicle={userData.vehicle} language={userData.language} onBack={() => handleSetView(AppView.PROFILE_DETAIL)} />;
      case AppView.EDIT_PROFILE: return <EditProfile userData={userData} onSave={(data) => { persistUserData(data); handleSetView(AppView.PROFILE); }} onBack={() => handleSetView(AppView.PROFILE)} />;
      case AppView.ACCOUNT: return <Account vehicleName={userData.vehicle} licensePlate={userData.licensePlate} onBack={() => handleSetView(AppView.PROFILE)} onLogout={() => { localStorage.clear(); setIsLoggedIn(false); setCurrentView(AppView.LOGIN); }} onDocuments={() => handleSetView(AppView.DOCUMENTS)} onVehicles={() => handleSetView(AppView.VEHICLES)} />;
      case AppView.VEHICLES: return <Vehicles vehicleName={userData.vehicle} licensePlate={userData.licensePlate} onBack={() => handleSetView(AppView.ACCOUNT)} />;
      case AppView.DOCUMENTS: return <Documents onBack={() => handleSetView(AppView.ACCOUNT)} onViewAll={() => handleSetView(AppView.TRIP_DOCUMENTS)} />;
      case AppView.TRIP_DOCUMENTS: return <TripDocuments onBack={() => handleSetView(AppView.DOCUMENTS)} />;
      default: return <Dashboard isOnline={isOnline} setIsOnline={handleSetOnline} activeRequest={newRequest} onAccept={handleRequestResolution} onDecline={handleRequestResolution} userCity={userData.city} currentView={currentView} />;
    }
  };

  const isMainTab = [AppView.DASHBOARD, AppView.EARNINGS, AppView.INBOX, AppView.PROFILE].includes(currentView);
  const showNav = isLoggedIn && !isOnline && isMainTab;

  return (
    <div className="h-screen w-full flex flex-col bg-white relative overflow-hidden">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <main className="flex-1 relative bg-white overflow-hidden">
        {renderView()}
      </main>
      {showNav && <BottomNav currentView={currentView} setView={handleSetView} />}
    </div>
  );
};

export default App;
