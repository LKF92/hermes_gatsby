# Local dev for AWS Lambda

## Exemple to run
`python-lambda-local /var/lambda/lambda.euronext.fr.py /var/lambda/event.js`

## publication lambda
 > This is a mock example, check for event-schedule.js

  Official API endpoint should be :
  - /api/scheduled/
  
   Available mocked endpoints :
   - /api/scheduled/nothing.json
   - /api/scheduled/immediate-only.json
   - /api/scheduled/schedule-only.json
   - /api/scheduled/immediate-schedule.json