import { CustomFields } from "./customFields";

export interface Item {
  id: number,
  name: string,
  commentIds: string[],
  customFields: CustomFields[],
  likedBy: string[],
  tags: string[]
}