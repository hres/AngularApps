import json
import os
import sys

# Get the path from the command line arguments
if len(sys.argv) < 2:
    print("Error: Please provide the relative path to the taget package.json file. eg. ./projects/hpfb/sdk/package.json")
    sys.exit(1)

package_json_path = sys.argv[1]

# Resolve the full path and read the package.json
package_json_full_path = os.path.abspath(package_json_path)

# Load the package.json file
with open(package_json_full_path, 'r') as file:
    package_json = json.load(file)

# Increment the build number
package_json['buildNumber'] = package_json.get('buildNumber', 0) + 1

# Write the updated package.json back to disk
with open(package_json_full_path, 'w') as file:
    json.dump(package_json, file, indent=2)

print(f"Build number updated to {package_json['buildNumber']} in {package_json_full_path}")