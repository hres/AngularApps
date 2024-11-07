import csv
import json
import os

def csv_to_json(csv_file_path, json_file_path):
    data = []
    
    # Read the CSV file
    with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)

        # Process each row in the CSV
        for row in reader:
            if len(row) >= 5:  # Ensure that there are at least 5 columns in the row
                # Create a dictionary for each row
                entry = {
                    "id": row[0].strip(),
                    "en": row[1].strip(),
                    "fr": row[2].strip(),
                }

                # Conditionally add defEn if it's not empty
                if row[3].strip():
                    entry["defEn"] = row[3].strip()
                
                # Conditionally add defFr if it's not empty
                if row[4].strip():
                    entry["defFr"] = row[4].strip()
                
                data.append(entry)
    
    # Write the list of dictionaries to a JSON file
    with open(json_file_path, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, indent=4, ensure_ascii=False)
    
    print(f"Data has been written to {json_file_path}")

# Example file paths (replace with your actual paths)
data_folder = 'C:/Ling/pvb/RT-4/apps/pbv-rt/src/assets/data'  # Replace this with your folder path
csv_file_path = os.path.join(data_folder, 'txndescp.csv')
json_file_path = os.path.join(data_folder, 'txndescp.json')

csv_to_json(csv_file_path, json_file_path)