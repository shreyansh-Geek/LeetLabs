import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

// Dropdown items
const discoverItems = [
  {
    title: 'Pricing & Plans',
    to: '/pricing',
    description: 'Choose a plan that fits your learning goals.',
  },
  {
    title: 'Featured Courses',
    to: '/courses',
    description: 'Explore our curated coding courses to level up your skills.',
  },
  {
    title: 'Community Support',
    to: '/community',
    description: 'Join our community, Connect with peers for support and collaboration.',
  },
];

// Dropdown items for "Resources"
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

  // Add scroll effect for background change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 satoshi ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
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
              className="text-gray-700 rounded-md hover:text-yellow-600 hover:bg-gray-100  px-3 py-2 text-sm font-medium "
            >
              Home
            </Link>
            <Link
              to="/problems"
              className="text-gray-700 rounded-md hover:bg-gray-100 hover:text-yellow-600 px-3 py-2 text-sm font-medium "
            >
              Practice
            </Link>
            
            {/* Add the Discover Dropdown */}
            <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className=" text-gray-700 hover:text-yellow-600 px-3 py-2 text-sm font-medium ">
                      Discover
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        {/* Left Section with Logo and Description */}
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
                        {/* Right Section with Dropdown Items */}
                        {discoverItems.map((item) => (
                          <ListItem key={item.title} title={item.title} to={item.to}>
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
                    <NavigationMenuTrigger className=" text-gray-700 hover:text-yellow-600 px-3 py-2 text-sm font-medium">
                      Resources
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px]">
                        {resourceItems.map((item) => (
                          <ListItem key={item.title} title={item.title} to={item.to}>
                            {item.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <Link
              to="/contribute"
              className="text-gray-700 rounded-md hover:text-yellow-600 hover:bg-gray-100  px-3 py-2 text-sm font-medium "
            >
              Contribute
            </Link>
          </div>

          
          {/* Desktop Buttons */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link
              to="/login"
              className="text-gray-700 border border-2-black hover:border-yellow-500 hover:bg-yellow-100 px-3 py-3 rounded-sm text-sm font-medium"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-black text-white hover:bg-yellow-400 px-6 py-3 rounded-sm text-sm font-medium"
            >
              Join For Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-yellow-600 hover:bg-gray-100"
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
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-50 "
            >
              Home
            </Link>
            <Link
              to="/problems"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-50 "
            >
              Problems
            </Link>
            <Link
              to="/contests"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-50 "
            >
              Contests
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-50 "
            >
              Blogs
            </Link>
            <Link
              to="/courses"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 uppercase"
            >
              Featured Courses
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 uppercase"
            >
              Pricing & Plans
            </Link>
            <Link
              to="/community"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 uppercase"
            >
              Community Support
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 text-base font-medium text-gray-700 border border-gray-300 hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-3 py-2 text-base font-medium text-white bg-green-600 hover:bg-green-700"
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
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-yellow-600 focus:bg-gray-100 focus:text-yellow-600',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';