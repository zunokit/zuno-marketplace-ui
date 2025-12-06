import { useState, useEffect } from "react";
import { makeMockCollection } from "@/shared/utils/mock/mockCollection";
import { Collection } from "@/shared/types";

const OverviewSection = () => {
  const [collection, setCollection] = useState<Collection | null>(null);
  useEffect(() => {
    setCollection(makeMockCollection());
  }, []);
  if (!collection) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white dark:text-white">{collection.name}</h1>
        <div className="space-y-3 text-sm text-white">
          <p>{collection.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white dark:text-white">Data</h2>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-white dark:text-white flex items-center">
              🏆 Mint start date: {collection.mintStartDate}
            </p>
            <p className="text-xs text-os-gray-300">
              Max supply: {collection.maxSupply}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-white dark:text-white">Image:</p>
            <ul className="list-disc pl-5 space-y-0.5 text-xs text-white">
              Link: {collection.imageUrl}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-white dark:text-white">Uri:</p>

            <ul className="list-disc pl-5 space-y-0.5 text-xs text-white">
              Link: {collection.socialLinks?.discord}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
