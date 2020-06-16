import { Client } from "../../client.ts";
import { PathParameter } from "../../util/types.ts";

export type GenericEndpointInput = EndpointInput<unknown, unknown>;

/**
 * The generic package of client's requested information.
 * For `Meta` and `Body`, see the parameter `meta` and `body`.
 */
export interface EndpointInput<Meta, Body> {
  
  /**
   * Note that the path here is not just the path in the url
   */
  path: string;

  /**
  * A string value indicates network protocol of this EndpointInput. (like 'HTTP/1.1')
  */
  protocol: string;

  /**
   * Onwer of this input.
   */
  client: Client;

  /**
   * the metadata of the EndpointInput of specific network protocol.
   */
  meta: Meta;

  /**
   * General string parameter acquisition method.
   * 
   * @param key The key of parameter.
   */
  parameter(key: string): string | null;

  /**
   * The value indicates the content of the network request. This value 
   * should be the original information from the network request that 
   * has not been processed.
   */
  body?: Body;

  /**
   * The parameters contained in the path. For example:
   * 
   *    expected-path: '/:(name)/repos' 
   *    actual-path: '/jctaoo/repos'
   * 
   * Then, the pathParameters is
   *    
   *    {
   *      'name': 'jctaoo'
   *    }
   * 
   * Note that this value is different from the query in the url.
   */
  pathParameters: PathParameter;

}