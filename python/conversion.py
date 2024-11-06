import json
import csv
import os

def flatten_json_to_csv(data_folder):
    # Define file paths
    # csv_file_path = os.path.join(data_folder, 'PharmaceuticalRALead.csv')
    # csv_file_path = os.path.join(data_folder, 'BiologicalRALead.csv')
    # csv_file_path = os.path.join(data_folder, 'PostMarketVigilanceRALead.csv')
    # csv_file_path = os.path.join(data_folder, 'ConsumerHealthProductRALead.csv')
    csv_file_path = os.path.join(data_folder, 'VeterinaryRALead.csv')    
    
    ra_types_file_path = os.path.join(data_folder, 'raTypes.json')
    transaction_desc_file_path = os.path.join(data_folder, 'transactionDescriptions.json')
    # output_file_path = os.path.join(data_folder, 'PharmaceuticalRALead.json')
    # output_file_path = os.path.join(data_folder, 'BiologicalRALead.json')
    # output_file_path = os.path.join(data_folder, 'PostMarketVigilanceRALead.json')
    # output_file_path = os.path.join(data_folder, 'ConsumerHealthProductRALead.json')
    output_file_path = os.path.join(data_folder, 'VeterinaryRALead.json')

    # Load raTypes.json and transactionDescriptions.json
    with open(ra_types_file_path, 'r') as f:
        ra_types = json.load(f)
    # Convert keys to lowercase
    for entry in ra_types:
        entry['en'] = entry['en'].lower()

    with open(transaction_desc_file_path, 'r') as f:
        transaction_descriptions = json.load(f)
    # Convert keys to lowercase
    for entry in transaction_descriptions:
        entry['en'] = entry['en'].lower()

    # Create dictionaries for quick lookup of 'id' based on 'en'
    ra_type_lookup = {}
    for entry in ra_types:
        ra_type_name = entry['en']
        trimmed_ra_type_name = ra_type_name.split("(")[0].strip() if "(" in ra_type_name else ra_type_name.strip()
        ra_type_lookup[trimmed_ra_type_name] = entry

    transaction_desc_lookup = {}
    for entry in transaction_descriptions:
        transaction_desc_lookup[entry['en'].strip().lower()] = entry

    # Function to get raTypeId and raTypeEn
    def get_ra_type_info(ra_type_name):
        ra_type_name_trimmed = ra_type_name.strip().lower()
        ra_type_info = ra_type_lookup.get(ra_type_name_trimmed)
        if ra_type_info:
            return ra_type_info['id'], ra_type_info['en']
        else:
            print(f"Error: raType '{ra_type_name}' not found in raTypes.json")
            return "N/A", ra_type_name

    # Function to get transactionDescriptionId and transactionDescriptionEn
    def get_transaction_description_info(transaction_desc):
        transaction_desc_trimmed = transaction_desc.strip().lower()
        transaction_desc_info = transaction_desc_lookup.get(transaction_desc_trimmed)
        if transaction_desc_info:
            return transaction_desc_info['id'], transaction_desc_info['en']
        else:
            print(f"Error: transactionDescription '{transaction_desc}' not found in transactionDescriptions.json")
            return "N/A", transaction_desc

    # Grouped output data
    grouped_data = {}

    # Process the CSV file
    with open(csv_file_path, newline='') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)  # Read the header (first row)

        # Iterate over each row (excluding the header)
        for row in reader:
            transaction_type = row[0]  # First column value
            tx_trans_id, _ = get_transaction_description_info(transaction_type)

            # Iterate over each column from the second onwards
            for col_idx, col_value in enumerate(row[1:], start=1):
                ra_type_name = headers[col_idx].strip()  # Get the corresponding raType from the header
                ra_type_id, _ = get_ra_type_info(ra_type_name)

                # Only add records if there's an "A" in the cell
                if col_value == "A":
                    if ra_type_id not in grouped_data:
                        grouped_data[ra_type_id] = {
                            "raTypeId": ra_type_id,
                            "txnDescpIds": []
                        }
                    grouped_data[ra_type_id]["txnDescpIds"].append(tx_trans_id)

    # Convert the grouped data to the desired structure
    output_data = {"matrix": list(grouped_data.values())}

    # Write the result to an output JSON file
    with open(output_file_path, 'w') as jsonfile:
        json.dump(output_data, jsonfile, indent=4)

    print(f"Data has been written to {output_file_path}")


data_folder = 'C:/Ling/pvb/RT-4/apps/pbv-rt/src/assets/data'  # Replace this with your folder path
flatten_json_to_csv(data_folder)
