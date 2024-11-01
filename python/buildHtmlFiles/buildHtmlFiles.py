import json
import os
import datetime
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import utils.buildScriptUtils as buildUtils;
import utils.fileUtils as fileUtils;

# global variables
dist_root_folder = 'dist'
curr_path = os.path.dirname(os.path.realpath(__file__));
jinja_template_dir = os.path.join(curr_path, 'templates')
    
def generate_files(option):
    if option == 1: 
        # build md index files
        app = "md"
        appContentConfigSubfolder = "index"
        appEnvConfigHtmlKey = "index_html_name"
    elif option == 2: 
        # build md template history files
        app = "md"
        appContentConfigSubfolder = "versionHistory"
        appEnvConfigHtmlKey = "version_history_html_name"
    elif option == 3: 
        # build rep index files
        app = "rep"
        appContentConfigSubfolder = "index"
        appEnvConfigHtmlKey = "index_html_name"
    elif option == 4: 
        # build rep template history files
        app = "rep"
        appContentConfigSubfolder = "versionHistory"
        appEnvConfigHtmlKey = "version_history_html_name"
    else:
        print ("????")  # should never happen

    print(f'.. building for {app} {appContentConfigSubfolder}')

    # Load server config 
    server_file_path = os.path.join(curr_path, f'appEnvConfigs/{app}.json')
    with open(f"{server_file_path}", "r", encoding="utf-8") as f1:
        f1_data = json.load(f1)

        html_file_dict = f1_data[appEnvConfigHtmlKey]
        # Extract environments
        environments = f1_data["environments"]
        # print(environments, template_paths)

        for lang, target_file_name in html_file_dict.items():
            print(f'.... {lang}')
            # Construct the path to the JSON file relative to the script
            html_content_file_path = os.path.join(curr_path, f'appContentConfigs/{app}/{appContentConfigSubfolder}/{lang}.json')
            # print('html_content_file_path=', html_content_file_path)

            # jinja template file name
            jinja_html_template_name = 'html-' + lang + '.j2'
            # print('jinja_html_template_name=', jinja_html_template_name)

            # Get today's date
            if lang=="fr":
                modification_date = datetime.datetime.now().strftime("%Y-%m-%d")
                lngHref = f'{html_file_dict["en"]}.html'
            else:
                modification_date = datetime.datetime.now().strftime("%Y-%m-%d")
                lngHref = f'{html_file_dict["fr"]}.html'
            # print("lngHref", lngHref)

            # Read JSON file
            with open(html_content_file_path, 'r', encoding="utf-8") as f2:
                f2_data = json.load(f2)
                
                if appContentConfigSubfolder=='index':
                    # generate files for each environment and each site
                    sites = ["internal", "external"]
                    for env, base_url_setting in environments.items():
                        print(f'...... {env}')
                        for site in sites:
                            if (env == "prod"):
                                serverBaseUrl = base_url_setting[site]
                            else:
                                serverBaseUrl = base_url_setting
                            print(f'........ {site}, base_url={serverBaseUrl}') 
                            # get CO/RT/AI application path from the environment cofig file (appEnvConfigs\md.json)
                            template_paths = f1_data["template_paths"][env]
                            target_dir = f'{app}/{appContentConfigSubfolder}/{env}/{site}'
                                
                            temp_folder = os.path.join(curr_path, f'{dist_root_folder}/temp')
                            temp_dir = os.path.join(temp_folder, target_dir) 
                            temp_file_name = f'{target_file_name}.j2'                            
                            # first generate a temp file using the html template, the temp file will have places holders for template application urls
                            buildUtils.generate_from_jinja_template(template_dirs=[jinja_template_dir], 
                                                                    template_file_name=jinja_html_template_name, 
                                                                    output_dir=temp_dir, 
                                                                    output_file_name=temp_file_name, 
                                                                    env=env, site=site, data=f2_data, lngHref=lngHref, dateModified=modification_date)
                                
                            # then use the temp file as the template to genereate final html file, 
                            # replace places holders for template application urls (eg. {{ base_url }}{{ template_paths.rt.en }}) with values from the environment configs
                            dist_dir = os.path.join(curr_path, f'{dist_root_folder}/{target_dir}')
                            final_file_name = f'{target_file_name}.html'
                            final_file_path = buildUtils.generate_from_jinja_template(template_dirs=[temp_dir],
                                                                    template_file_name=temp_file_name, 
                                                                    output_dir=dist_dir, 
                                                                    output_file_name=final_file_name, 
                                                                    base_url=serverBaseUrl,template_paths=template_paths)
                            print(f'.......... {final_file_path} is generated successfully.')     
                                
                            
                    # delete the temp folder
                    if fileUtils.delete_folder(temp_folder):
                        print(f"\n.... temp folder '{temp_folder}' and its contents were deleted successfully for {lang} files build process.\n")           
                    
                else :  
                    # for version history pages, there is not difference between dev and prod, so we are going to only build files for prod
                    env = 'prod'
                    target_dir = f'{app}/{appContentConfigSubfolder}'
                    dist_dir = os.path.join(curr_path, f'{dist_root_folder}/{target_dir}')
                    final_file_name = f'{target_file_name}.html'
                    final_file_path = buildUtils.generate_from_jinja_template(template_dirs=[jinja_template_dir],
                                                                    template_file_name=jinja_html_template_name, 
                                                                    output_dir=dist_dir, 
                                                                    output_file_name=final_file_name, 
                                                                    env=env, data=f2_data, lngHref=lngHref, dateModified=modification_date) 
                    print(f'...... {final_file_path} is generated successfully.')     
                    
                    
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


