/**
 * Convenience aliases over the GENERATED contract types (schema.d.ts).
 * Never hand-write API shapes here: only re-export from `components["schemas"]`.
 */
import type { components, paths } from "./schema";

type S = components["schemas"];

export type Site = S["Site"];
export type Service = S["Service"];
export type ServicePackage = S["ServicePackage"];
export type CaseStudySummary = S["CaseStudySummary"];
export type CaseStudy = S["CaseStudy"];
export type ArticleSummary = S["ArticleSummary"];
export type Article = S["Article"];
export type Tag = S["Tag"];
export type TagWithCount = S["TagWithCount"];
export type Promo = S["Promo"];
export type PromoStatus = S["PromoStatus"];
export type Testimonial = S["Testimonial"];
export type ClientLogo = S["ClientLogo"];
export type Seo = S["Seo"];
export type FaqItem = S["FaqItem"];
export type PageMeta = S["PageMeta"];
export type ApiError = S["Error"];
export type ErrorCode = S["Error"]["error"]["code"];
export type LeadCreateInput = S["LeadCreateInput"];

export type User = S["User"];
export type UserRole = S["UserRole"];
export type ContentStatus = S["ContentStatus"];
export type DashboardSummary = S["DashboardSummary"];
export type SettingsAdmin = S["SettingsAdmin"];
export type SettingsInput = S["SettingsInput"];
export type SettingsTogglesInput = S["SettingsTogglesInput"];
export type ServiceAdmin = S["ServiceAdmin"];
export type ServiceInput = S["ServiceInput"];
export type ServicePackageInput = S["ServicePackageInput"];
export type CaseStudyAdmin = S["CaseStudyAdmin"];
export type CaseStudyInput = S["CaseStudyInput"];
export type ArticleAdmin = S["ArticleAdmin"];
export type ArticleAdminSummary = S["ArticleAdminSummary"];
export type ArticleInput = S["ArticleInput"];
export type PromoAdmin = S["PromoAdmin"];
export type PromoInput = S["PromoInput"];
export type TestimonialAdmin = S["TestimonialAdmin"];
export type TestimonialInput = S["TestimonialInput"];
export type ClientLogoAdmin = S["ClientLogoAdmin"];
export type ClientLogoInput = S["ClientLogoInput"];
export type Lead = S["Lead"];
export type LeadStatus = S["LeadStatus"];
export type LeadPatchInput = S["LeadPatchInput"];
export type MediaUpload = S["MediaUpload"];
export type UserCreateInput = S["UserCreateInput"];
export type UserUpdateInput = S["UserUpdateInput"];

export type { paths, components };
