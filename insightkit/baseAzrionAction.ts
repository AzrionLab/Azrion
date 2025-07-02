import { z } from "zod"

export type AzrionSchema = z.ZodObject<z.ZodRawShape>

export interface AzrionActionResponse<T> {
  notice: string
  data?: T
}

export interface AzrionActionCore<
  S extends AzrionSchema,
  R,
  Ctx = unknown
> {
  id: string
  summary: string
  input: S
  execute: (
    args: {
      payload: z.infer<S>
      context: Ctx
    }
  ) => Promise<AzrionActionResponse<R>>
}

export type AzrionAction = AzrionActionCore<AzrionSchema, unknown, unknown>