import ExistingCollections from "@/modules/launch-pad/collection-manager/components/existing-collections";
import NewCollection from "@/modules/launch-pad/collection-manager/components/new-collection";

export default function CreateManageContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NewCollection />
      <ExistingCollections />
    </div>
  );
}
