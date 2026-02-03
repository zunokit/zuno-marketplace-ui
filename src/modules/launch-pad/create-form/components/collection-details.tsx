"use client";
import { FormField, FormItem, FormControl, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { mockChains } from "@/shared/utils/mock/mockChain";

export function CollectionDetails() {
  const { formState, setValue } = useFormContext();

  return (
    <div className="space-y-6 bg-background dark:bg-dialog p-6 rounded-[8px] border border-border-subtle dark:border-border-subtle">
      <div className="space-y-6">
        {/* Chain Selection */}
        <div>
          <Label className="text-foreground">Chain</Label>
          {formState.isSubmitting ? (
            <Skeleton className="h-10 w-full mt-1" />
          ) : (
            <FormField
              name="chain"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={value => {
                      field.onChange(value);
                      setValue("chain", value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-secondary dark:bg-muted border-border-subtle dark:border-border-subtle text-foreground mt-2 focus-visible:ring-0 focus-visible:ring-offset-0">
                        <SelectValue>
                          {(() => {
                            const selectedChain = mockChains().find(c => c.name === field.value);

                            return selectedChain ? (
                              <div className="flex items-center gap-2">
                                <Image
                                  src={selectedChain.icon}
                                  alt={selectedChain.name}
                                  width={24}
                                  height={24}
                                />
                                {selectedChain.name}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Image
                                  src={"/icons/sepolia.svg"}
                                  alt="Chain"
                                  width={24}
                                  height={24}
                                />
                                {field.value || "Select Chain"}
                              </div>
                            );
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background dark:bg-muted border-border-subtle dark:border-border-subtle text-foreground">
                      {mockChains().map(chain => (
                        <SelectItem
                          key={chain.id}
                          value={chain.name}
                          className="text-foreground focus:bg-muted dark:focus:bg-hover focus:text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Image src={chain.icon} alt={chain.name} width={24} height={24} />
                            {chain.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Name and Symbol */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-foreground">Name</Label>
            {formState.isSubmitting ? (
              <Skeleton className="h-10 w-full mt-1" />
            ) : (
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="The Pond"
                        className="bg-secondary dark:bg-muted border-border-subtle dark:border-border-subtle text-foreground mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div>
            <Label className="text-foreground">Symbol</Label>
            {formState.isSubmitting ? (
              <Skeleton className="h-10 w-full mt-1" />
            ) : (
              <FormField
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="POND"
                        maxLength={10}
                        className="bg-secondary dark:bg-muted border-border-subtle dark:border-border-subtle text-foreground mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">Max 10 characters</p>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* Collection Image */}
        <div>
          <Label className="text-foreground">Collection Image</Label>
          <p className="text-sm text-foreground dark:text-os-gray-300 mt-1">
            Image that will be shown as the main image for the collection. Recommended: 800x800px
            jpg
          </p>
          {formState.isSubmitting ? (
            <Skeleton className="h-40 w-full mt-1" />
          ) : (
            <FormField
              name="collectionImage"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <div className="border border-dashed border-border-subtle dark:border-border-subtle rounded-[6px] p-6 flex flex-col items-center justify-center bg-secondary dark:bg-transparent mt-2">
                      <input
                        type="file"
                        id="collection-image"
                        className="hidden"
                        accept="image/jpeg,image/png"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          onChange(file || null);
                        }}
                        {...field}
                      />

                      {value ? (
                        <div className="w-full flex flex-col items-center">
                          <div className="relative w-32 h-32 mb-2">
                            <Image
                              src={
                                value instanceof File
                                  ? URL.createObjectURL(value)
                                  : "/placeholder.svg"
                              }
                              alt="Collection preview"
                              fill
                              style={{ objectFit: "cover" }}
                              className="rounded-[6px]"
                            />
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 bg-destructive rounded-full p-1"
                              onClick={e => {
                                e.preventDefault();
                                onChange(null);
                                const input = document.getElementById(
                                  "collection-image"
                                ) as HTMLInputElement;
                                if (input) input.value = "";
                              }}
                            >
                              <X className="h-4 w-4 text-foreground" />
                            </button>
                          </div>
                          <p className="text-sm text-foreground dark:text-os-gray-300 mt-2">
                            {value?.name}
                          </p>
                          <p className="text-xs text-os-gray-300 dark:text-os-gray-300">
                            {value && (value.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-6 w-6 mb-2 text-os-gray-300" />
                          <p className="text-sm text-center text-foreground dark:text-os-gray-300">
                            Drop your artwork here
                            <br />
                            to upload
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-4 bg-background dark:bg-muted border-border-subtle dark:border-border-subtle text-foreground hover:bg-muted dark:hover:bg-hover"
                            onClick={e => {
                              e.preventDefault();
                              document.getElementById("collection-image")?.click();
                            }}
                          >
                            Choose Image...
                          </Button>
                        </>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Description */}
        <div>
          <Label className="text-foreground">Description</Label>
          {formState.isSubmitting ? (
            <Skeleton className="h-24 w-full mt-1" />
          ) : (
            <FormField
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. The Pond is the greatest collection ever made"
                      className="bg-secondary dark:bg-muted border-border-subtle dark:border-border-subtle text-foreground min-h-24 mt-2 focus-visible:ring-0 focus-visible:ring-offset-0 resize-y"
                      style={{ whiteSpace: "pre-wrap" }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}
