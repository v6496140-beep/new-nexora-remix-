import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  LogOut,
  User,
  Settings,
  ChevronDown,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';

// Mock Data
const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'New Booking', message: 'John Doe booked 10:00 AM', time: '5m ago', read: false },
  { id: 2, title: 'Payment Received', message: '₹500 received for BK-998', time: '1h ago', read: false },
];

const MOCK_SEARCH_RESULTS = [
  { type: 'Customer', label: 'Amit Sharma' },
  { type: 'Booking', label: 'BK-1234 - Royal Heritage' },
  { type: 'Service', label: 'Hair Cut' },
];

export const AdminHeader: React.FC<{
  onMenuToggle: () => void;
  activeId: string;
  businessName: string;
}> = ({ onMenuToggle, activeId, businessName }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Close dropdowns on outside click
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
        setProfileOpen(false);
        setHelpOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header ref={headerRef} className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-sm font-bold text-slate-900 capitalize">{activeId.replace('_', ' ')}</span>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Search */}
        <div className="relative">
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Search className="w-5 h-5" />
          </button>
          {searchOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-2">
              <input type="text" placeholder="Search..." className="w-full p-2 text-sm border-b border-slate-100 focus:outline-none" />
              {MOCK_SEARCH_RESULTS.map((res, i) => (
                <div key={i} className="p-2 text-xs hover:bg-slate-50 cursor-pointer rounded">
                  <span className="text-slate-400 mr-2">[{res.type}]</span>
                  {res.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </button>
          {notificationsOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-2">
              <div className="flex justify-between p-2 text-xs font-bold border-b border-slate-100">
                <span>Notifications</span>
                <button className="text-indigo-600">Mark all read</button>
              </div>
              {MOCK_NOTIFICATIONS.map((n) => (
                <div key={n.id} className="p-3 text-xs hover:bg-slate-50 rounded border-b border-slate-50">
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-slate-500">{n.message}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help */}
        <div className="relative">
          <button onClick={() => setHelpOpen(!helpOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <HelpCircle className="w-5 h-5" />
          </button>
          {helpOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 text-xs">
              <div className="p-2 font-bold border-b border-slate-100">Help Center</div>
              <div className="p-2 hover:bg-slate-50 cursor-pointer">Contact Support</div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-2 lg:pl-4">
            <div className="text-right hidden lg:block">
              <div className="text-xs font-bold text-slate-900">Owner Name</div>
              <div className="text-[10px] text-slate-500">Business Owner</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              ON
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          {profileOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 text-xs">
              <div className="p-2 flex items-center gap-2 hover:bg-slate-50 cursor-pointer rounded">
                <User className="w-4 h-4" /> My Profile
              </div>
              <div className="p-2 flex items-center gap-2 hover:bg-slate-50 cursor-pointer rounded">
                <Settings className="w-4 h-4" /> Business Settings
              </div>
              <div className="p-2 flex items-center gap-2 hover:bg-slate-50 cursor-pointer rounded text-rose-600">
                <LogOut className="w-4 h-4" /> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
