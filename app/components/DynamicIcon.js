'use client';

import React, { useEffect, useState, Suspense } from 'react';

// A mapping from provider prefixes to their import paths
const a = {
  fa: 'react-icons/fa',
  mdi: 'react-icons/mdi',
  hi: 'react-icons/hi',
  // Add other providers here as needed
};

// Fallback component while the icon is loading
const IconFallback = () => <div className="w-8 h-8" />; // Placeholder with size

const DynamicIcon = ({ icon, className }) => {
  const [IconComponent, setIconComponent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadIcon = async () => {
      if (!icon || !icon.provider || !icon.name) {
        if (isMounted) setIconComponent(null);
        return;
      }

      const providerPrefix = icon.provider.toLowerCase();
      const iconName = icon.name;
      let library;

      try {
        switch (providerPrefix) {
          case 'fa':
            // Use Font Awesome 5 for broader compatibility with the picker
            library = await import('react-icons/fa');
            break;
          case 'mdi':
            library = await import('react-icons/mdi');
            break;
          case 'hi':
            // Use Heroicons v1 for broader compatibility
            library = await import('react-icons/hi');
            break;
          default:
            console.warn(`Icon provider '${icon.provider}' is not supported.`);
            if (isMounted) setIconComponent(null);
            return;
        }

        const LoadedIcon = library[iconName];

        if (LoadedIcon && isMounted) {
          setIconComponent(() => LoadedIcon);
        } else if (isMounted) {
          console.warn(`Icon '${iconName}' not found in provider '${providerPrefix}'.`);
          setIconComponent(null);
        }
      } catch (error) {
        console.error(`Error loading icon '${iconName}' from provider '${providerPrefix}':`, error);
        if (isMounted) setIconComponent(null);
      }
    };

    loadIcon();

    return () => {
      isMounted = false;
    };
  }, [icon]);

  if (!IconComponent) {
    return <IconFallback />;
  }

  return (
    <Suspense fallback={<IconFallback />}>
      <IconComponent className={className} />
    </Suspense>
  );
};

export default DynamicIcon; 