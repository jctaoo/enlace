import * as Testing from "https://deno.land/std/testing/asserts.ts";
import { Util } from "../../lib/util/mod.ts";

class Demo { }
function DemoFunc() { }
const arrowFunc = () => { };
const number = 1;
const str = "test";
const obj = new Demo();

Deno.test("判断是否能被构造", () => {
  Testing.assertEquals(Util.canBeConstructed(Demo), true);
  Testing.assertEquals(Util.canBeConstructed(DemoFunc), true);
  Testing.assertEquals(Util.canBeConstructed(arrowFunc), false);
  Testing.assertEquals(Util.canBeConstructed(number), false);
  Testing.assertEquals(Util.canBeConstructed(str), false);
  Testing.assertEquals(Util.canBeConstructed(obj), false);
});

Deno.test("判断是否为Function", () => {
  Testing.assertEquals(Util.isFunction(Demo), true);
  Testing.assertEquals(Util.isFunction(DemoFunc), true);
  Testing.assertEquals(Util.isFunction(arrowFunc), true);
  Testing.assertEquals(Util.isFunction(number), false);
  Testing.assertEquals(Util.isFunction(str), false);
  Testing.assertEquals(Util.isFunction(obj), false);
});

Deno.test("判断字符串是否为JSON", () => {
  Testing.assertEquals(Util.isJson(""), false);
  Testing.assertEquals(Util.isJson("{}"), {});
  Testing.assertEquals(Util.isJson(`{"name":"bob"}`), { name: "bob" });
  Testing.assertEquals(Util.isJson(`{name:"bob"}`), false);
});