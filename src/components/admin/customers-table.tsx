import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
export type Customer = {
  id: number;
  name: string;
  email: string;
  notes: string;
  created_at: string;
  updated_at: string;
  subscription?: {
    status: string;
  };
};

const columnHelper = createColumnHelper<Customer>();

// Helper function to determine professional type from notes
const getProfessionalType = (notes: string) => {
  if (!notes) return null;
  if (notes.toLowerCase().includes('slp')) return 'SLP';
  if (notes.toLowerCase().includes('ot')) return 'OT';
  if (notes.toLowerCase().includes('pt')) return 'PT';
  return null;
};

// Helper function to get status badge variant
const getStatusVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'default' as const;
    case 'inactive': return 'secondary' as const;
    case 'pending': return 'outline' as const;
    default: return 'secondary' as const;
  }
};

const columns: ColumnDef<Customer, any>[] = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => (
      <div className="font-mono text-sm text-slate-600">
        #{String(info.getValue()).padStart(4, '0')}
      </div>
    ),
  } as ColumnDef<Customer, any>),
  columnHelper.accessor("name", {
    header: "Healthcare Professional",
    cell: (info) => {
      const professionalType = getProfessionalType(info.row.original.notes);
      return (
        <div className="space-y-1">
          <a
            className="font-medium text-slate-900 hover:text-blue-600 transition-colors flex items-center space-x-2"
            href={`/admin/customers/${info.row.original.id}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold">
              {info.getValue().split(' ').map((n: string) => n[0]).join('')}
            </div>
            <span>{info.getValue()}</span>
          </a>
          {professionalType && (
            <Badge
              variant="secondary"
              className={`text-xs ${
                professionalType === 'SLP' ? 'bg-blue-100 text-blue-800' :
                professionalType === 'OT' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}
            >
              {professionalType === 'SLP' ? '🗣️ Speech-Language Pathologist' :
               professionalType === 'OT' ? '🖐️ Occupational Therapist' :
               '🏃 Physical Therapist'}
            </Badge>
          )}
        </div>
      );
    },
  } as ColumnDef<Customer, any>),
  columnHelper.accessor("email", {
    header: "Contact Information",
    cell: (info) => (
      <div className="space-y-1">
        <div className="text-sm text-slate-900">{info.getValue()}</div>
        <div className="flex items-center text-xs text-slate-500">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Verified Contact
        </div>
      </div>
    ),
  } as ColumnDef<Customer, any>),
  columnHelper.accessor("notes", {
    header: "Clinical Notes",
    cell: (info) => {
      const notes = info.getValue();
      return (
        <div className="max-w-xs">
          {notes ? (
            <div className="text-sm text-slate-600 truncate" title={notes}>
              {notes}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">No clinical notes</div>
          )}
        </div>
      );
    },
  } as ColumnDef<Customer, any>),
  {
    id: "subscription_status",
    header: "License Status",
    cell: (info) => {
      const status = (info.row.original as any).subscription?.status || 'inactive';
      return (
        <Badge variant={getStatusVariant(status)} className="capitalize">
          {status === 'active' && (
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
          )}
          {status === 'pending' && (
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
          )}
          {status === 'inactive' && (
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
          )}
          {status}
        </Badge>
      );
    },
  } as ColumnDef<Customer, any>,
  columnHelper.accessor("created_at", {
    header: "Registration Date",
    cell: (info) => (
      <div className="text-sm space-y-1">
        <div className="text-slate-900">
          {new Date(info.getValue()).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
        <div className="text-xs text-slate-500">
          {new Date(info.getValue()).toLocaleDateString('en-US', {
            weekday: 'short'
          })}
        </div>
      </div>
    ),
  } as ColumnDef<Customer, any>),
  columnHelper.accessor("updated_at", {
    header: "Last Activity",
    cell: (info) => {
      const daysSince = Math.floor((new Date().getTime() - new Date(info.getValue()).getTime()) / (1000 * 60 * 60 * 24));
      return (
        <div className="text-sm space-y-1">
          <div className="text-slate-900">
            {daysSince === 0 ? 'Today' :
             daysSince === 1 ? 'Yesterday' :
             `${daysSince} days ago`}
          </div>
          <div className="text-xs text-slate-500">
            {new Date(info.getValue()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      );
    },
  } as ColumnDef<Customer, any>),
];

interface DataTableProps {
  data: Customer[];
}

export function CustomersTable({ data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Healthcare Professionals Directory</span>
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Manage licensed speech-language pathologists and occupational therapists
        </p>
      </div>
      <DataTable table={table} />
    </div>
  );
}
