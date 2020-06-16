import * as Testing from "https://deno.land/std/testing/asserts.ts";
import { matchPath, parsePath } from "../../lib/util/match_path.ts";

Deno.test("测试path匹配", () => {
  Testing.assertEquals(matchPath("/room/id/233", "*"), true);
  Testing.assertEquals(matchPath("/favicon.ico", "/"), false);
  Testing.assertEquals(matchPath("somePath", "link-to-*"), false);
  Testing.assertEquals(matchPath("link-to-somewhere", "link-to-*"), true);
});

Deno.test("测试path参数提取", () => {
  Testing.assertEquals(parsePath("link-to-web", "link-to-*"), {});
  Testing.assertEquals(
    parsePath("link-to-web", "link-to-:(place)"),
    { place: "web" },
  );
  Testing.assertEquals(
    parsePath("link-of-world", "link-*-:(place)"),
    { place: "world" },
  );
});
