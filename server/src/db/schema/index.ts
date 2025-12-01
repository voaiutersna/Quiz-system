export * from "./auth";

// Export all tables for Drizzle
import { user , session , account , verification ,userRole} from "./auth";

export const schema = {
  user,
  session,
  account,
  verification,
  userRole
};