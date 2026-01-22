# Copyright (c) 2025-2026 Gene Ressler
# SPDX-License-Identifier: GPL-3.0-or-later

"""Check for missing and excess help images. Optionally delete excess."""

from html.parser import HTMLParser
import os
import sys


class Checker(HTMLParser):
    """HTML Parser for finding all image sources."""

    def __init__(self, *, convert_charrefs=True):
        super().__init__(convert_charrefs=convert_charrefs)
        self.srcs = set()

    def handle_startendtag(self, tag, attrs):
        if tag == "img":
            src = dict(attrs).get("src")
            self.srcs.add(src.removeprefix("img/help/"))


checker = Checker()
with open("help-topic.component.html", "r") as file:
    checker.feed(file.read())

img_dir = "../../../../../public/img/help"
files = set(os.listdir(img_dir))

print("missing", sorted(checker.srcs - files))
excess = sorted(files - checker.srcs)
print("excess", excess)

if "--delete" in sys.argv:
    print("deleting excess")
    for file in excess:
        path = f"{img_dir}/{file}"
        os.remove(path)
