"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import AnalyticsManager from "@/lib/analytics/AnalyticsManager";

export function VisitTracker() {
  useAnalytics();
  return null;
}

// Helper functions for tracking - can be called directly without hooks
const getAnalyticsInstance = () => AnalyticsManager.getInstance();

export const trackCVDownload = () => {
  getAnalyticsInstance().trackEvent("cv_download", {
    language: "EN",
  });
};

export const trackGitHubClick = () => {
  getAnalyticsInstance().trackEvent("github_click");
};

export const trackLinkedinClick = () => {
  getAnalyticsInstance().trackEvent("linkedin_click");
};

export const trackEmailClick = () => {
  getAnalyticsInstance().trackEvent("email_click");
};

export const trackContactFormSubmit = (formData?: any) => {
  getAnalyticsInstance().trackEvent("contact_form_submit", {
    hasMessage: !!formData?.message,
    messageLength: formData?.message?.length || 0,
  });
};

export const trackProjectClick = (projectName: string) => {
  getAnalyticsInstance().trackEvent("project_click", { projectName });
};

export const trackSkillView = (skillName: string) => {
  getAnalyticsInstance().trackEvent("skill_view", { skillName });
};
