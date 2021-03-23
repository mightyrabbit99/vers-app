from boxsdk import OAuth2, Client

client_id = '9cgyk7kaa4ps71of9jyekot4jmik1xiu'
client_secret = 'bPO9l5ohOTjNp9b2E9Wrnqx6MYgXLd2W'
dev_token = 'd7sjZ2HqgPWw4kipJcY55BJqSGgBAmxO'

oauth = OAuth2(client_id=client_id, client_secret=client_secret,
               access_token=dev_token)
client = Client(oauth)
root_folder = client.folder(folder_id='0')
shared_folder = root_folder.create_subfolder('shared_folder')