import { PropertyCreateSchema } from "@/lib/validators";
import { z } from "zod";

export type Property = z.infer<typeof PropertyCreateSchema> & {
  id: string;
  createdAt: string;
};
