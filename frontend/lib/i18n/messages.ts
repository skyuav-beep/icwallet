export type Locale = "en" | "ko";

export interface MessagePair {
  en: string;
  ko: string;
}

export type MessageCatalog = Record<string, MessagePair>;

export const defaultMessages: MessageCatalog = {
  "nav.wallet": { en: "Wallet", ko: "지갑" },
  "nav.nftMarket": { en: "NFT Market", ko: "NFT 마켓" },
  "nav.p2p": { en: "P2P", ko: "P2P" },
  "nav.mining": { en: "Mining", ko: "마이닝" },
  "nav.earn": { en: "EARN", ko: "EARN" },
  "nav.store": { en: "Store", ko: "스토어" },
  "nav.merchants": { en: "Merchants", ko: "가맹점" },
  "nav.me": { en: "My Page", ko: "마이페이지" },
  "nav.merchantPortal": { en: "Merchant Portal", ko: "가맹점 포털" },
  "nav.adminConsole": { en: "Admin Console", ko: "관리자 콘솔" },
  "label.language": { en: "Language", ko: "언어" },
  "label.language.english": { en: "English", ko: "영어" },
  "label.language.korean": { en: "Korean", ko: "한국어" },
  "action.switchLanguage": { en: "Switch Language", ko: "언어 전환" },
  "portal.merchant.title": {
    en: "Merchant Portal",
    ko: "가맹점 포털",
  },
  "portal.admin.title": {
    en: "Admin Console",
    ko: "관리자 콘솔",
  },
};
