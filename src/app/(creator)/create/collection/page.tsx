import { CreateCollectionForm } from "@/modules/create/components/CreateCollectionForm";

export const metadata = {
  title: "Create Collection | NFT Marketplace",
  description: "Launch your own NFT collection with custom settings",
};

export default function CreateCollectionPage() {
  return (
    <div className="mx-auto py-8">
      <CreateCollectionForm />
    </div>
  );
}
