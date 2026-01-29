import CreateManageContent from "@/modules/launch-pad/collection-manager/components/create-manage-content";
import CreateManageHeader from "@/modules/launch-pad/collection-manager/components/create-manage-header";
import React from "react";

export default function CreateManageLayout() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <CreateManageHeader />
      <CreateManageContent />
    </div>
  );
}
