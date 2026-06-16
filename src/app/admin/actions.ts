"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { revalidatePath } from "next/cache";

// Security verification helper
async function verifyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: No session token found.");
  }

  const payload = verifyToken(token);
  if (!payload) {
    throw new Error("Unauthorized: Invalid session token.");
  }

  return payload;
}

/* ==========================================================================
   Profile Management
   ========================================================================== */
export async function updateProfile(data: any) {
  try {
    await verifyAdminSession();

    const existingProfile = await prisma.profile.findFirst();
    if (existingProfile) {
      await prisma.profile.update({
        where: { id: existingProfile.id },
        data,
      });
    } else {
      await prisma.profile.create({ data });
    }

    revalidatePath("/");
    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    console.error("Action error:", error);
    return { success: false, message: error.message || "Failed to update profile." };
  }
}

/* ==========================================================================
   Services CRUD
   ========================================================================== */
export async function addService(data: any) {
  try {
    await verifyAdminSession();
    const service = await prisma.service.create({ data });
    revalidatePath("/");
    return { success: true, message: "Service added successfully!", data: service };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateService(id: string, data: any) {
  try {
    await verifyAdminSession();
    await prisma.service.update({ where: { id }, data });
    revalidatePath("/");
    return { success: true, message: "Service updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteService(id: string) {
  try {
    await verifyAdminSession();
    await prisma.service.delete({ where: { id } });
    revalidatePath("/");
    return { success: true, message: "Service deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/* ==========================================================================
   Skills CRUD
   ========================================================================== */
export async function addSkill(data: any) {
  try {
    await verifyAdminSession();
    const skill = await prisma.skill.create({ data });
    revalidatePath("/");
    return { success: true, message: "Skill added successfully!", data: skill };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateSkill(id: string, data: any) {
  try {
    await verifyAdminSession();
    await prisma.skill.update({ where: { id }, data });
    revalidatePath("/");
    return { success: true, message: "Skill updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteSkill(id: string) {
  try {
    await verifyAdminSession();
    await prisma.skill.delete({ where: { id } });
    revalidatePath("/");
    return { success: true, message: "Skill deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/* ==========================================================================
   Timeline (Resume) CRUD
   ========================================================================== */
export async function addTimelineItem(data: any) {
  try {
    await verifyAdminSession();
    const item = await prisma.timelineItem.create({ data });
    revalidatePath("/");
    return { success: true, message: "Timeline item added successfully!", data: item };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateTimelineItem(id: string, data: any) {
  try {
    await verifyAdminSession();
    await prisma.timelineItem.update({ where: { id }, data });
    revalidatePath("/");
    return { success: true, message: "Timeline item updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteTimelineItem(id: string) {
  try {
    await verifyAdminSession();
    await prisma.timelineItem.delete({ where: { id } });
    revalidatePath("/");
    return { success: true, message: "Timeline item deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/* ==========================================================================
   Portfolio Items CRUD
   ========================================================================== */
export async function addPortfolioItem(data: any) {
  try {
    await verifyAdminSession();
    const item = await prisma.portfolioItem.create({ data });
    revalidatePath("/");
    return { success: true, message: "Project added successfully!", data: item };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updatePortfolioItem(id: string, data: any) {
  try {
    await verifyAdminSession();
    await prisma.portfolioItem.update({ where: { id }, data });
    revalidatePath("/");
    return { success: true, message: "Project updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deletePortfolioItem(id: string) {
  try {
    await verifyAdminSession();
    await prisma.portfolioItem.delete({ where: { id } });
    revalidatePath("/");
    return { success: true, message: "Project deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/* ==========================================================================
   Reviews CRUD
   ========================================================================== */
export async function addReview(data: any) {
  try {
    await verifyAdminSession();
    const review = await prisma.review.create({ data });
    revalidatePath("/");
    return { success: true, message: "Review added successfully!", data: review };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateReview(id: string, data: any) {
  try {
    await verifyAdminSession();
    await prisma.review.update({ where: { id }, data });
    revalidatePath("/");
    return { success: true, message: "Review updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteReview(id: string) {
  try {
    await verifyAdminSession();
    await prisma.review.delete({ where: { id } });
    revalidatePath("/");
    return { success: true, message: "Review deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/* ==========================================================================
   Contact Leads Manager
   ========================================================================== */
export async function markLeadRead(id: string, status: "unread" | "read" | "archived" = "read") {
  try {
    await verifyAdminSession();
    await prisma.contactSubmission.update({ where: { id }, data: { status } });
    return { success: true, message: "Lead status updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteLead(id: string) {
  try {
    await verifyAdminSession();
    await prisma.contactSubmission.delete({ where: { id } });
    return { success: true, message: "Lead deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/* ==========================================================================
   Hero Slides CRUD
   ========================================================================== */
export async function addHeroSlide(data: any) {
  try {
    await verifyAdminSession();
    const slide = await prisma.heroSlide.create({ data });
    revalidatePath("/");
    return { success: true, message: "Hero slide added successfully!", data: slide };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateHeroSlide(id: string, data: any) {
  try {
    await verifyAdminSession();
    await prisma.heroSlide.update({ where: { id }, data });
    revalidatePath("/");
    return { success: true, message: "Hero slide updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteHeroSlide(id: string) {
  try {
    await verifyAdminSession();
    await prisma.heroSlide.delete({ where: { id } });
    revalidatePath("/");
    return { success: true, message: "Hero slide deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/* ==========================================================================
   Banners Slider CRUD
   ========================================================================== */
export async function addBanner(data: any) {
  try {
    await verifyAdminSession();
    const banner = await prisma.banner.create({ data });
    revalidatePath("/");
    return { success: true, message: "Banner added successfully!", data: banner };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateBanner(id: string, data: any) {
  try {
    await verifyAdminSession();
    await prisma.banner.update({ where: { id }, data });
    revalidatePath("/");
    return { success: true, message: "Banner updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteBanner(id: string) {
  try {
    await verifyAdminSession();
    await prisma.banner.delete({ where: { id } });
    revalidatePath("/");
    return { success: true, message: "Banner deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

