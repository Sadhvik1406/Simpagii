import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, CheckCircle2, Receipt, ArrowRight, Sparkles, Plus, Save } from 'lucide-react';

interface InvoiceItem {
  id: string;
  date: string;
  invoiceNo: string;
  vendor: string;
  category: string;
  amount: number;
  status: 'pending' | 'entering' | 'completed';
}

interface DataEntryAppProps {
  isAgentActive?: boolean;
  onRowCompleted?: (rowId: string) => void;
}

export const DataEntryApp: React.FC<DataEntryAppProps> = ({
  isAgentActive = false,
  onRowCompleted,
}) => {
  const [rows, setRows] = useState<InvoiceItem[]>([
    {
      id: 'row_1',
      date: '2026-10-18',
      invoiceNo: 'INV-4401',
      vendor: 'MedTech Supplies Inc',
      category: 'Medical Gear',
      amount: 480.50,
      status: 'completed',
    },
    {
      id: 'row_2',
      date: '2026-10-19',
      invoiceNo: 'INV-4402',
      vendor: 'Apex Courier Logistics',
      category: 'Freight / Shipping',
      amount: 125.00,
      status: 'entering',
    },
    {
      id: 'row_3',
      date: '2026-10-19',
      invoiceNo: 'INV-4403',
      vendor: 'Sunlight Utilities',
      category: 'Electricity & Gas',
      amount: 340.20,
      status: 'pending',
    },
    {
      id: 'row_4',
      date: '2026-10-19',
      invoiceNo: 'INV-4404',
      vendor: 'BioClean Sanitize Corp',
      category: 'Sterilization',
      amount: 89.90,
      status: 'pending',
    },
  ]);

  const [activeCell, setActiveCell] = useState<{ row: number; col: number }>({ row: 1, col: 2 });
  const [totalSum, setTotalSum] = useState(1035.60);

  // Auto-entry loop when agent is active
  useEffect(() => {
    if (!isAgentActive) return;

    const interval = setInterval(() => {
      setRows(prevRows => {
        const enteringIndex = prevRows.findIndex(r => r.status === 'entering');
        if (enteringIndex !== -1) {
          const next = [...prevRows];
          next[enteringIndex].status = 'completed';
          if (enteringIndex + 1 < next.length) {
            next[enteringIndex + 1].status = 'entering';
            setActiveCell({ row: enteringIndex + 1, col: 2 });
          }
          if (onRowCompleted) onRowCompleted(next[enteringIndex].id);
          return next;
        } else {
          const firstPending = prevRows.findIndex(r => r.status === 'pending');
          if (firstPending !== -1) {
            const next = [...prevRows];
            next[firstPending].status = 'entering';
            setActiveCell({ row: firstPending, col: 2 });
            return next;
          }
        }
        return prevRows;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isAgentActive, onRowCompleted]);

  // Recalculate total sum
  useEffect(() => {
    const sum = rows
      .filter(r => r.status === 'completed' || r.status === 'entering')
      .reduce((acc, curr) => acc + curr.amount, 0);
    setTotalSum(sum);
  }, [rows]);

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-y-auto">
      {/* Top App Bar (Excel / Sheets mobile header) */}
      <div className="bg-emerald-700 px-3 py-2 text-white flex items-center justify-between shrink-0 shadow">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
          <div>
            <h2 className="text-xs font-bold leading-tight">Mom_October_Ledger.xlsx</h2>
            <span className="text-[10px] text-emerald-200">Auto-saved to cloud</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded font-mono text-emerald-100">
            Total: ${totalSum.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Scanned Document Source Bar */}
      <div className="bg-slate-800 border-b border-slate-700 p-2.5 shrink-0 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <Receipt className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-slate-200 truncate">
              OCR Source: Scanned Invoice #INV-4402
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
              <span>Apex Courier Logistics</span>
              <span>•</span>
              <span className="text-amber-400 font-mono font-bold">$125.00</span>
            </div>
          </div>
        </div>

        {isAgentActive && (
          <div className="flex items-center gap-1 text-[10px] font-semibold text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2 py-1 rounded">
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>AI Auto-Typing</span>
          </div>
        )}
      </div>

      {/* Spreadsheet Table Grid */}
      <div className="flex-1 overflow-x-auto p-2">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-800/80 text-slate-400 text-[10px] uppercase font-semibold border-b border-slate-700">
              <th className="p-1.5 w-6 text-center">#</th>
              <th className="p-1.5">Date</th>
              <th className="p-1.5">Invoice #</th>
              <th className="p-1.5">Vendor</th>
              <th className="p-1.5 text-right">Amount</th>
              <th className="p-1.5 text-center">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((row, index) => {
              const isEntering = row.status === 'entering';
              const isCompleted = row.status === 'completed';

              return (
                <tr
                  key={row.id}
                  onClick={() => setActiveCell({ row: index, col: 2 })}
                  className={`transition ${
                    isEntering
                      ? 'bg-sky-500/15 border-l-2 border-sky-400'
                      : isCompleted
                      ? 'bg-slate-900/60 hover:bg-slate-800/40'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <td className="p-1.5 text-center text-slate-500 font-mono text-[10px]">
                    {index + 1}
                  </td>
                  <td className="p-1.5 font-mono text-[11px] text-slate-300">
                    {row.date}
                  </td>
                  <td className={`p-1.5 font-mono font-medium ${isEntering ? 'text-sky-300 ring-1 ring-sky-400/50 rounded bg-sky-950/40' : 'text-slate-200'}`}>
                    {row.invoiceNo}
                  </td>
                  <td className="p-1.5 font-medium text-slate-300 truncate max-w-[120px]">
                    {row.vendor}
                  </td>
                  <td className="p-1.5 text-right font-mono font-semibold text-emerald-400">
                    ${row.amount.toFixed(2)}
                  </td>
                  <td className="p-1.5 text-center">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    ) : isEntering ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-sky-400 bg-sky-950/60 border border-sky-800/50 px-1.5 py-0.5 rounded font-medium animate-pulse">
                        Entering...
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">
                        Queued
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Spreadsheet Formula & Action Bar */}
      <div className="bg-slate-950/90 border-t border-slate-800 p-2 shrink-0 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span className="text-emerald-400 font-bold">fx</span>
          <span>=SUM(E2:E{rows.length + 1})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRows(prev => [
                ...prev,
                {
                  id: `row_${Date.now()}`,
                  date: '2026-10-19',
                  invoiceNo: `INV-${4400 + prev.length + 1}`,
                  vendor: 'Office Depot Supply',
                  category: 'Stationery',
                  amount: 64.50,
                  status: 'completed',
                },
              ]);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700"
          >
            <Plus className="w-3 h-3" />
            Add Row
          </button>
        </div>
      </div>
    </div>
  );
};
