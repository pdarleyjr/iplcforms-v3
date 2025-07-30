import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export type Subscription = {
  id: number;
  name: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
  status?: string;
  tier?: string;
  features?: string[];
  subscribers?: number;
};

const columnHelper = createColumnHelper<Subscription>();

// Enhanced subscription tier detection based on name and price
const getSubscriptionTier = (name: string, price: number): 'Basic' | 'Professional' | 'Enterprise' | 'Clinical' => {
  const lowerName = name.toLowerCase();
  if (price === 0 || lowerName.includes('free') || lowerName.includes('trial')) return 'Basic';
  if (price > 100 || lowerName.includes('enterprise') || lowerName.includes('premium')) return 'Enterprise';
  if (lowerName.includes('clinical') || lowerName.includes('therapy') || lowerName.includes('professional')) return 'Clinical';
  return 'Professional';
};

// Enhanced subscription status detection
const getSubscriptionStatus = (subscription: Subscription): 'Active' | 'Inactive' | 'Trial' | 'Expired' => {
  if (subscription.status) {
    const status = subscription.status.toLowerCase();
    if (status === 'trial') return 'Trial';
    if (status === 'expired' || status === 'cancelled') return 'Expired';
    if (status === 'inactive') return 'Inactive';
  }
  return 'Active';
};

// Clinical subscription tier badge styling
const getTierBadgeVariant = (tier: string) => {
  switch (tier) {
    case 'Basic': return 'outline';
    case 'Professional': return 'default';
    case 'Clinical': return 'destructive';
    case 'Enterprise': return 'secondary';
    default: return 'outline';
  }
};

// Clinical subscription status badge styling
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Active': return 'default';
    case 'Trial': return 'secondary';
    case 'Inactive': return 'outline';
    case 'Expired': return 'destructive';
    default: return 'outline';
  }
};

const columns: ColumnDef<Subscription, any>[] = [
  {
    accessorKey: "id",
    header: "Plan ID",
    cell: ({ getValue }) => (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
          {String(getValue()).slice(-2)}
        </div>
        <span className="text-sm font-medium text-muted-foreground">#{getValue()}</span>
      </div>
    ),
  } as ColumnDef<Subscription, any>,
  {
    accessorKey: "name",
    header: "Subscription Plan",
    cell: ({ getValue, row }) => {
      const name = getValue() as string;
      const tier = getSubscriptionTier(name, row.original.price);
      return (
        <div className="space-y-1">
          <a
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            href={`/admin/subscriptions/${row.original.id}`}
          >
            {name}
          </a>
          <div className="flex items-center space-x-2">
            <Badge variant={getTierBadgeVariant(tier)} className="text-xs">
              {tier}
            </Badge>
            {row.original.subscribers && (
              <span className="text-xs text-muted-foreground">
                {row.original.subscribers} subscribers
              </span>
            )}
          </div>
        </div>
      );
    },
  } as ColumnDef<Subscription, any>,
  {
    accessorKey: "description",
    header: "Clinical Features",
    cell: ({ getValue, row }) => {
      const description = getValue() as string;
      const features = row.original.features || [];
      return (
        <div className="space-y-1 max-w-xs">
          <p className="text-sm text-foreground line-clamp-2">{description}</p>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 2).map((feature: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {features.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{features.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>
      );
    },
  } as ColumnDef<Subscription, any>,
  {
    accessorKey: "price",
    header: "Monthly Rate",
    cell: ({ getValue, row }) => {
      const price = getValue() as number;
      const tier = getSubscriptionTier(row.original.name, price);
      return (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-foreground">
            {price === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              <span>${price.toFixed(2)}</span>
            )}
            {price > 0 && <span className="text-muted-foreground text-xs">/month</span>}
          </div>
          {tier === 'Clinical' && (
            <Badge variant="destructive" className="text-xs">
              HIPAA Compliant
            </Badge>
          )}
        </div>
      );
    },
  } as ColumnDef<Subscription, any>,
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = getSubscriptionStatus(row.original);
      return (
        <div className="space-y-1">
          <Badge variant={getStatusBadgeVariant(status)} className="text-xs">
            {status}
          </Badge>
          {status === 'Active' && (
            <div className="text-xs text-green-600">
              ● Available for signup
            </div>
          )}
          {status === 'Trial' && (
            <div className="text-xs text-blue-600">
              ● 14-day trial period
            </div>
          )}
        </div>
      );
    },
  } as ColumnDef<Subscription, any>,
  {
    accessorKey: "created_at",
    header: "Launch Date",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return (
        <div className="space-y-1">
          <div className="text-sm text-foreground">
            {date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div className="text-xs text-muted-foreground">
            {diffDays < 30 ? `${diffDays} days ago` :
             diffDays < 365 ? `${Math.floor(diffDays / 30)} months ago` :
             `${Math.floor(diffDays / 365)} years ago`}
          </div>
        </div>
      );
    },
  } as ColumnDef<Subscription, any>,
];

interface DataTableProps {
  data: Subscription[];
}

export function SubscriptionsTable({ data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-lg border border-slate-200/80 dark:border-slate-700/30 bg-gradient-to-br from-slate-50/90 to-slate-100/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-sm shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
      <div className="p-6 border-b border-slate-200/80 dark:border-slate-700/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Clinical Subscription Plans
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage healthcare professional subscription tiers and billing
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-xs border-slate-300/50 dark:border-slate-600/50 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50">
              {data.length} Plans
            </Badge>
            <Badge variant="default" className="text-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm">
              {data.filter(sub => getSubscriptionStatus(sub) === 'Active').length} Active
            </Badge>
          </div>
        </div>
      </div>
      <DataTable table={table} />
    </div>
  );
}
