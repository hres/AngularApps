import json
import os
import jinja2
import datetime
import buildScriptUtils as buildUtils;

def generate_files():
    curr_path = os.path.dirname(os.path.realpath(__file__));

    # get the full path to the index template folder
    template_dir = os.path.join(curr_path, 'templates')

    # Load the template config
    template_loader = jinja2.FileSystemLoader(searchpath=template_dir)
    template_env = jinja2.Environment(loader=template_loader)

    # Load server config JSON data
    server_file_path = os.path.join(curr_path, 'server.json')
    with open(f"{server_file_path}", "r") as f1:
        f1_data = json.load(f1)

        index_dict = f1_data["index_html_name"]
        # Extract environments
        environments = f1_data["environments"]

        for lang, index_file_name in index_dict.items():
            # Construct the path to the JSON file relative to the script
            index_data_file_path = os.path.join(curr_path, f'contentConfigs/index/md/{lang}.json')
            print('index_data_file_path=', index_data_file_path)

            # get template file
            template_name = 'html-' + lang + '.j2'
            # print('template_name=', template_name)

            # Get today's date
            if lang=="fr":
                modification_date = datetime.datetime.now().strftime("%Y-%m-%d")
            else:
                modification_date = datetime.datetime.now().strftime("%d/%m/%Y")

            # Read JSON file
            with open(index_data_file_path, 'r') as f2:
                f2_data = json.load(f2)
                # read ...
                h1_header = f2_data['h1_header']
                sections= f2_data['sections']

                # generate files for each environment
                for environment in environments:
                    dist_dir = os.path.join(curr_path, f'dist/{environment}')
                    os.makedirs(dist_dir, exist_ok=True)

                    # Generate html file
                    output_html_file_path = os.path.join(dist_dir, index_file_name)
                    # output_html_file_path = os.path.join(os.path.dirname(__file__), f"xxx.html")
                    buildUtils.generate_from_jinja_template(template_env, template_name, output_html_file_path, h1_header=h1_header, sections=sections, dateModified=modification_date, environment=environment)
                    print(f"{output_html_file_path} is generated successfully.")
                        

if __name__ == '__main__':
    # Define the options
    options = [
        "build md index files",
        "build md template history files"
    ]

    # Display the options to the user
    print("\nChoose an option to continue:")
    for i, option in enumerate(options, start=1):
        print(f"{i}. {option}")

    # Prompt the user for input
    user_choice = input("\nEnter the number of your choice: ")

    # Validate user input
    try:
        user_choice = int(user_choice)
        if 1 <= user_choice <= len(options):
            selected_option = options[user_choice - 1]
            print(f"\nYou selected option {user_choice}: {selected_option}")

            generate_files()

        else:
            print("\nInvalid choice. Please enter a number within the range.\n")
    except ValueError:
        print("\nInvalid input. Please enter a valid number.\n")


