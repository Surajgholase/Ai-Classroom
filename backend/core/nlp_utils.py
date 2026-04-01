import spacy
import functools

@functools.lru_cache(maxsize=1)
def get_nlp():
    """
    Lazy load the SpaCy model to save memory and decrease boot time.
    Cached after first call.
    """
    print("Loading SpaCy model en_core_web_sm...")
    return spacy.load("en_core_web_sm")
