import CreateManageContent from "@/modules/mint/collection-manager/components/CreateManageContent";
import CreateManageHeader from "@/modules/mint/collection-manager/components/CreateManageHeader";
import React from "react";

export default function CreateManageLayout() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <CreateManageHeader />
      <CreateManageContent />
    </div>
  );
}
