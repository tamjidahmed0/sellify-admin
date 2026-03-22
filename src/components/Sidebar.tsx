import { NavLink } from 'react-router-dom';
import Icon from './Icons';


interface NavItem {
  path: string;
  label: string;
  icon: keyof typeof Icon;
}

const NAV: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/products', label: 'Products', icon: 'products' },
  { path: '/categories', label: 'Categories', icon: 'categories' },
  { path: '/orders', label: 'Orders', icon: 'orders' },
  { path: '/slides', label: 'Hero Slides', icon: 'slides' },
  { path: '/reviews', label: 'reviews', icon: 'review' },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {


  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-100 z-30 flex flex-col
          transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-50">
          <Icon.logo />
          <span className="text-lg font-bold text-gray-900 tracking-tight">Sellify</span>
          <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-md font-semibold ml-auto">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const Ic = Icon[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-indigo-600' : 'text-gray-400'}>
                      <Ic />
                    </span>
                    {item.label}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-gray-50">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Super Admin</p>
              <p className="text-xs text-gray-400 truncate">admin@sellify.com</p>
            </div>
            <button

              className="text-gray-400 hover:text-rose-500 transition"
              title="Logout"
            >
              <Icon.logout />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}