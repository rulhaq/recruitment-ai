/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authService } from '../lib/firebase';
import SignOutModal from './SignOutModal';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

const Navigation = () => {
  const { 
    user, 
    userProfile, 
    signOut, 
    isAdmin, 
    isSuperAdmin,
    hasAdminAccess,
    isRecruiter, 
    isClient, 
    isCandidate,
    getUserDisplayName, 
    getRoleDisplayName 
  } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // Save collapsed state to localStorage and update body class
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isCollapsed]);

  // Don't show navigation on public pages
  const publicPages = ['/', '/login', '/signup', '/features', '/pricing', '/about'];
  if (publicPages.includes(location.pathname) || !user) {
    return null;
  }

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const userRole = userProfile?.role;
    
    // Admin and Super Admin only see admin features
    if (hasAdminAccess()) {
      return [
        { name: 'Admin Dashboard', href: '/admin', icon: ShieldCheckIcon },
        { name: 'User Management', href: '/admin/users', icon: UsersIcon },
        { name: 'Team Management', href: '/team', icon: UsersIcon },
        { name: 'System Settings', href: '/admin/system', icon: CogIcon },
        { name: 'System Monitoring', href: '/admin/monitoring', icon: ChartBarIcon }
      ];
    }
    
    // Recruiter navigation
    if (isRecruiter()) {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Talent Search', href: '/talent-search', icon: MagnifyingGlassIcon },
        { name: 'Candidates', href: '/candidates', icon: UsersIcon },
        { name: 'Resource Requests', href: '/proposals', icon: DocumentTextIcon },
        { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
        { name: 'Settings', href: '/settings', icon: CogIcon }
      ];
    }
    
    // Client navigation
    if (isClient()) {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'My Projects', href: '/projects', icon: BriefcaseIcon },
        { name: 'Resource Requests', href: '/proposals', icon: DocumentTextIcon },
        { name: 'Settings', href: '/settings', icon: CogIcon }
      ];
    }
    
    // Candidate navigation
    if (isCandidate()) {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'My Profile', href: '/my-profile', icon: UserCircleIcon },
        { name: 'Job Opportunities', href: '/job-opportunities', icon: BriefcaseIcon },
        { name: 'Applications', href: '/applications', icon: DocumentTextIcon },
        { name: 'Settings', href: '/settings', icon: CogIcon }
      ];
    }
    
    // Default navigation
    return [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Settings', href: '/settings', icon: CogIcon }
    ];
  };

  const navigationItems = getNavigationItems();

  const handleSignOutClick = () => {
    setShowUserMenu(false);
    setShowSignOutModal(true);
  };

  const handleSignOutConfirm = async () => {
    try {
      setShowSignOutModal(false);
      setShowUserMenu(false);
      
      // Sign out from Firebase (don't await - fire and forget)
      authService.signOut().catch(err => {
        console.error('SignOut error:', err);
      });
      
      // Immediately navigate to landing page
      window.location.href = '/';
    } catch (error) {
      console.error('Error in sign out handler:', error);
      // Force navigation even if there's an error
      window.location.href = '/';
    }
  };

  const isActiveLink = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    if (href === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-card via-card to-card/95 border-r border-border z-50 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-[20%] min-w-[200px]'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <Link to="/dashboard" className="flex items-center space-x-2 flex-1">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-foreground">RecruitmentAI</span>
            </Link>
          )}
          {isCollapsed && (
            <Link to="/dashboard" className="flex items-center justify-center w-full">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isAdminItem = item.href.startsWith('/admin');
              const isActive = isActiveLink(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center px-2' : 'px-4'
                  } py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? isAdminItem
                        ? 'bg-gradient-to-r from-gray-900 to-black text-white shadow-lg'
                        : 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg'
                      : isAdminItem
                        ? 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} flex-shrink-0`} />
                  {!isCollapsed && (
                    <span className="ml-3 truncate">{item.name}</span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section - User Menu & Actions */}
        <div className="border-t border-border p-4 space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2' : 'px-4'
            } py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors`}
            title={isCollapsed ? (theme === 'dark' ? 'Light mode' : 'Dark mode') : ''}
          >
            {theme === 'dark' ? (
              <SunIcon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            ) : (
              <MoonIcon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            )}
            {!isCollapsed && <span className="ml-3">Toggle Theme</span>}
          </button>

          {/* Notifications */}
          <button
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2' : 'px-4'
            } py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors relative`}
            title={isCollapsed ? 'Notifications' : ''}
          >
            <BellIcon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            {!isCollapsed && <span className="ml-3">Notifications</span>}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-2' : 'px-4'
              } py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                {userProfile?.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={getUserDisplayName()}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary font-medium text-sm">
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="ml-3 text-left flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{getUserDisplayName()}</div>
                  <div className="text-xs text-muted-foreground truncate">{getRoleDisplayName()}</div>
                </div>
              )}
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={`absolute ${
                      isCollapsed ? 'left-24' : 'left-4'
                    } bottom-20 w-56 bg-card border border-border rounded-lg shadow-xl z-50`}
                  >
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground">{getUserDisplayName()}</p>
                        <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
                        <p className="text-xs text-muted-foreground">{getRoleDisplayName()}</p>
                      </div>
                      
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserCircleIcon className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>

                      <button
                        onClick={handleSignOutClick}
                        className="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {!isCollapsed && (
            <div className="border-t border-border pt-4 mt-2">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 px-4">
                A Product of Scalovate Systems Solutions
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleSignOutConfirm}
      />
    </aside>
  );
};

export default Navigation; 