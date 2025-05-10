import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LeetLabsLogoLight from '../../assets/Leetlabs-logo-light.png';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { ShimmerButton } from '../magicui/shimmer-button';

// Dropdown items
const discoverItems = [
  {
    title: 'Featured Courses',
    to: '/courses',
    description: 'Explore our curated coding courses to level up your skills.',
  },
  {
    title: 'Sheets Library',
    to: '/sheet-library',
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // For mobile dropdowns
  const location = useLocation();

  // Scroll effect for background change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dropdown in mobile menu
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav
    className={`fixed top-0 w-full z-50 transition-all duration-300 satoshi  ${
      isScrolled
        ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm'
        : 'bg-transparent'
    }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18.5">
          {/* Logo */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-14 w-auto mr-2" src={LeetLabsLogoLight} alt="LeetLabs Logo" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link
              to="/"
              className={cn(
                'text-gray-600 rounded-md px-3 py-2 text-sm font-semibold',
                isActive('/')
                  ? 'text-yellow-600 '
                  : ' hover:bg-gray-100'
              )}
            >
              Home
            </Link>
            <Link
              to="/problems"
              className={cn(
                'text-gray-600 rounded-md px-3 py-2 text-sm font-semibold',
                isActive('/problems')
                  ? 'text-yellow-600 '
                  : 'hover:bg-gray-100'
              )}
            >
              Practice
            </Link>

            {/* Discover Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      'text-gray-600 px-3 py-2 text-sm font-semibold',
                      discoverItems.some((item) => isActive(item.to))
                        ? 'text-yellow-600 '
                        : 'hover:bg-gray-100'
                    )}
                  >
                    Discover
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/"
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-gray-100 to-gray-200 p-6 no-underline outline-none focus:shadow-md"
                          >
                            <img src={LeetLabsLogoLight} alt="LeetLabs Logo" className="h-18 w-auto mb-2" />
                            <p className="text-sm leading-tight text-gray-600">
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
                          className={isActive(item.to) ? 'text-yellow-600 ' : ''}
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
                      'text-gray-600 px-3 py-2 text-sm font-semibold',
                      resourceItems.some((item) => isActive(item.to))
                        ? 'text-yellow-600 '
                        : 'hover:bg-gray-100'
                    )}
                  >
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px]">
                      {resourceItems.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          to={item.to}
                          className={isActive(item.to) ? 'text-yellow-600 ' : ''}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              to="/pricing"
              className={cn(
                'text-gray-600 rounded-md px-3 py-2 text-sm font-semibold',
                isActive('/pricing')
                  ? 'text-yellow-600 '
                  : 'hover:bg-gray-100'
              )}
            >
              Pricing
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link
              to="/login"
              className="transition-all duration-300 ease-in-out text-gray-600 border hover:border-yellow-600 border-2-black hover:shadow-[0_2px_2px_#f5b210] px-3 py-3 rounded-md text-sm font-semibold"
            >
              Log In
            </Link>
            <Link to="/signup">
              <ShimmerButton
                shimmerColor="#f5b210"
                borderRadius="7px"
                shimmerSize="0.15em"
                background="black"
                className="h-11 px-6 text-sm font-semibold group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]"
              >
                Join For Free
              </ShimmerButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-yellow-600 hover:bg-gray-100"
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
      {isOpen && (
        <div className="sm:hidden bg-white">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={cn(
                'block px-3 py-2 text-base font-semibold text-gray-600',
                isActive('/') ? 'text-yellow-600 bg-gray-100' : 'hover:text-yellow-600 hover:bg-gray-50'
              )}
            >
              Home
            </Link>
            <Link
              to="/problems"
              className={cn(
                'block px-3 py-2 text-base font-semibold text-gray-600',
                isActive('/problems') ? 'text-yellow-600 bg-gray-100' : 'hover:text-yellow-600 hover:bg-gray-50'
              )}
            >
              Practice
            </Link>

            {/* Discover Dropdown for Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown('discover')}
                className={cn(
                  'w-full text-left px-3 py-2 text-base font-semibold text-gray-600',
                  discoverItems.some((item) => isActive(item.to))
                    ? 'text-yellow-600 bg-gray-100'
                    : 'hover:text-yellow-600 hover:bg-gray-50'
                )}
              >
                Discover
                <span className="float-right">{openDropdown === 'discover' ? '−' : '+'}</span>
              </button>
              {openDropdown === 'discover' && (
                <div className="pl-6 space-y-1">
                  {discoverItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.to}
                      className={cn(
                        'block px-3 py-2 text-sm font-semibold text-gray-600',
                        isActive(item.to) ? 'text-yellow-600 bg-gray-100' : 'hover:text-yellow-600 hover:bg-gray-50'
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Dropdown for Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown('resources')}
                className={cn(
                  'w-full text-left px-3 py-2 text-base font-semibold text-gray-600',
                  resourceItems.some((item) => isActive(item.to))
                    ? 'text-yellow-600 bg-gray-100'
                    : 'hover:text-yellow-600 hover:bg-gray-50'
                )}
              >
                Resources
                <span className="float-right">{openDropdown === 'resources' ? '−' : '+'}</span>
              </button>
              {openDropdown === 'resources' && (
                <div className="pl-6 space-y-1">
                  {resourceItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.to}
                      className={cn(
                        'block px-3 py-2 text-sm font-semibold text-gray-600',
                        isActive(item.to) ? 'text-yellow-600 bg-gray-100' : 'hover:text-yellow-600 hover:bg-gray-50'
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/pricing"
              className={cn(
                'block px-3 py-2 text-base font-semibold text-gray-600',
                isActive('/pricing') ? 'text-yellow-600 bg-gray-100' : 'hover:text-yellow-600 hover:bg-gray-50'
              )}
            >
              Pricing
            </Link>
            <Link
              to="/login"
              className={cn(
                'block px-3 py-2 text-base font-semibold text-gray-600 border border-gray-300',
                isActive('/login') ? 'text-yellow-600 bg-gray-100 border-yellow-500' : 'hover:bg-gray-100'
              )}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={cn(
                'block px-3 py-2 text-base font-semibold text-white bg-black',
                isActive('/signup') ? 'bg-yellow-400 text-black' : 'hover:bg-yellow-400'
              )}
            >
              Join For Free
            </Link>
          </div>
        </div>
      )}
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
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
            isActive ? 'text-yellow-600 bg-gray-100' : 'text-gray-600 hover:bg-gray-100 hover:text-yellow-600',
            className
          )}
          {...props}
        >
          <div className="text-sm font-semibold leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';