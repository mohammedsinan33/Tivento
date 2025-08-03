'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, UserButton, SignInButton, SignUpButton, useClerk } from '@clerk/nextjs';
import { Bell, User, Calendar, Settings, Crown, LogOut } from 'lucide-react';
import { useNotifications } from '../Notifications/NotificationProvider';
import { useUserTier } from '@/lib/auth/useUserTier';
import { getTierDisplayName, getTierColor, getTierIcon } from '@/lib/tierUtils';

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { userTier, loading: tierLoading } = useUserTier();
  const { addNotification } = useNotifications();
  const { signOut } = useClerk();

  const handleNavigation = (page: string) => {
    router.push(`/?page=${page}`);
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleNotificationClick = () => {
    addNotification({
      type: 'info',
      title: 'Notifications',
      message: 'No new notifications at this time.',
      duration: 3000
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsProfileDropdownOpen(false);
      addNotification({
        type: 'success',
        title: 'Logged out successfully',
        message: 'You have been signed out of your account.',
        duration: 3000
      });
      router.push('/');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Logout failed',
        message: 'There was an error signing you out. Please try again.',
        duration: 5000
      });
    }
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.username) {
      return user.username;
    } else if (user?.emailAddresses && user.emailAddresses.length > 0) {
      return user.emailAddresses[0].emailAddress.split('@')[0];
    }
    return 'User';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
            >
              Tivento
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('events')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Events
            </button>
            <button
              onClick={() => handleNavigation('categories')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Categories
            </button>
            {isSignedIn && (
              <button
                onClick={() => handleNavigation('create-event')}
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                Create Event
              </button>
            )}
            <button
              onClick={() => handleNavigation('premium')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Premium
            </button>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <button
                  onClick={handleNotificationClick}
                  className="p-2 text-gray-700 hover:text-orange-600 hover:bg-gray-100 rounded-full transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-3 p-2 text-gray-700 hover:text-orange-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8",
                            userButtonPopoverCard: "hidden"
                          }
                        }}
                        showName={false}
                      />
                      <div className="flex flex-col items-start">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            Hi, {getUserDisplayName()}
                          </span>
                          {!tierLoading && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTierColor(userTier)}`}>
                              <span className="mr-1">{getTierIcon(userTier)}</span>
                              {getTierDisplayName(userTier)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {user?.emailAddresses?.[0]?.emailAddress}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <UserButton 
                            appearance={{
                              elements: {
                                avatarBox: "w-10 h-10"
                              }
                            }}
                            showName={false}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.emailAddresses?.[0]?.emailAddress}
                            </p>
                            {!tierLoading && (
                              <div className="mt-1">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTierColor(userTier)}`}>
                                  <span className="mr-1">{getTierIcon(userTier)}</span>
                                  {getTierDisplayName(userTier)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <button
                        onClick={() => handleNavigation('profile')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile Settings
                      </button>
                      <button
                        onClick={() => handleNavigation('my-events')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                      >
                        <Calendar className="h-4 w-4 mr-3" />
                        My Events
                      </button>
                      <button
                        onClick={() => handleNavigation('my-registrations')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                      >
                        <Calendar className="h-4 w-4 mr-3" />
                        My Registrations
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      {userTier === 'free' && (
                        <button
                          onClick={() => handleNavigation('premium')}
                          className="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 font-medium"
                        >
                          <Crown className="h-4 w-4 mr-3" />
                          Upgrade to Premium
                        </button>
                      )}
                      <button
                        onClick={() => handleNavigation('settings')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <SignInButton mode="modal">
                  <button className="text-gray-700 hover:text-orange-600 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <button
                onClick={() => handleNavigation('events')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
              >
                Events
              </button>
              <button
                onClick={() => handleNavigation('categories')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
              >
                Categories
              </button>
              {isSignedIn && (
                <button
                  onClick={() => handleNavigation('create-event')}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                >
                  Create Event
                </button>
              )}
              <button
                onClick={() => handleNavigation('premium')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
              >
                Premium
              </button>
              
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4">
                {isSignedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8"
                          }
                        }}
                        showName={false}
                      />
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 font-medium text-sm">
                            {getUserDisplayName()}
                          </span>
                          {!tierLoading && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTierColor(userTier)}`}>
                              <span className="mr-1">{getTierIcon(userTier)}</span>
                              {getTierDisplayName(userTier)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {user?.emailAddresses?.[0]?.emailAddress}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNavigation('profile')}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => handleNavigation('my-events')}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                    >
                      My Events
                    </button>
                    <button
                      onClick={() => handleNavigation('my-registrations')}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                    >
                      My Registrations
                    </button>
                    {userTier === 'free' && (
                      <button
                        onClick={() => handleNavigation('premium')}
                        className="block w-full text-left px-3 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-md font-medium"
                      >
                        🚀 Upgrade to Premium
                      </button>
                    )}
                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md font-medium"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <SignInButton mode="modal">
                      <button className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="block w-full text-left px-3 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-md">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;