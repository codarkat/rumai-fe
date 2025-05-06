import { ReactNode } from "react";

// Navigation menu items
export const NAV_MENU = [
  { name: "Cá nhân", href: "/personal" },
  { name: "Khóa học", href: "/courses" },
  { name: "Bảng chữ cái", href: "/alphabet" },
  { name: "Tài nguyên", href: "/resources" },
  { name: "Giới thiệu", href: "/about" },
];

// Feature type definition
export interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

// Footer link type definition
export interface FooterLink {
  name: string;
  href: string;
}

// Site configuration
export const SITE_CONFIG = {
  name: "RumAI",
  slogan: "Học tiếng Nga mọi lúc, mọi nơi",
  heroTitle: "Công cụ hỗ trợ học tiếng Nga thông minh",
  heroDescription:
    "Trải nghiệm phương pháp học tiếng Nga hiện đại với sự hỗ trợ của AI. Tiện lợi, hiệu quả và phù hợp với mọi nhu cầu học tập.",
  ctaTitle: "Bắt đầu học ngay hôm nay",
  ctaDescription:
    "Sử dụng công cụ hỗ trợ thông minh của chúng tôi để học tiếng Nga nhanh chóng và hiệu quả.",
  ctaButtonText: "Dùng ngay",
  featuresTitle: "Công cụ hỗ trợ thông minh",
};
