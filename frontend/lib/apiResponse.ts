// lib/apiResponse.ts — standard response envelope helper.
// Keeps every route handler consistent:
//   { success: true,  data: {...},        message?: "optional" }
//   { success: false, data: null,         message: "error" }
// See docs/API.md §1 and docs/CONVENTIONS.md §2 "Error Handling".

import { NextResponse } from "next/server";

export function ok<T>(
  data: T,
  message?: string,
  init: { status?: number } = {}
) {
  return NextResponse.json(
    { success: true, data, message: message ?? undefined },
    { status: init.status ?? 200 }
  );
}

export function created<T>(data: T, message?: string) {
  return ok(data, message, { status: 201 });
}

export function fail(message: string, status: number) {
  return NextResponse.json({ success: false, data: null, message }, { status });
}