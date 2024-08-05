import json
import argparse

parser = argparse.ArgumentParser(
                    prog="version.py",
                    description="Opdaterer versionen af BetterLectio")
parser.add_argument('-b', '--branch')

package = json.loads(open("package.json").read())
args = parser.parse_args()

version = package["version"].split(".")

if args.branch == "main":
    package["version"] = f"{version[0]}.{int(version[1])+1}.0"
elif args.branch == "dev":
    package["version"] = f"{version[0]}.{version[1]}.{int(version[2])+1}"
elif args.branch == None:
    raise Exception("Ingen branch blev valgt. Se eventuelt \"version.py --help\"")
else:
    raise Exception(f"\"{args.branch}\" er ikke en gyldig branch")

open("package.json", "w").write(json.dumps(package, indent=2))