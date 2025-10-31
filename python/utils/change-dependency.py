import json
import os
import fileUtils as fileUtils
import sys

# Define the path to your library's built package.json
library_name = sys.argv[1]  # Replace with your library name
dist_path = os.path.join('dist','hpfb',library_name)
package_json_path = os.path.join(dist_path, 'package.json')
# The dependency to modify (you can change this)
dependency_name = '@hpfb/sdk'  # Replace with the actual dependency name
new_dependency_path = ''  
# Check if the package.json exists
if os.path.exists(package_json_path):
    # Open the package.json file
    with open(package_json_path, 'r', encoding='utf-8') as file:
        package_json = json.load(file)
    
    # Modify the dependency in the package.json file
    if 'dependencies' in package_json and dependency_name in package_json['dependencies']:
        old_dependency_path = package_json['dependencies'][dependency_name]
        print(f"Old dependency path for {dependency_name}: {old_dependency_path}")

        if old_dependency_path.startswith('file:../../../'):
            # Replace "file:../../../" with "file:../../"
            new_dependency_path = old_dependency_path.replace('file:../../../', 'file:../../')
            print(f"Updated dependency path: {new_dependency_path}")
        else:
            print("Current dependency path does not begin with 'file:../../../'")
        package_json['dependencies'][dependency_name] = new_dependency_path
    else:
        package_json['dependencies'] = {dependency_name: new_dependency_path}
    
    # Write the updated package.json back to the file
    with open(package_json_path, 'w', encoding='utf-8') as file:
        json.dump(package_json, file, indent=2)
    
    print(f'Dependency {dependency_name} updated to {new_dependency_path} in {package_json_path}')
else:
    print(f'Error: {package_json_path} not found.')