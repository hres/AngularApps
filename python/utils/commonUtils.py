from datetime import datetime

def get_todays_date():
    today = datetime.today()
    formatted_date = today.strftime('%Y-%m-%d')
    return formatted_date