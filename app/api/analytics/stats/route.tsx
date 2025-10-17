import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Analytics from "@/models/analytics";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Estadísticas generales
    const totalVisits = await Analytics.countDocuments({
      event: "page_visit",
      timestamp: { $gte: startDate.getTime() },
    });

    const uniqueVisitors = await Analytics.distinct("sessionId", {
      event: "page_visit",
      timestamp: { $gte: startDate.getTime() },
    });

    const firstTimeVisitors = await Analytics.countDocuments({
      event: "page_visit",
      "data.isFirstVisit": true,
      timestamp: { $gte: startDate.getTime() },
    });

    // Eventos por tipo
    const eventCounts = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate.getTime() },
        },
      },
      {
        $group: {
          _id: "$event",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Referrers más comunes
    const topReferrers = await Analytics.aggregate([
      {
        $match: {
          event: "page_visit",
          timestamp: { $gte: startDate.getTime() },
          referrer: { $ne: "", $exists: true },
        },
      },
      {
        $group: {
          _id: "$referrer",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Conversiones (CV downloads, form submits)
    const cvDownloads = await Analytics.countDocuments({
      event: "cv_download",
      timestamp: { $gte: startDate.getTime() },
    });

    const contactForms = await Analytics.countDocuments({
      event: "contact_form_submit",
      timestamp: { $gte: startDate.getTime() },
    });

    const githubClicks = await Analytics.countDocuments({
      event: "github_click",
      timestamp: { $gte: startDate.getTime() },
    });

    const linkedinClicks = await Analytics.countDocuments({
      event: "linkedin_click",
      timestamp: { $gte: startDate.getTime() },
    });

    // Tasa de conversión
    const conversionRate =
      totalVisits > 0 ? ((contactForms / totalVisits) * 100).toFixed(2) : 0;

    // Ubicaciones más comunes (países)
    const topCountries = await Analytics.aggregate([
      {
        $match: {
          event: "page_visit",
          timestamp: { $gte: startDate.getTime() },
          "location.country": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            country: "$location.country",
            countryCode: "$location.countryCode",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Ciudades más comunes
    const topCities = await Analytics.aggregate([
      {
        $match: {
          event: "page_visit",
          timestamp: { $gte: startDate.getTime() },
          "location.city": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            city: "$location.city",
            country: "$location.country",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Actividad del día corriente
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayVisits = await Analytics.countDocuments({
      event: "page_visit",
      timestamp: { $gte: todayStart.getTime() },
    });

    const todayUniqueVisitors = await Analytics.distinct("sessionId", {
      event: "page_visit",
      timestamp: { $gte: todayStart.getTime() },
    });

    const todayCVDownloads = await Analytics.countDocuments({
      event: "cv_download",
      timestamp: { $gte: todayStart.getTime() },
    });

    const todayContactForms = await Analytics.countDocuments({
      event: "contact_form_submit",
      timestamp: { $gte: todayStart.getTime() },
    });

    const todayGithubClicks = await Analytics.countDocuments({
      event: "github_click",
      timestamp: { $gte: todayStart.getTime() },
    });

    const todayLinkedinClicks = await Analytics.countDocuments({
      event: "linkedin_click",
      timestamp: { $gte: todayStart.getTime() },
    });

    // Actividad por hora del día (últimas 24 horas)
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const hourlyActivity = await Analytics.aggregate([
      {
        $match: {
          event: "page_visit",
          timestamp: { $gte: last24Hours.getTime() },
        },
      },
      {
        $group: {
          _id: {
            $hour: { $toDate: "$timestamp" }
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalVisits,
          uniqueVisitors: uniqueVisitors.length,
          firstTimeVisitors,
          returningVisitors: totalVisits - firstTimeVisitors,
          conversionRate: `${conversionRate}%`,
        },
        today: {
          visits: todayVisits,
          uniqueVisitors: todayUniqueVisitors.length,
          cvDownloads: todayCVDownloads,
          contactForms: todayContactForms,
          githubClicks: todayGithubClicks,
          linkedinClicks: todayLinkedinClicks,
        },
        events: {
          cvDownloads,
          contactForms,
          githubClicks,
          linkedinClicks,
        },
        eventCounts,
        topReferrers,
        topCountries,
        topCities,
        hourlyActivity,
      },
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
