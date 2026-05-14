import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const EmiCalculator = ({ propertyPrice }) => {
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState(20);

  const stats = useMemo(() => {
    const downPayment = (propertyPrice * downPaymentPct) / 100;
    const principal = propertyPrice - downPayment;
    const r = interestRate / 12 / 100;
    const n = loanTenureYears * 12;
    
    let emi = 0;
    if (r === 0) {
      emi = principal / n;
    } else {
      emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }
    
    const totalPayment = emi * n;
    const totalInterest = totalPayment - principal;

    return { downPayment, principal, emi, totalPayment, totalInterest };
  }, [propertyPrice, downPaymentPct, interestRate, loanTenureYears]);

  const data = [
    { name: 'Principal Loan Amount', value: stats.principal },
    { name: 'Total Interest', value: Math.max(0, stats.totalInterest) },
  ];
  const COLORS = ['#3b82f6', '#f97316'];

  return (
    <div className="bg-white dark:bg-[#151515] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 mt-8">
      <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-6">EMI Calculator</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Down Payment</span>
              <span className="font-bold text-slate-900 dark:text-white">{downPaymentPct}% (Rs. {stats.downPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
            </div>
            <input type="range" min="0" max="100" value={downPaymentPct} onChange={e => setDownPaymentPct(Number(e.target.value))} className="w-full accent-blue-600" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Interest Rate</span>
              <span className="font-bold text-slate-900 dark:text-white">{interestRate}%</span>
            </div>
            <input type="range" min="1" max="20" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full accent-blue-600" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Loan Tenure</span>
              <span className="font-bold text-slate-900 dark:text-white">{loanTenureYears} Years</span>
            </div>
            <input type="range" min="1" max="30" value={loanTenureYears} onChange={e => setLoanTenureYears(Number(e.target.value))} className="w-full accent-blue-600" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
          <div className="w-48 h-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `Rs. ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full space-y-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Monthly EMI</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rs. {stats.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span> Principal</p>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Rs. {stats.principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="flex justify-between items-center bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span> Interest</p>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Rs. {Math.max(0, stats.totalInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
