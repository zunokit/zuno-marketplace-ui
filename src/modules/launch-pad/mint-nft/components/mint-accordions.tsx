"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";

export default function MintAccordions() {
  return (
    <div className="space-y-5 lg:hidden">
      <div className="bg-layer-01 p-4 space-y-4 rounded-xl empty:hidden">
        <Accordion type="single" collapsible className="w-full" defaultValue="overview">
          <AccordionItem value="overview" className="border-none">
            <AccordionTrigger className="hover:no-underline py-4">
              <h2 className="text-xl font-bold text-wrap text-foreground">Overview</h2>
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-secondary">
                <p className="text-sm leading-normal mb-5 last:mb-0">
                  Kyzzen.io is your all-in-one explorer for opportunities on Solana, aggregating data
                  from Solana’s major protocols to highlight the best opportunities spanning tokens,
                  NFTs, DeFi, DePIN, airdrops and more.
                </p>
                <p className="text-sm leading-normal mb-5 last:mb-0">
                  The Kyzzen no Sekai NFT unlocks our most advanced products: premium alpha signals,
                  unique analytics, and rich portfolio intelligence to guide smarter, faster
                  decisions.
                </p>
                <p className="text-sm leading-normal mb-5 last:mb-0">
                  Our NFT art is a human-AI collaboration - we trained an AI model on our artist’s
                  original work to create a collection where every character is uniquely styled, with
                  diverse traits and individually rendered shadows, showcasing how AI can serve as a
                  creative tool rather than a competitor and achieving a scale no single artist could
                  realistically produce by hand.
                </p>
                <p className="text-sm leading-normal mb-5 last:mb-0">
                  Created by one of the earliest Solana OGs, OhMeOhMy, known for reviving historic
                  projects and contributing to major DAOs, this NFT represents both innovation and
                  proven credibility.
                </p>
                <p className="text-sm leading-normal mb-5 last:mb-0">
                  Join us in our journey to redefine what Solana NFTs can be - let&apos;s make NFTs
                  great again!
                </p>
                <h3 className="text-lg font-semibold pt-1 pb-2 text-foreground">Utility</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li className="my-0 text-sm">
                    Unmatched Alpha: Curated opportunities across the Solana ecosystem delivered
                    straight to you.
                  </li>
                  <li className="my-0 text-sm">
                    Premium Tools: Access our most cutting-edge analytics to gain a decisive edge.
                  </li>
                  <li className="my-0 text-sm">
                    Advanced Portfolio Tracking: Monitor all your wallets and assets with next-level
                    analytics and precision.
                  </li>
                  <li className="my-0 text-sm">
                    Daily Portfolio Snapshots: Get detailed automated email updates so you never miss
                    a portfolio change.
                  </li>
                  <li className="my-0 text-sm">
                    Real-Time Risk Alerts: Protect your bags with notifications on events that could
                    impact your holdings.
                  </li>
                  <li className="my-0 text-sm">
                    Actionable Growth Insights: Receive smart, tailored recommendations to optimize
                    your portfolio.
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="bg-layer-01 p-4 space-y-4 rounded-xl empty:hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="team" className="border-none">
            <AccordionTrigger className="hover:no-underline py-4">
              <h2 className="text-xl font-bold text-wrap text-foreground">Meet the team</h2>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                <div className="flex flex-col rounded-lg overflow-hidden bg-layer-01 border border-border-subtle">
                  <div className="cursor-default">
                    <div className="relative bg-layer-03 aspect-square">
                      <div className="relative w-full h-full">
                        <img
                          src="https://img-cdn.magiceden.dev/rs:fill:600:0:0/plain/https%3A%2F%2Fmedia.cdn.magiceden.dev%2Flaunchpad%2Fkyzzen_no_sekai%2Fe53eaddd-2fa5-4a37-b7c2-f3c7dc0a496c"
                          alt="OhMeOhMy image"
                          className="overflow-hidden size-full object-cover aspect-square"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 grow shrink-0 flex flex-col items-center justify-between">
                    <div className="max-w-full text-center space-y-1 [overflow-wrap:anywhere]">
                      <div className="font-bold leading-snug text-foreground">OhMeOhMy</div>
                      <div className="text-xs text-secondary">Founder</div>
                    </div>
                    <div className="mt-4 mb-1 min-h-[16px]">
                      <div className="flex items-center gap-2">
                        <div className="cursor-default">
                          <a
                            href="https://x.com/OhMeOhMy_Sol"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-opacity hover:opacity-80 flex items-center text-foreground"
                          >
                            <svg
                              viewBox="0 0 20 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="mx-0.5"
                              color="currentColor"
                              width="16"
                              height="16"
                            >
                              <path
                                d="M11.3032 9.42806L16.4029 3.5H15.1945L10.7663 8.64725L7.2296 3.5H3.15039L8.49863 11.2836L3.15039 17.5H4.35894L9.03516 12.0644L12.7702 17.5H16.8494L11.3029 9.42806H11.3032ZM9.6479 11.3521L9.10601 10.5771L4.7944 4.40978H6.65066L10.1302 9.38698L10.6721 10.162L15.195 16.6316H13.3388L9.6479 11.3524V11.3521Z"
                                fill="currentColor"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
