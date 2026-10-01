# Capture test

## Tool and model

- Tool: Cursor
- Model: Grok 4.7. The hook records it as `grok-4.7`.
- This agent session uses that one model to plan and to execute. There is no separate planner.

## Mechanism

Cursor project hooks, which run a command on their own when the matching event fires.

Config file changed: `.cursor/hooks.json`

Script: `.cursor/hooks/capture.py`

Events wired:

- `beforeSubmitPrompt` appends the prompt verbatim
- `afterAgentResponse` holds the latest assistant text for that turn
- `stop` and `sessionEnd` append that held text as the response

Logs go to `.agent-logs/`. That directory is not in `.gitignore`. `.cursor/hooks/state/` is ignored because it only holds the in-progress reply buffer.

## Log files

Session 1 (this chat):

`.agent-logs/2026-10-01_08-45-37_40cff009-0594-4736-9f85-bd6fa0e09181.md`

Session 2 (a separate agent chat in this project):

`.agent-logs/2026-10-01_08-48-58_c0268672-0755-4997-94bc-925838b18dc5.md`

## Canary entries

Pasted from those files, unchanged.

Session 1 prompt and response:

````
[LOG_ENTRY type=PROMPT num=1 session=40cff009]
timestamp: 2026-10-01T08:48:50.732Z
model: grok-4.7

CAPTURE TEST — 8x assignment, Moazzam

[LOG_ENTRY type=RESPONSE num=1 session=40cff009]
timestamp: 2026-10-01T08:49:24.647Z
model: grok-4.7

The canary prompt is in the log. This reply is the matching response, and the hook writes it when the turn ends.

Prompt entry, already on disk in `.agent-logs/2026-10-01_08-45-37_40cff009-0594-4736-9f85-bd6fa0e09181.md`:

```
[LOG_ENTRY type=PROMPT num=1 session=40cff009]
timestamp: 2026-10-01T08:48:50.732Z
model: grok-4.7

CAPTURE TEST — 8x assignment, Moazzam
```

The same file also has the previous turn’s final reply, flushed when this prompt arrived. That prompt was sent before the hook existed, so the file starts with that reply.

Open a new agent chat in this project and send: `CAPTURE TEST — 8x assignment, Moazzam, session 2`. After that lands, I will write `CAPTURE-TEST.md` from the raw entries.
````

Session 2 prompt and response:

````
[LOG_ENTRY type=PROMPT num=1 session=c0268672]
timestamp: 2026-10-01T08:48:58.758Z
model: grok-4.7

CAPTURE TEST — 8x assignment, Moazzam, session 2

[LOG_ENTRY type=RESPONSE num=1 session=c0268672]
timestamp: 2026-10-01T08:50:03.181Z
model: grok-4.7

Session 2 captured the canary. The prompt is already in `.agent-logs/2026-10-01_08-48-58_c0268672-0755-4997-94bc-925838b18dc5.md`:

```
[LOG_ENTRY type=PROMPT num=1 session=c0268672]
timestamp: 2026-10-01T08:48:58.758Z
model: grok-4.7

CAPTURE TEST — 8x assignment, Moazzam, session 2
```

This reply is the matching response. The hook writes it to that same file when the turn ends.

Go back to the first chat. That session said it would write `CAPTURE-TEST.md` from both raw entries once this one had landed.
````

## What I tried first that did not work

I checked Cursor’s hooks documentation before answering. A project rules file does not run a command on each prompt, so I did not use one for capture.

The first `chmod +x` on `.cursor/hooks/capture.py` failed in the sandbox with `Read-only file system`. I reran it outside the sandbox. The script is executable.

I also piped sample hook JSON into the script by hand. That wrote two files under `/tmp`, then I deleted nothing from `.agent-logs/` because those temp files were never the live log. A direct run is not Cursor firing the hook, so it was not the canary.

The setup prompt in session 1 was submitted before `.cursor/hooks.json` existed, so that prompt is not in the log. Its reply was still buffered, and the next submit flushed it. It sits at the top of the session 1 file, before the canary prompt, and it is also labeled response 1.

The canary replies quote a log header. The script counted those quoted lines as real prompts, so the following prompt in session 1 was stored as `num=3`, and session 2’s `total_exchanges` became 2. I changed the counter to use the hook’s session state. I did not edit the log entries.
