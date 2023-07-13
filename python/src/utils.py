"""Define your LangChain chatbot."""
import re
import uuid

UUID_PATTERN = re.compile(
    r"([0-9A-Za-z]{8}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{12})"
)


def is_uuid(uuid_to_test: str, version: int = 4) -> bool:
    """Check a string to see if it is actually a UUID."""
    lowered = uuid_to_test.lower()
    try:
        return str(uuid.UUID(lowered, version=version)) == lowered
    except ValueError:
        return False


def convert_to_handle(s: str) -> str:
    if not s:
        return s
    s = s.strip().lower()
    s = re.sub(r" ", "_", s)
    s = re.sub(r"[^a-z0-9-_]", "", s)
    s = re.sub(r"[-_]{2,}", "-", s)
    return s


def replace_markdown_with_uuid(text):
    pattern = r"(?:!\[.*?\]|)\((.*?)://?(.*?)\)"
    return re.sub(pattern, r"\2", text)
