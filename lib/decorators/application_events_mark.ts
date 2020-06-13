import ApplicationEvents from "../application_events.ts";

interface ApplicationEventsMark<Meta = unknown> {
  type: ApplicationEvents
  meta: Meta
  target: Function
}

export default ApplicationEventsMark;