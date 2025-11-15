import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import React from "react";

type MintAmountProps = {
  amount: number;
  setAmount: (amount: number) => void;
  maxQuantity: number;
};

export default function MintAmount({ amount, setAmount, maxQuantity }: MintAmountProps) {
  return (
    <div className="flex items-center border border-border rounded-xs  overflow-hidden">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setAmount(Math.max(1, amount - 1))}
        disabled={amount <= 1}
        className="w-10 h-10 p-0 rounded-none border-r border-border disabled:opacity-50 text-muted-foreground"
      >
        -
      </Button>
      <Input
        id="amount"
        type="number"
        value={amount}
        onChange={e => setAmount(Math.max(1, Math.min(maxQuantity, Number(e.target.value))))}
        min={1}
        max={maxQuantity}
        className="h-10 text-sm bg-transparent border-0 text-foreground dark:text-white text-center w-16 focus:ring-0 focus:border-0"
        aria-label="Number of NFTs to mint"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setAmount(Math.min(maxQuantity, amount + 1))}
        disabled={amount >= maxQuantity}
        className="w-10 h-10 p-0 rounded-none border-l border-border disabled:opacity-50 text-muted-foreground"
      >
        +
      </Button>
    </div>
  );
}
