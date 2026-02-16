
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, pass: string) => boolean;
  onRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(email, password);
    if (!success) {
      setError('E-mail ou senha incorretos. Tente novamente.');
    }
  };

  return (
    <div className="h-full bg-black flex flex-col px-8 pt-24 pb-12 text-white overflow-y-auto">
      <div className="flex-1">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Uber Driver</h1>
        <p className="text-xl font-medium text-gray-300 mb-10">Faça login para começar a ganhar</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">E-mail</p>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com" 
              required
              className="bg-transparent border-none outline-none w-full text-white font-medium text-lg placeholder:text-gray-700"
            />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 relative">
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Senha</p>
            <div className="flex items-center">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha" 
                required
                className="bg-transparent border-none outline-none flex-1 text-white font-medium text-lg placeholder:text-gray-700"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 px-2"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold animate-pulse">{error}</p>
          )}
          
          <button 
            type="submit"
            className="w-full bg-white text-black font-bold py-5 rounded-2xl text-lg hover:bg-gray-100 transition-colors mt-6 shadow-xl active:scale-[0.98]"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 flex justify-between items-center px-1">
          <button className="text-sm text-gray-400 font-medium">Esqueceu a senha?</button>
        </div>

        <div className="flex items-center gap-4 my-10">
          <div className="flex-1 h-[1px] bg-gray-800"></div>
          <span className="text-gray-500 text-sm">ou</span>
          <div className="flex-1 h-[1px] bg-gray-800"></div>
        </div>

        <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 border border-gray-800 mb-4 active:scale-[0.98]">
          <i className="fa-brands fa-google"></i>
          Continuar com Google
        </button>
      </div>

      <div className="mt-auto text-center pt-8">
        <p className="text-sm text-gray-500">
          Não tem uma conta? 
          <button onClick={onRegister} className="text-blue-500 font-bold ml-1 hover:underline">Inscreva-se</button>
        </p>
        <p className="text-[10px] text-gray-600 mt-8 px-4 leading-relaxed">
          Uber Driver v5.0 • Desenvolvido para motoristas parceiros.
        </p>
      </div>
    </div>
  );
};

export default Login;
