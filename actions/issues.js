"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getIssuesForSprint(sprintId) {
  const { userId, orgId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const sprint = await db.sprint.findUnique({
    where: { id: sprintId },
    include: { project: true },
  });

  if (!sprint) {
    throw new Error("Sprint not found");
  }

  if (sprint.project.organizationId !== orgId) {
    const { data: membershipList } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: sprint.project.organizationId,
      });

    const userMembership = membershipList.find(
      (membership) => membership.publicUserData.userId === userId
    );

    if (!userMembership) {
      throw new Error("You do not have access to this project");
    }
  }

  const issues = await db.issue.findMany({
    where: { sprintId: sprintId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issues;
}

export async function createIssue(projectId, data) {
  const { userId, orgId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify access to project
  if (!orgId) {
      // Find project first to check checks
      const project = await db.project.findUnique({where: {id: projectId}});
      if(!project) throw new Error("Project not found");

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
  } else {
    // Basic check if orgId differs (though usually projectId implies org, just to be safe if passed orgId matches)
    // Actually, createIssue is critical. We should do the robust check if mismatch.
    const project = await db.project.findUnique({where: {id: projectId}});
    if (project && project.organizationId !== orgId) {
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
  }

  let user = await db.user.findUnique({ where: { clerkUserId: userId } });

  const lastIssue = await db.issue.findFirst({
    where: { projectId, status: data.status },
    orderBy: { order: "desc" },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;

  const issue = await db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      projectId: projectId,
      sprintId: data.sprintId,
      reporterId: user.id,
      assigneeId: data.assigneeId || null, // Add this line
      order: newOrder,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issue;
}

export async function updateIssueOrder(updatedIssues) {
  const { userId, orgId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify access for the first issue (assuming all belong to same project)
  if (updatedIssues.length > 0) {
    const firstIssueId = updatedIssues[0].id;
    const issue = await db.issue.findUnique({
      where: { id: firstIssueId },
      include: { project: true },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.project.organizationId !== orgId) {
      const { data: membershipList } =
        await clerkClient().organizations.getOrganizationMembershipList({
          organizationId: issue.project.organizationId,
        });

      const userMembership = membershipList.find(
        (membership) => membership.publicUserData.userId === userId
      );

      if (!userMembership) {
        throw new Error("You do not have access to this project");
      }
    }
  }

  // Start a transaction
  await db.$transaction(async (prisma) => {
    // Update each issue
    for (const issue of updatedIssues) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status,
          order: issue.order,
        },
      });
    }
  });

  return { success: true };
}

export async function deleteIssue(issueId) {
  const { userId, orgId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (issue.project.organizationId !== orgId) {
    const { data: membershipList } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: issue.project.organizationId,
      });

    const userMembership = membershipList.find(
      (membership) => membership.publicUserData.userId === userId
    );

    if (!userMembership) {
      throw new Error("You do not have access to this project");
    }
  }

  if (
    issue.reporterId !== user.id &&
    !issue.project.adminIds.includes(user.id)
  ) {
    throw new Error("You don't have permission to delete this issue");
  }

  await db.issue.delete({ where: { id: issueId } });

  return { success: true };
}

export async function updateIssue(issueId, data) {
  const { userId, orgId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const issue = await db.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.project.organizationId !== orgId) {
      const { data: membershipList } =
        await clerkClient().organizations.getOrganizationMembershipList({
          organizationId: issue.project.organizationId,
        });

      const userMembership = membershipList.find(
        (membership) => membership.publicUserData.userId === userId
      );

      if (!userMembership) {
        throw new Error("You do not have access to this project");
      }
    }

    const updatedIssue = await db.issue.update({
      where: { id: issueId },
      data: {
        status: data.status,
        priority: data.priority,
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return updatedIssue;
  } catch (error) {
    throw new Error("Error updating issue: " + error.message);
  }
}
