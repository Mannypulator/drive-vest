import { propertyCreateSchema } from "@/lib/validators";
import { z } from "zod";

export type Property = z.infer<typeof propertyCreateSchema> & {
  id: string;
  createdAt: string;
};
