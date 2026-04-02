import * as cheerio from "cheerio";

async function test() {
  const res = await fetch("https://www.loveandlemons.com/lemon-olive-oil-cake/");
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log("TOTAL IMAGES IN CONTENT:", $(".entry-content img").length);
  
  $(".entry-content img").each((i, el) => {
    const parents = $(el).parentsUntil(".entry-content").map((_, p) => $(p).prop("tagName")).get().reverse().join(" > ");
    console.log(i, "PATH:", parents, "> IMG");
  });
}

test();
