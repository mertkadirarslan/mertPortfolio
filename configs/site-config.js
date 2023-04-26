import {
  FaGithub,
  FaDev,
  FaLinkedin,
  FaQuora,
  FaTwitter,
  FaInstagram
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";

const siteConfig = {
  copyright: `Copyright © ${new Date().getFullYear()} Mert Kadir. All Rights Reserved.`,
  author: {
    name: "Mert Kadir",
    accounts: [
      {
        url: "https://github.com/itsmertkadir",
        label: "Github Account",
        type: "gray",
        icon: <FaGithub />
      },
      {
        url: "https://twitter.com/itsmertkadir",
        label: "Twitter Account",
        type: "twitter",
        icon: <FaTwitter />
      },
      {
        url: "https://dev.to/mert_kadir",
        label: "Dev Account",
        type: "gray",
        icon: <FaDev />
      },
      {
        url: "https://www.linkedin.com/in/mert-kadir-b14275232/",
        label: "LinkedIn Account",
        type: "linkedin",
        icon: <FaLinkedin />
      },
      {
        url: "https://www.instagram.com/itsmertdev/",
        label: "Instagram Account",
        type: "red",
        icon: <FaInstagram />
      },
      {
        url: "mailto:mertkadirarslan@gmail.com",
        label: "Mail Mert",
        type: "gray",
        icon: <FiMail />
      }
    ]
  }
};

export default siteConfig;
