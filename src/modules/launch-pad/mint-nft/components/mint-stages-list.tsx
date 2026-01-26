"use client";

import React from "react";

export default function MintStagesList() {
  return (
    <div className="bg-layer-01 p-4 space-y-4 rounded-xl">
      <div className="space-y-4">
        {/* OG Stage - Ended */}
        <div className="rounded-lg border-solid p-3 flex flex-col gap-6 relative border border-border-subtle">
          <div className="bg-layer-01/70 rounded-2xl absolute inset-0 z-50"></div>
          <div className="flex justify-between items-center">
            <div className="basis-1/2 flex items-center space-x-2">
              <div className="cursor-default">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="self-center cursor-default"
                  color="currentColor"
                  width="16"
                  height="16"
                >
                  <path stroke="none" d="M0 0h24v24H0z"></path>
                  <rect width="14" height="10" x="5" y="11" rx="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M8 11V7a4 4 0 018 0v4"></path>
                </svg>
              </div>
              <div className="cursor-default">
                <div className="bg-layer-04 flex gap-2 items-center px-3 py-2 rounded-md space-x-2 text-sm">
                  <div className="flex space-x-2 items-center">
                    <span className="ml-1 capitalize truncate max-w-[90px]">OG</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="currentColor"
                      className="text-secondary"
                      color="currentColor"
                    >
                      <path d="M8 11C8.13807 11 8.25 11.1119 8.25 11.25C8.25 11.3881 8.13807 11.5 8 11.5C7.86193 11.5 7.75 11.3881 7.75 11.25C7.75 11.1119 7.86193 11 8 11Z"></path>
                      <path d="M8 9V8.5C9.10438 8.5 10 7.71625 10 6.75C10 5.78375 9.10438 5 8 5C6.89562 5 6 5.78375 6 6.75V7"></path>
                      <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="basis-1/2 flex flex-row gap-2 tracking-wide text-center items-center flex-wrap justify-end text-primary text-sm font-medium uppercase">
              <span className="text-secondary text-xs">Ended</span>
            </div>
          </div>
          <div className="flex gap-1.5 items-center justify-between">
            <div className="flex gap-2.5 tracking-wide text-xs">
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="break-all text-secondary">Price:</span>
                <div className="cursor-default inline-block">
                  <span className="text-primary">0.39</span>
                  <span className="ml-1 text-secondary">SOL</span>
                </div>
              </div>
              <div className="flex items-center gap-x-1">
                <span className="text-secondary">Minted:</span>
                <span className="text-primary">67</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1 text-primary tracking-wide text-sm flex-col">
            <div className="h-1.5 rounded-full bg-layer-04 overflow-hidden">
              <div
                className="bg-brand rounded-full h-full"
                role="progressbar"
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={16.75}
                style={{ width: "16.75%" }}
              ></div>
            </div>
            <div className="flex justify-between text-secondary text-xs">
              <span>Minted during stage</span>
              <span>
                <b>16% </b>(67/400)
              </span>
            </div>
          </div>
        </div>

        {/* Whitelist Stage - Ended */}
        <div className="rounded-lg border-solid p-3 flex flex-col gap-6 relative border border-border-subtle">
          <div className="bg-layer-01/70 rounded-2xl absolute inset-0 z-50"></div>
          <div className="flex justify-between items-center">
            <div className="basis-1/2 flex items-center space-x-2">
              <div className="cursor-default">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="self-center cursor-default"
                  color="currentColor"
                  width="16"
                  height="16"
                >
                  <path stroke="none" d="M0 0h24v24H0z"></path>
                  <rect width="14" height="10" x="5" y="11" rx="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M8 11V7a4 4 0 018 0v4"></path>
                </svg>
              </div>
              <div className="cursor-default">
                <div className="bg-layer-04 flex gap-2 items-center px-3 py-2 rounded-md space-x-2 text-sm">
                  <div className="flex space-x-2 items-center">
                    <span className="ml-1 capitalize truncate max-w-[90px]">Whitelist</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="currentColor"
                      className="text-secondary"
                      color="currentColor"
                    >
                      <path d="M8 11C8.13807 11 8.25 11.1119 8.25 11.25C8.25 11.3881 8.13807 11.5 8 11.5C7.86193 11.5 7.75 11.3881 7.75 11.25C7.75 11.1119 7.86193 11 8 11Z"></path>
                      <path d="M8 9V8.5C9.10438 8.5 10 7.71625 10 6.75C10 5.78375 9.10438 5 8 5C6.89562 5 6 5.78375 6 6.75V7"></path>
                      <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="basis-1/2 flex flex-row gap-2 tracking-wide text-center items-center flex-wrap justify-end text-primary text-sm font-medium uppercase">
              <span className="text-secondary text-xs">Ended</span>
            </div>
          </div>
          <div className="flex gap-1.5 items-center justify-between">
            <div className="flex gap-2.5 tracking-wide text-xs">
              <div className="">
                <div className="flex items-center gap-x-1">
                  <span className="text-secondary">Mint Limit:</span>
                  <span className="text-primary">2</span>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="break-all text-secondary">Price:</span>
                <div className="cursor-default inline-block">
                  <span className="text-primary">0.39</span>
                  <span className="ml-1 text-secondary">SOL</span>
                </div>
              </div>
              <div className="flex items-center gap-x-1">
                <span className="text-secondary">Minted:</span>
                <span className="text-primary">29</span>
              </div>
            </div>
          </div>
        </div>

        {/* Public Stage - Active (Duplicate visual from MintStatus? No, in HTML it shows Public again as a card) */}
        {/* The HTML has a 3rd card for "Public" which looks active (no grey overlay, different border color) */}
        <div className="rounded-lg border-solid p-3 flex flex-col gap-6 relative bg-layer-03 border border-interactive-hover">
          <div className="flex justify-between items-center">
            <div className="basis-1/2 flex items-center space-x-2">
              <div className="w-fit flex items-center justify-center min-h-6 text-xs rounded-full border border-labels-neutral text-labels-neutral min-w-fit py-1 px-1.5 max-lg:hidden bg-transparent">
                <div className="cursor-default">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="self-center cursor-default"
                    color="currentColor"
                    width="16"
                    height="16"
                  >
                    <path stroke="none" d="M0 0h24v24H0z"></path>
                    <rect width="14" height="10" x="5" y="11" rx="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M8 11V7a4 4 0 018 0v4"></path>
                  </svg>
                </div>
                <span className="ml-1">Not Eligible</span>
              </div>
              <div className="hidden max-lg:block !ml-0">
                <div className="cursor-default">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="self-center cursor-default"
                    color="currentColor"
                    width="16"
                    height="16"
                  >
                    <path stroke="none" d="M0 0h24v24H0z"></path>
                    <rect width="14" height="10" x="5" y="11" rx="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M8 11V7a4 4 0 018 0v4"></path>
                  </svg>
                </div>
              </div>
              <div className="cursor-default">
                <div className="bg-layer-04 flex gap-2 items-center px-3 py-2 rounded-md space-x-2 text-sm">
                  <div className="flex space-x-2 items-center">
                    <span
                      className="shrink-0 relative flex items-center justify-center h-[8px] w-[8px]"
                      aria-hidden="true"
                    >
                      <span className="absolute rounded-full bg-support-positive animate-ping [animation-duration:2s] h-[10px] w-[10px]"></span>
                      <span className="relative block rounded-full bg-support-positive h-[8px] w-[8px]"></span>
                    </span>
                    <span className="ml-1 capitalize truncate max-w-[90px]">Public</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="currentColor"
                      className="text-secondary"
                      color="currentColor"
                    >
                      <path d="M8 11C8.13807 11 8.25 11.1119 8.25 11.25C8.25 11.3881 8.13807 11.5 8 11.5C7.86193 11.5 7.75 11.3881 7.75 11.25C7.75 11.1119 7.86193 11 8 11Z"></path>
                      <path d="M8 9V8.5C9.10438 8.5 10 7.71625 10 6.75C10 5.78375 9.10438 5 8 5C6.89562 5 6 5.78375 6 6.75V7"></path>
                      <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="basis-1/2 flex flex-row gap-2 tracking-wide text-center items-center flex-wrap justify-end text-primary text-sm font-medium uppercase">
              <span className="text-xs text-primary">Ends</span>
              <div className="cursor-default">
                <span className="bg-layer-01 text-primary font-semibold p-2 rounded-md uppercase text-xs">
                  Dec 19
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 items-center justify-between">
            <div className="flex gap-2.5 tracking-wide text-xs">
              <div className="">
                <div className="flex items-center gap-x-1 max-lg:hidden">
                  <span className="text-secondary">Mint Limit:</span>
                  <span className="text-primary">5</span>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="break-all text-secondary">Price:</span>
                <div className="cursor-default inline-block">
                  <span className="text-primary">0.2</span>
                  <span className="ml-1 text-secondary">SOL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
