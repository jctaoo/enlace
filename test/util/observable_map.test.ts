import * as Testing from "https://deno.land/std/testing/asserts.ts";
import ObservableMap from "../../lib/util/observable_map.ts";

Deno.test("测试使用可观察的Map", () => {
  const map = new ObservableMap<string, string>();
  let number = 0;
  map.observeChange(updated => {
    if (number === 0) {
      Testing.assertEquals(updated.key, "key1");
      Testing.assertEquals(updated.value, "value1");
    }
    if (number === 1) {
      Testing.assertEquals(updated.key, "key2");
      Testing.assertEquals(updated.value, "value2");
    }
    if (number === 2) {
      Testing.assertEquals(updated.key, "key2");
      Testing.assertEquals(updated.value, "value2");
    }
    number += 1;
  });
  map.set("key1", "value1");
  map.set("key2", "value2");
  map.set("key2", "value2");
  Testing.assertEquals([...map.keys()], ["key1", "key2"]);
  Testing.assertEquals([...map.values()], ["value1", "value2"]);
});