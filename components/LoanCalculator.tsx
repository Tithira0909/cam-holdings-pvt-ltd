import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

interface LoanCalculatorProps {
  initialAmount?: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ initialAmount = 1000000 }) => {
  const [totalAmount, setTotalAmount] = useState<number>(initialAmount);
  const [downPayment, setDownPayment] = useState<number>(initialAmount * 0.2); // Default 20%
  const [interestRate, setInterestRate] = useState<number>(12); // Default 12%
  const [loanTerm, setLoanTerm] = useState<number>(5); // Default 5 years
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  useEffect(() => {
    // Calculate monthly payment
    // Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const p = totalAmount - downPayment;
    if (p <= 0) {
      setMonthlyPayment(0);
      return;
    }

    const r = (interestRate / 100) / 12; // Monthly interest rate
    const n = loanTerm * 12; // Total number of months

    if (r === 0) {
       setMonthlyPayment(p / n);
       return;
    }

    const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyPayment(m);
  }, [totalAmount, downPayment, interestRate, loanTerm]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-luxury-border">
      <div className="flex items-center gap-3 mb-8 border-b border-luxury-border pb-4">
        <div className="p-3 bg-luxury-offwhite rounded-xl text-red-600">
          <Calculator size={24} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-luxury-black uppercase tracking-tight">Loan Calculator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Total Property Amount (LKR)</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all font-bold text-luxury-black"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Down Payment (LKR)</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all font-bold text-luxury-black"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500 font-bold">
               <span>0%</span>
               <span>{((downPayment / totalAmount) * 100).toFixed(0)}%</span>
               <span>100%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Interest Rate (%)</label>
               <input
                 type="number"
                 value={interestRate}
                 onChange={(e) => setInterestRate(Number(e.target.value))}
                 className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all font-bold text-luxury-black"
               />
             </div>
             <div>
               <label className="block text-sm font-bold text-luxury-gray mb-2 uppercase tracking-wider">Loan Term (Years)</label>
               <select
                 value={loanTerm}
                 onChange={(e) => setLoanTerm(Number(e.target.value))}
                 className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-600 outline-none transition-all font-bold text-luxury-black appearance-none"
               >
                 {[1, 2, 3, 4, 5, 10, 15, 20, 25, 30].map(year => (
                    <option key={year} value={year}>{year} Years</option>
                 ))}
               </select>
             </div>
          </div>
        </div>

        <div className="bg-luxury-black text-white p-8 rounded-xl flex flex-col justify-center items-center text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
           <p className="text-white/70 font-bold uppercase tracking-widest text-sm mb-4">Estimated Monthly Payment</p>
           <h3 className="text-4xl md:text-5xl font-serif font-bold text-red-600 mb-2">{formatCurrency(monthlyPayment)}</h3>
           <p className="text-white/50 text-xs mt-6 max-w-[250px] mx-auto">
             *This is an estimate. Actual payments may vary depending on your bank and final interest rates.
           </p>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;