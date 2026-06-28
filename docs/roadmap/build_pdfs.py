#!/usr/bin/env python3
"""RangeClarity roadmap deck builder (entry point). See README.md."""
from deck import build_doc
from content_overall import overall_slides
from cs_part1 import slides_1
from cs_part2 import slides_2


def sprint_slides():
    return slides_1() + slides_2()


def main():
    print("Building RangeClarity roadmap PDFs...")
    build_doc(overall_slides(), "RangeClarity · Overall Roadmap",
              "RangeClarity — Overall Project Roadmap",
              "RangeClarity_Overall_Roadmap")
    build_doc(sprint_slides(), "RangeClarity · Sprint Taskbook",
              "RangeClarity — Next Sprint Taskbook",
              "RangeClarity_Next_Sprint_Taskbook")
    print("Done.")


if __name__ == "__main__":
    main()
