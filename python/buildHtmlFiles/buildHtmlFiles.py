import json
import os
import jinja2
import datetime
import shutil
import buildScriptUtils as buildUtils;

def generate_files(option):
    if option == 1: 
        # build md index files
        app = "md"
        subfolder = "index"
        config_key = "index_html_name"
    elif option == 2: 
        # build md template history files
        app = "md"
        subfolder = "templateHistory"
        config_key = "template_history_html_name"
    elif option == 3: 
        # build rep index files
        app = "rep"
        subfolder = "index"
        config_key = "index_html_name"
    elif option == 4: 
        # build rep template history files
        app = "rep"
        subfolder = "templateHistory"
        config_key = "template_history_html_name"
    else:
        print ("....")

    print (app, subfolder, config_key)

    curr_path = os.path.dirname(os.path.realpath(__file__));

    # get the full path to the jinja html template folder
    jinja_html_template_dir = os.path.join(curr_path, 'templates')

    # Load the jinja template config
    jinja_template_loader = jinja2.FileSystemLoader(searchpath=jinja_html_template_dir)
    jinja_template_env = jinja2.Environment(loader=jinja_template_loader)

    # Load server config 
    server_file_path = os.path.join(curr_path, f'appEnvConfigs/{app}.json')
    with open(f"{server_file_path}", "r") as f1:
        f1_data = json.load(f1)

        html_file_dict = f1_data[config_key]
        # Extract environments
        environments = f1_data["environments"]

        for lang, index_file_name in html_file_dict.items():
            # Construct the path to the JSON file relative to the script
            index_data_file_path = os.path.join(curr_path, f'appContentConfigs/{app}/{subfolder}/{lang}.json')
            print('index_data_file_path=', index_data_file_path)

            # get template file name
            jinja_html_template_name = 'html-' + lang + '.j2'
            print('jinja_html_template_name=', jinja_html_template_name)

            # Get today's date
            if lang=="fr":
                modification_date = datetime.datetime.now().strftime("%d/%m/%Y")
                lngHref = html_file_dict["en"]
            else:
                modification_date = datetime.datetime.now().strftime("%Y-%m-%d")
                lngHref = html_file_dict["fr"]
            print("lngHref", lngHref)


            # Read JSON file
            with open(index_data_file_path, 'r', encoding="utf-8") as f2:
                f2_data = json.load(f2)
                print('.......')
                # generate files for each environment
                for environment in environments:
                    print(environment)
                    dist_dir = os.path.join(curr_path, f'dist/{app}/{subfolder}/{environment}')
                    print('dist_dir=', dist_dir)
                    # Create dist_dir (if it doesn't exist)
                    os.makedirs(dist_dir, exist_ok=True)

                    # Generate html file
                    output_html_file_path = os.path.join(dist_dir, index_file_name)
                    print('output_html_file_path=', output_html_file_path)
                    buildUtils.generate_from_jinja_template(jinja_template_env, jinja_html_template_name, output_html_file_path, 
                                                            data=f2_data, lngHref=lngHref, dateModified=modification_date, environment=environment)
                    print(f"{output_html_file_path} is generated successfully.")
                        

if __name__ == '__main__':
    # Define the prompt options
    options = [
        "build md index files",
        "build md template history files",
        "build rep index files",
        "build rep template history files"
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

            generate_files(user_choice)

        else:
            print("\nInvalid choice. Please enter a number within the range.\n")

    except Exception as e:
        # Catch and display any exceptions
        print(f"An error occurred: {e}")


