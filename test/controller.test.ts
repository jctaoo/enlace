import * as Testing from "https://deno.land/std/testing/asserts.ts";
import { ControllerMapping } from "../lib/decorators/controller.ts";
import { TrueFunction } from "../lib/util/types.ts";
import { isController } from "../lib/controller.ts";

Deno.test("是否为Controller", () => {
  // define
  @ControllerMapping({expectedPath: "*", selectAdaptor: TrueFunction})
  class ControllerMarked {
  }
  class ControllerNotMarked {
  }
  // test
  Testing.assertEquals(isController(new ControllerMarked()), true);
  Testing.assertEquals(isController(ControllerMarked), true);
  Testing.assertEquals(isController(new ControllerNotMarked()), false);
  Testing.assertEquals(isController(ControllerNotMarked), false);
});

// todo get endpoints in controller