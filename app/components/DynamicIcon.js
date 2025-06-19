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

const DynamicIcon = ({ icon }) => {
  const [IconComponent, setIconComponent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadIcon = async () => {
      if (!icon || !icon.provider || !icon.name) {
        return;
      }
      
      const providerPrefix = icon.provider.toLowerCase();
      const libraryPath = a[providerPrefix];

      if (!libraryPath) {
        console.warn(`Icon provider '${icon.provider}' is not supported.`);
        return;
      }
      
      try {
        const library = await import(/* @vite-ignore */ libraryPath);
        const LoadedIcon = library[icon.name];
        
        if (LoadedIcon && isMounted) {
          setIconComponent(() => LoadedIcon);
        } else if(isMounted) {
          console.warn(`Icon '${icon.name}' not found in provider '${icon.provider}'.`);
          setIconComponent(null);
        }
      } catch (error) {
        console.error(`Error loading icon library '${libraryPath}':`, error);
        if(isMounted) setIconComponent(null);
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
      <IconComponent />
    </Suspense>
  );
};

export default DynamicIcon; 