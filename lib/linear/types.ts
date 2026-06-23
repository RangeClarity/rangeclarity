export type LinearIssueStatus = {
  id: string;
  name: string;
  type: string;
  color: string | null;
};

export type LinearBoardIssue = {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  url: string;
  dueDate: string | null;
  createdAt: string;
  status: LinearIssueStatus | null;
};

export type LinearBoardPayload = {
  issues: LinearBoardIssue[];
  scope: string;
  writeEnabled: boolean;
};
