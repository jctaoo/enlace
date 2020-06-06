import * as UUID from "https://deno.land/std/uuid/mod.ts";

/**
 * Used to mark a unique network request instead of a unique user
 */
export class Client {
  
  constructor(
    public readonly ip: Deno.Addr,
    public readonly id: string
  ) {}
  
  static generate(ip: Deno.Addr): Client {
    const id = UUID.v4.generate();
    return new Client(ip, id);
  }

}