import json
import os
import fileUtils as fileUtils
# Define the path to your library's built package.json
library_name = 'pbv'  # Replace with your library name
dist_path = os.path.join('dist','hpfb',library_name)
package_json_path = os.path.join(dist_path, 'package.json')
# The dependency to modify (you can change this)
dependency_name = '@hpfb/sdk'  # Replace with the actual dependency name
new_dependency_path = 'file:../../libs/hpfb-sdk-1.1.0.tgz'  # Replace with your new dependency path
# Check if the package.json exists
if os.path.exists(package_json_path):
    # Open the package.json file
    with open(package_json_path, 'r', encoding='utf-8') as file:
        package_json = json.load(file)
    
    # Modify the dependency in the package.json file
    if 'dependencies' in package_json:
        package_json['dependencies'][dependency_name] = new_dependency_path
    else:
        package_json['dependencies'] = {dependency_name: new_dependency_path}
    
    # Write the updated package.json back to the file
    with open(package_json_path, 'w', encoding='utf-8') as file:
        json.dump(package_json, file, indent=2)
    
    print(f'Dependency {dependency_name} updated to {new_dependency_path} in {package_json_path}')
else:
    print(f'Error: {package_json_path} not found.')