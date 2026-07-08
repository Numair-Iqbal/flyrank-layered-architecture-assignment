import { NextRequest, NextResponse } from "next/server";
import { ContentService } from "@/app/content/content.service";

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: "postId required" }, { status: 400 });
    }
    const result = await ContentService.registerView(postId);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}