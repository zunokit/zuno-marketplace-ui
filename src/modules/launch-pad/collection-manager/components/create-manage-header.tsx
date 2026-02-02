import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateManageHeader() {
  return (
    <header className="mb-8">
      <Link
        href="/mint/create"
        className="inline-flex items-center text-foreground hover:text-foreground/80 dark:text-foreground dark:hover:text-foreground/80 transition-all duration-150"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        <span className="text-lg font-medium">Create NFT Drop</span>
      </Link>
    </header>
  );
}
