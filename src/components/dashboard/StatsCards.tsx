import React from 'react';
import { FileText, CheckCircle2, Clock, Users } from 'lucide-react';
import type { Report } from '../../types';

interface StatsCardsProps {
  reports: Report[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ reports }) => {
  const total = reports.length;
  const completed = reports.filter((r) => r.status === 'Completed').length;
  const drafts = reports.filter((r) => r.status === 'Draft').length;
  const uniquePatients = new Set(reports.map((r) => r.patientId)).size;

  const cards = [
    {
      title: 'Total Reports',
      value: total,
      icon: FileText,
      color: 'bg-sky-50 text-sky-600 border-sky-200',
    },
    {
      title: 'Completed Reports',
      value: completed,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Active Drafts',
      value: drafts,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      title: 'Unique Patients',
      value: uniquePatients,
      icon: Users,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-medium text-slate-500">{card.title}</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-xl border ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
