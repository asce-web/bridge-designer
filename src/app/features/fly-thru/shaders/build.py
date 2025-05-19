import os
import re
import sys


def main(compress):
    shader_files = [f for f in os.listdir(".") if f.endswith((".vert", ".frag"))]
    file_count = 0
    with open("shaders.ts", "w") as output:
        for file_name in shader_files:
            var_name = os.path.splitext(file_name)[0].upper().replace("-", "_")
            if file_name.endswith(".vert"):
                var_name += "_VERTEX_SHADER"
            elif file_name.endswith(".frag"):
                var_name += "_FRAGMENT_SHADER"
            print(f"{file_name}:");
            with open(file_name, "r") as input:
                file_count += 1
                text = input.read()

                if compress:
                    text = re.sub(r"//[^\n]*\n", " ", text)  # elide comments
                    text = re.sub(r"\s+", " ", text)  # compress whitespace
                    text = re.sub(r"\s?([=,*+\-/{}()])\s?", r"\1", text)
                    text = re.sub(r"; ", ";\n", text)  # break after ; for reading
                if file_count > 0:
                    print(file=output)
                print(f"export const {var_name} = ", file=output)
                print(f"`{text}`;", file=output)

                uniforms = {}
                ins = {}
                if not file_name.endswith(".vert"):
                    continue

                matches = re.findall(r"uniform\s+(\w+)\s+(\w+)", text)
                for match in matches:
                    uniformType, uniformId = match
                    if uniformId in uniforms or uniformId in ins:
                        print(f'  redefinition of "{uniformId}"') 
                    uniforms[uniformId] = uniformType

                matches = re.findall(
                    r"layout\s+\(location\s+=\s+(\d+)\)\s+in\s+(\w+)\s+(\w+)", text
                )
                for match in matches:
                    inLocation, inType, inId = match
                    if inId in uniforms or inId in ins:
                        print(f' redefinition of "{inId}"') 
                    ins[inId] = (inLocation, inType)


main(len(sys.argv) > 1 and sys.argv[1] == "--compress")
