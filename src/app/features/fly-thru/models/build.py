from pathlib import Path
import os
import re
import sys


class MaterialsLibrary:
    def __init__(self, mtl_file_name):
        self.materials = {}
        self.name = "<no name>"
        with open(mtl_file_name, "r") as in_file:
            for line in in_file:
                line = re.sub("#.*$", "", line)
                parts = line.split()
                if len(parts) == 0:
                    continue
                match parts:
                    case ["newmtl", name]:
                        self.name = name
                    case ["Kd", x, y, z]:
                        self.add('kd', (x, y, z))
                    case ["Ka", x, y, z]:
                        self.add('ka', (x, y, z))
                    case ["Ks", x, y, z]:
                        self.add('ks', (x, y, z))
                    case ["Ns", value]:
                        self.add('ns', value)
                    case ['Ts', value]:
                        self.add('ts', value)
                    case _:
                        print(f"unknown value: {line}", file=sys.stderr)
                        continue
        print(self.materials)

    def add(self, tag, value):
        if self.name in self.materials:
            self.materials[self.name][tag] = value
        else:
            self.materials[self.name] = {tag: value}

    def get(self, name):
        return self.materials[name]


class Processor:
    def __init__(self):
        self.vertices = [()]
        self.texcoords = [()]
        self.normals = [()]
        self.triples = [()]
        self.triple_index = dict()
        self.faces = [()]
        self.material_libs = []

    def get_material(self, name):
        for lib in self.material_libs:
            material = lib.get(name)
            if material:
                return material
        return None

    def process(self, in_file, out_file):
        material = {}
        for line in in_file:
            line = re.sub("#.*$", "", line)
            parts = line.split()
            if len(parts) == 0:
                continue
            match parts[0]:
                case "v":
                    self.vertices.append(tuple(float(x) for x in parts[1:]))
                case "vn":
                    self.normals.append(tuple(float(x) for x in parts[1:]))
                case "f":
                    face = []
                    for vertex_spec in parts[1:]:
                        triple = tuple(
                            int(i) if len(i) > 0 else None
                            for i in vertex_spec.split("/")
                        )
                        face.append(triple)
                        if len(triple) != 3:
                            print(f"triangles required: {line}")
                            return
                        triple_index = self.triple_index.get(triple)
                        if triple_index == None:
                            self.triple_index[triple] = len(self.triples)
                            self.triples.append(triple)
                    self.faces.append({'face': face, 'material': material})
                case "s":
                    if parts[1] != "off":
                        print(f"unknown smooth: {line}", file=sys.stderr)
                    continue
                case "mtllib":
                    self.material_libs.append(MaterialsLibrary(parts[1]))
                case "usemtl":
                    material = self.get_material(parts[1])
                case _:
                    print(f"unknown command: {line}", file=sys.stderr)
                    continue
        populated = [False, False, False]
        for key in self.triple_index.keys():
            for i, index in enumerate(key):
                populated[i] = populated[i] or index != None
        print(f"// Source: {in_file.name}", file=out_file)
        if populated[0]:
            print("\n// prettier-ignore", file=out_file)
            print("export const VERTICES = new Float32Array([", file=out_file)
            for index, triple in enumerate(self.triple_index.keys()):
                p = self.vertices[triple[0]]
                print(f"  {p[0]}, {p[1]}, {p[2]}, // {index}", file=out_file)
            print("]);", file=out_file)
        if populated[1]:
            print("\n// prettier-ignore", file=out_file)
            print("export const TEX_COORDS = new Float32Array([", file=out_file)
            for index, triple in enumerate(self.triple_index.keys()):
                p = self.vertices[triple[1]]
                print(f"  {p[0]}, {p[1]}, {p[2]}, // {index}", file=out_file)
            print("]);", file=out_file)
        if populated[2]:
            print("\n// prettier-ignore", file=out_file)
            print("export const NORMALS = new Float32Array([", file=out_file)
            for index, triple in enumerate(self.triple_index.keys()):
                p = self.vertices[triple[2]]
                print(f"  {p[0]}, {p[1]}, {p[2]}, // {index}", file=out_file)
            print("]);", file=out_file)
        print("\n// prettier-ignore", file=out_file)
        print("export const INDICES = new Int16Array([", file=out_file)
        for face in self.faces[1:]:
            i = tuple(self.triple_index.get(f) - 1 for f in face['face'])
            print(f"  {i[0]}, {i[1]}, {i[2]},", file=out_file)
        print("]);", file=out_file)
        # TODO: Emit face['material'] vector.

    def run(self):
        obj_files = [f for f in os.listdir(".") if f.endswith(".obj")]
        for obj_file in obj_files:
            with open(obj_file, "r") as in_file:
                path = Path(obj_file).with_suffix(".ts")
                with open(path, "w") as out_file:
                    self.process(in_file, out_file)


Processor().run()
