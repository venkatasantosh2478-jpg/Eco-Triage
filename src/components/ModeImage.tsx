import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { getModeAssetAlt, ModeAssetSlotKey } from '../utils/modeConfig.ts';

interface ModeImageProps {
  slot: ModeAssetSlotKey;
  className?: string;
  priority?: boolean;
  showCreditBadge?: boolean;
}

export const ModeImage: React.FC<ModeImageProps> = ({
  slot,
  className = '',
  priority = false,
  showCreditBadge = false,
}) => {
  const { getAsset, language, lowDataMode, operatingMode } = useApp();
  const asset = getAsset(slot);
  const altText = getModeAssetAlt(asset, language);

  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const srcUrl = lowDataMode ? asset.image_url_mobile : asset.image_url_desktop;
  const posClass = className.includes('absolute') || className.includes('fixed') ? '' : 'relative';

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [srcUrl, operatingMode]);

  if (hasError || !srcUrl) {
    return (
      <div
        style={{ backgroundColor: asset.fallback_color || '#E2E8F0' }}
        className={`${posClass} flex flex-col items-center justify-center p-4 text-center select-none ${className}`}
        role="img"
        aria-label={altText}
      >
        <p className="text-xs font-bold text-slate-700 max-w-xs leading-snug">{altText}</p>
        {asset.credit && (
          <span className="text-[10px] font-medium text-slate-500 mt-1">
            {asset.credit} • {asset.licence}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: asset.fallback_color || '#E2E8F0' }}
      className={`${posClass} overflow-hidden ${className}`}
    >
      <picture className="block w-full h-full">
        <source media="(max-width: 768px)" srcSet={asset.image_url_mobile} />
        <img
          src={srcUrl}
          alt={altText}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover object-center transition-opacity duration-300 motion-reduce:transition-none ${
            isLoaded ? 'opacity-100' : 'opacity-90'
          }`}
        />
      </picture>
      {showCreditBadge && asset.credit && (
        <span className="absolute bottom-2 right-2 z-10 px-2 py-0.5 rounded bg-slate-900/65 text-white text-[10px] font-medium backdrop-blur-xs">
          {asset.credit} ({asset.licence})
        </span>
      )}
    </div>
  );
};
