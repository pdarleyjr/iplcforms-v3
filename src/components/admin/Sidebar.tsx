import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  MessageSquare,
  Settings,
  ChevronRight
} from 'lucide-react';

const sidebarLinks = [
  { 
    href: '/admin', 
    label: 'Dashboard', 
    icon: LayoutDashboard,
    description: 'Overview and analytics'
  },
  { 
    href: '/admin/customers', 
    label: 'Customers', 
    icon: Users,
    description: 'Manage customer accounts'
  },
  {
    href: '/admin/subscriptions',
    label: 'Subscriptions',
    icon: CreditCard,
    description: 'Billing and plans'
  },
  {
    href: '/forms',
    label: 'Forms',
    icon: FileText,
    description: 'Form builder and templates'
  },
  {
    href: '/chat',
    label: 'AI Chat',
    icon: MessageSquare,
    description: 'Document assistant',
    badge: 'New'
  },
  { 
    href: '/admin/integrations', 
    label: 'Integrations', 
    icon: Settings,
    description: 'Third-party connections'
  },
];

interface SidebarProps {
  currentPath: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile toggle button - always visible when sidebar is collapsed */}
      {isMobile && isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-20 z-50 w-12 h-12 rounded-lg bg-[#153F81] hover:bg-[#1a4a94] iplc-shadow-lg flex items-center justify-center transition-all group"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "relative h-full bg-[#153F81] transition-all duration-300 ease-in-out z-50",
          "flex flex-col iplc-shadow-xl",
          isCollapsed ? "w-16" : "w-64",
          isMobile && "fixed top-16",
          isMobile ? (isCollapsed ? "-left-64" : "left-0") : ""
        )}
      >
        {/* Toggle button - for desktop */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className={cn(
              "absolute top-6 z-10 h-6 w-6 rounded-full bg-white iplc-shadow-md flex items-center justify-center hover:scale-110 transition-transform",
              isCollapsed ? "-right-10" : "-right-3"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3 text-[#153F81]" />
            ) : (
              <X className="h-3 w-3 text-[#153F81]" />
            )}
          </button>
        )}

        {/* Sidebar header */}
        <div className={cn(
          "border-b border-white/10",
          isCollapsed ? "p-2" : "p-4"
        )}>
          <div className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {isMobile && !isCollapsed ? (
              <button
                onClick={toggleSidebar}
                className="w-12 h-12 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group"
                aria-label="Close sidebar"
              >
                <X className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            ) : !isCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg gradient-metallic-gold flex items-center justify-center iplc-shadow-sm">
                  <span className="text-[#153F81] font-bold text-sm">IP</span>
                </div>
                <div>
                  <h2 className="text-white font-semibold">IPLC Admin</h2>
                  <p className="text-[#219FD9] text-xs">Clinical Forms</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.href;
            
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "hover:bg-white/10",
                  isActive && "bg-gradient-to-r from-[#219FD9]/20 to-[#27599F]/20 border-l-4 border-[#F9C04D]",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? link.label : undefined}
              >
                <Icon 
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    isActive ? "text-[#F9C04D]" : "text-[#219FD9] group-hover:text-white",
                    !isCollapsed && "mr-3",
                    "h-5 w-5"
                  )}
                />
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "transition-colors",
                        isActive ? "text-white" : "text-[#C9D4D5] group-hover:text-white"
                      )}>
                        {link.label}
                      </span>
                      {link.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-metallic-gold text-[#153F81]">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#92969C] mt-0.5 group-hover:text-[#C9D4D5]">
                      {link.description}
                    </p>
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="rounded-lg bg-gradient-to-r from-[#219FD9]/10 to-[#27599F]/10 p-3">
              <p className="text-xs text-[#C9D4D5] mb-1">System Status</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#80C97B] animate-pulse"></div>
                <span className="text-xs text-white font-medium">All systems operational</span>
              </div>
            </div>
          </div>
        )}

        {/* Metallic accent line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#219FD9]/30 to-transparent"></div>
      </aside>
    </>
  );
}