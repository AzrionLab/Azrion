import math
from typing import List, Dict

def normalize_vector(vec: List[float]) -> List[float]:
    total = sum(vec)
    if total == 0: return [0] * len(vec)
    return [round(v / total, 4) for v in vec]

def entropy(series: List[str]) -> float:
    freq: Dict[str, int] = {}
    for item in series:
        freq[item] = freq.get(item, 0) + 1
    total = len(series)
    return -sum((count / total) * math.log2(count / total) for count in freq.values())