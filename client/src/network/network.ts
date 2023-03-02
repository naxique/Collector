import { Collection } from "../models/Collections";
import { Item } from "../models/Item";
import { Tag } from "../models/Tag";
import { User } from "../models/User";
let token = '';

export function setToken(t: string) {
  token = t;
}

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const url = process.env.REACT_APP_SERVERURL;
  if (!url) throw Error('Check your env variables');
  const response = await fetch(url+input, {...init, credentials: 'include'});
  if (response.ok) {
    return response
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    throw Error(errorMessage);
  }
}

export interface NewUserData {
  username: string,
  password: string,
  email: string
}

export async function signup(newUser: NewUserData): Promise<User> {
  const response = await fetchData("/api/user/", { 
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newUser)
  });
  return response.json();
}

export interface LoginData {
  username: string,
  password: string
}

export async function login(loginData: LoginData): Promise<User> {
  const response = await fetchData("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loginData)
  });
  return response.json();
}

export async function getUserById(id: string): Promise<User> {
  const response = await fetchData("/api/user/"+id, {
    method: "GET"
  });
  return response.json();
}

export interface PatchDescData {
  uid: string,
  newDesc: string
}

export async function patchUserDescripton(descData: PatchDescData) {
  const response = await fetchData('/api/user/'+descData.uid+'/patchDesc', {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ description: descData.newDesc, token: token })
  });
  return response;
}

export async function getAllCollections(): Promise<Collection[]> {
  const response = await fetchData("/api/collection/", {
    method: "GET"
  });
  return response.json();
}

export async function getCollectionById(id: string): Promise<Collection> {
  const response = await fetchData("/api/collection/"+id, {
    method: "GET"
  });
  return response.json();
}

export async function getAllTags(): Promise<Tag[]> {
  const response = await fetchData("/api/tags/", {
    method: "GET"
  });
  return response.json();
}

export async function getAllItems(): Promise<Item[]> {
  const response = await fetchData("/api/collection/items/", {
    method: "GET"
  });
  return response.json();
}

export async function getItem(collectionId: string, itemId: number): Promise<Item> {
  const response = await fetchData("/api/collection/"+collectionId+"/item/"+itemId, {
    method: "GET"
  });
  return response.json();
}