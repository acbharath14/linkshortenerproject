---
agent: ask
---
Perform a security audit of this codebase to detect any potential security vulnerabilities in this project.

Output your findings as a markdown formatted tables with the following columns (ID should start at 1 and auto increment, File Path should be an actual link to file): "ID", "SEVERITY", "Issue", "File Path", "Line Number(s)", and "Recommendation".

Next, ask the user which issues they want to fix by either replying "all", or a comma sepearate list of IDs. After thir reply, run a separate sub agent (#runSubagent) to fix each issue that the user has specified. Each sub agent should report back with a simple 'subAgentSucess: true | false'.
