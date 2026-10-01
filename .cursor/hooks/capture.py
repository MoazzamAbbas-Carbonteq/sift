#!/usr/bin/env python3
"""Capture user prompts and final assistant responses into .agent-logs/.

Cursor runs this on its own. Stdout is reserved for hook JSON.
"""

import fcntl
import json
import os
import re
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

AUTHOR = "MoazzamAbbas-Carbonteq"
PROJECT = "sift"
TOOL = "cursor"

ROOT = Path(__file__).resolve().parents[2]
LOG_DIR = Path(os.environ.get("AGENT_LOG_DIR", ROOT / ".agent-logs"))
STATE_DIR = Path(os.environ.get("AGENT_STATE_DIR", ROOT / ".cursor" / "hooks" / "state"))


def utc_now():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def model_name(data):
    model_id = (data.get("model_id") or "").strip()
    model = (data.get("model") or "").strip()
    if model_id and model and model_id != model:
        return model_id
    return model_id or model or "unknown"


def conversation_id(data):
    return (data.get("conversation_id") or data.get("session_id") or "unknown").strip()


def safe_id(value):
    cleaned = re.sub(r"[^A-Za-z0-9._-]", "_", value)
    return cleaned or "unknown"


def short_id(value):
    return value.replace("-", "")[:8] or "unknown"


def emit(event):
    if event == "beforeSubmitPrompt":
        sys.stdout.write(json.dumps({"continue": True}) + "\n")
    else:
        sys.stdout.write("{}\n")


def atomic_write(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(dir=str(path.parent), prefix=path.name + ".", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write(content)
        os.replace(tmp_name, path)
    except Exception:
        try:
            os.unlink(tmp_name)
        except OSError:
            pass
        raise


def session_path(conv):
    matches = sorted(LOG_DIR.glob(f"*_{safe_id(conv)}.md"))
    return matches[0] if matches else None


def new_session_path(conv, timestamp):
    stamp = timestamp[:19].replace(":", "-").replace("T", "_")
    return LOG_DIR / f"{stamp}_{safe_id(conv)}.md"


def header(conv, timestamp, model):
    short = short_id(conv)
    day = timestamp[:10]
    return (
        "---\n"
        f"session_id: {conv}\n"
        f"date: {day}\n"
        f"author: {AUTHOR}\n"
        f"model: {model}\n"
        f"tool: {TOOL}\n"
        f"project: {PROJECT}\n"
        "total_exchanges: 0\n"
        f"first_prompt_time: {timestamp}\n"
        f"last_prompt_time: {timestamp}\n"
        "---\n"
        "\n"
        f"# Session Log - {day}\n"
        "\n"
        f"Session: `{short}` | Project: `{PROJECT}` | Author: `{AUTHOR}`\n"
        "\n"
        "---\n"
        "\n"
    )


def set_field(text, key, value):
    pattern = rf"^{re.escape(key)}: .*$"
    return re.sub(pattern, f"{key}: {value}", text, count=1, flags=re.M)


def known_prompt_count(state):
    stored = state.get("prompt_count")
    if isinstance(stored, int):
        return stored
    nums = [n for n in state.get("prompt_nums", {}).values() if isinstance(n, int)]
    return max(nums) if nums else 0


def format_entry(kind, number, conv, timestamp, model, body):
    text = body if body.endswith("\n") else body + "\n"
    return (
        f"[LOG_ENTRY type={kind} num={number} session={short_id(conv)}]\n"
        f"timestamp: {timestamp}\n"
        f"model: {model}\n"
        "\n"
        f"{text}\n"
    )


def load_state(conv):
    path = STATE_DIR / f"{safe_id(conv)}.json"
    if not path.exists():
        return {"pending": None, "prompt_nums": {}}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {"pending": None, "prompt_nums": {}}
    data.setdefault("pending", None)
    data.setdefault("prompt_nums", {})
    return data


def save_state(conv, state):
    path = STATE_DIR / f"{safe_id(conv)}.json"
    atomic_write(path, json.dumps(state, ensure_ascii=False))


def ensure_session(conv, timestamp, model):
    path = session_path(conv)
    if path is not None:
        return path
    path = new_session_path(conv, timestamp)
    atomic_write(path, header(conv, timestamp, model))
    return path


def refresh_counts(text, state):
    return set_field(text, "total_exchanges", str(known_prompt_count(state)))


def append_prompt(conv, generation, timestamp, model, prompt):
    state = load_state(conv)
    path = ensure_session(conv, timestamp, model)
    text = path.read_text(encoding="utf-8")
    number = known_prompt_count(state) + 1
    state["prompt_count"] = number
    text += format_entry("PROMPT", number, conv, timestamp, model, prompt)
    text = set_field(text, "last_prompt_time", timestamp)
    text = refresh_counts(text, state)
    atomic_write(path, text)
    if generation:
        state["prompt_nums"][generation] = number
    save_state(conv, state)


def flush_pending(conv):
    state = load_state(conv)
    pending = state.get("pending")
    if not pending:
        return
    timestamp = pending.get("timestamp") or utc_now()
    model = pending.get("model") or "unknown"
    body = pending.get("text") or ""
    generation = pending.get("generation_id") or ""
    path = ensure_session(conv, timestamp, model)
    text = path.read_text(encoding="utf-8")
    number = state.get("prompt_nums", {}).get(generation)
    if not isinstance(number, int):
        number = known_prompt_count(state) or 1
    text += format_entry("RESPONSE", number, conv, timestamp, model, body)
    text = refresh_counts(text, state)
    atomic_write(path, text)
    state["pending"] = None
    save_state(conv, state)


def store_response(conv, generation, timestamp, model, response):
    state = load_state(conv)
    state["pending"] = {
        "generation_id": generation,
        "timestamp": timestamp,
        "model": model,
        "text": response,
    }
    save_state(conv, state)


def handle(data):
    event = data.get("hook_event_name") or ""
    conv = conversation_id(data)
    generation = (data.get("generation_id") or "").strip()
    model = model_name(data)
    timestamp = utc_now()

    LOG_DIR.mkdir(parents=True, exist_ok=True)
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    lock_path = STATE_DIR / "capture.lock"
    with lock_path.open("a", encoding="utf-8") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if event == "beforeSubmitPrompt":
            flush_pending(conv)
            append_prompt(conv, generation, timestamp, model, data.get("prompt") or "")
        elif event == "afterAgentResponse":
            store_response(conv, generation, timestamp, model, data.get("text") or "")
        elif event in ("stop", "sessionEnd"):
            flush_pending(conv)


def main():
    event = ""
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
        event = data.get("hook_event_name") or ""
        handle(data)
    except Exception as exc:
        sys.stderr.write(f"capture hook error: {exc}\n")
    emit(event)


if __name__ == "__main__":
    main()
