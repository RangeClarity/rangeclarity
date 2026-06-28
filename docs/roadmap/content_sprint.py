#!/usr/bin/env python3
"""Next Sprint Taskbook aggregator: joins cs_part1 (1-7) + cs_part2 (8-14)."""
from cs_part1 import slides_1
from cs_part2 import slides_2


def sprint_slides():
    return slides_1() + slides_2()
