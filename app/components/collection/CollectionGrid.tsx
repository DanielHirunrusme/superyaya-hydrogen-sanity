import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ProductCard from '~/components/product/Card';
import { COLLECTION_GRID, COLLECTION_GRID_GAP } from '~/lib/constants';
import type { SanityModule } from '~/lib/sanity';
import type { ProductWithNodes } from '~/types/shopify';
import { motion } from "framer-motion";

type Props = {
  items: (SanityModule | ProductWithNodes)[];
  stagger?: boolean;
  className?: string;
};

export default function ModuleGrid({
  items,
  stagger,
  className = `grid ${COLLECTION_GRID}`,
}: Props) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set()); // Controls which images are visible
  const [pendingImages, setPendingImages] = useState<Set<number>>(new Set()); // Stores all loaded images
  const [nextIndex, setNextIndex] = useState(0); // Tracks the next expected index to reveal

  const handleImageLoad = (index: number) => {
    setPendingImages((prev) => new Set(prev).add(index)); // Track all loaded images
  };

  // Use `useEffect` to process pending images in sequential order
  useEffect(() => {
    if (pendingImages.has(nextIndex)) {
      setLoadedImages((prev) => new Set(prev).add(nextIndex)); // Add only sequential images
      setNextIndex((prev) => prev + 1); // Move to next expected index
    }
  }, [pendingImages, nextIndex]);

  return (
    <ul className={clsx(className, COLLECTION_GRID_GAP)}>
      {items.map((item, index) => {
        return (
          <motion.li
            key={item.id}
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: stagger && loadedImages.has(index) ? 1 : 0 }}
            transition={{ duration: 0.05, delay: index * 0.1 }}
          >
            <ProductCard
              storefrontProduct={item}
              index={index}
              onImageLoad={() => handleImageLoad(index)}
            />
          </motion.li>
        );
      })}
    </ul>
  );
}
