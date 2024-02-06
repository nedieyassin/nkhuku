import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import pb from "@/lib/pocketbase.ts";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export function queryStringToObject(string: string) {
    return Object.fromEntries(new URLSearchParams(string))
}

export function isPrimaryKey(key: string) {
    return key !== "+" && key !== ""
}


export function upsert(collection: string, id: string, data: Record<string, unknown>) {
    if (isPrimaryKey(id)) {
        return pb.collection(collection).update(id, data)
    } else {
        return pb.collection(collection).create(data)
    }
}