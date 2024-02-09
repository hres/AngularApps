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
        appContentConfigSubfolder = "index"
        appEnvConfigKey = "index_html_name"
    elif option == 2: 
        # build md template history files
        app = "md"
        appContentConfigSubfolder = "versionHistory"
        appEnvConfigKey = "version_history_html_name"
    elif option == 3: 
        # build rep index files
        app = "rep"
        appContentConfigSubfolder = "index"
        appEnvConfigKey = "index_html_name"
    elif option == 4: 
        # build rep template history files
        app = "rep"
        appContentConfigSubfolder = "versionHistory"
        appEnvConfigKey = "version_history_html_name"
    else:
        print ("....")

    # print (app, appContentConfigSubfolder, appEnvConfigKey)
    print(f'.. building for {app} {appContentConfigSubfolder}')

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

        html_file_dict = f1_data[appEnvConfigKey]
        # Extract environments
        environments = f1_data["environments"]

        for lang, target_file_name in html_file_dict.items():
            print(f'.... {lang}')
            # Construct the path to the JSON file relative to the script
            index_data_file_path = os.path.join(curr_path, f'appContentConfigs/{app}/{appContentConfigSubfolder}/{lang}.json')
            # print('index_data_file_path=', index_data_file_path)

            # get template file name
            jinja_html_template_name = 'html-' + lang + '.j2'
            # print('jinja_html_template_name=', jinja_html_template_name)

            # Get today's date
            if lang=="fr":
                modification_date = datetime.datetime.now().strftime("%d/%m/%Y")
                lngHref = html_file_dict["en"]
            else:
                modification_date = datetime.datetime.now().strftime("%Y-%m-%d")
                lngHref = html_file_dict["fr"]
            # print("lngHref", lngHref)

            # Read JSON file
            with open(index_data_file_path, 'r', encoding="utf-8") as f2:
                f2_data = json.load(f2)
                
                # generate files for each environment
                for environment in environments:
                    print(f'...... {environment}')
                    if appContentConfigSubfolder=='index':
                        if environment == 'dev':
                           # Define a list with two values: "internal" and "external"
                            sites = ["internal"]
                        else:
                            sites = ["internal", "external"]

                        for site in sites:
                            print(f'........ {site}')
                            dist_dir_prefix = os.path.join(curr_path, f'dist/{app}/{appContentConfigSubfolder}/{environment}/{site}')
                            abc(dist_dir_prefix, target_file_name, site, environment, jinja_template_env, jinja_html_template_name, 
                                                            data=f2_data, lngHref=lngHref, dateModified=modification_date)
                    else :
                        dist_dir_prefix = os.path.join(curr_path, f'dist/{app}/{appContentConfigSubfolder}/{environment}')
                        abc(dist_dir_prefix, target_file_name, None, environment, jinja_template_env, jinja_html_template_name, 
                                                            data=f2_data, lngHref=lngHref, dateModified=modification_date)


def abc(dist_dir_prefix, target_file_name, site, environment, template_env, template_name, **kwargs):
    dist_dir = os.path.join(dist_dir_prefix)
    # print('dist_dir=', dist_dir)
    # Create dist_dir (if it doesn't exist)
    os.makedirs(dist_dir, exist_ok=True)

     # Generate html file
    output_html_file_path = os.path.join(dist_dir, target_file_name)
    # print('output_html_file_path=', output_html_file_path)
    buildUtils.generate_from_jinja_template(template_env, template_name, output_html_file_path, **kwargs)
    print(f'.......... {output_html_file_path} is generated successfully.')                  

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
            print('\n')
            generate_files(user_choice)
            print('\n')
        else:
            print("\nInvalid choice. Please enter a number within the range.\n")

    except Exception as e:
        # Catch and display any exceptions
        print(f"\nAn error occurred: {e}")


