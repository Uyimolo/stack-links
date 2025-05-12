import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";

async function scrapeMetadata(url: string) {
  try {
    const { data: html } = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(html);
    const title = $("title").first().text().trim();
    const description =
      $('meta[name="description"]').attr("content")?.trim() || "";
    const favicon = $('link[rel="icon"]').attr("href")?.trim() || "";
    const tags = extractKeywords($);

    if (!title && !description && !favicon && !tags)
      throw new Error("Empty metadata");
    return { title, description, favicon, tags };
  } catch (err) {
    console.error("Scraping failed:", (err as Error).message);
    return null;
  }
}

function extractKeywords($: cheerio.CheerioAPI): string {
  const keywordsMeta = $('meta[name="keywords"]').attr("content") || "";
  const keywordsOG = $('meta[property="article:tag"]')
    .map((_, el) => $(el).attr("content"))
    .get();

  const keywordList = keywordsMeta
    ? keywordsMeta.split(",").map((tag) => tag.trim())
    : [];

  return [...new Set([...keywordList, ...keywordsOG])].join(","); // dedupe
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const metadata = await scrapeMetadata(url);

    if (!metadata) {
      return NextResponse.json(
        { error: "Failed to generate metadata. Please input manually." },
        { status: 500 },
      );
    }

    return NextResponse.json(metadata, { status: 200 });
  } catch (err) {
    console.error("Handler error:", (err as Error).message);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
