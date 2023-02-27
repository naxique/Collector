import { Item } from "./Item";
import { CustomFields } from "./customFields";

export interface Collection {
  authorId: string,
  customFields: CustomFields[],
  description: string,
  imageUrl: string,
  items: Item[],
  name: string,
  theme: string
}