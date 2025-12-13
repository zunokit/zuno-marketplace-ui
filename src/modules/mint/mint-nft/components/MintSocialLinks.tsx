"use client";

import { useMintState } from "@/modules/mint/mint-nft/hooks/useMintState";

export default function MintSocialLinks() {
  const { collection } = useMintState();

  if (!collection) return null;

  // Use collection links or fallbacks if not present, but for now we assume they come from collection or are hardcoded as per design
  // In a real app, these should be dynamic.
  // The provided HTML has specific links. I will try to use collection.socialLinks if available, matching the design.

  const contractUrl = `https://solscan.io/account/${collection.address || ""}?cluster=mainnet`;
  const websiteUrl = collection.websiteUrl || collection.socialLinks?.website;
  const twitterUrl = collection.twitterUrl || collection.socialLinks?.twitter;
  const discordUrl = collection.discordUrl || collection.socialLinks?.discord;

  return (
    <div className="flex w-full empty:hidden max-lg:hidden">
      <div className="flex justify-between w-full">
        {/* Contract Link */}
        <div className="flex flex-wrap gap-2 empty:hidden">
          <div className="cursor-default">
            <a
              href={contractUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="w-fit py-2 px-3 flex items-center gap-2 transition-colors rounded bg-button-secondary hover:bg-button-secondary-hover active:bg-button-secondary-active text-sm text-foreground"
            >
              <span>Contract</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="none"
                color="currentColor"
                width="20"
                height="20"
              >
                <path
                  d="M13.5 6.5L13.4994 2.50062L9.5 2.5M8.5 7.5L13.5 2.5M11.5 8.5V13C11.5 13.1326 11.4473 13.2598 11.3536 13.3536C11.2598 13.4473 11.1326 13.5 11 13.5H3C2.86739 13.5 2.74021 13.4473 2.64645 13.3536C2.55268 13.2598 2.5 13.1326 2.5 13V5C2.5 4.86739 2.55268 4.74021 2.64645 4.64645C2.74021 4.55268 2.86739 4.5 3 4.5H7.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-2 empty:hidden">
          {websiteUrl && (
            <div className="cursor-default">
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="w-fit py-2 px-2 flex items-center gap-2 transition-colors rounded bg-button-secondary hover:bg-button-secondary-hover active:bg-button-secondary-active text-sm text-foreground"
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  color="currentColor"
                  width="20"
                  height="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>
            </div>
          )}

          {twitterUrl && (
            <div className="cursor-default">
              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="w-fit py-2 px-2 flex items-center gap-2 transition-colors rounded bg-button-secondary hover:bg-button-secondary-hover active:bg-button-secondary-active text-sm text-foreground"
              >
                <svg
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    d="M11.3032 9.42806L16.4029 3.5H15.1945L10.7663 8.64725L7.2296 3.5H3.15039L8.49863 11.2836L3.15039 17.5H4.35894L9.03516 12.0644L12.7702 17.5H16.8494L11.3029 9.42806H11.3032ZM9.6479 11.3521L9.10601 10.5771L4.7944 4.40978H6.65066L10.1302 9.38698L10.6721 10.162L15.195 16.6316H13.3388L9.6479 11.3524V11.3521Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          )}

          {discordUrl && (
            <div className="cursor-default">
              <a
                href={discordUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="w-fit py-2 px-2 flex items-center gap-2 transition-colors rounded bg-button-secondary hover:bg-button-secondary-hover active:bg-button-secondary-active text-sm text-foreground"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 640 512"
                  color="currentColor"
                  width="20"
                  height="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
