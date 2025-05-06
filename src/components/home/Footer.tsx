import Link from "next/link";
// import { FOOTER_LINKS } from "@/constants/footer";
import { NAV_MENU, SITE_CONFIG } from "@/constants/site";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  const socialIcons = {
    facebook: <Facebook className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
  };

  return (
    <footer className="border-t border-slate-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="font-medium text-blue-600 text-2xl font-bold">{SITE_CONFIG.name}</h1>
          <div className="flex items-center space-x-2">
          
            <span className="text-slate-300">•</span>
            <span className="text-sm text-slate-500">{SITE_CONFIG.slogan}</span>
            <span className="text-slate-300">•</span>
          </div>
          
          <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 text-sm">
            {NAV_MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-500 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            {/* {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-500 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/faq"
              className="text-slate-500 hover:text-blue-600 transition-colors"
            >
              FAQ
            </Link> */}
          </div>
          
          <div className="flex gap-4">
            {Object.entries(socialIcons).map(([name, icon]) => (
              <a
                key={name}
                href="#"
                className="text-slate-400 hover:text-blue-500 transition-colors"
                aria-label={name}
              >
                {icon}
              </a>
            ))}
          </div>
          
          <div className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}
          </div>
        </div>
      </div>
    </footer>
  );
}
