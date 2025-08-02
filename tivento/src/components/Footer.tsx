import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const footerSections = [
    {
      title: 'Your Account',
      links: [
        { name: 'Sign up', href: '/signup' },
        { name: 'Log in', href: '/login' },
        { name: 'Help', href: '/help' },
      ]
    },
    {
      title: 'Discover',
      links: [
        { name: 'Groups', href: '/groups' },
        { name: 'Calendar', href: '/calendar' },
        { name: 'Topics', href: '/topics' },
        { name: 'Cities', href: '/cities' },
      ]
    },
    {
      title: 'ConnectSphere',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Apps', href: '/apps' },
        { name: 'Podcast', href: '/podcast' },
      ]
    }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.73-3.016-1.804-.568-1.074-.394-2.4.441-3.235.835-.835 2.161-1.009 3.235-.441 1.074.568 1.804 1.719 1.804 3.016 0 1.864-1.512 3.374-3.374 3.374l-.09.09zm7.56 0c-1.297 0-2.448-.73-3.016-1.804-.568-1.074-.394-2.4.441-3.235.835-.835 2.161-1.009 3.235-.441 1.074.568 1.804 1.719 1.804 3.016 0 1.864-1.512 3.374-3.374 3.374l-.09.09z"/>
        </svg>
      )
    }
  ];

  const appStoreLinks = [
    {
      name: 'App Store',
      href: 'https://apps.apple.com',
      image: 'https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg'
    },
    {
      name: 'Google Play',
      href: 'https://play.google.com',
      image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold">ConnectSphere</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Find your people and do your thing. Join millions of people using ConnectSphere to meet new people and explore shared interests.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* App Store Links */}
            <div className="space-y-3">
              {appStoreLinks.map((app) => (
                <a
                  key={app.name}
                  href={app.href}
                  className="block hover:opacity-80 transition-opacity duration-200"
                >
                  <img 
                    src={app.image} 
                    alt={`Download on ${app.name}`}
                    className="h-10"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 ConnectSphere. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;