import React from "react";
import { Marquee } from "../magicui/marquee";

// Import company logos
import chaiCodeLogo from "../../assets/companies/chaicode-black.png";
import googleLogo from "../../assets/companies/2916251_google_communication_logo_marketing_media_icon.png";
import amazonLogo from "../../assets/companies/294695_amazon_icon.png";
import microsoftLogo from "../../assets/companies/294669_microsoft_icon.png";
import accentureLogo from "../../assets/companies/294677_accenture_icon.png";
import payPalLogo from "../../assets/companies/1156727_finance_payment_paypal_icon.png";
import netflixLogo from "../../assets/companies/7124274_netflix_logo_icon.png";
import oracleLogo from "../../assets/companies/294664_oracle_icon.png";
import nvidiaLogo from "../../assets/companies/294666_nvidia_icon.png";
import ciscoLogo from "../../assets/companies/294687_cisco_icon.png";
import spotifyLogo from "../../assets/companies/7124272_spotify_logo_icon.png";

export default function BrandsMarquee() {
  // List of companies with their logos
  const companies = [
    { name: "Google", logoSrc: googleLogo },
    { name: "Amazon", logoSrc: amazonLogo },
    { name: "Microsoft", logoSrc: microsoftLogo },
    { name: "Accenture", logoSrc: accentureLogo },
    { name: "PayPal", logoSrc: payPalLogo },
    { name: "Netflix", logoSrc: netflixLogo },
    { name: "ChaiCode", logoSrc: chaiCodeLogo },
    { name: "Oracle", logoSrc: oracleLogo },
    { name: "Nvidia", logoSrc: nvidiaLogo },
    { name: "Cisco", logoSrc: ciscoLogo },
    { name: "Spotify", logoSrc: spotifyLogo },
  ];

  return (
    <div className="py-4 w-full bg-white ">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white satoshi">
        Where Our Learners Work
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300  satoshi">
        From startups to Fortune 500s, our alumni are building the future.
      </p>

      {/* Marquee Container with Increased Horizontal Margins and Fading Effect */}
      <div className="w-full px-8 md:px-36 relative">
        <Marquee
          className="overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-6"
              style={{
                minWidth: "120px",
                textAlign: "center",
              }}
            >
              <img
                src={company.logoSrc}
                alt={company.name}
                className="h-30 w-auto mx-auto"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
