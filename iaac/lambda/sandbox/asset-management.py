import os

def lambda_handler(event, context):
    file_name, file_extension = os.path.splitext("/Users/pankaj/abc.pdf")
    print (file_name)
    print (file_extension)

    if (file_extension == ".pdf"):
        print ("PDF HANDLED")


def handler(event, context):
    lambda_handler(event, context)