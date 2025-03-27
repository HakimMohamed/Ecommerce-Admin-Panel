export interface ITicket extends Document {
  _id: string;
  _user: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  subject: string;
  description: string;
  status: "open" | "in-progress" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}
