import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Admin" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/performance", label: "Performance" },
];

export function Header({ currentPath }: { currentPath: string }) {
  // Only show navigation links when in admin section
  const isAdminSection = currentPath.startsWith('/admin') || currentPath.startsWith('/forms');
  
  return (
    <div className="relative border-b border-gray-200/30 bg-white iplc-shadow-sm">
      <nav className="flex items-center justify-between mx-6 h-16">
        <div className="flex items-center space-x-4 lg:space-x-6">
          {/* Brand text with metallic hover effect */}
          <a
            href="/"
            className="group relative flex items-center pr-4 lg:pr-6 transition-transform hover:scale-105 focus:outline-none focus:ring-0"
            aria-label="FormPro Home"
          >
            <h1 className="text-2xl font-bold gradient-metallic-primary bg-clip-text text-transparent">
              FormPro
            </h1>
          </a>
          
          {/* Only show navigation links in admin section */}
          {isAdminSection && (
            <>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-[#C9D4D5] to-transparent" />
              
              {/* Navigation links */}
              <div className="flex items-center space-x-1 lg:space-x-2">
                {links.map((link) => (
                  <a
                    key={link.href}
                    className={cn(
                      "relative overflow-hidden px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      currentPath === link.href
                        ? "text-[#27599F]"
                        : "text-[#92969C] hover:text-[#219FD9]",
                    )}
                    href={link.href}
                    aria-current={currentPath === link.href ? "page" : undefined}
                  >
                    {/* Active indicator with metallic gradient */}
                    {currentPath === link.href && (
                      <span className="absolute inset-0 bg-gradient-to-r from-[#219FD9]/10 to-[#27599F]/10 rounded-lg" />
                    )}
                    
                    {/* Hover effect */}
                    <span className="relative z-10">{link.label}</span>
                    
                    {/* Bottom accent for active state */}
                    {currentPath === link.href && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 gradient-metallic-primary rounded-full" />
                    )}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Optional right side content area */}
        <div className="flex items-center space-x-3">
          {/* Theme toggle or other actions can go here */}
          <div className="hidden sm:flex items-center space-x-2 text-xs text-[#92969C]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#80C97B] animate-pulse"></span>
            <span>System Active</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
