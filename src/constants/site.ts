import { ReactNode } from "react";

// Navigation menu items
export const NAV_MENU = [
  { name: "Từ điển", href: "/dictionary" },
  { name: "Tài liệu", href: "/documents" },
  { name: "Trợ lý AI", href: "/assistant" },
  { name: "Bài kiểm tra", href: "/tests" },
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
