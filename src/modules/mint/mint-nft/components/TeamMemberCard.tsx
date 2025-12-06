"use client";

import { useState } from "react";
import { Linkedin } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";
import Image from "next/image";

interface TeamMemberProps {
  name: string;
  title: string;
  image: string;
  bio?: string;
  linkedinUrl?: string;
}

export const TeamMemberCard = ({ name, title, image, bio, linkedinUrl }: TeamMemberProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="bg-card rounded-[8px] overflow-hidden border border-border-subtle hover:border-border-subtle/60 transition-all duration-150">
        <div className="flex flex-col items-center">
          {/* Image - full width */}
          <div className="w-full aspect-square overflow-hidden">
            <Image src={image} alt={name} className="w-full h-full object-cover" />
          </div>

          {/* Text content with padding */}
          <div className="w-full p-3 text-center">
            <h3 className="text-sm font-medium text-white">{name}</h3>
            <p className="text-[10px] text-primary mt-0.5 leading-tight">{title}</p>

            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-os-gray-300 hover:text-white transition-all duration-150"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && bio && (
        <div
          className={cn(
            "absolute z-10 w-64 bg-card border border-border-subtle rounded-[6px] p-3 shadow-os-focus",
            "text-xs text-white leading-relaxed",
            "top-0 left-full ml-2"
          )}
        >
          {bio}
        </div>
      )}
    </div>
  );
};
