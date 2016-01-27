#client-process-query

Provides a framework for easily querying spawned child processes through their CLI using callbacks. Normally, a command would need to be sent to a process, and a response listened for separately. This disconnect can be a bit of a pain and lead to uneccessary code overhead, so to simplify this process this package is designed to reconnect the command and the response, by using user-defined events based on the parsed process output

##Usage


