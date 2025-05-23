import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LeetLabsLogoDark from '../../assets/LeetLabs-logo-dark.png'; // Use dark logo
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShimmerButton } from '../magicui/shimmer-button';
import { useAuth } from '@/lib/auth';
import Avatar from 'boring-avatars';
import { LogOut, Zap } from 'lucide-react';

// Dropdown items
const discoverItems = [
  {
    title: 'Featured Courses',
    to: '/courses',
    description: 'Explore our curated coding courses to level up your skills.',
  },
  {
    title: 'Sheets Library',
    to: '/sheets/public',
    description: 'Explore curated DSA and coding question sheets for practice.',
  },
  {
    title: 'Contribute',
    to: '/contribute',
    description: 'Showcase your expertise and make an impact in the learning community.',
  },
];

const resourceItems = [
  {
    title: 'Blogs',
    to: '/blogs',
    description: 'Read insightful articles on coding and tech.',
  },
  {
    title: 'Roadmaps',
    to: '/roadmaps',
    description: 'Step-by-step guides to master coding skills.',
  },
  {
    title: 'Glossary',
    to: '/glossary',
    description: 'Understand key coding terms and concepts.',
  },
  {
    title: 'AI Discussion',
    to: '/ai-discussion',
    description: 'Talk with AI, solve smarter, learn together.',
  },
];

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const { isAuthenticated, user, isLoading, logout } = useAuth();

  // Scroll effect with debouncing
  useEffect(() => {
    const handleScroll = debounce(() => {
      setIsScrolled(window.scrollY > 50);
    }, 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus trap for mobile menu
  useEffect(() => {
    if (isOpen && mobileMenuRef.current) {
      const focusableElements = mobileMenuRef.current.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Toggle dropdown in mobile menu
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Check if a link is active
  const isActive = (path) => location.pathname === path;

  // Reusable link class
  const linkClass = (path) =>
    cn(
      'text-gray-200 rounded-md text-sm font-semibold transition-all duration-200 ease-in-out',
      isActive(path) ? 'text-yellow-500' : 'hover:bg-neutral-800 hover:text-yellow-500  focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none'
    );

  // Profile Dropdown Component
  const ProfileDropdown = ({ isMobile = false }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex items-center justify-center rounded-full h-10 w-10 bg-neutral-800 hover:bg-neutral-700 transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none',
            isMobile && 'w-full h-12'
          )}
          aria-label="User profile"
        >
          <Avatar
            size={isMobile ? 36 : 32}
            name={user?.name || 'Guest'}
            variant="beam"
            colors={['#f5b210', '#166534', '#ef4444', '#3b82f6', '#ffffff']}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 p-4 satoshi bg-neutral-900 border-0 shadow-[0_4px_15px_rgba(0,0,0,0.2)] backdrop-blur-sm rounded-lg transition-all duration-200 ease-in-out will-change-transform"
        align="end"
      >
        <div className="flex flex-col items-center p-4 bg-neutral-800 rounded-md">
          <Avatar
            size={48}
            name={user?.name || 'Guest'}
            variant="beam"
            colors={['#f5b210', '#166534', '#ef4444', '#3b82f6', '#ffffff']}
          />
          <span className="mt-2 text-sm font-semibold text-gray-200">
            {user?.name || 'Guest'}
          </span>
        </div>
        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuItem asChild>
          <Link
            to="/profile"
            className="flex items-center text-sm font-semibold text-gray-200 hover:text-yellow-500 hover:bg-neutral-800 transition-all duration-200 ease-in-out rounded-md"
          >
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={logout}
          className="flex items-center text-sm font-semibold text-gray-200 hover:text-yellow-500 hover:bg-neutral-800 transition-all duration-200 ease-in-out rounded-md"
        >
          Log Out
          <LogOut className="ml-auto h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Render loading state if auth check is in progress
  if (isLoading) {
    return null;
  }

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 satoshi bg-neutral-950/90 backdrop-blur-sm',
        isScrolled && 'border-b border-neutral-800 shadow-sm'
      )}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-12 w-auto mr-2"
                src={LeetLabsLogoDark}
                alt="LeetLabs Logo"
                loading="eager"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <Link to="/" className={cn(linkClass('/'), 'px-3 py-2')}>
              Home
            </Link>
            <Link to="/problems" className={cn(linkClass('/problems'), 'px-3 py-2')}>
              Practice
            </Link>

            {/* Discover Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      linkClass(),
                      'px-3 py-2 bg-neutral-950 hover:bg-neutral-800 text-gray-200 hover:text-yellow-500 transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none'
                    )}
                  >
                    Discover
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="no-border bg-neutral-900 border-0 shadow-[0_4px_15px_rgba(0,0,0,0.2)] backdrop-blur-sm rounded-lg transition-all duration-200 ease-in-out transform will-change-transform"
                  >
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-neutral-900">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/"
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-neutral-800 to-neutral-900 p-6 no-underline outline-none focus:shadow-md transition-all duration-200 ease-in-out hover:bg-neutral-800"
                          >
                            <img
                              src={LeetLabsLogoDark}
                              alt="LeetLabs Logo"
                              className="h-16 w-auto mb-2"
                              loading="eager"
                            />
                            <p className="text-sm leading-tight text-gray-200">
                              Master Coding with AI-Powered Discussions & Challenges.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {discoverItems.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          to={item.to}
                          className={isActive(item.to) ? 'text-yellow-500 bg-neutral-800' : ''}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Resources Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      linkClass(),
                      'px-3 py-2 bg-neutral-950 hover:bg-neutral-800 text-gray-200 hover:text-yellow-500 transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none'
                    )}
                  >
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="no-border bg-neutral-900 border-0 shadow-[0_4px_15px_rgba(0,0,0,0.2)] backdrop-blur-sm rounded-lg transition-all duration-200 ease-in-out transform will-change-transform"
                  >
                    <ul className="grid gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px] bg-neutral-900">
                      {resourceItems.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          to={item.to}
                          className={isActive(item.to) ? 'text-yellow-500 bg-neutral-800' : ''}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/pricing" className={cn(linkClass('/pricing'), 'px-3 py-2')}>
              Pricing
            </Link>
          </div>

          {/* Desktop Buttons or Profile */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/pricing"
                  className={cn(
                    'flex items-center text-gray-200 hover:text-yellow-500 text-sm font-semibold px-3 py-2 rounded-md transition-all duration-200 ease-in-out hover:scale-105 focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none',
                    isActive('/pricing') && 'text-yellow-500'
                  )}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Switch to Pro
                </Link>
                <div className="h-6 w-px bg-neutral-700" />
                <ProfileDropdown />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="transition-all duration-200 ease-in-out text-gray-200 border border-neutral-700 hover:border-yellow-500 hover:shadow-[0_2px_2px_#f5b210] px-3 py-2 rounded-md text-sm font-semibold hover:scale-105 focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none"
                >
                  Log In
                </Link>
                <Link to="/signup">
                  <ShimmerButton
                    shimmerColor="#f5b210"
                    borderRadius="7px"
                    shimmerSize="0.15em"
                    background="neutral-800"
                    className="h-10 px-6 text-sm font-semibold text-gray-200  focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none"
                  >
                    Join For Free
                  </ShimmerButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-yellow-500 hover:bg-neutral-800 transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'sm:hidden bg-neutral-950 overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[80vh]' : 'max-h-0'
        )}
        ref={mobileMenuRef}
      >
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={cn(
              'block px-3 py-2 text-base font-semibold transition-all duration-200 ease-in-out',
              isActive('/') ? 'text-yellow-500 bg-neutral-800' : 'text-gray-200 hover:text-yellow-500 hover:bg-neutral-800 hover:scale-105 focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none'
            )}
          >
            Home
          </Link>
          <Link
            to="/problems"
            className={cn(
              'block px-3 py-2 text-base font-semibold transition-all duration-200 ease-in-out',
              isActive('/problems') ? 'text-yellow-500 bg-neutral-800' : 'text-gray-200 hover:text-yellow-500 hover:bg-neutral-800  focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none'
            )}
          >
            Practice
          </Link>

          {/* Discover Dropdown for Mobile */}
          <div>
            <button
              onClick={() => toggleDropdown('discover')}
              className={cn(
                'w-full text-left px-3 py-2 text-base font-semibold flex items-center justify-between transition-all duration-200 ease-in-out',
                discoverItems.some((item) => isActive(item.to))
                  ? 'text-yellow-500 bg-neutral-800'
                  : 'text-gray-200 hover:text-yellow-500 hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none'
              )}
              aria-expanded={openDropdown === 'discover'}
              aria-controls="discover-dropdown"
            >
              Discover
              <svg
                className={cn('h-5 w-5 transition-transform duration-200', openDropdown === 'discover' && 'rotate-180')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={cn(
                'pl-6 space-y-1 overflow-hidden transition-all duration-200 ease-in-out',
                openDropdown === 'discover' ? 'max-h-96' : 'max-h-0'
              )}
              id="discover-dropdown"
            >
              {discoverItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className={cn(
                    'block px-3 py-2 text-sm font-semibold transition-all duration-200 ease-in-out',
                    isActive(item.to) ? 'text-yellow-500 bg-neutral-800' : 'text-gray-200 hover:text-yellow-500 hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none'
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources Dropdown for Mobile */}
          <div>
            <button
              onClick={() => toggleDropdown('resources')}
              className={cn(
                'w-full text-left px-3 py-2 text-base font-semibold flex items-center justify-between transition-all duration-200 ease-in-out',
                resourceItems.some((item) => isActive(item.to))
                  ? 'text-yellow-500 bg-neutral-800'
                  : 'text-gray-200 hover:text-yellow-500 hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none'
              )}
              aria-expanded={openDropdown === 'resources'}
              aria-controls="resources-dropdown"
            >
              Resources
              <svg
                className={cn('h-5 w-5 transition-transform duration-200', openDropdown === 'resources' && 'rotate-180')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={cn(
                'pl-6 space-y-1 overflow-hidden transition-all duration-200 ease-in-out',
                openDropdown === 'resources' ? 'max-h-96' : 'max-h-0'
              )}
              id="resources-dropdown"
            >
              {resourceItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className={cn(
                    'block px-3 py-2 text-sm font-semibold transition-all duration-200 ease-in-out',
                    isActive(item.to) ? 'text-yellow-500 bg-neutral-800' : 'text-gray-200 hover:text-yellow-500 hover:bg-neutral-800  focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none'
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/pricing"
            className={cn(
              'block px-3 py-2 text-base font-semibold transition-all duration-200 ease-in-out',
              isActive('/pricing') ? 'text-yellow-500 bg-neutral-800' : 'text-gray-200 hover:text-yellow-500 hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none'
            )}
          >
            Pricing
          </Link>

          {/* Mobile Auth Buttons or Profile */}
          {isAuthenticated ? (
            <div className="px-3 py-2 space-y-2">
              <Link
                to="/pricing"
                className={cn(
                  'flex items-center text-gray-200 hover:text-yellow-500 text-base font-semibold px-3 py-2 transition-all duration-200 ease-in-out',
                  isActive('/pricing') && 'text-yellow-500 bg-neutral-800'
                )}
              >
                <Zap className="h-5 w-5 mr-2" />
                Switch to Pro
              </Link>
              <div className="w-full h-px bg-neutral-700" />
              <ProfileDropdown isMobile />
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={cn(
                  'block px-3 py-2 text-base font-semibold border border-neutral-700 transition-all duration-200 ease-in-out',
                  isActive('/login') ? 'text-yellow-500 bg-neutral-800 border-yellow-500' : 'text-gray-200 hover:text-yellow-500 hover:bg-neutral-800 hover:border-yellow-500 focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none'
                )}
              >
                Log In
              </Link>
              <Link to="/signup" className="block px-3 py-2">
                <ShimmerButton
                  shimmerColor="#f5b210"
                  borderRadius="7px"
                  shimmerSize="0.15em"
                  background="neutral-800"
                  className="w-full h-11 text-base font-semibold text-gray-200 focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none transition-all duration-200 ease-in-out"
                >
                  Join For Free
                </ShimmerButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const ListItem = React.forwardRef(({ className, title, children, to, ...props }, ref) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-200 ease-in-out',
            isActive ? 'text-yellow-500 bg-neutral-800' : 'text-gray-200 hover:bg-neutral-800 hover:text-yellow-500  focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none',
            className
          )}
          {...props}
        >
          <div className="text-sm font-semibold leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-400">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';