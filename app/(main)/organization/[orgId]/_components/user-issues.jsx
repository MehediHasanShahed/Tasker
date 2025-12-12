import { Suspense } from "react";
import { getUserIssues } from "@/actions/organiztion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueCard from "@/components/issue-card";

export default async function UserIssues({ userId, orgId }) {
  const issues = await getUserIssues(userId, orgId);

  if (issues.length === 0) {
    return null;
  }

  const assignedIssues = issues.filter(
    (issue) => issue.assignee.clerkUserId === userId
  );
  const reportedIssues = issues.filter(
    (issue) => issue.reporter.clerkUserId === userId
  );

  return (
    <>
      <h1 className="text-4xl font-bold gradient-title mb-4">My Issues</h1>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList>
          <TabsTrigger value="assigned">Assigned to You</TabsTrigger>
          <TabsTrigger value="reported">Reported to You</TabsTrigger>
        </TabsList>
        <TabsContent value="assigned">
          <Suspense fallback={<div>Loading...</div>}>
            {assignedIssues.length === 0 ? (
              <p className="mt-4 text-gray-500">No issues assigned to you.</p>
            ) : (<IssueGrid issues={assignedIssues} />)}
          </Suspense>
        </TabsContent>
        <TabsContent value="reported">
          <Suspense fallback={<div>Loading...</div>}>
            {reportedIssues.length === 0 ? (
              <p className="mt-4 text-gray-500">No issues reported to you.</p>
            ) : (<IssueGrid issues={reportedIssues} />)}
            
          </Suspense>
        </TabsContent>
      </Tabs>
    </>
  );
}

function IssueGrid({ issues }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} showStatus />
      ))}
    </div>
  );
}
