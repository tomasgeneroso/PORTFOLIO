import { useEffect, useCallback } from "react";
import AnalyticsManager from "@/lib/analytics/AnalyticsManager";

export const useAnalytics = () => {
  const analytics = AnalyticsManager.getInstance();

  useEffect(() => {
    // Track page visit on mount
    const isFirstVisit = !localStorage.getItem("has_visited");

    analytics.trackEvent("page_visit", {
      isFirstVisit,
      path: window.location.pathname,
      referrer: document.referrer,
    });

    if (isFirstVisit) {
      localStorage.setItem("has_visited", "true");
      localStorage.setItem("first_visit_date", new Date().toISOString());
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const trackCVDownload = useCallback(() => {
    analytics.trackEvent("cv_download", {
      language: "EN", // o detectar automáticamente
    });
  }, []);

  const trackGitHubClick = useCallback(() => {
    analytics.trackEvent("github_click");
  }, []);

  const trackLinkedinClick = useCallback(() => {
    analytics.trackEvent("linkedin_click");
  }, []);

  const trackEmailClick = useCallback(() => {
    analytics.trackEvent("email_click");
  }, []);

  const trackContactFormSubmit = useCallback((formData: any) => {
    analytics.trackEvent("contact_form_submit", {
      hasMessage: !!formData.message,
      messageLength: formData.message?.length || 0,
    });
  }, []);

  const trackProjectClick = useCallback((projectName: string) => {
    analytics.trackEvent("project_click", { projectName });
  }, []);

  const trackSkillView = useCallback((skillName: string) => {
    analytics.trackEvent("skill_view", { skillName });
  }, []);

  const getConnectionStatus = useCallback(() => {
    return analytics.getConnectionStatus();
  }, []);

  const forceSync = useCallback(async () => {
    await analytics.forceSync();
  }, []);

  return {
    trackCVDownload,
    trackGitHubClick,
    trackLinkedinClick,
    trackEmailClick,
    trackContactFormSubmit,
    trackProjectClick,
    trackSkillView,
    getConnectionStatus,
    forceSync,
  };
};
