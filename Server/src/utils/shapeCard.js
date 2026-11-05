export const shapeCard = (c) => ({
  id: c.id,
  title: c.title,
  description: c.description,
  priority: c.priority,
  dueDate: c.dueDate ? c.dueDate.toISOString().slice(0, 10) : "",
  labels: c.labels,
  assignee: c.assignee,
  assigneeId: c.assigneeId || "",
  comments: c.comments,
});