"use client"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function SourceChart({ data }: { data: { name: string, value: number }[] }) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Filtramos dados zerados
  const chartData = data.filter(d => d.value > 0);

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm h-[320px] flex flex-col w-full overflow-hidden">
      <h3 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest text-center">
        Distribuição por Origem (R$)
      </h3>
      
      {/* AJUSTE AQUI: Definimos uma altura fixa para o container do gráfico */}
      <div className="w-full h-[220px] relative mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData.length > 0 ? chartData : [{ name: "Sem dados", value: 1 }]}
              cx="50%"
              cy="50%" 
              innerRadius={50} 
              outerRadius={70} 
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.length > 0 ? (
                chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))
              ) : (
                <Cell fill="#f1f5f9" />
              )}
            </Pie>
            
            <Tooltip 
              formatter={(value: number) => chartData.length > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value) : "R$ 0,00"}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
            />
            
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              wrapperStyle={{ 
                fontSize: '9px', 
                fontFamily: 'inherit',
                fontWeight: '800', 
                textTransform: 'uppercase',
                paddingTop: '10px'
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}