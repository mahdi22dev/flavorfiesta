import * as cheerio from "cheerio";

async function test() {
  const res = await fetch("https://www.loveandlemons.com/lemon-olive-oil-cake/");
  const html = await res.text();
  const $ = cheerio.load(html);

  $(".entry-content > *").each((i, el) => {
    if ($(el).hasClass("entry-meta") || $(el).hasClass("sharedaddy") || $(el).hasClass("jp-relatedposts")) {
      return;
    }

    if ($(el).find("img").length > 0) {
      console.log("TAG:", $(el).prop("tagName"), "CLASS:", $(el).attr("class"));
      $(el).find("img").each((_, img) => {
        let imgUrl =
          $(img).attr("data-lazy-src") || 
          $(img).attr("data-src") || 
          $(img).attr("src") ||
          $(img).attr("srcset")?.split(" ")[0];

        if (imgUrl && !imgUrl.startsWith("data:")) {
           console.log("  IMG SRC:", imgUrl);
        }
      });
    }
  });
}

test();
