"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { includes } from "zod";

export async function createProject(data) {
  const { userId, orgId: authOrgId } = auth();
  const orgId = authOrgId || data.orgId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    throw new Error("No Organization Selected");
  }

  // Check if the user is an admin of the organization
  const { data: membershipList } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userMembership = membershipList.find(
    (membership) => membership.publicUserData.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can create projects");
  }

  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        organizationId: orgId,
      },
    });

    return project;
  } catch (error) {
    throw new Error("Error creating project: " + error.message);
  }
}

export async function getProjects(orgId) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find user to verify existence
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const projects = await db.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return projects
}

export async function deleteProject(projectId, orgIdFromClient) {
  const { userId, orgId: authOrgId, orgRole: authOrgRole } = auth();
  const orgId = authOrgId || orgIdFromClient;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Determine if user is admin
  let isAdmin = authOrgRole === "org:admin";

  // If we don't have the role from auth (because we fell back to client orgId), fetch it
  if (!isAdmin && authOrgId !== orgId) {
    const { data: membershipList } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: orgId,
      });

    const userMembership = membershipList.find(
      (membership) => membership.publicUserData.userId === userId
    );

    isAdmin = userMembership?.role === "org:admin";
  }

  if (!isAdmin) {
    throw new Error("Only organization admins can delete projects");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error(
      "Project not found or you don't have permission to delete it"
    );
  }

  await db.project.delete({
    where: { id: projectId },
  });

  return { success: true };
}

export async function getProject(projectId) {
  const { userId, orgId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find user to verify existence
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    return null
  }

  // Verify project belongs to the organization
  if (project.organizationId !== orgId) {
    const { data: membershipList } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: project.organizationId,
      });

    const userMembership = membershipList.find(
      (membership) => membership.publicUserData.userId === userId
    );

    if (!userMembership) {
      throw new Error("You do not have access to this project");
    }
  }

  return project;
}