
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { day: 'Seg', value: 120 },
  { day: 'Ter', value: 90 },
  { day: 'Qua', value: 150 },
  { day: 'Qui', value: 210 },
  { day: 'Sex', value: 340 },
  { day: 'Sáb', value: 450 },
  { day: 'Dom', value: 300 },
];

const Earnings: React.FC = () => {
  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-y-auto pb-32">
      <div className="p-6 pt-12 bg-white">
        <h1 className="text-2xl font-bold mb-1">Ganhos</h1>
        <p className="text-sm text-gray-500">Esta semana (12 Mai - 19 Mai)</p>
        
        <div className="mt-8 mb-4">
          <p className="text-3xl font-bold text-gray-900">R$ 1.660,00</p>
          <div className="flex items-center gap-1 text-green-600 text-xs font-semibold mt-1">
            <i className="fa-solid fa-arrow-trend-up"></i>
            <span>12% a mais que a semana passada</span>
          </div>
        </div>

        <div className="h-48 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 5 ? '#2563eb' : '#d1d5db'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Tempo online</p>
            <p className="text-lg font-bold">34h 12m</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-bold">Viagens</p>
            <p className="text-lg font-bold">87</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100 border border-gray-100">
          <div className="p-4 flex justify-between items-center">
            <span className="text-sm font-medium">Repasse semanal</span>
            <span className="text-sm text-gray-900 font-bold">R$ 1.200,00</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-sm font-medium">Promoções</span>
            <span className="text-sm text-green-600 font-bold">+R$ 460,00</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-sm font-medium">Gorjetas</span>
            <span className="text-sm text-green-600 font-bold">R$ 0,00</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Atividade recente</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-bold">Viagem {1234 + i}</p>
                  <p className="text-xs text-gray-400">Ontem, 18:4{i}</p>
                </div>
                <p className="text-sm font-bold text-gray-900">R$ {(15.5 * i).toFixed(2).replace('.', ',')}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-black text-white py-4 rounded-xl font-bold mt-4 shadow-lg active:scale-95 transition-transform sticky bottom-4">
          TRANSFERIR AGORA
        </button>
      </div>
    </div>
  );
};

export default Earnings;
