export * from "./auth";

// Export all tables for Drizzle
import { user , session , account , verification ,userRole} from "./auth";

export {
  user,
  session,
  account,
  verification,
  userRole
};

export{
  materials
} from "./materials"

export{
  quizSections,
  quizSectionsRelations,
  quizItems,
  quizItemsRelations,
  quizChoices,
  quizChoicesRelations
} from "./quiz"