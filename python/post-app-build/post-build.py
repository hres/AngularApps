import json
import argparse
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import utils.buildScriptUtils as buildUtils;
import utils.fileUtils as fileUtils;
import utils.commonUtils as commonUtils;

if __name__ == "__main__":
    
    parser = argparse.ArgumentParser(description='Process some files.')
    parser.add_argument('--root_folder', type=str, help='The root folder path')
    parser.add_argument('--template', type=str, required=True, help='The application name')
    parser.add_argument('--env', type=str, required=True, help='The environment to process for')
    parser.add_argument('--language', type=str, required=True, help='The language to process')

    args = parser.parse_args()
    
    if args.template is None or args.env is None or args.language is None:
        print("Error: '--template', '--env' and '--language' must be specified.")
        sys.exit(1) 

    root_folder = args.root_folder or input("Please enter the absolute path to the root folder: ").strip()
    template = args.template
    env = args.env
    language = args.language
    
    print(f'.. post build process for {template}, {env}, {language}')

    dist_dir = os.path.join(f'{root_folder}/dist/{template}/{env}/{language}')
    browser_dir = os.path.join(f'{dist_dir}/browser/') 
    jinja_template_file_name = f"index-{language}.j2"
    temporary_files_dir = os.path.join(f'{browser_dir}temp/') 
    temporary_jinja_template_name = f"index-{language}-temp.j2"

    print(f" root_folder: {root_folder}")
    print(f" dist_dir: {dist_dir}")
    print(f" browser_dir: {browser_dir}")
    print(f" jinja_template_file_name: {jinja_template_file_name}")
    print(f" temporary_files_dir: {temporary_files_dir}")
    print(f" temporary_jinja_template_name: {temporary_jinja_template_name}")

    # Load build config file
    build_config_file_path = os.path.join(f'{temporary_files_dir}configs.json')
    print(f" build_config_file_path: {build_config_file_path}\n")
    with open(f"{build_config_file_path}", "r") as f1:
        f1_data = json.load(f1)

        date_issued = f1_data["date_issued"]
        if date_issued is None:
            print(f"Error: 'date_issued' not found in {build_config_file_path}")
            sys.exit(1)
            
        server_base_url = f1_data["server_base_url"][env]
        if server_base_url is None:
            print(f"Error: 'serverBaseUrl' not found in {build_config_file_path}")
            sys.exit(1)           
         
        if language=="fr":
            final_file_name = f1_data["index_file_name"]["fr"]
            lngHref = f'../en/{f1_data["index_file_name"]["en"]}'
        else:
            final_file_name = f1_data["index_file_name"]["en"]    
            lngHref = f'../fr/{f1_data["index_file_name"]["fr"]}'
            
        modification_date = commonUtils.get_todays_date()
        
        print(f"\n Date Issued: {date_issued}\n server_base_url: {server_base_url}\n lngHref: {lngHref}\n final_file_name: {final_file_name}")

        final_file_path = buildUtils.generate_from_jinja_template(template_dirs=[browser_dir, temporary_files_dir],
                                                                template_file_name=jinja_template_file_name, 
                                                                output_dir=browser_dir, 
                                                                output_file_name=final_file_name, 
                                                                env=env, lang=language, base_url=server_base_url, dateIssued=date_issued, dateModified=modification_date, lngHref=lngHref)
        print(f'.......... {final_file_path} is generated successfully.')    
        
    
    # cleanups
    # delete the temporary files directory
    fileUtils.delete_folder(temporary_files_dir);
    
    # delete the jinjia template
    fileUtils.delete_files_with_extension( browser_dir, ".j2" );    
    
    # move the contents in the "broswer" folder one level up, https://github.com/angular/angular-cli/issues/26304
    fileUtils.move_folder_contents(browser_dir, dist_dir);    
    
    # # remove the "broswer" folder, 
    fileUtils.delete_folder(browser_dir);

    
