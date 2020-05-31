import { int } from "../util/mod.ts";
import { EnlaceServer } from "../core/server.ts";
import EndpointInput from "../endpoint/endpoint-input.ts";

export interface AdaptorConfigure {
    host: string;
    port: int;
}

export abstract class Adaptor<InputMeta, InputBody> {

    abstract protocol: string;
    abstract attachOnServer(server: EnlaceServer, configure: AdaptorConfigure): void;
    abstract sendToClient(input: EndpointInput<InputMeta, InputBody>, content: any): void;

    public didReceiveContent: (input: EndpointInput<InputMeta, InputBody>) => void = () => {};
    protected onStart(): void { }
    protected onDispose(): void { }

}
