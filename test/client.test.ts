import * as Testing from "https://deno.land/std/testing/asserts.ts";
import { Client } from "../lib/client.ts";

Deno.test("测试Client的唯一性", () => {
  const ip: Deno.NetAddr = {
    transport: "tcp",
    hostname: "122.135.148.35",
    port: 443,
  };
  const set = new Set<Client>();
  const number = 100;
  for (let i = 0; i < number; i ++) {
    set.add(Client.generate(ip));
  }
  Testing.assertEquals(set.size, number);
  set.add([...set.values()][0]);
  Testing.assertEquals(set.size, number);
});